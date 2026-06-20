/**
 * =====================================================================
 * CARTBOOST — server.js
 * Backend OAuth para Tiendanube (Node.js + Express)
 * =====================================================================
 *
 * Responsabilidades de este servidor:
 *   1. Servir el frontend (index.html, style.css, app.js).
 *   2. Recibir el callback de OAuth de Tiendanube en /oauth/callback.
 *   3. Intercambiar el "code" por un access_token (server-side, porque
 *      requiere el Client Secret, que NUNCA debe vivir en el frontend).
 *   4. Guardar store_id + access_token vinculados.
 *   5. Redirigir de vuelta al frontend con el resultado del proceso.
 *
 * VARIABLES DE ENTORNO REQUERIDAS (configurar en el panel de Render,
 * nunca hardcodeadas en este archivo ni commiteadas a git):
 *
 *   TIENDANUBE_CLIENT_ID      = 34476
 *   TIENDANUBE_CLIENT_SECRET  = <tu client secret real, del panel de partners>
 *   APP_URL                   = https://cartboost-v2.onrender.com
 *   PORT                      = (Render la inyecta sola, no la fijes a mano)
 *
 * En Render: Dashboard → tu servicio → Environment → Add Environment Variable.
 * =====================================================================
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const fetch = global.fetch || require('node-fetch'); // Node 18+ ya trae fetch nativo

const app = express();
const PORT = process.env.PORT || 3000;

/* =====================================================================
   CONFIGURACIÓN
   ===================================================================== */

const TIENDANUBE_CLIENT_ID = process.env.TIENDANUBE_CLIENT_ID || '34476';
const TIENDANUBE_CLIENT_SECRET = process.env.TIENDANUBE_CLIENT_SECRET; // OBLIGATORIA, sin default
const APP_URL = process.env.APP_URL || 'https://cartboost-v2.onrender.com';

// Endpoint oficial de Tiendanube para intercambiar code -> access_token.
// Referencia: https://tiendanube.github.io/api-documentation/authentication
const TIENDANUBE_TOKEN_URL = 'https://www.tiendanube.com/apps/authorize/token';

if (!TIENDANUBE_CLIENT_SECRET) {
  console.error(
    '[CartBoost] FALTA TIENDANUBE_CLIENT_SECRET en las variables de entorno. ' +
    'El intercambio de OAuth va a fallar hasta que la configures en Render ' +
    '(Dashboard → Environment).'
  );
}

/* =====================================================================
   "BASE DE DATOS" — archivo JSON local
   =====================================================================
   ADVERTENCIA IMPORTANTE: el disco de Render es EFÍMERO en el plan free.
   Cada redeploy o reinicio por inactividad BORRA este archivo y perdés
   todas las tiendas vinculadas. Esto es válido solo para pruebas.
   ANTES DE PRODUCCIÓN REAL: migrar a una base de datos persistente
   (Postgres de Render, MongoDB Atlas, Supabase, etc.)
   ===================================================================== */

const DB_PATH = path.join(__dirname, 'stores.json');

function readStores() {
  try {
    if (!fs.existsSync(DB_PATH)) return {};
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.error('[CartBoost] Error leyendo stores.json:', err.message);
    return {};
  }
}

function saveStore(storeId, data) {
  const stores = readStores();
  stores[storeId] = { ...stores[storeId], ...data, updatedAt: new Date().toISOString() };
  fs.writeFileSync(DB_PATH, JSON.stringify(stores, null, 2), 'utf-8');
  return stores[storeId];
}

/* =====================================================================
   MIDDLEWARES
   ===================================================================== */

app.use(express.json());

// Servir el frontend estático (index.html, style.css, app.js).
// Asumiendo que server.js vive en la raíz del repo junto a esos archivos.
// Si tu estructura de carpetas es distinta, ajustar este path.
app.use(express.static(path.join(__dirname)));

/* =====================================================================
   RUTA 1 — GET /
   =====================================================================
   Soluciona el error "Cannot GET /". Sirve el index.html del frontend.
   Si index.html no existe en esta carpeta, responde con un mensaje
   claro en vez de un 404 genérico.
   ===================================================================== */

app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(200).send(
      'CartBoost backend funcionando. ' +
      'No se encontró index.html en esta carpeta — ' +
      'verificá que el frontend esté en el mismo directorio que server.js.'
    );
  }
});

/* =====================================================================
   RUTA 2 — GET /oauth/callback
   =====================================================================
   Tiendanube redirige acá después de que el usuario autoriza la app,
   con un query param ?code=XXXX. Este endpoint:
     1. Toma ese code.
     2. Lo intercambia por un access_token llamando al endpoint oficial
        de Tiendanube (server-to-server, usando el Client Secret).
     3. Guarda store_id + access_token.
     4. Redirige al usuario de vuelta al frontend con el resultado.
   ===================================================================== */

