const twitterScraper = require('../scraper/twitterScraper');
const moltyvouchAgent = require('../scraper/moltyvouchAgent');

// Export pour Vercel serverless function
module.exports = async (req, res) => {
    // Activer CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { keyword, limit = 20, fullAnalysis = false } = req.body;
        
        if (!keyword) {
            return res.status(400).json({ error: 'Le mot-clé est requis' });
        }

        // Si fullAnalysis est true, utiliser l'agent MoltyVouch (PumpFun + Twitter)
        if (fullAnalysis) {
            console.log(`🤖 Analyse complète MoltyVouch pour: ${keyword}`);
            try {
                const analysis = await moltyvouchAgent.analyzeToken(keyword);
                console.log('✅ Analyse complète terminée:', {
                    recommendation: analysis.recommendation,
                    confidenceScore: analysis.confidenceScore,
                    hasPumpFunData: !!analysis.pumpfunData,
                    hasTwitterData: !!analysis.twitterData,
                    pumpfunDataKeys: analysis.pumpfunData ? Object.keys(analysis.pumpfunData) : []
                });
                
                // S'assurer que toutes les données sont présentes
                const response = {
                    success: true,
                    analysis: {
                        ...analysis,
                        pumpfunData: analysis.pumpfunData || {},
                        twitterData: analysis.twitterData || { tweets: [], stats: {} }
                    },
                    tweets: analysis.twitterData?.tweets || [],
                    pumpfunData: analysis.pumpfunData || {}
                };
                
                console.log('📤 Envoi de la réponse avec:', {
                    hasAnalysis: !!response.analysis,
                    hasPumpFunData: !!response.pumpfunData,
                    tweetsCount: response.tweets.length
                });
                
                return res.json(response);
            } catch (agentError) {
                console.error('❌ Erreur agent MoltyVouch:', agentError);
                // Fallback: retourner au moins les tweets + données PumpFun de fallback
                const tweets = await twitterScraper.scrapeTweets(keyword, limit);
                const fallbackPumpFun = require('../scraper/pumpfunScraper').getFallbackData(keyword);
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
        const tweets = await twitterScraper.scrapeTweets(keyword, limit);
        res.json({ success: true, tweets });
    } catch (error) {
        console.error('Erreur lors du scraping:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message || 'Erreur lors du scraping' 
        });
    }
};
