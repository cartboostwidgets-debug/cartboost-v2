const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const verifyFirebaseToken = require('./middleware/auth');
const { authLimiter, oauthLimiter } = require('./middleware/rateLimit');
const config = require('./config');

const router = express.Router();

// 1. INICIO DE OAUTH DE TIENDANUBE
router.get('/auth/nuvem', authLimiter, verifyFirebaseToken, async (req, res) => {
    const state = crypto.randomBytes(16).toString('hex');
    req.session.oauth_state = state;
    req.session.uid = req.user.uid; // Guardar UID para el callback

    const authUrl = `https://www.tiendanube.com/apps/authorize?` +
        `client_id=${config.tiendanube.clientId}` +
        `&redirect_uri=${encodeURIComponent(config.tiendanube.redirectUri)}` +
        `&state=${state}` +
        `&response_type=code`;

    res.redirect(authUrl);
});

// 2. CALLBACK DE TIENDANUBE
router.get('/oauth/callback', oauthLimiter, async (req, res) => {
    const { code, state } = req.query;

    // Validación CSRF
    if (state !== req.session.oauth_state) {
        return res.status(403).send("Error de seguridad: El parámetro 'state' no coincide.");
    }

    if (!code) {
        return res.status(400).send("Tiendanube no devolvió un código de autorización.");
    }

    try {
        // Intercambiar código por Access Token
        const tokenResponse = await axios.post('https://www.tiendanube.com/apps/token', {
            client_id: config.tiendanube.clientId,
            client_secret: config.tiendanube.clientSecret,
            code: code,
            grant_type: 'authorization_code',
            redirect_uri: config.tiendanube.redirectUri
        });

        const { access_token, user_id, store_id, store_name, store_url } = tokenResponse.data;
    
        // Limpiar sesión
        req.session.oauth_state = null;
        req.session.uid = null;

        // Redirigir al Dashboard frontend
        res.redirect('/dashboard');

    } catch (error) {
        console.error('Error en callback OAuth:', error.response?.data || error.message);
        res.status(500).send("Error al conectar con Tiendanube.");
    }
});

module.exports = router;
