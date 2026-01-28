const express = require('express');
const cors = require('cors');
const twitterScraper = require('../scraper/twitterScraper');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

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

// Export pour Vercel serverless
module.exports = app;
