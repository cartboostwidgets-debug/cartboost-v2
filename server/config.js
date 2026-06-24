require('dotenv').config();

const requiredEnvVars = [
    'FIREBASE_PROJECT_ID',
    'FIREBASE_PRIVATE_KEY',
    'FIREBASE_CLIENT_EMAIL',
    'TIENDANUBE_CLIENT_ID',
    'TIENDANUBE_CLIENT_SECRET',
    'TIENDANUBE_REDIRECT_URI',
    'SESSION_SECRET'
];

requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
        throw new Error(`❌ ERROR CRÍTICO EN PRODUCCIÓN: Falta la variable de entorno "${varName}". No se puede iniciar el servidor.`);
    }
});

module.exports = {
    databaseUrl: process.env.DATABASE_URL,
    firebase: {
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL
    },
    tiendanube: {
        clientId: process.env.TIENDANUBE_CLIENT_ID,
        clientSecret: process.env.TIENDANUBE_CLIENT_SECRET,
        redirectUri: process.env.TIENDANUBE_REDIRECT_URI
    },
    sessionSecret: process.env.SESSION_SECRET,
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
};