app.get('/oauth/callback', async (req, res) => {
  const { code, error: oauthError } = req.query;

  // Caso: el usuario rechazó la autorización en Tiendanube.
  if (oauthError) {
    return res.redirect(
      `${APP_URL}/?cb_step=error&reason=${encodeURIComponent(oauthError)}`
    );
  }

  // Caso: Tiendanube no mandó ningún code (no debería pasar en un flujo normal).
  if (!code) {
    return res.redirect(`${APP_URL}/?cb_step=error&reason=missing_code`);
  }

  if (!TIENDANUBE_CLIENT_SECRET) {
    console.error('[CartBoost] No se puede intercambiar el code: falta TIENDANUBE_CLIENT_SECRET.');
    return res.redirect(`${APP_URL}/?cb_step=error&reason=server_misconfigured`);
  }

  try {
    // Intercambio real del code por un access_token.
    // Documentación oficial: https://tiendanube.github.io/api-documentation/authentication
    const tokenResponse = await fetch(TIENDANUBE_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: TIENDANUBE_CLIENT_ID,
        client_secret: TIENDANUBE_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: code
      })
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error('[CartBoost] Tiendanube rechazó el intercambio de code:', tokenData);
      return res.redirect(`${APP_URL}/?cb_step=error&reason=token_exchange_failed`);
    }

    // Respuesta esperada de Tiendanube (según su documentación oficial):
    //   { access_token, token_type, scope, user_id }
    // "user_id" en la respuesta de Tiendanube ES el store_id de la tienda.
    const { access_token, user_id: storeId, scope } = tokenData;

    if (!storeId) {
      console.error('[CartBoost] La respuesta de Tiendanube no incluyó user_id/store_id:', tokenData);
      return res.redirect(`${APP_URL}/?cb_step=error&reason=missing_store_id`);
    }

    // Guardar la tienda vinculada (store_id + access_token).
    saveStore(storeId, { storeId, accessToken: access_token, scope });

    // Intentar obtener el nombre real de la tienda y el conteo de productos
    // desde la API de Tiendanube, para no inventar esos datos en el frontend.
    let storeName = `Tienda #${storeId}`;
    let productsCount = 0;

    try {
      const storeInfoRes = await fetch(`https://api.tiendanube.com/v1/${storeId}/store`, {
        headers: {
          'Authentication': `bearer ${access_token}`,
          'User-Agent': 'CartBoost (soporte@cartboost.app)'
        }
      });
      if (storeInfoRes.ok) {
        const storeInfo = await storeInfoRes.json();
        // El nombre puede venir como objeto multi-idioma { es: '...', pt: '...' }
        storeName = (storeInfo.name && (storeInfo.name.es || storeInfo.name.pt || storeInfo.name.en))
          || storeName;
      }

      const productsRes = await fetch(`https://api.tiendanube.com/v1/${storeId}/products?per_page=1`, {
        headers: {
          'Authentication': `bearer ${access_token}`,
          'User-Agent': 'CartBoost (soporte@cartboost.app)'
        }
      });
      if (productsRes.ok) {
        // Tiendanube devuelve el total en el header 'X-Total-Count'.
        const totalHeader = productsRes.headers.get('x-total-count');
        if (totalHeader) productsCount = parseInt(totalHeader, 10) || 0;
      }
    } catch (infoErr) {
      // Si esta segunda llamada falla, no abortamos el login: la tienda
      // ya quedó guardada y vinculada. Solo no tenemos nombre/conteo aún.
      console.warn('[CartBoost] No se pudo obtener info adicional de la tienda:', infoErr.message);
    }

    saveStore(storeId, { name: storeName, productsCount });

    // Redirigir de vuelta al frontend con el resultado, tal como espera
    // handleOAuthReturnParams() en app.js.
    const redirectUrl =
      `${APP_URL}/?cb_step=success` +
      `&store_id=${encodeURIComponent(storeId)}` +
      `&store_name=${encodeURIComponent(storeName)}` +
      `&products_count=${encodeURIComponent(productsCount)}`;

    return res.redirect(redirectUrl);

  } catch (err) {
    console.error('[CartBoost] Error inesperado en /oauth/callback:', err);
    return res.redirect(`${APP_URL}/?cb_step=error&reason=server_error`);
  }
});

/* =====================================================================
   RUTA 3 — GET /api/store/:id  (opcional, para fetchStoreData() del frontend)
   =====================================================================
   Punto de integración para que app.js pueda refrescar los datos de la
   tienda en vez de depender solo de los query params del redirect.
   ===================================================================== */

app.get('/api/store/:id', (req, res) => {
  const stores = readStores();
  const store = stores[req.params.id];

  if (!store) {
    return res.status(404).json({ message: 'Tienda no encontrada.' });
  }

  // No devolver el access_token al frontend: es un dato sensible que
  // solo el backend debe usar para llamar a la API de Tiendanube.
  const { accessToken, ...safeStoreData } = store;

  res.json({
    id: safeStoreData.storeId,
    name: safeStoreData.name || `Tienda #${safeStoreData.storeId}`,
    productsCount: safeStoreData.productsCount || 0,
    widgetsActive: safeStoreData.widgetsActive || 0
  });
});

/* =====================================================================
   INICIO DEL SERVIDOR
   ===================================================================== */

app.listen(PORT, () => {
  console.log(`[CartBoost] Servidor corriendo en el puerto ${PORT}`);
  console.log(`[CartBoost] APP_URL configurada: ${APP_URL}`);
  if (!TIENDANUBE_CLIENT_SECRET) {
    console.warn('[CartBoost] ADVERTENCIA: TIENDANUBE_CLIENT_SECRET no está configurado.');
  }
});
