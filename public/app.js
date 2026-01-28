// Configuration
// VERSION 2.0 - Debug amélioré
console.log('🚀 app.js VERSION 2.0 chargée');
const API_BASE_URL = window.location.origin;

// État de l'application
let currentKeyword = 'MOLTYVOUCH';
let currentTweets = [];

// Fonction principale de recherche
async function searchKeyword(keyword) {
    console.log('🚀 searchKeyword appelé avec:', keyword);
    
    if (!keyword || keyword.trim() === '') {
        console.warn('⚠️ Mot-clé vide');
        alert('Veuillez entrer un mot-clé');
        return;
    }

    currentKeyword = keyword.trim().toUpperCase();
    console.log('📊 Recherche pour:', currentKeyword);
    showLoading();

    try {
        console.log('🌐 Envoi de la requête à:', `${API_BASE_URL}/api/scrape`);
        
        // Charger les tweets
        const tweetsResponse = await fetch(`${API_BASE_URL}/api/scrape`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                keyword: currentKeyword,
                limit: 20
            })
        });

        console.log('📡 Réponse reçue, status:', tweetsResponse.status);
        
        if (!tweetsResponse.ok) {
            throw new Error(`Erreur HTTP: ${tweetsResponse.status} ${tweetsResponse.statusText}`);
        }

        const tweetsData = await tweetsResponse.json();
        console.log('📦 Données reçues:', tweetsData);
        console.log('📦 Type de tweetsData:', typeof tweetsData);
        console.log('📦 tweetsData.success:', tweetsData.success);
        console.log('📦 tweetsData.tweets:', tweetsData.tweets);
        console.log('📦 Nombre de tweets:', tweetsData.tweets?.length);

        if (tweetsData.success) {
            console.log('✅ Données valides, tweets reçus:', tweetsData.tweets?.length || 0);
            currentTweets = tweetsData.tweets || [];
            
            console.log('📋 currentTweets après assignation:', currentTweets);
            console.log('📋 currentTweets.length:', currentTweets.length);
            
            if (currentTweets.length === 0) {
                console.warn('⚠️ Tableau de tweets vide');
                showError('Aucun tweet trouvé pour ce mot-clé.');
                return;
            }
            
            console.log('📤 Appel de displayTweets avec', currentTweets.length, 'tweets');
            console.log('📤 Premier tweet:', currentTweets[0]);
            
            // Appel DIRECT de displayTweets sans délai
            console.log('📤 === AVANT APPEL displayTweets ===');
            console.log('📤 displayTweets existe?', typeof displayTweets);
            console.log('📤 currentTweets:', currentTweets);
            
            // Appel immédiat de displayTweets
            try {
                console.log('📤 Appel de displayTweets MAINTENANT...');
                displayTweets(currentTweets);
                console.log('✅ displayTweets appelé avec succès');
            } catch (displayError) {
                console.error('❌ Erreur dans displayTweets:', displayError);
                console.error('❌ Stack:', displayError.stack);
                // En cas d'erreur, afficher au moins quelque chose
                const container = document.getElementById('tweetsContainer');
                if (container) {
                    container.innerHTML = `<div style="color: white; padding: 20px; background: #ef4444; border-radius: 10px;">
                        <h3>Erreur d'affichage</h3>
                        <p>${displayError.message}</p>
                        <p>Tweets reçus: ${currentTweets.length}</p>
                    </div>`;
                }
            }
            
            // Scroll automatique vers les tweets
            setTimeout(() => {
                const tweetsSection = document.getElementById('tweets');
                if (tweetsSection) {
                    tweetsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 500);
        } else {
            throw new Error(tweetsData.error || 'Erreur lors du chargement des tweets');
        }

    } catch (error) {
        console.error('Erreur:', error);
        showError('Erreur lors du chargement des données: ' + error.message);
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
            altContainer.innerHTML = '<div class="loading-state"><p style="color: #ef4444;">Erreur: Container principal non trouvé</p></div>';
        }
        return;
    }
    
    if (!tweets || tweets.length === 0) {
        console.warn('⚠️ Aucun tweet à afficher');
        container.innerHTML = '<div class="loading-state"><p>Aucun tweet trouvé pour ce mot-clé.</p></div>';
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
        console.error('❌ Erreur lors de l\'affichage des tweets:', error);
        console.error('❌ Stack trace:', error.stack);
        container.innerHTML = `<div class="loading-state"><p style="color: #ef4444;">Erreur d'affichage: ${error.message}</p><pre style="color: white; background: #1a1a1a; padding: 10px; border-radius: 5px;">${error.stack}</pre></div>`;
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
        console.warn('⚠️ Aucun mot-clé saisi');
        alert('Veuillez entrer un mot-clé');
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
        return 'Récemment';
    }
    
    try {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) {
            return 'Récemment';
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
        console.error('Erreur formatTime:', error);
        return 'Récemment';
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
        // Nettoyer le texte - supprimer tout HTML existant qui pourrait être mal formé
        let cleanText = String(text);
        
        // Supprimer les fragments de code CSS/HTML mal formés qui apparaissent dans le texte
        // Pattern pour supprimer les fragments comme: #6366f1; font-weight: 600;">$1
        // Nettoyer AVANT l'échappement HTML pour mieux capturer les patterns
        cleanText = cleanText
            // Supprimer les fragments de style CSS complets avec regex pattern (pattern le plus spécifique en premier)
            .replace(/#6366f1;\s*font-weight:\s*600;\s*">\$1/gi, '') // Pattern exact du problème
            .replace(/#[0-9a-fA-F]{6};\s*font-weight:\s*\d+;\s*">\$?\d*/gi, '') // Pattern général
            .replace(/color:\s*#[0-9a-fA-F]{6};\s*font-weight:\s*\d+;\s*">\$?\d*/gi, '') // Avec "color:"
            // Supprimer les fragments de couleur CSS seuls
            .replace(/#[0-9a-fA-F]{6};\s*/gi, '')
            // Supprimer les fragments font-weight seuls
            .replace(/font-weight:\s*\d+;\s*/gi, '')
            // Supprimer les fragments de balises fermantes avec contenu
            .replace(/">\$?\d*/g, '')
            .replace(/">/g, '')
            // Supprimer les fragments de balises HTML incomplètes
            .replace(/<[^>]*$/g, '')
            // Supprimer les balises style et script complètes
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
            // Supprimer les répétitions de fragments spécifiques (avec variations)
            .replace(/(#6366f1;\s*font-weight:\s*600;\s*">\$1\s*)+/gi, '')
            .replace(/(color:\s*#6366f1;\s*font-weight:\s*600;\s*">\$1\s*)+/gi, '')
            // Supprimer les fragments isolés qui peuvent rester
            .replace(/\$1/g, '') // Supprimer les $1 isolés
            .replace(/span\s+style/g, '') // Supprimer les fragments "span style"
            .replace(/color:\s*#6366f1/g, ''); // Supprimer les fragments "color: #6366f1"
        
        // Nettoyer les espaces multiples et normaliser
        cleanText = cleanText
            .replace(/\s+/g, ' ') // Normaliser les espaces multiples
            .trim();
        
        // Échapper les caractères HTML pour sécurité
        cleanText = cleanText
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
        
        // Nettoyer les répétitions de fragments (après échappement HTML)
        cleanText = cleanText
            // Supprimer les fragments échappés
            .replace(/(&amp;#6366f1;|#6366f1;|font-weight:\s*600;|">\$1|&quot;&gt;\$1)+/gi, '')
            .replace(/(&amp;quot;&gt;\$?\d*)+/gi, '') // Fragments échappés
            .replace(/&amp;\$1/gi, '') // Fragments $1 échappés
            .replace(/&quot;&gt;\$?\d*/gi, '') // Fragments ">$1 échappés
            // Supprimer les répétitions multiples d'espaces et fragments
            .replace(/\s+/g, ' ') // Normaliser les espaces multiples
            .replace(/(\s*#6366f1\s*)+/gi, '') // Répétitions de #6366f1
            .replace(/(\s*font-weight\s*)+/gi, '') // Répétitions de font-weight
            .trim();
        
        // Mettre en évidence les mentions de crypto (seulement sur le texte propre)
        return cleanText
            .replace(/\$([A-Z]{2,})/g, '<span style="color: #6366f1; font-weight: 600;">$$1</span>')
            .replace(/#([A-Za-z0-9_]+)/g, '<span style="color: #8b5cf6;">#$1</span>')
            .replace(/@([A-Za-z0-9_]+)/g, '<span style="color: #ec4899;">@$1</span>')
            // Convertir les URLs en liens cliquables
            .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" style="color: #6366f1; text-decoration: underline;">$1</a>');
    } catch (error) {
        console.error('Erreur formatTweetText:', error);
        // En cas d'erreur, retourner le texte nettoyé sans formatage
        return String(text || '').replace(/<[^>]*>/g, '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
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
    // Charger les données pour MOLTYVOUCH par défaut
    searchKeyword('MOLTYVOUCH');
});

// Smooth scroll pour les liens de navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
