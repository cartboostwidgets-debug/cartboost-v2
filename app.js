/* app.js - Lógica Completa del Sistema con Validación Robusta de Firebase */

// =========================================================================
// 1. CONFIGURACIÓN DE FIREBASE Y VALIDACIÓN DE SEGURIDAD
// =========================================================================
const firebaseConfig = {
    apiKey: "AIzaSyAq9zyfd2EubmIA_MGhjmbF9jZzZBZ25XA",
    authDomain: "cartboost-60a48.firebaseapp.com",
    projectId: "cartboost-60a48",
    storageBucket: "cartboost-60a48.firebasestorage.app",
    messagingSenderId: "503544641575",
    appId: "1:503544641575:web:c10f4c762b536b06b87602",
    measurementId: "G-NG83JVTPN5"
};

// Función para validar que las credenciales no sean placeholders
function validateFirebaseConfig(config) {
    const placeholders = ['YOUR_', 'TU_', 'placeholder', 'YOUR_PROJECT_ID'];
    for (const key in config) {
        const val = config[key];
        // Si está vacío, es nulo o no es un string, es inválido
        if (!val || typeof val !== 'string') return false;
        // Si contiene palabras clave de placeholder, es inválido
        const upperVal = val.toUpperCase();
        for (const p of placeholders) {
            if (upperVal.includes(p)) return false;
        }
    }
    return true;
}

let isFirebaseReady = false;
let firebaseErrorMsg = null;

console.log('🚀 CartBoost: Inicializando Firebase...');

if (validateFirebaseConfig(firebaseConfig)) {
    try {
        firebase.initializeApp(firebaseConfig);
        isFirebaseReady = true;
        console.log('✅ CartBoost: Firebase inicializado correctamente.');
    } catch (e) {
        console.error('❌ CartBoost: Error de inicialización de Firebase:', e.message);
        firebaseErrorMsg = "Error al inicializar Firebase. Verifica que tus credenciales sean válidas.";
    }
} else {
    console.error('❌ CartBoost: Error de configuración de Firebase. Las credenciales no son válidas (placeholders detectados).');
    firebaseErrorMsg = "Firebase no está configurado. Debes agregar tus credenciales reales en firebaseConfig.";
}

