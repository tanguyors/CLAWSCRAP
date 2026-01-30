// Configuration
// VERSION 2.0 - Debug amélioré
console.log('🚀 app.js VERSION 2.0 chargée');
const API_BASE_URL = window.location.origin;

// État de l'application
let currentKeyword = 'MOLTYVOUCH';
let currentTweets = [];
let lastScrapeData = null; // Stocker les dernières données scrappées
const visitedSections = new Set();

// Fonction principale de recherche
async function searchKeyword(keyword) {
    console.log('🚀 searchKeyword appelé avec:', keyword);
    
    if (!keyword || keyword.trim() === '') {
        console.warn('⚠️ Empty keyword');
        alert('Please enter a keyword');
        return;
    }

    currentKeyword = keyword.trim().toUpperCase();
    console.log('📊 Recherche pour:', currentKeyword);
    showLoading();

    try {
        console.log('🌐 Envoi de la requête à:', `${API_BASE_URL}/api/scrape`);
        
        // Utiliser l'analyse complète MoltyTouch (PumpFun + Twitter)
        console.log('🤖 Utilisation de MoltyTouch Agent pour analyse complète');
        const requestBody = {
            keyword: currentKeyword,
            limit: 20,
            fullAnalysis: true  // Activer l'analyse complète
        };
        console.log('📤 Corps de la requête:', JSON.stringify(requestBody));
        const analysisResponse = await fetch(`${API_BASE_URL}/api/scrape`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        
        const tweetsResponse = analysisResponse;

        console.log('📡 Réponse reçue, status:', tweetsResponse.status);
        
        if (!tweetsResponse.ok) {
            throw new Error(`HTTP Error: ${tweetsResponse.status} ${tweetsResponse.statusText}`);
        }

        const responseData = await tweetsResponse.json();
        console.log('📦 Données reçues complètes:', JSON.stringify(responseData, null, 2));
        
        // Gérer les deux formats : analyse complète ou tweets seulement
        let tweetsData;
        let pumpfunData = null;
        let analysis = null;
        
        // Vérifier plusieurs formats possibles
        if (responseData.analysis) {
            // Format analyse complète MoltyVouch
            analysis = responseData.analysis;
            tweetsData = { success: true, tweets: analysis.twitterData?.tweets || [] };
            pumpfunData = analysis.pumpfunData;
            console.log('🤖 Analyse MoltyVouch reçue:', analysis);
            console.log('📈 Données PumpFun:', pumpfunData);
        } else if (responseData.pumpfunData) {
            // Format avec pumpfunData directement
            pumpfunData = responseData.pumpfunData;
            analysis = responseData.analysis || null;
            tweetsData = { success: true, tweets: responseData.tweets || [] };
            console.log('📈 Données PumpFun trouvées directement:', pumpfunData);
        } else {
            // Format legacy (tweets seulement)
            tweetsData = responseData;
            console.log('⚠️ Format legacy détecté, pas de données PumpFun');
        }

        if (tweetsData.success) {
            console.log('✅ Données valides, tweets reçus:', tweetsData.tweets?.length || 0);
            currentTweets = tweetsData.tweets || [];
            
            // Générer des données de démo si nécessaire
            if (!pumpfunData) {
                console.warn('⚠️ No PumpFun data in response, generating demo data');
                pumpfunData = {
                    name: currentKeyword,
                    symbol: currentKeyword.substring(0, 5),
                    price: 0.000123,
                    marketCap: 125000,
                    volume24h: 45000,
                    holders: 1250,
                    liquidity: 35000,
                    trending: true
                };
            }
            
            if (!analysis) {
                analysis = {
                    recommendation: 'NEUTRAL',
                    confidenceScore: 50,
                    action: 'ANALYZE',
                    reasons: ['Data analysis in progress'],
                    summary: 'Analysis based on available data'
                };
            }
            
            // Afficher toutes les données dans le modal popup
            displayResultsInModal(currentTweets, pumpfunData, analysis);
        } else {
            throw new Error(tweetsData.error || 'Error loading tweets');
        }

    } catch (error) {
        console.error('Error:', error);
        showError('Error loading data: ' + error.message);
    } finally {
        hideLoading();
    }
}

// Afficher les tweets
function displayTweets(tweets) {
    console.log('🎨 ========== displayTweets DÉBUT ==========');
    console.log('🎨 displayTweets appelé avec:', tweets);
    console.log('🎨 Nombre de tweets:', tweets?.length);
    
    const container = document.getElementById('tweetsContainer');
    console.log('📦 Container trouvé:', container);
    console.log('📦 Container existe?', !!container);
    
    if (!container) {
        console.error('❌ Container tweetsContainer non trouvé dans le DOM');
        // Essayer de trouver le container avec d'autres sélecteurs
        const altContainer = document.querySelector('.tweets-container');
        console.log('🔍 Tentative avec .tweets-container:', altContainer);
        if (altContainer) {
            console.log('✅ Container alternatif trouvé, utilisation de celui-ci');
            altContainer.innerHTML = '<div class="loading-state"><p style="color: #ef4444;">Error: Main container not found</p></div>';
        }
        return;
    }
    
    if (!tweets || tweets.length === 0) {
        console.warn('⚠️ Aucun tweet à afficher');
        container.innerHTML = '<div class="loading-state"><p>No tweets found for this keyword.</p></div>';
        return;
    }
    
    console.log(`✅ Affichage de ${tweets.length} tweets`);
    console.log('📋 Premier tweet:', tweets[0]);
    console.log('📋 Structure du premier tweet:', JSON.stringify(tweets[0], null, 2));

    try {
        console.log('📝 Début de la génération HTML...');
        
        const html = tweets.map((tweet, index) => {
            if (index === 0) {
                console.log(`📝 Génération HTML pour tweet ${index}:`, tweet);
            }
            
            // Vérifier que les propriétés existent
            const authorName = (tweet.authorName || 'Unknown').toString();
            const author = (tweet.author || '@unknown').toString();
            const text = (tweet.text || '').toString();
            const timestamp = tweet.timestamp || new Date().toISOString();
            const likes = Number(tweet.likes) || 0;
            const retweets = Number(tweet.retweets) || 0;
            const replies = Number(tweet.replies) || 0;
            
            const avatarLetter = authorName.charAt(0).toUpperCase() || '?';
            
            return `
                <div class="tweet-card">
                    <div class="tweet-header">
                        <div class="tweet-avatar">${avatarLetter}</div>
                        <div class="tweet-author">
                            <div class="tweet-author-name">${authorName}</div>
                            <div class="tweet-author-handle">${author}</div>
                        </div>
                        <div class="tweet-time">${formatTime(timestamp)}</div>
                    </div>
                    <div class="tweet-text">${formatTweetText(text)}</div>
                    <div class="tweet-stats">
                        <div class="tweet-stat">
                            <svg class="tweet-stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                            </svg>
                            <span>${formatNumber(likes)}</span>
                        </div>
                        <div class="tweet-stat">
                            <svg class="tweet-stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3"/>
                            </svg>
                            <span>${formatNumber(retweets)}</span>
                        </div>
                        <div class="tweet-stat">
                            <svg class="tweet-stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                            </svg>
                            <span>${formatNumber(replies)}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        console.log('📄 HTML généré, longueur:', html.length);
        console.log('📄 Premiers 500 caractères:', html.substring(0, 500));
        
        // Insérer directement dans le container
        console.log('📤 Insertion du HTML dans le container...');
        container.innerHTML = html;
        console.log('✅ HTML inséré dans le container');
        
        // Vérification immédiate
        const cards = container.querySelectorAll('.tweet-card');
        console.log(`🔍 Vérification immédiate: ${cards.length} cartes trouvées dans le DOM`);
        
        if (cards.length === 0) {
            console.error('❌ PROBLÈME CRITIQUE: Aucune carte trouvée après insertion!');
            console.log('📦 Container HTML actuel (premiers 1000 caractères):', container.innerHTML.substring(0, 1000));
            console.log('📦 Container parent:', container.parentElement);
            console.log('📦 Container visible?', container.offsetParent !== null);
        } else {
            console.log(`✅ SUCCÈS: ${cards.length} cartes affichées!`);
        }
        
        console.log('🎨 ========== displayTweets FIN ==========');
        
    } catch (error) {
        console.error('❌ Error displaying tweets:', error);
        console.error('❌ Stack trace:', error.stack);
        container.innerHTML = `<div class="loading-state"><p style="color: #ef4444;">Display error: ${error.message}</p><pre style="color: white; background: #1a1a1a; padding: 10px; border-radius: 5px;">${error.stack}</pre></div>`;
    }
}


// Recherche depuis l'input
function performSearch() {
    console.log('🔍 performSearch appelé');
    const input = document.getElementById('keywordInput');
    if (!input) {
        console.error('❌ Input keywordInput non trouvé');
        return;
    }
    
    const keyword = input.value.trim();
    console.log('📝 Mot-clé saisi:', keyword);
    
    if (keyword) {
        console.log('✅ Lancement de la recherche pour:', keyword);
        searchKeyword(keyword);
        input.value = '';
    } else {
        console.warn('⚠️ No keyword entered');
        alert('Please enter a keyword');
    }
}

// Gérer la touche Entrée
function handleSearchKeyPress(event) {
    if (event.key === 'Enter') {
        performSearch();
    }
}

// Afficher le modal de recherche (simplifié)
function showSearchModal() {
    document.getElementById('keywordInput').focus();
    document.querySelector('.search-section').scrollIntoView({ behavior: 'smooth' });
}

// Formatage
function formatTime(timestamp) {
    if (!timestamp) {
        return 'Recently';
    }
    
    try {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) {
            return 'Recently';
        }
        
        const now = new Date();
        const diff = now - date;
        
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 60) {
            return `Il y a ${minutes} min`;
        } else if (hours < 24) {
            return `Il y a ${hours}h`;
        } else {
            return `Il y a ${days}j`;
        }
    } catch (error) {
        console.error('Error formatTime:', error);
        return 'Recently';
    }
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function formatTweetText(text) {
    if (!text) {
        return '';
    }
    
    try {
        let cleanText = String(text);
        
        // ÉTAPE 1: Supprimer TOUTES les balises HTML et fragments CSS AVANT tout traitement
        // Supprimer les balises HTML complètes
        cleanText = cleanText
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
            .replace(/<[^>]+>/g, ''); // Supprimer toutes les balises HTML
        
        // ÉTAPE 2: Supprimer les fragments CSS répétés de manière agressive
        // Répéter le nettoyage plusieurs fois pour éliminer toutes les répétitions
        for (let i = 0; i < 10; i++) {
            cleanText = cleanText
                // Pattern exact répété: #6366f1; font-weight: 600;">$1
                .replace(/#6366f1;\s*font-weight:\s*600;\s*">\$1/gi, '')
                .replace(/#6366f1;\s*font-weight:\s*600;\s*">\$1\s*/gi, '')
                .replace(/(#6366f1;\s*font-weight:\s*600;\s*">\$1\s*)+/gi, '')
                // Avec "color:"
                .replace(/color:\s*#6366f1;\s*font-weight:\s*600;\s*">\$1/gi, '')
                .replace(/(color:\s*#6366f1;\s*font-weight:\s*600;\s*">\$1\s*)+/gi, '')
                // Patterns généraux
                .replace(/#[0-9a-fA-F]{6};\s*font-weight:\s*\d+;\s*">\$?\d*/gi, '')
                .replace(/color:\s*#[0-9a-fA-F]{6};\s*font-weight:\s*\d+;\s*">\$?\d*/gi, '')
                // Fragments CSS isolés
                .replace(/#[0-9a-fA-F]{6};\s*/gi, '')
                .replace(/font-weight:\s*\d+;\s*/gi, '')
                .replace(/color:\s*#[0-9a-fA-F]{6}\s*/gi, '')
                // Fragments de balises
                .replace(/">\$?\d*/g, '')
                .replace(/">/g, '')
                .replace(/&quot;&gt;\$?\d*/gi, '')
                // Fragments isolés
                .replace(/\$1\s*/g, '')
                .replace(/span\s+style/gi, '')
                // Répétitions de mots-clés CSS
                .replace(/(#6366f1\s*)+/gi, '')
                .replace(/(font-weight\s*)+/gi, '')
                .replace(/(color:\s*)+/gi, '')
                // Normaliser les espaces après chaque itération
                .replace(/\s+/g, ' ')
                .trim();
        }
        
        // ÉTAPE 3: Nettoyer les fragments restants de manière plus agressive
        cleanText = cleanText
            .replace(/#6366f1/gi, '')
            .replace(/font-weight/gi, '')
            .replace(/color:/gi, '')
            .replace(/\$1/g, '')
            .replace(/">/g, '')
            .replace(/;\s*/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
        
        // ÉTAPE 4: Échapper les caractères HTML pour sécurité
        cleanText = cleanText
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
        
        // ÉTAPE 5: Nettoyer les fragments échappés qui pourraient rester
        cleanText = cleanText
            .replace(/(&amp;#6366f1;|&amp;quot;&amp;gt;|\$1)+/gi, '')
            .replace(/\s+/g, ' ')
            .trim();
        
        // ÉTAPE 6: Vérifier qu'il ne reste plus de fragments CSS avant de formater
        // Si on trouve encore des fragments, les supprimer une dernière fois
        if (cleanText.includes('#6366f1') || cleanText.includes('font-weight') || cleanText.includes('$1')) {
            cleanText = cleanText
                .replace(/#6366f1/gi, '')
                .replace(/font-weight/gi, '')
                .replace(/\$1/g, '')
                .replace(/\s+/g, ' ')
                .trim();
        }
        
        // ÉTAPE 7: Appliquer le formatage final UNIQUEMENT sur le texte propre
        // Utiliser des classes CSS au lieu de styles inline pour éviter les problèmes
        return cleanText
            .replace(/\$([A-Z]{2,})/g, '<span class="crypto-mention">$$1</span>')
            .replace(/#([A-Za-z0-9_]+)/g, '<span class="hashtag">#$1</span>')
            .replace(/@([A-Za-z0-9_]+)/g, '<span class="mention">@$1</span>')
            .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" class="tweet-link">$1</a>');
    } catch (error) {
        console.error('Error formatTweetText:', error);
        // In case of error, return basic cleaned text
        return String(text || '')
            .replace(/<[^>]*>/g, '')
            .replace(/#6366f1;\s*font-weight:\s*600;\s*">\$1/gi, '')
            .replace(/#6366f1/gi, '')
            .replace(/font-weight/gi, '')
            .replace(/\$1/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }
}

// Récupérer les données PumpFun séparément si nécessaire
async function fetchPumpFunData(keyword) {
    try {
        console.log('🔄 Attempting separate PumpFun data fetch for:', keyword);
        const response = await fetch(`${API_BASE_URL}/api/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ keyword })
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.success && data.analysis) {
                displayPumpFunData(data.analysis.pumpfunData, data.analysis);
            }
        }
    } catch (error) {
        console.error('Error fetching PumpFun:', error);
    }
}

