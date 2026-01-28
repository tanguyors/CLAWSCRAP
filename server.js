require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const twitterScraper = require('./scraper/twitterScraper');
const moltyvouchAgent = require('./scraper/moltyvouchAgent');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Route principale
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API pour scraper Twitter (avec support analyse complète MoltyVouch)
app.post('/api/scrape', async (req, res) => {
    try {
        const { keyword, limit = 20, fullAnalysis = false } = req.body;
        
        if (!keyword) {
            return res.status(400).json({ error: 'Le mot-clé est requis' });
        }

        // Si fullAnalysis est true, utiliser l'agent MoltyVouch (PumpFun + Twitter)
        console.log(`📥 Requête reçue - fullAnalysis: ${fullAnalysis}, keyword: ${keyword}`);
        if (fullAnalysis) {
            console.log(`🤖 Analyse complète MoltyVouch activée pour: ${keyword}`);
            try {
                const analysis = await moltyvouchAgent.analyzeToken(keyword);
                console.log('✅ Analyse complète terminée:', {
                    recommendation: analysis.recommendation,
                    confidenceScore: analysis.confidenceScore,
                    hasPumpFunData: !!analysis.pumpfunData,
                    hasTwitterData: !!analysis.twitterData
                });
                
                return res.json({ 
                    success: true, 
                    analysis: {
                        ...analysis,
                        pumpfunData: analysis.pumpfunData || {},
                        twitterData: analysis.twitterData || { tweets: [], stats: {} }
                    },
                    tweets: analysis.twitterData?.tweets || [],
                    pumpfunData: analysis.pumpfunData || {}
                });
            } catch (agentError) {
                console.error('❌ Erreur agent MoltyVouch:', agentError);
                // Fallback: retourner au moins les tweets + données PumpFun de fallback
                const tweets = await twitterScraper.scrapeTweets(keyword, limit);
                const pumpfunScraper = require('./scraper/pumpfunScraper');
                const fallbackPumpFun = pumpfunScraper.getFallbackData(keyword);
                return res.json({ 
                    success: true, 
                    tweets,
                    pumpfunData: fallbackPumpFun,
                    analysis: {
                        recommendation: 'NEUTRAL',
                        confidenceScore: 0,
                        action: 'OBSERVER',
                        reasons: ['Données limitées'],
                        pumpfunData: fallbackPumpFun,
                        twitterData: { tweets, stats: {} }
                    },
                    error: 'Analyse complète partielle'
                });
            }
        }

        // Sinon, seulement Twitter (compatibilité)
        console.log(`📊 Mode legacy: scraping Twitter seulement pour: ${keyword}`);
        const tweets = await twitterScraper.scrapeTweets(keyword, limit);
        res.json({ success: true, tweets });
    } catch (error) {
        console.error('Erreur lors du scraping:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message || 'Erreur lors du scraping Twitter' 
        });
    }
});

// API pour analyse complète MoltyVouch Agent (PumpFun + Twitter)
app.post('/api/analyze', async (req, res) => {
    try {
        const { keyword } = req.body;
        
        if (!keyword) {
            return res.status(400).json({ error: 'Le mot-clé est requis' });
        }

        console.log(`🤖 Analyse autonome demandée pour: ${keyword}`);
        const analysis = await moltyvouchAgent.analyzeToken(keyword);
        res.json({ success: true, analysis });
    } catch (error) {
        console.error('Erreur lors de l\'analyse:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message || 'Erreur lors de l\'analyse autonome' 
        });
    }
});

// API pour obtenir les stats d'un mot-clé
app.get('/api/stats/:keyword', async (req, res) => {
    try {
        const { keyword } = req.params;
        const stats = await twitterScraper.getKeywordStats(keyword);
        res.json({ success: true, stats });
    } catch (error) {
        console.error('Erreur lors de la récupération des stats:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    console.log(`📊 Scraping Twitter activé pour $MOLTYVOUCH`);
    console.log(`🤖 Agent MoltyVouch activé (PumpFun + Twitter)`);
    
    // Vérifier la configuration
    if (process.env.TWITTER_BEARER_TOKEN) {
        console.log(`✅ Twitter API configurée avec Bearer Token`);
        console.log(`💡 Note: Si vous voyez une erreur 402, un abonnement Twitter API payant est requis`);
    } else {
        console.log(`⚠️  Twitter API non configurée`);
    }
});
