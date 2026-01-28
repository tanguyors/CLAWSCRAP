const twitterScraper = require('../../scraper/twitterScraper');

// Export pour Vercel serverless function
module.exports = async (req, res) => {
    // Activer CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        // Récupérer le keyword depuis les paramètres de route Vercel
        const keyword = req.query.keyword || req.url.split('/').pop() || req.url.split('/api/stats/')[1];
        
        if (!keyword) {
            return res.status(400).json({ error: 'Le mot-clé est requis' });
        }

        const stats = await twitterScraper.getKeywordStats(keyword);
        res.json({ success: true, stats });
    } catch (error) {
        console.error('Erreur lors de la récupération des stats:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
};