// Afficher les données PumpFun
function displayPumpFunData(pumpfunData, analysis) {
    console.log('📈 Affichage des données PumpFun:', pumpfunData);
    console.log('📈 Analysis:', analysis);
    
    if (!pumpfunData) {
        console.error('❌ pumpfunData est null ou undefined');
        return;
    }
    
    // Créer ou mettre à jour une section pour les données PumpFun
    let pumpfunSection = document.getElementById('pumpfunSection');
    
    if (!pumpfunSection) {
        // Créer la section si elle n'existe pas
        const tweetsSection = document.getElementById('tweets');
        if (tweetsSection && tweetsSection.parentNode) {
            pumpfunSection = document.createElement('div');
            pumpfunSection.id = 'pumpfunSection';
            pumpfunSection.className = 'pumpfun-section';
            pumpfunSection.style.display = 'block';
            pumpfunSection.style.visibility = 'visible';
            pumpfunSection.style.opacity = '1';
            tweetsSection.parentNode.insertBefore(pumpfunSection, tweetsSection);
            console.log('✅ Section PumpFun créée et insérée avant la section tweets');
            console.log('📍 Position:', tweetsSection.parentNode === document.body ? 'body' : 'container');
        } else {
            console.error('❌ Section tweets non trouvée ou parentNode manquant');
            console.error('tweetsSection:', tweetsSection);
            return;
        }
    } else {
        console.log('✅ Section PumpFun existe déjà, mise à jour du contenu');
        pumpfunSection.style.display = 'block';
        pumpfunSection.style.visibility = 'visible';
        pumpfunSection.style.opacity = '1';
    }
    
    const recommendation = analysis?.recommendation || 'NEUTRAL';
    const confidenceScore = analysis?.confidenceScore || 0;
    const action = analysis?.action || 'OBSERVER';
    const reasons = analysis?.reasons || ['Analysis in progress'];
    
    // Vérifier que les données sont valides
    if (!pumpfunData.name && !pumpfunData.symbol) {
        console.warn('⚠️ Incomplete PumpFun data, using default values');
        pumpfunData = {
            name: pumpfunData.name || 'Token',
            symbol: pumpfunData.symbol || 'TKN',
            price: pumpfunData.price || 0,
            marketCap: pumpfunData.marketCap || 0,
            volume24h: pumpfunData.volume24h || 0,
            holders: pumpfunData.holders || 0,
            liquidity: pumpfunData.liquidity || 0,
            trending: pumpfunData.trending || false
        };
    }
    
    console.log('📊 Génération du HTML avec:', {
        name: pumpfunData.name,
        symbol: pumpfunData.symbol,
        price: pumpfunData.price,
        recommendation
    });
    
    pumpfunSection.innerHTML = `
        <div class="container">
            <h2 class="section-title">MoltyTouch Agent Analysis</h2>
            <div class="analysis-container">
                <div class="pumpfun-card">
                    <div class="pumpfun-header">
                        <h3>📈 PumpFun Data</h3>
                        ${pumpfunData.trending ? '<span class="trending-badge">🔥 Trending</span>' : ''}
                    </div>
                    <div class="pumpfun-stats">
                        <div class="pumpfun-stat">
                            <div class="stat-label">Token</div>
                            <div class="stat-value">${pumpfunData.name || 'N/A'} (${pumpfunData.symbol || 'N/A'})</div>
                        </div>
                        <div class="pumpfun-stat">
                            <div class="stat-label">Price</div>
                            <div class="stat-value">$${(pumpfunData.price || 0).toFixed(6)}</div>
                        </div>
                        <div class="pumpfun-stat">
                            <div class="stat-label">Market Cap</div>
                            <div class="stat-value">$${(pumpfunData.marketCap || 0).toLocaleString()}</div>
                        </div>
                        <div class="pumpfun-stat">
                            <div class="stat-label">Volume 24h</div>
                            <div class="stat-value">$${(pumpfunData.volume24h || 0).toLocaleString()}</div>
                        </div>
                        <div class="pumpfun-stat">
                            <div class="stat-label">Holders</div>
                            <div class="stat-value">${(pumpfunData.holders || 0).toLocaleString()}</div>
                        </div>
                        <div class="pumpfun-stat">
                            <div class="stat-label">Liquidity</div>
                            <div class="stat-value">$${(pumpfunData.liquidity || 0).toLocaleString()}</div>
                        </div>
                    </div>
                </div>
                
                <div class="recommendation-card recommendation-${recommendation.toLowerCase()}">
                    <div class="recommendation-header">
                        <h3>🤖 MoltyVouch Autonomous Decision</h3>
                        <div class="confidence-score">Confidence: ${confidenceScore}%</div>
                    </div>
                    <div class="recommendation-content">
                        <div class="recommendation-action">
                            <span class="action-badge action-${recommendation.toLowerCase()}">${action}</span>
                            <span class="recommendation-text">${recommendation}</span>
                        </div>
                        <div class="recommendation-reasons">
                            <h4>Reasons:</h4>
                            <ul>
                                ${reasons.map(reason => `<li>${reason}</li>`).join('')}
                            </ul>
                        </div>
                        ${analysis?.summary ? `<p class="recommendation-summary">${analysis.summary}</p>` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Forcer la visibilité
    pumpfunSection.style.display = 'block';
    pumpfunSection.style.visibility = 'visible';
    pumpfunSection.style.opacity = '1';
    pumpfunSection.style.position = 'relative';
    pumpfunSection.style.zIndex = '10';
    
    console.log('✅ HTML inséré dans pumpfunSection');
    console.log('📏 Taille de la section:', pumpfunSection.offsetHeight, 'px');
    console.log('👁️ Section visible:', pumpfunSection.offsetHeight > 0);
    
    // Scroll vers la section
    setTimeout(() => {
        try {
            pumpfunSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            console.log('✅ Scroll vers section PumpFun effectué');
        } catch (scrollError) {
            console.warn('⚠️ Scroll error:', scrollError);
        }
    }, 100);
    
    // Vérifier que le HTML a bien été inséré
    setTimeout(() => {
        const insertedContent = pumpfunSection.querySelector('.pumpfun-card');
        const recommendationCard = pumpfunSection.querySelector('.recommendation-card');
        console.log('🔍 Vérification du contenu:');
        console.log('  - pumpfun-card:', !!insertedContent);
        console.log('  - recommendation-card:', !!recommendationCard);
        console.log('  - innerHTML length:', pumpfunSection.innerHTML.length);
        
        if (!insertedContent) {
            console.error('❌ Le contenu PumpFun n\'a pas été inséré correctement');
            console.error('innerHTML:', pumpfunSection.innerHTML.substring(0, 200));
        } else {
            console.log('✅ Contenu PumpFun vérifié et présent dans le DOM');
            console.log('📊 Contenu trouvé:', {
                pumpfunCard: !!insertedContent,
                recommendationCard: !!recommendationCard,
                container: !!pumpfunSection.querySelector('.container')
            });
        }
    }, 300);
}

// Gestion du chargement
function showLoading() {
    document.getElementById('loadingOverlay').classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loadingOverlay').classList.add('hidden');
}

function showError(message) {
    const container = document.getElementById('tweetsContainer');
    container.innerHTML = `<div class="loading-state"><p style="color: #ef4444;">${message}</p></div>`;
}

// Exposer les fonctions globalement pour les onclick
window.searchKeyword = searchKeyword;
window.performSearch = performSearch;
window.handleSearchKeyPress = handleSearchKeyPress;
window.showSearchModal = showSearchModal;

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ DOM chargé, initialisation...');
    // Ne pas charger automatiquement - l'utilisateur doit rechercher manuellement
    
    // Menu Burger
    initMobileMenu();
    
    // Marquer la section home comme visitée au chargement
    visitedSections.add('#home');
    if (window.location.hash) {
        visitedSections.add(window.location.hash);
    }
});

// Menu Burger Mobile
function initMobileMenu() {
    const burgerMenu = document.getElementById('burgerMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');
    
    // Vérifier que les éléments existent
    if (!burgerMenu || !mobileMenu || !mobileMenuClose) {
        console.error('❌ Menu burger elements not found');
        return;
    }
    
    // Vérifier ou créer l'overlay
    let overlay = document.getElementById('mobileMenuOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'mobile-menu-overlay';
        overlay.id = 'mobileMenuOverlay';
        document.body.appendChild(overlay);
    }
    
    function openMenu() {
        console.log('📱 Opening mobile menu');
        burgerMenu.classList.add('active');
        mobileMenu.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeMenu() {
        console.log('📱 Closing mobile menu');
        burgerMenu.classList.remove('active');
        mobileMenu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Ouvrir le menu
    burgerMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        openMenu();
    });
    
    // Fermer le menu
    mobileMenuClose.addEventListener('click', (e) => {
        e.stopPropagation();
        closeMenu();
    });
    
    overlay.addEventListener('click', (e) => {
        e.stopPropagation();
        closeMenu();
    });
    
    // Fermer le menu lors du clic sur un lien et déclencher la navigation
    if (mobileMenuLinks.length > 0) {
        console.log('✅ Found', mobileMenuLinks.length, 'mobile menu links');
        mobileMenuLinks.forEach((link, index) => {
            console.log(`📱 Setting up link ${index + 1}:`, link.getAttribute('href'));
            
            link.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const href = this.getAttribute('href');
                console.log('📱 Link clicked:', href);
                
                // Fermer le menu immédiatement
                closeMenu();
                
                // Chercher la section cible
                const target = document.querySelector(href);
                console.log('📱 Target element:', target ? 'Found' : 'Not found', href);
                
                if (target) {
                    // Vérifier si c'est la première visite de cette section
                    if (!visitedSections.has(href)) {
                        visitedSections.add(href);
                        console.log('📱 First visit to', href, '- showing loader');
                        
                        // Afficher le loader
                        showPageLoader();
                        
                        // Attendre un peu pour l'animation, puis scroller
                        setTimeout(() => {
                            target.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });
                            
                            // Masquer le loader après le scroll
                            setTimeout(() => {
                                hidePageLoader();
                            }, 800);
                        }, 300);
                    } else {
                        console.log('📱 Already visited', href, '- direct scroll');
                        // Section déjà visitée, scroll direct
                        setTimeout(() => {
                            target.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });
                        }, 100);
                    }
                } else {
                    console.error('❌ Section not found:', href);
                    alert('Section not found: ' + href);
                }
            });
        });
    } else {
        console.error('❌ No mobile menu links found!');
    }
    
    // Fermer avec Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMenu();
        }
    });
    
    console.log('✅ Mobile menu initialized:', {
        burgerMenu: !!burgerMenu,
        mobileMenu: !!mobileMenu,
        mobileMenuClose: !!mobileMenuClose,
        linksCount: mobileMenuLinks.length,
        overlay: !!overlay
    });
    
    // Vérifier que les sections existent
    const sections = ['#home', '#story', '#features', '#tokenomics', '#faq', '#coming-soon'];
    sections.forEach(section => {
        const element = document.querySelector(section);
        console.log(`📍 Section ${section}:`, element ? '✅ Found' : '❌ Not found');
    });
}

// Gestion de la page de chargement et navigation
const pageLoader = document.getElementById('pageLoader');

function showPageLoader() {
    if (pageLoader) {
        pageLoader.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function hidePageLoader() {
    if (pageLoader) {
        pageLoader.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Smooth scroll pour les liens de navigation avec page de chargement
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        const target = document.querySelector(href);
        
        if (target) {
            // Vérifier si c'est la première visite de cette section
            if (!visitedSections.has(href)) {
                visitedSections.add(href);
                
                // Afficher le loader
                showPageLoader();
                
                // Attendre un peu pour l'animation, puis scroller
                setTimeout(() => {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Masquer le loader après le scroll
                    setTimeout(() => {
                        hidePageLoader();
                    }, 800);
                }, 300);
            } else {
                // Section déjà visitée, scroll direct
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// FAQ Toggle Function
function toggleFAQ(element) {
    const faqItem = element.closest('.faq-item');
    const isActive = faqItem.classList.contains('active');
    
    // Close all FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Open clicked item if it wasn't active
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// Make toggleFAQ globally available
window.toggleFAQ = toggleFAQ;

// Fonction pour télécharger les données du scraper
function downloadScraperData(tweets, pumpfunData, analysis, keyword) {
    const data = {
        keyword: keyword || currentKeyword,
        timestamp: new Date().toISOString(),
        pumpfunData: pumpfunData || null,
        analysis: analysis || null,
        tweets: tweets || [],
        summary: {
            totalTweets: tweets?.length || 0,
            recommendation: analysis?.recommendation || 'NEUTRAL',
            confidenceScore: analysis?.confidenceScore || 0,
            action: analysis?.action || 'ANALYZE'
        }
    };
    
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `moltytouch-scrape-${keyword || currentKeyword}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Exposer la fonction globalement
window.downloadScraperData = downloadScraperData;

// Modal Functions
function displayResultsInModal(tweets, pumpfunData, analysis) {
    const modal = document.getElementById('resultsModal');
    const modalBody = document.getElementById('modalBody');
    
    if (!modal || !modalBody) {
        console.error('❌ Modal elements not found');
        return;
    }
    
    // Générer le contenu du modal avec toutes les données croisées
    const recommendation = analysis?.recommendation || 'NEUTRAL';
    const confidenceScore = analysis?.confidenceScore || 50;
    const action = analysis?.action || 'ANALYZE';
    const reasons = analysis?.reasons || ['Analysis in progress'];
    const summary = analysis?.summary || '';
    
    modalBody.innerHTML = `
        <div class="modal-results-grid">
            <!-- PumpFun Data Section -->
            <div class="modal-section pumpfun-section-modal">
                    <div class="modal-section-header">
                        <h3>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: inline-block; vertical-align: middle; margin-right: 0.5rem; color: #00d4ff;">
                                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                            </svg>
                            PumpFun Data
                        </h3>
                        ${pumpfunData.trending ? '<span class="trending-badge">🔥 Trending</span>' : ''}
                    </div>
                <div class="modal-pumpfun-stats">
                    <div class="modal-stat-item">
                        <div class="modal-stat-label">Token</div>
                        <div class="modal-stat-value">${pumpfunData.name || 'N/A'} (${pumpfunData.symbol || 'N/A'})</div>
                    </div>
                    <div class="modal-stat-item">
                        <div class="modal-stat-label">Price</div>
                        <div class="modal-stat-value">$${(pumpfunData.price || 0).toFixed(8)}</div>
                    </div>
                    <div class="modal-stat-item">
                        <div class="modal-stat-label">Market Cap</div>
                        <div class="modal-stat-value">$${(pumpfunData.marketCap || 0).toLocaleString()}</div>
                    </div>
                    <div class="modal-stat-item">
                        <div class="modal-stat-label">Volume 24h</div>
                        <div class="modal-stat-value">$${(pumpfunData.volume24h || 0).toLocaleString()}</div>
                    </div>
                    <div class="modal-stat-item">
                        <div class="modal-stat-label">Holders</div>
                        <div class="modal-stat-value">${(pumpfunData.holders || 0).toLocaleString()}</div>
                    </div>
                    <div class="modal-stat-item">
                        <div class="modal-stat-label">Liquidity</div>
                        <div class="modal-stat-value">$${(pumpfunData.liquidity || 0).toLocaleString()}</div>
                    </div>
                </div>
            </div>
            
            <!-- Analysis Section -->
            <div class="modal-section analysis-section-modal">
                    <div class="modal-section-header">
                        <h3>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: inline-block; vertical-align: middle; margin-right: 0.5rem; color: #7c3aed;">
                                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                                <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
                            </svg>
                            MoltyTouch Analysis
                        </h3>
                        <div class="confidence-badge">Confidence: ${confidenceScore}%</div>
                    </div>
                <div class="modal-recommendation">
                    <div class="recommendation-badge recommendation-${recommendation.toLowerCase()}">
                        <span class="action-badge">${action}</span>
                        <span class="recommendation-text">${recommendation}</span>
                    </div>
                    <div class="recommendation-reasons">
                        <h4>Reasons:</h4>
                        <ul>
                            ${reasons.map(reason => `<li>${reason}</li>`).join('')}
                        </ul>
                    </div>
                    ${summary ? `<p class="recommendation-summary">${summary}</p>` : ''}
                </div>
            </div>
            
            <!-- Twitter Data Section -->
            <div class="modal-section tweets-section-modal">
                    <div class="modal-section-header">
                        <h3>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="display: inline-block; vertical-align: middle; margin-right: 0.5rem; color: #00d4ff;">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                            </svg>
                            Twitter Analysis
                        </h3>
                        <span class="tweet-count">${tweets.length} tweets</span>
                    </div>
                <div class="modal-tweets-container">
                    ${tweets.length > 0 ? tweets.slice(0, 10).map(tweet => `
                        <div class="modal-tweet-card">
                            <div class="modal-tweet-header">
                                <div class="modal-tweet-avatar">${(tweet.authorName || '?').charAt(0).toUpperCase()}</div>
                                <div class="modal-tweet-author">
                                    <div class="modal-tweet-name">${tweet.authorName || 'Unknown'}</div>
                                    <div class="modal-tweet-handle">${tweet.author || '@unknown'}</div>
                                </div>
                                <div class="modal-tweet-time">${formatTime(tweet.timestamp)}</div>
                            </div>
                            <div class="modal-tweet-text">${formatTweetText(tweet.text)}</div>
                            <div class="modal-tweet-stats">
                                <span class="modal-tweet-stat">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                                    </svg>
                                    ${tweet.likes || 0}
                                </span>
                                <span class="modal-tweet-stat">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3"/>
                                    </svg>
                                    ${tweet.retweets || 0}
                                </span>
                                <span class="modal-tweet-stat">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                                    </svg>
                                    ${tweet.replies || 0}
                                </span>
                            </div>
                        </div>
                    `).join('') : '<p class="no-tweets">No tweets found</p>'}
                </div>
            </div>
        </div>
    `;
    
    // Stocker les données pour le téléchargement
    modal.dataset.tweets = JSON.stringify(tweets);
    modal.dataset.pumpfunData = JSON.stringify(pumpfunData);
    modal.dataset.analysis = JSON.stringify(analysis);
    modal.dataset.keyword = currentKeyword;
    
    // Stocker les dernières données pour le bouton hero
    lastScrapeData = {
        tweets: tweets,
        pumpfunData: pumpfunData,
        analysis: analysis,
        keyword: currentKeyword
    };
    
    // Ouvrir le modal
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    hideLoading();
}

// Fonction pour télécharger les données actuelles du modal
function downloadCurrentData() {
    const modal = document.getElementById('resultsModal');
    if (!modal) {
        console.error('❌ Modal not found');
        return;
    }
    
    try {
        const tweets = JSON.parse(modal.dataset.tweets || '[]');
        const pumpfunData = JSON.parse(modal.dataset.pumpfunData || 'null');
        const analysis = JSON.parse(modal.dataset.analysis || 'null');
        const keyword = modal.dataset.keyword || currentKeyword;
        
        downloadScraperData(tweets, pumpfunData, analysis, keyword);
    } catch (error) {
        console.error('❌ Error downloading data:', error);
        alert('Error downloading data. Please try again.');
    }
}

// Exposer la fonction globalement
window.downloadCurrentData = downloadCurrentData;

// Fonction pour télécharger les dernières données depuis le hero
function downloadLastScrapeData() {
    if (!lastScrapeData) {
        alert('No data available. Please search for a token first.');
        return;
    }
    
    downloadScraperData(
        lastScrapeData.tweets,
        lastScrapeData.pumpfunData,
        lastScrapeData.analysis,
        lastScrapeData.keyword
    );
}

// Exposer la fonction globalement
window.downloadLastScrapeData = downloadLastScrapeData;

// Fonction pour copier l'adresse du contrat
function copyContractAddress() {
    const contractAddress = 'FUFkXXfWbpp3GWhWuE2i97J2qe1UVqkVFnnfX37B39R7';
    const copyBtn = document.getElementById('contractCopyBtn');
    
    navigator.clipboard.writeText(contractAddress).then(() => {
        // Feedback visuel
        const originalHTML = copyBtn.innerHTML;
        copyBtn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        `;
        copyBtn.style.color = '#00ff00';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalHTML;
            copyBtn.style.color = '';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy contract address');
    });
}

// Exposer la fonction globalement
window.copyContractAddress = copyContractAddress;

function closeResultsModal() {
    const modal = document.getElementById('resultsModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

// Make functions globally available
window.closeResultsModal = closeResultsModal;

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeResultsModal();
    }
});
