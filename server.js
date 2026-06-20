const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de tus credenciales de Tiendanube (las obtienes de tu panel de Partner)
const CLIENT_ID = 'TU_CLIENT_ID';
const CLIENT_SECRET = 'TU_CLIENT_SECRET';

app.get('/oauth/callback', async (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.status(400).send('Falta el código de autorización.');
    }

    try {
        // Intercambiamos el código por el access_token permanente
        const response = await axios.post('https://tiendanube.com', {
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: 'authorization_code',
            code: code
        });

        const accessToken = response.data.access_token;
        const userStoreId = response.data.user_id;

        // ¡IMPORTANTE! Aquí debes guardar el accessToken y el userStoreId 
        // en una base de datos para saber qué tiendas tienen instalado tu widget.
        console.log(`App instalada con éxito en la tienda ${userStoreId}. Token: ${accessToken}`);

        // Redirigimos al usuario de vuelta a la página de tu app en GitHub Pages
        res.redirect(`https://github.io{userStoreId}`);

    } catch (error) {
        console.error('Error en el proceso de OAuth:', error.response?.data || error.message);
        res.status(500).send('Error durante la instalación de la aplicación.');
    }
});

app.listen(PORT, () => {
    console.log(`Servidor de autenticación corriendo en el puerto ${PORT}`);
});
