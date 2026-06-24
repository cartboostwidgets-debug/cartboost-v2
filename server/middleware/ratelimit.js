const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 50, // Límite de 50 intentos
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Demasiados intentos de autenticación. Por favor, intenta más tarde.' }
});

const oauthLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 10,
    message: { error: 'Has alcanzado el límite de intentos de conexión de tiendas. Espera una hora.' }
});

module.exports = { authLimiter, oauthLimiter };
