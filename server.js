// server.js
const express = require('express');
const path = require('path');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
// Firebase Admin desactivado temporalmente
let db = null;
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// OAuth callback de Tiendanube
app.get('/oauth/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).send('Falta el código de autorización.');
  try {
    const response = await axios.post('https://www.tiendanube.com/oauth/token', {
      client_id: process.env.TIENDANUBE_CLIENT_ID || '34476',
      client_secret: process.env.TIENDANUBE_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: process.env.TIENDANUBE_REDIRECT_URL || 'https://cartboost-v2.onrender.com/oauth/callback'
    });
    const { access_token, store_id, store_name } = response.data;
    // Aquí se debería obtener el uid del usuario autenticado (por token de Firebase enviado desde el frontend)
    // Como simplificación, asumimos que el frontend enviará el uid en un parámetro adicional "state"
    // Pero en esta versión, guardaremos en Firestore usando un identificador temporal.
    // Para producción, se debe enviar el uid en el state del OAuth y verificarlo.
    // Guardar en Firestore (asociar al usuario mediante state)
    const userId = req.query.state; // El frontend debe pasar el uid en state
    if (userId) {
      await db.collection('stores').doc(userId).set({
        userId,
        store_id,
        store_name,
        access_token,
        connected: true,
        created_at: new Date().toISOString()
      });
    }
    res.redirect('/');
  } catch (error) {
    console.error('Error en OAuth:', error.response?.data || error.message);
    res.redirect('/?status=error');
  }
});

// Servir index.html para cualquier otra ruta (SPA)
app.get('*', (req, res) => {
res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
