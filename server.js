require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const twitterScraper = require('./scraper/twitterScraper');

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

// API pour scraper Twitter
app.post('/api/scrape', async (req, res) => {
    try {
        const { keyword, limit = 20 } = req.body;
        
        if (!keyword) {
            return res.status(400).json({ error: 'Le mot-clé est requis' });
        }

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
    
    // Vérifier la configuration
    if (process.env.TWITTER_BEARER_TOKEN) {
        console.log(`✅ Twitter API configurée avec Bearer Token`);
        console.log(`💡 Note: Si vous voyez une erreur 402, un abonnement Twitter API payant est requis`);
    } else {
        console.log(`⚠️  Twitter API non configurée`);
    }
});
