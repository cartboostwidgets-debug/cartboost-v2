const { admin } = require('../firebase');

async function verifyFirebaseToken(req, res, next) {
    // Intentar obtener de headers o cookies
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
        return res.status(401).json({ error: 'No autenticado. Token no proporcionado.' });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken; // { uid, email, name, ... }
        next();
    } catch (error) {
        console.error('Error verificando token:', error);
        res.status(403).json({ error: 'Token inválido o expirado.' });
    }
}

module.exports = verifyFirebaseToken;