// Mensaje de error elegante en la interfaz de usuario si falla la validación
if (firebaseErrorMsg) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 99999;
        background: #0F1420;
        color: #ffffff;
        padding: 18px 20px;
        text-align: center;
        font-family: 'Inter', sans-serif;
        font-size: 14px;
        border-bottom: 2px solid #ef4444;
        box-shadow: 0 8px 30px rgba(239, 68, 68, 0.3);
        backdrop-filter: blur(12px);
    `;
    errorDiv.textContent = firebaseErrorMsg;
    document.body.prepend(errorDiv);
}

// Declarar variables de Firebase solo si está listo
let auth = null;
let db = null;
if (isFirebaseReady) {
    auth = firebase.auth();
    db = firebase.firestore();
}

// =========================================================================
// 2. VARIABLES GLOBALES Y UTILIDADES DOM
// =========================================================================
const screens = document.querySelectorAll('.screen');
const loader = document.getElementById('loader-overlay');

function showLoader() { if(loader) loader.classList.add('show'); }
function hideLoader() { if(loader) loader.classList.remove('show'); }

// Función para cambiar de pantalla (SPA)
window.switchScreen = function(screenId) {
    screens.forEach(s => s.classList.remove('active'));
    const target = document.getElementById(screenId);
    if (target) target.classList.add('active');
    hideLoader();
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// =========================================================================
// 3. FUNCIONES DE FIRESTORE
// =========================================================================
async function createOrUpdateUser(user, additionalData = {}) {
    if (!isFirebaseReady) return false;
    const userRef = db.collection('users').doc(user.uid);
    const doc = await userRef.get();
    
    if (!doc.exists) {
        await userRef.set({
            uid: user.uid,
            nombre: additionalData.nombre || user.displayName || 'Usuario CartBoost',
            email: user.email,
            plan: 'Free Trial',
            trialActive: true,
            trialEndsAt: firebase.firestore.Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
            tiendaConectada: false,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        console.log('📦 CartBoost: Usuario registrado en Firestore.');
    }
    return userRef;
}

// =========================================================================
// 4. GESTIÓN DE SESIÓN (Auth State Listener)
// =========================================================================
if (isFirebaseReady) {
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            try {
                const userDoc = await db.collection('users').doc(user.uid).get();
                if (userDoc.exists) {
                    const userData = userDoc.data();
                    if (userData.tiendaConectada) {
                        renderDashboard(user, userData);
                        switchScreen('dashboard-screen');
                    } else {
                        switchScreen('auth-setup');
                    }
                } else {
                    await createOrUpdateUser(user);
                    switchScreen('auth-setup');
                }
            } catch (e) {
                console.error('❌ CartBoost: Error en Firestore (Session Listener):', e.message);
                switchScreen('landing-screen');
            }
        } else {
            if (!document.getElementById('landing-screen').classList.contains('active')) {
                switchScreen('landing-screen');
            }
        }
    });
} else {
    // Si Firebase no está listo, aseguramos que el flujo no se rompa
    console.warn('⚠️ CartBoost: El sistema no puede iniciar sesión porque Firebase no está configurado.');
}

// =========================================================================
// 5. REGISTRO DE USUARIO
// =========================================================================
document.getElementById('register-btn').addEventListener('click', async () => {
    if (!isFirebaseReady) {
        alert('Firebase no está configurado. Revisa tus credenciales.');
        return;
    }
    
    const nombre = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const pass = document.getElementById('reg-pass').value;
    const passConfirm = document.getElementById('reg-pass-confirm').value;

    if (!nombre) return alert('Por favor ingresa tu nombre completo.');
    if (!email || !pass) return alert('Por favor completa todos los campos.');
    if (pass !== passConfirm) return alert('Las contraseñas no coinciden.');
    if (pass.length < 6) return alert('La contraseña debe tener al menos 6 caracteres.');

    showLoader();
    try {
        const userCred = await auth.createUserWithEmailAndPassword(email, pass);
        await createOrUpdateUser(userCred.user, { nombre: nombre });
        hideLoader();
    } catch (error) {
        hideLoader();
        console.error('❌ CartBoost: Error de Autenticación (Registro):', error.message);
        alert('Error en registro: ' + error.message);
    }
});

// =========================================================================
// 6. LOGIN DE USUARIO
// =========================================================================
document.getElementById('login-btn').addEventListener('click', async () => {
    if (!isFirebaseReady) {
        alert('Firebase no está configurado.');
        return;
    }
    
    const email = document.getElementById('login-email').value.trim();
    const pass = document.getElementById('login-pass').value;

    if (!email || !pass) return alert('Por favor completa todos los campos.');
    showLoader();
    try {
        await auth.signInWithEmailAndPassword(email, pass);
        hideLoader();
    } catch (error) {
        hideLoader();
        console.error('❌ CartBoost: Error de Autenticación (Login):', error.message);
        alert('Error en inicio de sesión: ' + error.message);
    }
});

// =========================================================================
// 7. LOGIN CON GOOGLE
// =========================================================================
async function handleGoogleLogin() {
    if (!isFirebaseReady) {
        alert('Firebase no está configurado.');
        return;
    }
    
    showLoader();
    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        const result = await auth.signInWithPopup(provider);
        await createOrUpdateUser(result.user);
        hideLoader();
    } catch (error) {
        hideLoader();
        console.error('❌ CartBoost: Error de Autenticación (Google):', error.message);
        alert('Error en Google Login: ' + error.message);
    }
}
document.getElementById('google-register-btn').addEventListener('click', handleGoogleLogin);
document.getElementById('google-login-btn').addEventListener('click', handleGoogleLogin);

// =========================================================================
// 8. RECUPERAR CONTRASEÑA
// =========================================================================
document.getElementById('recover-btn').addEventListener('click', async () => {
    if (!isFirebaseReady) {
        alert('Firebase no está configurado.');
        return;
    }
    
    const email = document.getElementById('recover-email').value.trim();
    if (!email) return alert('Por favor ingresa tu email.');
    showLoader();
    try {
        await auth.sendPasswordResetEmail(email);
        hideLoader();
        alert('Link de recuperación enviado a tu correo.');
        switchScreen('auth-login');
    } catch (error) {
        hideLoader();
        console.error('❌ CartBoost: Error en Recuperación:', error.message);
        alert('Error: ' + error.message);
    }
});

// =========================================================================
// 9. CERRAR SESIÓN (LOGOUT)
// =========================================================================
document.getElementById('logout-btn').addEventListener('click', async () => {
    if (isFirebaseReady) {
        await auth.signOut();
    }
    switchScreen('landing-screen');
});

// =========================================================================
// 10. BOTONES DE LLAMADA A LA ACCIÓN (CTA)
// =========================================================================
document.getElementById('landing-probar-btn').addEventListener('click', () => switchScreen('auth-register'));
document.getElementById('hero-cta-btn').addEventListener('click', () => switchScreen('auth-register'));
document.getElementById('bottom-cta-btn').addEventListener('click', () => switchScreen('auth-register'));

// =========================================================================
// 11. RENDERIZAR DASHBOARD
// =========================================================================
async function renderDashboard(user, userData) {
    if (!isFirebaseReady) return;
    
    document.getElementById('dash-user-name').textContent = userData.nombre || user.displayName || 'Usuario';
    try {
        const storeDoc = await db.collection('stores').doc(user.uid).get();
        const badge = document.getElementById('dash-status-badge');
        if (storeDoc.exists) {
            const storeData = storeDoc.data();
            document.getElementById('dash-store-name').textContent = storeData.store_name || 'Tienda sin nombre';
            document.getElementById('dash-store-id').textContent = storeData.store_id || '---';
            if (storeData.connected) {
                badge.textContent = '● Conectada';
                badge.style.background = '#10b981';
            } else {
                badge.textContent = '● Desconectada';
                badge.style.background = '#ef4444';
            }
        } else {
            document.getElementById('dash-store-name').textContent = 'Sin conectar';
            document.getElementById('dash-store-id').textContent = '---';
            badge.textContent = '● Desconectada';
            badge.style.background = '#ef4444';
        }
    } catch (e) {
        console.error('❌ CartBoost: Error en Firestore (Dashboard):', e.message);
        document.getElementById('dash-store-name').textContent = 'Error al cargar';
    }
}

// =========================================================================
// 12. OAUTH DE TIENDANUBE
// =========================================================================
const CLIENT_ID = '34476';
const REDIRECT_URI = 'https://cartboost-v2.onrender.com/oauth/callback'; 

let currentUserUid = null;
if (isFirebaseReady) {
    auth.onAuthStateChanged((user) => {
        if (user) currentUserUid = user.uid;
        else currentUserUid = null;
    });
}

document.getElementById('connect-tn-btn').addEventListener('click', () => {
    if (!isFirebaseReady) {
        alert('Firebase no está configurado. No se puede conectar la tienda.');
        return;
    }
    if (!currentUserUid) { 
        alert('Debes estar logueado para conectar tu tienda.'); 
        return; 
    }
    const authUrl =
`https://www.tiendanube.com/apps/34476/authorize`;
  console.log(authUrl);
    alert(authUrl);
