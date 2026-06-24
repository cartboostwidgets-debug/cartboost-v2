import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    GoogleAuthProvider, 
    signInWithPopup, 
    signInWithRedirect,
    sendPasswordResetEmail,
    setPersistence,
    browserLocalPersistence,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ⚠️ IMPORTANTE: Reemplazar estas variables con las credenciales reales de Firebase
const firebaseConfig = {
    apiKey: "TU_API_KEY_DE_FIREBASE",
    authDomain: "TU_PROYECTO.firebaseapp.com",
    projectId: "TU_PROYECTO_ID",
    storageBucket: "TU_PROYECTO.appspot.com",
    messagingSenderId: "TU_SENDER_ID",
    appId: "TU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Persistencia local
setPersistence(auth, browserLocalPersistence);

// --- REGISTRO ---
document.getElementById('register-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const confirm = document.getElementById('reg-confirm').value;
    const btn = document.getElementById('btn-register');
    const errorEl = document.getElementById('reg-error');

    if (password !== confirm) {
        errorEl.textContent = "Las contraseñas no coinciden.";
        return;
    }

    btn.disabled = true; btn.textContent = "Registrando...";
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Guardar usuario en Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
            email: email,
            provider: 'email',
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp()
        });
        window.location.href = '/setup'; // Redirigir a setup
    } catch (error) {
        let msg = "Error al registrarse.";
        if (error.code === 'auth/email-already-in-use') msg = "Este email ya está registrado.";
        if (error.code === 'auth/weak-password') msg = "La contraseña debe tener al menos 6 caracteres.";
        if (error.code === 'auth/invalid-email') msg = "El email no es válido.";
        errorEl.textContent = msg;
        btn.disabled = false; btn.textContent = "Registrate →";
    }
});

// --- LOGIN ---
document.getElementById('login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const btn = document.getElementById('btn-login');
    const errorEl = document.getElementById('login-error');

    btn.disabled = true; btn.textContent = "Iniciando sesión...";
    try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = '/setup';
    } catch (error) {
        let msg = "Credenciales incorrectas.";
        if (error.code === 'auth/user-not-found') msg = "No existe una cuenta con este email.";
        if (error.code === 'auth/wrong-password') msg = "La contraseña es incorrecta.";
        errorEl.textContent = msg;
        btn.disabled = false; btn.textContent = "Iniciar sesión →";
    }
});

// --- GOOGLE AUTH (Unificado para Registro y Login) ---
document.querySelectorAll('.btn-google').forEach(btn => {
    btn.addEventListener('click', async () => {
        const provider = new GoogleAuthProvider();
        try {
            // Intentar Popup (mejor UX), fallback a Redirect en móvil
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            
            // Guardar/Actualizar usuario en Firestore
            const userRef = doc(db, 'users', user.uid);
            const snap = await getDoc(userRef);
            if (!snap.exists()) {
                await setDoc(userRef, {
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    provider: 'google',
                    createdAt: serverTimestamp(),
                    lastLogin: serverTimestamp()
                });
            } else {
                await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
            }
            window.location.href = '/setup';
        } catch (error) {
            if (error.code === 'auth/popup-blocked') {
                // Fallback para bloqueadores de popups
                await signInWithRedirect(auth, provider);
            } else {
                document.getElementById('login-error') ? 
                    document.getElementById('login-error').textContent = "Error al iniciar con Google." :
                    document.getElementById('reg-error').textContent = "Error al registrarse con Google.";
            }
        }
    });
});

// --- RECUPERAR CONTRASEÑA ---
document.getElementById('forgot-password-link')?.addEventListener('click', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    if (!email) {
        document.getElementById('login-error').textContent = "Por favor, ingresa tu email primero.";
        return;
    }
    try {
        await sendPasswordResetEmail(auth, email);
        alert("¡Email de recuperación enviado! Revisa tu bandeja de entrada.");
    } catch (error) {
        document.getElementById('login-error').textContent = "Error al enviar el email.";
    }
});

// --- PROTECTOR DE RUTAS (Setup y Dashboard) ---
onAuthStateChanged(auth, (user) => {
    const path = window.location.pathname;
    if ((path === '/setup' || path === '/dashboard') && !user) {
        window.location.href = '/login';
    }
    if ((path === '/login' || path === '/register') && user) {
        window.location.href = '/setup';
    }

    // Lógica del Dashboard
    if (path === '/dashboard' && user) {
        loadDashboardInfo(user);
    }
});

async function loadDashboardInfo(user) {
    const token = await user.getIdToken();
    try {
        const response = await fetch('/api/store-status', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (data.connected) {
            document.getElementById('dash-store-name').textContent = data.data.store_name;
            document.getElementById('dash-store-url').textContent = data.data.store_url;
            document.getElementById('dash-date').textContent = new Date(data.data.created_at).toLocaleDateString('es-AR');
        } else {
            document.getElementById('dash-content').innerHTML = `
                <div class="card" style="padding: 24px; text-align: center;">
                    <p style="color: #64748b;">No hay ninguna tienda conectada.</p>
                    <a href="/setup" class="btn btn-primary" style="margin-top:16px;">Conectar Tiendanube</a>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error cargando dashboard:', error);
    }
}

// Logout (Para el dashboard)
document.getElementById('btn-logout')?.addEventListener('click', async () => {
    await signOut(auth);
    window.location.href = '/login';
});
