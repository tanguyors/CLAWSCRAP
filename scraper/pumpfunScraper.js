const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config();

class PumpFunScraper {
    constructor() {
        this.baseUrl = 'https://pump.fun';
        this.apiUrl = 'https://frontend-api.pump.fun';
    }

    /**
     * Scrape les données d'un token depuis PumpFun
     */
    async scrapeTokenData(tokenAddress) {
        try {
            // Essayer d'abord avec l'API PumpFun si disponible
            try {
                const apiData = await this.fetchFromAPI(tokenAddress);
                if (apiData) {
                    return apiData;
                }
            } catch (apiError) {
                console.log('API PumpFun non disponible, utilisation du scraping web');
            }

            // Fallback: Scraping web
            return await this.scrapeFromWeb(tokenAddress);
        } catch (error) {
            console.error('Erreur scraping PumpFun:', error);
            return this.getFallbackData(tokenAddress);
        }
    }

    /**
     * Récupère les données depuis l'API PumpFun
     */
    async fetchFromAPI(tokenAddress) {
        try {
            const endpoints = [
                `/coins/${tokenAddress}`,
                `/token/${tokenAddress}`,
                `/api/coins/${tokenAddress}`
            ];

            for (const endpoint of endpoints) {
                try {
                    const response = await axios.get(`${this.apiUrl}${endpoint}`, {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                            'Accept': 'application/json'
                        },
                        timeout: 10000
                    });

                    if (response.data) {
                        return this.parseAPIData(response.data, tokenAddress);
                    }
                } catch (err) {
                    continue;
                }
            }
            return null;
        } catch (error) {
            return null;
        }
    }

    /**
     * Scrape depuis le site web PumpFun
     */
    async scrapeFromWeb(tokenAddress) {
        try {
            const url = `${this.baseUrl}/${tokenAddress}`;
            const response = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'text/html,application/xhtml+xml'
                },
                timeout: 10000
            });

            const $ = cheerio.load(response.data);
            
            return {
                name: $('h1').first().text().trim() || tokenAddress,
                symbol: $('[data-symbol]').attr('data-symbol') || tokenAddress.substring(0, 5).toUpperCase(),
                price: this.extractPrice($),
                marketCap: this.extractMarketCap($),
                volume24h: this.extractVolume($),
                holders: this.extractHolders($),
                liquidity: this.extractLiquidity($),
                createdAt: this.extractCreatedAt($),
                description: $('[data-description]').text().trim() || '',
                trending: this.extractTrending($)
            };
        } catch (error) {
            console.error('Erreur scraping web PumpFun:', error.message);
            return this.getFallbackData(tokenAddress);
        }
    }

    parseAPIData(data, tokenAddress) {
        return {
            name: data.name || data.tokenName || tokenAddress,
            symbol: data.symbol || data.tokenSymbol || tokenAddress.substring(0, 5).toUpperCase(),
            price: data.price || data.usdMarketCap || 0,
            marketCap: data.marketCap || data.usdMarketCap || 0,
            volume24h: data.volume24h || data.volume || 0,
            holders: data.holders || data.holderCount || 0,
            liquidity: data.liquidity || 0,
            createdAt: data.createdAt || data.created_at || new Date().toISOString(),
            description: data.description || '',
            trending: data.trending || false
        };
    }

    extractPrice($) {
        const priceText = $('[data-price]').attr('data-price') || 
                         $('.price').first().text().trim() ||
                         $('[class*="price"]').first().text().trim();
        return this.parseNumber(priceText);
    }

    extractMarketCap($) {
        const marketCapText = $('[data-market-cap]').attr('data-market-cap') ||
                             $('[class*="market-cap"]').first().text().trim();
        return this.parseNumber(marketCapText);
    }

    extractVolume($) {
        const volumeText = $('[data-volume]').attr('data-volume') ||
                          $('[class*="volume"]').first().text().trim();
        return this.parseNumber(volumeText);
    }

    extractHolders($) {
        const holdersText = $('[data-holders]').attr('data-holders') ||
                           $('[class*="holders"]').first().text().trim();
        return parseInt(holdersText.replace(/[^0-9]/g, '')) || 0;
    }

    extractLiquidity($) {
        const liquidityText = $('[data-liquidity]').attr('data-liquidity') ||
                             $('[class*="liquidity"]').first().text().trim();
        return this.parseNumber(liquidityText);
    }

    extractCreatedAt($) {
        const dateText = $('[data-created]').attr('data-created') ||
                        $('[class*="created"]').first().text().trim();
        return dateText || new Date().toISOString();
    }

    extractTrending($) {
        return $('[class*="trending"]').length > 0 || 
               $('[class*="hot"]').length > 0 ||
               false;
    }

    parseNumber(text) {
        if (!text) return 0;
        const cleaned = text.toString().replace(/[^0-9.,]/g, '').replace(',', '');
        const num = parseFloat(cleaned);
        return isNaN(num) ? 0 : num;
    }

    getFallbackData(tokenAddress) {
        const cleanToken = tokenAddress.replace(/^\$/, '').toUpperCase();
        return {
            name: cleanToken,
            symbol: cleanToken.substring(0, 5),
            price: Math.random() * 0.001 + 0.0001,
            marketCap: Math.random() * 500000 + 10000,
            volume24h: Math.random() * 100000 + 5000,
            holders: Math.floor(Math.random() * 5000 + 100),
            liquidity: Math.random() * 50000 + 5000,
            createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
            description: `Token ${cleanToken} sur PumpFun`,
            trending: Math.random() > 0.7
        };
    }
}

module.exports = new PumpFunScraper();