window.location.href = authUrl;
});

// =========================================================================
// 13. MANEJO DE CALLBACK DE OAUTH
// =========================================================================
window.addEventListener('load', async () => {
    if (!isFirebaseReady) {
        console.warn('⚠️ CartBoost: OAuth cancelado, Firebase no está listo.');
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code && currentUserUid) {
        showLoader();
        try {
            // En producción, la siguiente llamada debe ser un fetch a tu backend en Render.
            // El backend intercambiará el 'code' por el token usando el CLIENT_SECRET.
            
            /* 
            const response = await fetch('/api/exchange-tn-token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, userId: currentUserUid })
            });
            const result = await response.json();
            */
           
            // Simulación de éxito para pruebas (NO USAR EN PRODUCCIÓN)
            console.log('ℹ️ CartBoost: Simulando intercambio de token de Tiendanube.');
            await db.collection('stores').doc(currentUserUid).set({
                userId: currentUserUid,
                store_id: "123456789",
                store_name: "Mi Tienda Test",
                access_token: "token_real_recibido_del_backend",
                connected: true,
                created_at: firebase.firestore.FieldValue.serverTimestamp()
            });
            await db.collection('users').doc(currentUserUid).update({ tiendaConectada: true });
            
            hideLoader();
            const user = auth.currentUser;
            const userDoc = await db.collection('users').doc(user.uid).get();
            if (userDoc.exists) {
                renderDashboard(user, userDoc.data());
                switchScreen('dashboard-screen');
            }
            window.history.replaceState({}, document.title, window.location.pathname);

        } catch (error) {
            hideLoader();
            console.error('❌ CartBoost: Error en OAuth:', error.message);
            alert("Error al conectar la tienda: " + error.message);
        }
    }
});

