require('dotenv').config();
const axios = require('axios');

async function testTwitterToken() {
    console.log('🔍 Test de connexion Twitter API...\n');

    // Test 1: Vérifier le Bearer Token actuel
    const bearerToken = process.env.TWITTER_BEARER_TOKEN;
    if (bearerToken) {
        const decodedToken = decodeURIComponent(bearerToken).trim();
        console.log('📋 Bearer Token trouvé (premiers caractères):', decodedToken.substring(0, 20) + '...');
        
        try {
            const response = await axios.get('https://api.twitter.com/2/tweets/search/recent', {
                headers: {
                    'Authorization': `Bearer ${decodedToken}`
                },
                params: {
                    query: 'bitcoin -is:retweet lang:en',
                    max_results: 10,
                    'tweet.fields': 'created_at,public_metrics,author_id,text'
                },
                timeout: 10000
            });
            console.log('✅ Bearer Token valide !');
            console.log('📊 Test réussi - Tweets trouvés:', response.data.data?.length || 0);
            return true;
        } catch (error) {
            if (error.response?.status === 401) {
                console.log('❌ Bearer Token invalide ou expiré (401)');
            } else {
                console.log('❌ Erreur:', error.response?.status, error.response?.statusText);
            }
        }
    } else {
        console.log('⚠️  Aucun Bearer Token trouvé');
    }

    // Test 2: Essayer de générer un nouveau Bearer Token
    const apiKey = process.env.TWITTER_API_KEY;
    const apiSecret = process.env.TWITTER_API_SECRET;

    if (apiKey && apiSecret) {
        console.log('\n🔄 Tentative de génération d\'un nouveau Bearer Token...');
        try {
            const credentials = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
            
            const response = await axios.post(
                'https://api.twitter.com/oauth2/token',
                'grant_type=client_credentials',
                {
                    headers: {
                        'Authorization': `Basic ${credentials}`,
                        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                    },
                    timeout: 10000
                }
            );

            if (response.data.access_token) {
                console.log('✅ Nouveau Bearer Token généré avec succès !');
                console.log('📋 Nouveau token (premiers caractères):', response.data.access_token.substring(0, 20) + '...');
                console.log('\n💡 Mettez à jour votre .env avec:');
                console.log(`TWITTER_BEARER_TOKEN=${response.data.access_token}`);
                
                // Tester le nouveau token
                try {
                    const testResponse = await axios.get('https://api.twitter.com/2/tweets/search/recent', {
                        headers: {
                            'Authorization': `Bearer ${response.data.access_token}`
                        },
                        params: {
                            query: 'bitcoin',
                            max_results: 1
                        },
                        timeout: 10000
                    });
                    console.log('✅ Nouveau token testé avec succès !');
                    return true;
                } catch (testError) {
                    console.log('❌ Le nouveau token ne fonctionne pas:', testError.response?.status);
                }
            }
        } catch (error) {
            console.log('❌ Erreur lors de la génération:', error.response?.data || error.message);
            if (error.response?.status === 401) {
                console.log('💡 Vérifiez que votre API_KEY et API_SECRET sont corrects');
            }
        }
    } else {
        console.log('\n⚠️  API_KEY ou API_SECRET non trouvés');
    }

    console.log('\n📝 Consultez TWITTER_SETUP.md pour plus d\'informations');
    return false;
}

testTwitterToken().then(success => {
    process.exit(success ? 0 : 1);
}).catch(error => {
    console.error('Erreur fatale:', error);
    process.exit(1);
});
