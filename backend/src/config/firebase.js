const admin = require('firebase-admin');

// Debug : Afficher les variables d'environnement Firebase
console.log('🔍 === DEBUG FIREBASE BACKEND ===');
console.log('FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID);
console.log('GOOGLE_CLOUD_PROJECT_ID:', process.env.GOOGLE_CLOUD_PROJECT_ID);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('================================');

// Initialiser Firebase Admin SDK
if (!admin.apps.length) {
  try {
    let serviceAccount;
    
    // Essayer de charger le fichier de service account
    try {
      serviceAccount = require('../../firebase-service-account.json');
      console.log('🔍 Fichier firebase-service-account.json trouvé');
    } catch (err) {
      console.warn('⚠️ Fichier firebase-service-account.json non trouvé, tentative avec variables d\'environnement');
    }
    
    if (serviceAccount) {
      // Utiliser le fichier de service account
      console.log('🔍 Initialisation Firebase avec service account...');
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID || serviceAccount.project_id
      });
      console.log('✅ Firebase Admin SDK initialisé avec service account');
    } else {
      // Fallback : utiliser Application Default Credentials ou initialisation basique
      console.log('🔍 Initialisation Firebase avec projet ID uniquement...');
      admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID
      });
      console.log('✅ Firebase Admin SDK initialisé en mode basique');
      console.warn('⚠️ Certaines fonctionnalités peuvent être limitées sans service account');
    }
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation Firebase Admin SDK:', error);
    console.error('Erreur complète:', error.message);
    console.error('Stack:', error.stack);
  }
} else {
  console.log('✅ Firebase Admin SDK déjà initialisé');
}

const db = admin.firestore();
console.log('✅ Firestore initialisé');

module.exports = { admin, db };