// =========================================================================
// 14. INTERACTIVIDAD Y EFECTOS UI
// =========================================================================

// Contador Black Friday
(function startCountdown() {
    let hours = 6, minutes = 20, seconds = 50;
    const hEl = document.getElementById('timer-hrs');
    const mEl = document.getElementById('timer-min');
    const sEl = document.getElementById('timer-sec');
    if(!hEl || !mEl || !sEl) return;

    setInterval(() => {
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) { hours = 0; minutes = 0; seconds = 0; }
        hEl.textContent = String(hours).padStart(2, '0');
        mEl.textContent = String(minutes).padStart(2, '0');
        sEl.textContent = String(seconds).padStart(2, '0');
    }, 1000);
})();

// Pestañas Antes/Después
const tabBefore = document.getElementById('tab-before');
const tabAfter = document.getElementById('tab-after');
if(tabBefore && tabAfter) {
    tabBefore.addEventListener('click', () => {
        tabBefore.classList.add('active');
        tabAfter.classList.remove('active');
    });
    tabAfter.addEventListener('click', () => {
        tabAfter.classList.add('active');
        tabBefore.classList.remove('active');
    });
}

// Toggles de Personalización
document.querySelectorAll('.toggle-btn:not(.active)').forEach(btn => {
    btn.addEventListener('click', function() {
        const parent = this.parentElement;
        parent.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
    });
});

// Botones de Radio para Bundles
document.querySelectorAll('input[name="pack1"]').forEach(input => {
    input.addEventListener('change', function() {
        document.querySelectorAll('.product-option.selected-option').forEach(el => {
            el.classList.remove('selected-option');
        });
        if(this.checked) {
            this.closest('.product-option').classList.add('selected-option');
        }
    });
});

// =========================================================================
// 15. EFECTO DE PARTÍCULAS FLOTANTES
// =========================================================================
(function initParticles() {
    const container = document.getElementById('particles-container');
    if(!container) return;
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = Math.random() * 15 + 10 + 's';
        particle.style.animationDelay = Math.random() * 10 + 's';
        container.appendChild(particle);
    }
})();
// =========================================================================
// 4. GESTIÓN DE SESIÓN Y REDIRECCIONES (Auth State Listener)
// =========================================================================
if (isFirebaseReady) {
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            try {
                const userDoc = await db.collection('users').doc(user.uid).get();
                
                if (userDoc.exists) {
                    const userData = userDoc.data();

                    // Si tiene la tienda conectada, vamos directo al Dashboard
                    if (userData.tiendaConectada === true) {
                        renderDashboard(user, userData);
                        switchScreen('dashboard-screen');
                    } else {
                        // Si no tiene tienda conectada, va al Setup
                        switchScreen('auth-setup');
                    }
                } else {
                    // Si es un usuario nuevo (recién registrado), creamos el documento
                    await createOrUpdateUser(user);
                    switchScreen('auth-setup');
                }
            } catch (e) {
                console.error('❌ CartBoost: Error en Firestore (Session Listener):', e.message);
                switchScreen('landing-screen');
            }
        } else {
            // Si no está logueado, regresa a la Landing
            if (!document.getElementById('landing-screen').classList.contains('active')) {
                switchScreen('landing-screen');
            }
        }
    });
                             }
