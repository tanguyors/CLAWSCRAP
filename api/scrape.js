const twitterScraper = require('../scraper/twitterScraper');

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
};
