const twitterScraper = require('./twitterScraper');
const pumpfunScraper = require('./pumpfunScraper');

/**
 * Agent MoltyTouch - Analyse simultanée PumpFun + Twitter
 */
class MoltyVouchAgent {
    constructor() {
        this.name = 'MoltyTouch Agent';
        this.version = '1.0.0';
    }

    /**
     * Analyse complète d'un token : PumpFun + Twitter simultanément
     */
    async analyzeToken(keyword) {
        console.log(`🤖 ${this.name} - Analyse autonome de ${keyword}`);
        console.log('📊 Scraping simultané PumpFun + Twitter...');

        try {
            // Scraping simultané des deux plateformes
            const [pumpfunData, twitterData] = await Promise.all([
                this.scrapePumpFun(keyword),
                this.scrapeTwitter(keyword)
            ]);

            // Analyse et décision autonome
            const analysis = this.makeDecision(pumpfunData, twitterData, keyword);
            
            // S'assurer que pumpfunData est toujours présent dans l'analyse
            analysis.pumpfunData = pumpfunData;
            analysis.twitterData = twitterData;

            console.log(`✅ Analyse terminée - Décision: ${analysis.recommendation}`);
            console.log(`📊 PumpFun Data présent:`, !!analysis.pumpfunData);
            console.log(`📊 Twitter Data présent:`, !!analysis.twitterData);
            return analysis;
        } catch (error) {
            console.error('❌ Erreur analyse autonome:', error);
            return this.getFallbackAnalysis(keyword);
        }
    }

    async scrapePumpFun(keyword) {
        try {
            const data = await pumpfunScraper.scrapeTokenData(keyword);
            console.log(`📈 PumpFun: ${data.name} - Market Cap: $${data.marketCap.toLocaleString()}`);
            return data;
        } catch (error) {
            console.error('Erreur scraping PumpFun:', error);
            return pumpfunScraper.getFallbackData(keyword);
        }
    }

    async scrapeTwitter(keyword, limit = 20) {
        try {
            const tweets = await twitterScraper.scrapeTweets(keyword, limit);
            let stats = {};
            try {
                stats = await twitterScraper.getKeywordStats(keyword);
            } catch (statsError) {
                console.warn('Stats Twitter non disponibles, utilisation de stats calculées');
                // Calculer les stats depuis les tweets
                const totalLikes = tweets.reduce((sum, t) => sum + (t.likes || 0), 0);
                const totalRetweets = tweets.reduce((sum, t) => sum + (t.retweets || 0), 0);
                const totalReplies = tweets.reduce((sum, t) => sum + (t.replies || 0), 0);
                stats = {
                    totalTweets: tweets.length,
                    totalLikes,
                    totalRetweets,
                    totalReplies,
                    averageLikes: tweets.length > 0 ? Math.round(totalLikes / tweets.length) : 0,
                    positiveSentimentRate: '50.0'
                };
            }
            console.log(`🐦 Twitter: ${tweets.length} tweets analysés`);
            return { tweets, stats };
        } catch (error) {
            console.error('Erreur scraping Twitter:', error);
            return { tweets: [], stats: {} };
        }
    }

    makeDecision(pumpfunData, twitterData, keyword) {
        const { tweets, stats } = twitterData;

        let confidenceScore = 0;
        let reasons = [];

        // Facteurs PumpFun
        if (pumpfunData.marketCap > 100000) {
            confidenceScore += 20;
            reasons.push('Market cap solide');
        }
        if (pumpfunData.holders > 1000) {
            confidenceScore += 15;
            reasons.push('Base de holders importante');
        }
        if (pumpfunData.volume24h > 50000) {
            confidenceScore += 15;
            reasons.push('Volume 24h élevé');
        }
        if (pumpfunData.trending) {
            confidenceScore += 10;
            reasons.push('Token trending sur PumpFun');
        }
        if (pumpfunData.liquidity > 20000) {
            confidenceScore += 10;
            reasons.push('Liquidité suffisante');
        }

        // Facteurs Twitter
        if (stats.totalTweets > 50) {
            confidenceScore += 10;
            reasons.push('Forte activité sur Twitter');
        }
        if (stats.totalLikes > 10000) {
            confidenceScore += 10;
            reasons.push('Engagement Twitter élevé');
        }
        if (parseFloat(stats.positiveSentimentRate || 0) > 60) {
            confidenceScore += 10;
            reasons.push('Sentiment positif dominant');
        }

        // Décision finale
        let recommendation = 'NEUTRAL';
        let action = 'OBSERVER';

        if (confidenceScore >= 70) {
            recommendation = 'STRONG_BUY';
            action = 'INVESTIR';
        } else if (confidenceScore >= 50) {
            recommendation = 'BUY';
            action = 'CONSIDÉRER';
        } else if (confidenceScore >= 30) {
            recommendation = 'NEUTRAL';
            action = 'OBSERVER';
        } else {
            recommendation = 'AVOID';
            action = 'ÉVITER';
        }

        const result = {
            keyword,
            timestamp: new Date().toISOString(),
            pumpfunData: pumpfunData || {},
            twitterData: {
                tweets: tweets || [],
                tweetCount: tweets ? tweets.length : 0,
                stats: stats || {}
            },
            confidenceScore,
            recommendation,
            action,
            reasons,
            summary: this.generateSummary(pumpfunData, twitterData, recommendation, reasons)
        };
        
        // Log pour debug
        console.log('📊 Résultat de makeDecision:', {
            hasPumpFunData: !!result.pumpfunData,
            pumpfunDataKeys: result.pumpfunData ? Object.keys(result.pumpfunData) : [],
            tweetCount: result.twitterData.tweetCount
        });
        
        return result;
    }

    generateSummary(pumpfunData, twitterData, recommendation, reasons) {
        return `Analyse autonome terminée. ${recommendation === 'STRONG_BUY' ? 'Opportunité forte détectée' : 
                recommendation === 'BUY' ? 'Opportunité intéressante' : 
                recommendation === 'NEUTRAL' ? 'Situation à surveiller' : 
                'Risque élevé détecté'}. ${reasons.slice(0, 3).join(', ')}.`;
    }

    getFallbackAnalysis(keyword) {
        return {
            keyword,
            timestamp: new Date().toISOString(),
            pumpfunData: pumpfunScraper.getFallbackData(keyword),
            twitterData: { tweetCount: 0, stats: {} },
            confidenceScore: 0,
            recommendation: 'NEUTRAL',
            action: 'OBSERVER',
            reasons: ['Données limitées'],
            summary: 'Analyse en cours, données partielles disponibles.'
        };
    }
}

module.exports = new MoltyVouchAgent();
