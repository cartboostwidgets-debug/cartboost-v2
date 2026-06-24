const admin = require('firebase-admin');
const config = require('./config');

admin.initializeApp({
    credential: admin.credential.cert({
        projectId: config.firebase.projectId,
        privateKey: config.firebase.privateKey,
        clientEmail: config.firebase.clientEmail
    })
});

const db = admin.firestore();

module.exports = { admin, db };
