/* =============================================
   CARTBOOST — app.js
   Premium SaaS Landing Page Interactions
   ============================================= */

(function () {
  'use strict';

  /* ---- HEADER SCROLL ---- */
  const header = document.getElementById('header');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  /* ---- HAMBURGER MENU ---- */
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');

  hamburger.addEventListener('click', () => {
    nav.classList.toggle('open');
    hamburger.classList.toggle('active');
    document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
  });

  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      hamburger.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  /* ---- PARTICLES ---- */
  const particlesContainer = document.getElementById('heroParticles');
  const PARTICLE_COUNT = 20;

  function createParticle() {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 2;
    const x = Math.random() * 100;
    const duration = Math.random() * 12 + 8;
    const delay = Math.random() * 10;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${x}%;
      animation-duration: ${duration}s;
      animation-delay: ${-delay}s;
      opacity: ${Math.random() * 0.6 + 0.2};
    `;
    return p;
  }

  if (particlesContainer) {
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particlesContainer.appendChild(createParticle());
    }
  }

  /* ---- SCROLL REVEAL (Intersection Observer) ---- */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.dataset.delay) || 0;
        setTimeout(() => {
          el.classList.add('visible');
        }, delay);
        revealObserver.unobserve(el);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ---- ANIMATED COUNTERS ---- */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const steps = 60;
    const stepVal = target / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(stepVal * step), target);
      el.textContent = prefix + current.toLocaleString('es-AR') + suffix;
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
  }

  const counterEls = document.querySelectorAll('.stat-number[data-target]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counterEls.forEach(el => counterObserver.observe(el));

  /* ---- CARD TILT (3D Hover) ---- */
  const tiltCards = document.querySelectorAll('.widget-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / centerY * -8;
      const rotateY = (x - centerX) / centerX * 8;
      card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ---- HERO PARALLAX (Mouse) ---- */
  const heroVisual = document.getElementById('heroVisual');
  const heroBgGlow = document.querySelector('.hero-bg-glow');

  if (heroVisual) {
    document.addEventListener('mousemove', (e) => {
      const mx = (e.clientX / window.innerWidth - 0.5) * 2;
      const my = (e.clientY / window.innerHeight - 0.5) * 2;

      if (heroVisual) {
        heroVisual.style.transform = `translateX(${mx * 12}px) translateY(${my * 8}px)`;
      }
      if (heroBgGlow) {
        heroBgGlow.style.transform = `translateX(calc(-50% + ${mx * 20}px)) translateY(${my * 14}px)`;
      }
    });
  }

  /* ---- SMOOTH SCROLL for nav links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---- FAQ ACCORDION ---- */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // close all
      faqItems.forEach(i => i.classList.remove('open'));
      // open clicked if wasn't open
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ---- PRICING CARD HOVER GLOW ---- */
  const pricingCards = document.querySelectorAll('.pricing-card');

  pricingCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  /* ---- TESTIMONIALS auto-scroll already in CSS,
          but add pause-on-hover already handled via CSS ---- */

  /* ---- BUTTON RIPPLE ---- */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: 0;
        height: 0;
        background: rgba(255,255,255,.25);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
        animation: rippleExpand .6s ease-out forwards;
      `;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  // Inject ripple keyframe
  const style = document.createElement('style');
  style.textContent = `
    @keyframes rippleExpand {
      to { width: 200px; height: 200px; opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  /* ---- MOCKUP COUNTDOWN TIMER ---- */
  function updateMockupTimer() {
    const timerEl = document.querySelector('.mockup-timer');
    if (!timerEl) return;

    let total = 6 * 3600 + 21 * 60 + 28;

    const mockupInterval = setInterval(() => {
      if (!document.contains(timerEl)) {
        clearInterval(mockupInterval);
        return;
      }
      if (total <= 0) total = 24 * 3600;
      total--;
      const h = Math.floor(total / 3600);
      const m = Math.floor((total % 3600) / 60);
      const s = total % 60;
      timerEl.textContent =
        String(h).padStart(2, '0') + ' : ' +
        String(m).padStart(2, '0') + ' : ' +
        String(s).padStart(2, '0');
    }, 1000);
  }

  updateMockupTimer();

  /* ---- BENEFIT MOCKUP BUNDLE INTERACTION ---- */
  const bundleItems = document.querySelectorAll('.bm-bundle-item');
  bundleItems.forEach(item => {
    item.addEventListener('click', () => {
      bundleItems.forEach(i => {
        i.classList.remove('selected');
        i.querySelector('.bm-radio').classList.remove('selected-r', 'active');
      });
      item.classList.add('selected');
      item.querySelector('.bm-radio').classList.add('selected-r');
    });
  });

  /* ---- HEADER HAMBURGER ANIMATION ---- */
  const hamburgerStyle = document.createElement('style');
  hamburgerStyle.textContent = `
    .hamburger.active span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
    .hamburger.active span:nth-child(2) { opacity: 0; transform: scaleX(0); }
    .hamburger.active span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
  `;
  document.head.appendChild(hamburgerStyle);

  /* ---- SCROLL PROGRESS INDICATOR ---- */
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    height: 2px;
    background: linear-gradient(90deg, #2563EB, #60A5FA);
    z-index: 9999;
    width: 0%;
    transition: width .1s linear;
    box-shadow: 0 0 8px rgba(37,99,235,.6);
  `;
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const pct = (scrolled / maxScroll) * 100;
    progressBar.style.width = pct + '%';
  }, { passive: true });

  /* ---- LAZY INIT on DOMContentLoaded ---- */
  console.log('%c⚡ CartBoost loaded — Convertí visitas en ventas reales.', 'color:#2563EB;font-weight:800;font-size:14px;');

})();


/* =====================================================================
   CARTBOOST — MÓDULO DE AUTH / OAUTH TIENDANUBE / DASHBOARD
   =====================================================================
   Flujo completo:
   1) Click en "Probar Gratis" -> abre modal de auth (login/registro)
   2) Auth exitoso -> pantalla "Conectá tu tienda"
   3) Click "Conectar Tiendanube" -> redirige a OAuth real de Tiendanube
   4) Tiendanube redirige de vuelta a la redirect_uri configurada
   5) Pantalla de éxito con datos de la tienda
   6) Dashboard con datos reales de la tienda conectada
   ===================================================================== */
(function () {
  'use strict';

  /* =====================================================
     CONFIGURACIÓN — Editar estos valores según ambiente
     ===================================================== */

  // Client ID de tu app registrada en el panel de partners de Tiendanube
  const TIENDANUBE_CLIENT_ID = '34476';

  // URL a la que Tiendanube redirige luego de que el usuario autoriza la app.
  // Debe coincidir EXACTAMENTE con la configurada en el panel de partners de Tiendanube.
  const TIENDANUBE_REDIRECT_URI = 'https://cartboost-v2.onrender.com/oauth/callback';

  // Scopes que la app solicita. Ajustar según los permisos que CartBoost necesite.
  // Referencia: https://tiendanube.github.io/api-documentation/authentication
  const TIENDANUBE_SCOPES = [
    'read_products',
    'write_products',
    'read_orders',
    'read_store'
  ].join(',');

  // URL completa de autorización de Tiendanube (OAuth 2.0 - Authorization Code flow)
  const TIENDANUBE_CONNECT_URL =
    `https://www.tiendanube.com/apps/${TIENDANUBE_CLIENT_ID}/authorize` +
    `?redirect_uri=${encodeURIComponent(TIENDANUBE_REDIRECT_URI)}` +
    `&scope=${encodeURIComponent(TIENDANUBE_SCOPES)}`;

  // Endpoint de tu backend que devuelve el estado del onboarding del usuario actual.
  // Debe responder algo como: { authenticated: bool, storeConnected: bool, store: {...} }
  const API_BASE_URL = '/api'; // TODO: ajustar a la URL real de tu backend

  /* =====================================================
     ESTADO EN MEMORIA (no usar localStorage/sessionStorage
     en este entorno de preview; en producción real esto
     puede persistirse vía cookies httpOnly desde el backend)
     ===================================================== */
  const cbState = {
    user: null,           // { id, name, email, avatarUrl, provider }
    store: null,          // { id, name, productsCount, widgetsActive }
    authModalTab: 'register',
    selectedPlan: null    // 'Starter' | 'Pro' | 'Scale' | null
  };

  /* =====================================================
     HELPERS DOM
     ===================================================== */
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  function showToast(message, type = 'success') {
    let container = $('.cb-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'cb-toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `cb-toast ${type}`;
    const icon = type === 'error' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️';
    toast.innerHTML = `<span>${icon}</span><span>${escapeHtml(message)}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3600);
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function setLoading(btn, isLoading) {
    if (!btn) return;
    btn.classList.toggle('loading', isLoading);
    btn.disabled = isLoading;
  }

  function showFieldError(el, msg) {
    if (!el) return;
    el.textContent = msg;
    el.classList.toggle('show', Boolean(msg));
  }

  /* =====================================================
     PASO 1 — MODAL DE AUTENTICACIÓN
     ===================================================== */
  const overlay = $('#cbOverlay');
  const modalClose = $('#cbModalClose');
  const tabs = $$('.cb-tab');
  const registerPanel = $('#cbRegisterPanel');
  const loginPanel = $('#cbLoginPanel');
  const googleBtn = $('#cbGoogleBtn');
  const googleBtnText = $('#cbGoogleBtnText');
  const modalTitle = $('#authModalTitle');
  const modalSub = $('.cb-modal-sub');

  function openAuthModal(tab = 'register') {
    if (!overlay) return;
    switchAuthTab(tab);
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeAuthModal() {
    if (!overlay) return;
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function switchAuthTab(tab) {
    cbState.authModalTab = tab;
    tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tab));

    if (tab === 'register') {
      registerPanel.classList.remove('hidden');
      loginPanel.classList.add('hidden');
      modalTitle.textContent = 'Comenzá gratis con CartBoost';
      modalSub.textContent = 'Creá tu cuenta para conectar tu tienda Tiendanube';
      googleBtnText.textContent = 'Registrarme con Google';
    } else {
      registerPanel.classList.add('hidden');
      loginPanel.classList.remove('hidden');
      modalTitle.textContent = 'Iniciar sesión';
      modalSub.textContent = 'Ingresá a tu cuenta de CartBoost';
      googleBtnText.textContent = 'Continuar con Google';
    }
  }

  // Abrir modal desde cualquier botón "Probar Gratis" / "Empezar gratis" / try-btn
  $$('.try-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      // Si el botón pertenece a un plan específico, guardar cuál para uso posterior.
      const planCard = btn.closest('.pricing-card');
      if (planCard) {
        const planName = planCard.querySelector('.plan-name');
        cbState.selectedPlan = planName ? planName.textContent.trim() : null;
      } else {
        cbState.selectedPlan = null;
      }
      openAuthModal('register');
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeAuthModal);
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeAuthModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay && overlay.classList.contains('active')) {
      closeAuthModal();
    }
  });

  tabs.forEach(tab => {
    tab.addEventListener('click', () => switchAuthTab(tab.dataset.tab));
  });

  // Toggle ver/ocultar contraseña
  $$('.cb-eye').forEach(eye => {
    eye.addEventListener('click', () => {
      const targetId = eye.dataset.target;
      const input = document.getElementById(targetId);
      if (!input) return;
      const showing = input.type === 'text';
      input.type = showing ? 'password' : 'text';
      eye.classList.toggle('showing', !showing);
    });
  });

  /* -----------------------------------------------------
     INTEGRACIÓN CON BACKEND DE AUTENTICACIÓN
     -----------------------------------------------------
     Estas funciones están intencionalmente vacías de lógica
     real. Conectar aquí tu proveedor de auth (Firebase Auth,
     Supabase Auth, Auth0, o tu propio backend con JWT/sesión).

     Contrato esperado de cada función:
     - Debe devolver una Promise.
     - En éxito, debe resolver con: { id, name, email, avatarUrl, provider }
     - En error, debe rechazar con un Error con un mensaje legible
       para mostrar al usuario (ej: "Email o contraseña incorrectos").
     ----------------------------------------------------- */

  async function handleGoogleAuth() {
    // TODO: conectar backend — reemplazar por integración real, ej:
    //
    // Firebase:
    //   const provider = new GoogleAuthProvider();
    //   const result = await signInWithPopup(auth, provider);
    //   return { id: result.user.uid, name: result.user.displayName,
    //             email: result.user.email, avatarUrl: result.user.photoURL,
    //             provider: 'google' };
    //
    // Supabase:
    //   const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    //   if (error) throw error;
    //
    console.warn(
      '[CartBoost] handleGoogleAuth() no está conectado a un backend real todavía. ' +
      'Implementá la integración con tu proveedor de auth (Firebase / Supabase / Auth0 / propio).'
    );
    throw new Error('La autenticación con Google todavía no está configurada.');
  }

  async function handleEmailRegister(email, password, passwordConfirm) {
    // TODO: conectar backend real — reemplazar este bloque simulado por, ej:
    //
    // Firebase:
    //   const cred = await createUserWithEmailAndPassword(auth, email, password);
    //   return { id: cred.user.uid, name: email.split('@')[0], email, provider: 'email' };
    //
    // Backend propio:
    //   const res = await fetch(`${API_BASE_URL}/auth/register`, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ email, password })
    //   });
    //   if (!res.ok) throw new Error((await res.json()).message || 'No se pudo crear la cuenta.');
    //   return await res.json();
    //
    console.warn(
      '[CartBoost] handleEmailRegister() está en modo SIMULADO (sin backend real). ' +
      'Conectar Firebase/Supabase/backend propio antes de pasar a producción.'
    );

    // Simulación local: pequeña demora artificial para imitar latencia de red real.
    await new Promise(resolve => setTimeout(resolve, 600));

    return {
      id: 'sim_' + Date.now(),
      name: email.split('@')[0],
      email: email,
      provider: 'email-simulado'
    };
  }

  async function handleEmailLogin(email, password) {
    // TODO: conectar backend real — reemplazar este bloque simulado por, ej:
    //
    // Firebase:
    //   const cred = await signInWithEmailAndPassword(auth, email, password);
    //   return { id: cred.user.uid, name: cred.user.displayName || email.split('@')[0],
    //             email, provider: 'email' };
    //
    // Backend propio:
    //   const res = await fetch(`${API_BASE_URL}/auth/login`, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ email, password })
    //   });
    //   if (!res.ok) throw new Error('Email o contraseña incorrectos.');
    //   return await res.json();
    //
    console.warn(
      '[CartBoost] handleEmailLogin() está en modo SIMULADO (sin backend real). ' +
      'Conectar Firebase/Supabase/backend propio antes de pasar a producción.'
    );

    await new Promise(resolve => setTimeout(resolve, 600));

    return {
      id: 'sim_' + Date.now(),
      name: email.split('@')[0],
      email: email,
      provider: 'email-simulado'
    };
  }

  /* -----------------------------------------------------
     WIRING DE FORMULARIOS
     ----------------------------------------------------- */

  if (googleBtn) {
    googleBtn.addEventListener('click', async () => {
      setLoading(googleBtn, true);
      try {
        const user = await handleGoogleAuth();
        cbState.user = user;
        onAuthSuccess();
      } catch (err) {
        showToast(err.message || 'No se pudo continuar con Google.', 'error');
      } finally {
        setLoading(googleBtn, false);
      }
    });
  }

  const regSubmit = $('#cbRegSubmit');
  if (regSubmit) {
    regSubmit.addEventListener('click', async () => {
      const email = $('#cbRegEmail').value.trim();
      const pass = $('#cbRegPass').value;
      const pass2 = $('#cbRegPass2').value;
      const errEl = $('#cbRegError');
      showFieldError(errEl, '');

      if (!email || !validateEmail(email)) {
        return showFieldError(errEl, 'Ingresá un email válido.');
      }
      if (!pass || pass.length < 8) {
        return showFieldError(errEl, 'La contraseña debe tener al menos 8 caracteres.');
      }
      if (pass !== pass2) {
        return showFieldError(errEl, 'Las contraseñas no coinciden.');
      }

      setLoading(regSubmit, true);
      try {
        const user = await handleEmailRegister(email, pass, pass2);
        cbState.user = user;
        onAuthSuccess();
      } catch (err) {
        showFieldError(errEl, err.message || 'No se pudo crear la cuenta.');
      } finally {
        setLoading(regSubmit, false);
      }
    });
  }

  const logSubmit = $('#cbLogSubmit');
  if (logSubmit) {
    logSubmit.addEventListener('click', async () => {
      const email = $('#cbLogEmail').value.trim();
      const pass = $('#cbLogPass').value;
      const errEl = $('#cbLogError');
      showFieldError(errEl, '');

      if (!email || !validateEmail(email)) {
        return showFieldError(errEl, 'Ingresá un email válido.');
      }
      if (!pass) {
        return showFieldError(errEl, 'Ingresá tu contraseña.');
      }

      setLoading(logSubmit, true);
      try {
        const user = await handleEmailLogin(email, pass);
        cbState.user = user;
        onAuthSuccess();
      } catch (err) {
        showFieldError(errEl, err.message || 'Email o contraseña incorrectos.');
      } finally {
        setLoading(logSubmit, false);
      }
    });
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Permitir submit con Enter dentro de los forms
  $$('.cb-form-panel input').forEach(input => {
    input.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      const panel = input.closest('.cb-form-panel');
      const submitBtn = panel && panel.querySelector('.cb-submit-btn');
      if (submitBtn) submitBtn.click();
    });
  });

  /* =====================================================
     TRANSICIÓN: AUTH -> PASO 2 (Conectá tu tienda)
     ===================================================== */

  const connectScreen = $('#cbConnectScreen');
  const connectTNBtn = $('#cbConnectTNBtn');

  function onAuthSuccess() {
    closeAuthModal();
    showToast(`¡Bienvenido${cbState.user && cbState.user.name ? ', ' + cbState.user.name : ''}!`, 'success');
    showScreen(connectScreen);
  }

  // Expuesta globalmente para poder invocarse manualmente desde fuera del
  // módulo (ej: window.cbShowConnectScreen()) sin duplicar la lógica de
  // showScreen(). Reutiliza el mismo connectScreen ya resuelto arriba.
  window.cbShowConnectScreen = function () {
    showScreen(connectScreen);
  };

  function showScreen(screenEl) {
    $$('.cb-screen').forEach(s => s.classList.add('hidden'));
    if (screenEl) screenEl.classList.remove('hidden');
  }

  /* =====================================================
     PERSISTENCIA DE LA TIENDA VINCULADA
     =====================================================
     Guarda la relación Usuario → Tienda Tiendanube → CartBoost.
     localStorage acá es client-side cache de conveniencia
     (para saber "ya hay tienda conectada" en visitas futuras
     sin esperar al backend). La fuente de verdad real sigue
     siendo tu base de datos — esto NO sustituye el guardado
     server-side que tu backend ya hace al recibir el OAuth
     callback (store_id, user_id, access_token).
     ===================================================== */
  function saveConnectedStore(storeData) {
    cbState.store = storeData;

    try {
      localStorage.setItem('cb_store_connected', 'true');
      localStorage.setItem('cb_store_name', storeData.name || '');
      localStorage.setItem('cb_store_id', storeData.id || '');
      localStorage.setItem('cb_store_products_count', String(storeData.productsCount || 0));
    } catch (err) {
      // localStorage puede fallar en modo incógnito estricto o si está deshabilitado.
      console.warn('[CartBoost] No se pudo persistir en localStorage:', err.message);
    }
  }

  function isStoreConnected() {
    try {
      return localStorage.getItem('cb_store_connected') === 'true';
    } catch (err) {
      return false;
    }
  }

  function isTutorialDone() {
    try {
      return localStorage.getItem('cb_tutorial_done') === 'true';
    } catch (err) {
      return false;
    }
  }

  function markTutorialDone() {
    try {
      localStorage.setItem('cb_tutorial_done', 'true');
    } catch (err) {
      console.warn('[CartBoost] No se pudo persistir cb_tutorial_done:', err.message);
    }
  }

  /* =====================================================
     PASO 3 — INICIAR OAUTH REAL DE TIENDANUBE
     ===================================================== */

  if (connectTNBtn) {
    connectTNBtn.addEventListener('click', () => {
      setLoading(connectTNBtn, true);
      // Redirección real al flujo de autorización OAuth de Tiendanube.
      // Tiendanube va a mostrar su propia pantalla de autorización y,
      // si el usuario acepta, va a redirigir a TIENDANUBE_REDIRECT_URI
      // con un parámetro ?code=... que el BACKEND debe intercambiar
      // por un access_token (ese intercambio requiere el client_secret,
      // que nunca debe vivir en el frontend).
      window.location.href = TIENDANUBE_CONNECT_URL;
    });
  }

  /* =====================================================
     PASO 4 — MANEJO DEL CALLBACK DE OAUTH
     =====================================================
     Cuando Tiendanube redirige de vuelta a TIENDANUBE_REDIRECT_URI,
     tu BACKEND es quien recibe el "code", lo intercambia por el
     access_token, guarda la tienda vinculada en tu base de datos,
     y finalmente redirige al USUARIO de vuelta al frontend con
     parámetros simples en la URL para que esta página sepa qué pantalla
     mostrar. Ejemplo de redirección final que tu backend debería hacer:
     
       https://cartboost-v2.onrender.com/?cb_step=success&store_id=123&store_name=Mi+Tienda
     
     o, en caso de error:
     
       https://cartboost-v2.onrender.com/?cb_step=error&reason=access_denied
     ===================================================== */

  function handleOAuthReturnParams() {
    const params = new URLSearchParams(window.location.search);
    const step = params.get('cb_step');

    if (step === 'success') {
      const storeId = params.get('store_id') || '';
      const storeName = params.get('store_name') || 'Tu tienda';
      const productsCount = params.get('products_count') || '0';

      const storeData = {
        id: storeId,
        name: storeName,
        productsCount: parseInt(productsCount, 10) || 0,
        widgetsActive: 0
      };

      // Crea/actualiza la relación Usuario → Tienda → CartBoost.
      saveConnectedStore(storeData);

      showOnboardingSuccess(storeData);
      cleanUrlParams();
    } else if (step === 'error') {
      const reason = params.get('reason') || 'desconocido';
      showToast(`No se pudo conectar tu tienda (motivo: ${reason}). Probá nuevamente.`, 'error');
      showScreen(connectScreen);
      cleanUrlParams();
    } else if (isStoreConnected()) {
      // El usuario ya tiene una tienda vinculada de una sesión anterior
      // (persistida en localStorage). Lo llevamos directo al Dashboard
      // en vez de mostrarle de nuevo la pantalla "Conectá tu tienda".
      const cachedStore = {
        id: safeGetItem('cb_store_id'),
        name: safeGetItem('cb_store_name') || 'Tu tienda',
        productsCount: parseInt(safeGetItem('cb_store_products_count'), 10) || 0,
        widgetsActive: 0
      };
      cbState.store = cachedStore;
      showDashboard(cachedStore);
    }
    // Si no hay parámetros de callback ni tienda persistida, no hacer nada:
    // se muestra la landing normal.
  }

  function safeGetItem(key) {
    try {
      return localStorage.getItem(key);
    } catch (err) {
      return null;
    }
  }

  function cleanUrlParams() {
    const url = new URL(window.location.href);
    url.search = '';
    window.history.replaceState({}, document.title, url.toString());
  }

  /* =====================================================
     PASO 5 — PANTALLA DE ÉXITO
     =====================================================
     Esta pantalla es informativa y transitoria: NO requiere
     que el usuario haga click en ningún botón para continuar.
     Avanza sola al Dashboard de CartBoost después de un breve
     instante, igual que el patrón "Tienda conectada con éxito"
     de Wigy (notificación + entra directo al dashboard).
     No hay ningún window.location/redirect involucrado: solo
     se cambia qué <div class="cb-screen"> está visible.
     ===================================================== */

  const successScreen = $('#cbSuccessScreen');
  const successStoreName = $('#cbStoreName');
  const goToDashboardBtn = $('#cbGoToDashboard');

  const AUTO_ADVANCE_MS = 1800;

  function showOnboardingSuccess(store) {
    if (successStoreName) successStoreName.textContent = store.name;
    showScreen(successScreen);

    // Avance automático al Dashboard (sin click, sin redirect externo).
    // Se mantiene también el botón "Ir al Dashboard" por si el usuario
    // quiere avanzar manualmente antes de que termine la espera.
    setTimeout(() => {
      if (!successScreen.classList.contains('hidden')) {
        showDashboard(cbState.store);
      }
    }, AUTO_ADVANCE_MS);
  }

  if (goToDashboardBtn) {
    goToDashboardBtn.addEventListener('click', () => {
      showDashboard(cbState.store);
    });
  }

  /* =====================================================
     PASO 6 — DASHBOARD
     ===================================================== */

  const dashboard = $('#cbDashboard');
  const dashStoreName = $('#cbDashStoreName');
  const dashProducts = $('#cbDashProducts');
  const dashWidgets = $('#cbDashWidgets');
  const dashUserName = $('#cbDashUserName');
  const dashAvatar = $('#cbDashAvatar');
  const sidebarStoreName = $('#cbSidebarStoreName');

  /* -----------------------------------------------------
     fetchStoreData()
     -----------------------------------------------------
     Punto de integración con tu API real. Debe devolver
     datos actualizados de la tienda conectada. Reemplazar
     el cuerpo de la función por un fetch real, por ejemplo:

       const res = await fetch(`${API_BASE_URL}/store/${storeId}`);
       if (!res.ok) throw new Error('No se pudo obtener la tienda.');
       return await res.json();

     Mientras no haya backend conectado, devuelve los datos
     que ya tenemos en memoria desde el callback de OAuth
     (o valores de ejemplo si se accede directo al dashboard).
     ----------------------------------------------------- */
  async function fetchStoreData(storeId) {
    // Si ya tenemos datos en memoria (vienen del callback OAuth), los usamos directamente.
    if (cbState.store) return cbState.store;

    // TODO: conectar backend real. Reemplazar por:
    //   const res = await fetch(`${API_BASE_URL}/store/${storeId}`, { credentials: 'include' });
    //   if (!res.ok) throw new Error('No se pudo obtener la tienda.');
    //   return await res.json(); // { id, name, productsCount, widgetsActive }
    //
    // FALTA PARA PRODUCCIÓN: endpoint GET /api/store/:id en tu backend.
    // Hasta que exista, retornamos null para no mostrar datos inventados.
    console.warn('[CartBoost] fetchStoreData() sin backend real. Conectar API antes de producción.');
    return {
      id: storeId || null,
      name: storeId ? `Tienda #${storeId}` : '—',
      productsCount: 0,
      widgetsActive: 0
    };
  }

  let activeWidgetsCount = 0;

  async function showDashboard(store) {
    showScreen(dashboard);

    const data = await fetchStoreData(store && store.id);
    cbState.store = data;

    if (dashStoreName) dashStoreName.textContent = data.name;
    if (sidebarStoreName) sidebarStoreName.textContent = data.name;
    if (dashProducts) dashProducts.textContent = data.productsCount.toLocaleString('es-AR');
    activeWidgetsCount = data.widgetsActive || 0;
    if (dashWidgets) dashWidgets.textContent = activeWidgetsCount;

    if (cbState.user) {
      const displayName = cbState.user.name || cbState.user.email || 'Usuario';
      if (dashUserName) dashUserName.textContent = displayName;
      if (dashAvatar) {
        if (cbState.user.avatarUrl) {
          dashAvatar.innerHTML = `<img src="${cbState.user.avatarUrl}" alt="${escapeHtml(displayName)}" />`;
        } else {
          dashAvatar.textContent = displayName.charAt(0).toUpperCase();
        }
      }
    }

    // Disparo del tutorial: solo la primera vez que el usuario entra al
    // Dashboard después de conectar una tienda. Si ya lo vio (cb_tutorial_done)
    // o no hay tienda conectada, no se muestra.
    if (isStoreConnected() && !isTutorialDone()) {
      // Pequeño delay para que el dashboard termine de pintarse/animarse
      // antes de posicionar el primer tooltip sobre sus elementos reales.
      setTimeout(() => startCartBoostTutorial(data), 500);
    }
  }

  // Sincronización manual de productos (botón dentro de la card "Productos").
  // Mismo patrón que Wigy: el usuario la dispara si sospecha que el catálogo
  // no se actualizó solo después de un cambio en Tiendanube.
  //
  // Extraída a función para que tanto el botón de la card de Productos como
  // el botón "Sincronizar Productos" de Acciones Rápidas llamen exactamente
  // a la misma lógica real (sin duplicarla ni simularla dos veces distintas).
  async function runProductSync(triggerBtn) {
    if (triggerBtn) {
      triggerBtn.classList.add('syncing');
      triggerBtn.disabled = true;
    }

    try {
      // TODO: conectar backend real. Reemplazar por:
      //   const res = await fetch(`${API_BASE_URL}/store/${cbState.store?.id}/sync`, {
      //     method: 'POST', credentials: 'include'
      //   });
      //   if (!res.ok) throw new Error('No se pudo sincronizar.');
      //   const { productsCount } = await res.json();
      //   if (dashProducts) dashProducts.textContent = productsCount.toLocaleString('es-AR');
      //
      // FALTA PARA PRODUCCIÓN: endpoint POST /api/store/:id/sync en tu backend,
      // que vuelva a consultar la API de Tiendanube y devuelva el conteo actualizado.
      console.warn('[CartBoost] Sincronización manual sin backend real todavía.');
      await new Promise(resolve => setTimeout(resolve, 900));

      showToast('Sin backend conectado: no hay datos reales para sincronizar todavía.', 'info');
    } catch (err) {
      showToast(err.message || 'No se pudo sincronizar los productos.', 'error');
    } finally {
      if (triggerBtn) {
        triggerBtn.classList.remove('syncing');
        triggerBtn.disabled = false;
      }
    }
  }

  const syncProductsBtn = $('#cbSyncProductsBtn');
  if (syncProductsBtn) {
    syncProductsBtn.addEventListener('click', () => runProductSync(syncProductsBtn));
  }

  const quickSyncBtn = $('#cbQuickSyncProducts');
  if (quickSyncBtn) {
    quickSyncBtn.addEventListener('click', () => runProductSync(quickSyncBtn));
  }

  /* =====================================================
     SIDEBAR (mobile drawer / desktop fijo) + HAMBURGUESA
     ===================================================== */
  const dashHamburger = $('#cbDashHamburger');
  const sidebar = $('#cbSidebar');
  const sidebarOverlay = $('#cbSidebarOverlay');
  const sidebarClose = $('#cbSidebarClose');

  function openSidebar() {
    if (!sidebar) return;
    sidebar.classList.add('open');
    if (sidebarOverlay) sidebarOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    if (!sidebar) return;
    sidebar.classList.remove('open');
    if (sidebarOverlay) sidebarOverlay.classList.add('hidden');
    document.body.style.overflow = '';
  }

  if (dashHamburger) dashHamburger.addEventListener('click', openSidebar);
  if (sidebarClose) sidebarClose.addEventListener('click', closeSidebar);
  if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);

  // Navegación del sidebar: marca el link activo. Las secciones de
  // Widgets/Productos/Configuración/Facturación todavía no existen como
  // pantallas propias — eso queda fuera de este cambio (solo se pidió
  // rediseñar el Dashboard). Por ahora, navegar cierra el sidebar y avisa
  // si la sección todavía no está implementada.
  $$('.cb-sidebar-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      $$('.cb-sidebar-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      closeSidebar();

      const section = link.dataset.nav;
      if (section && section !== 'dashboard') {
        showToast(`La sección "${link.textContent.trim()}" todavía no está implementada.`, 'info');
      }
    });
  });

  // Botón de configuración junto a la tienda conectada (sidebar).
  // Sin pantalla de configuración propia todavía — feedback honesto.
  const sidebarStoreGear = $('#cbSidebarStoreGear');
  if (sidebarStoreGear) {
    sidebarStoreGear.addEventListener('click', () => {
      showToast('La configuración de la tienda todavía no está implementada.', 'info');
    });
  }

  // Flecha para desplegar más opciones de la tienda conectada.
  // Por ahora solo anima el ícono; sin un submenú real conectado todavía.
  const sidebarStoreExpand = $('#cbSidebarStoreExpand');
  if (sidebarStoreExpand) {
    sidebarStoreExpand.addEventListener('click', () => {
      sidebarStoreExpand.classList.toggle('open');
      showToast('Opciones adicionales de la tienda: todavía no implementadas.', 'info');
    });
  }

  /* =====================================================
     MENÚ DESPLEGABLE DEL AVATAR (header)
     ===================================================== */
  const dashUserBtn = $('#cbDashUserBtn');
  const avatarMenu = $('#cbAvatarMenu');

  function toggleAvatarMenu(forceClose) {
    if (!avatarMenu || !dashUserBtn) return;
    const willOpen = forceClose ? false : !avatarMenu.classList.contains('open');
    avatarMenu.classList.toggle('open', willOpen);
    avatarMenu.classList.toggle('hidden', !willOpen);
    dashUserBtn.setAttribute('aria-expanded', String(willOpen));
  }

  if (dashUserBtn) {
    dashUserBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleAvatarMenu();
    });
  }

  document.addEventListener('click', (e) => {
    if (avatarMenu && !avatarMenu.classList.contains('hidden') &&
        !avatarMenu.contains(e.target) && e.target !== dashUserBtn) {
      toggleAvatarMenu(true);
    }
  });

  $$('.cb-avatar-menu-item').forEach(item => {
    item.addEventListener('click', () => {
      toggleAvatarMenu(true);
      const action = item.dataset.action;

      if (action === 'logout') {
        // Cierre de sesión local: limpia el estado de onboarding guardado
        // y vuelve a la landing. No hay backend de sesión real conectado
        // todavía (mismo patrón ya documentado en handleEmailLogin/Register).
        localStorage.removeItem('cb_store_connected');
        localStorage.removeItem('cb_store_name');
        localStorage.removeItem('cb_tutorial_done');
        cbState.user = null;
        cbState.store = null;
        showScreen(null);
        document.body.style.overflow = '';
        showToast('Sesión cerrada.', 'success');
      } else if (action === 'account') {
        showToast('La sección "Mi cuenta" todavía no está implementada.', 'info');
      } else if (action === 'store') {
        showToast('La sección "Mi tienda" todavía no está implementada.', 'info');
      } else if (action === 'help') {
        showToast('Centro de ayuda: todavía no está conectado a un destino real.', 'info');
      }
    });
  });

  /* =====================================================
     WIDGETS RECIENTES — botones "Ver" / "Crear widget"
     =====================================================
     Estos botones no tienen todavía una pantalla de listado de widgets
     ni un modal de creación real conectados a backend. Se les da feedback
     honesto en vez de simular una acción que no existe.
     ===================================================== */
  ['#cbViewWidgetsBtn', '#cbEmptyViewWidgetsBtn'].forEach(sel => {
    const btn = $(sel);
    if (btn) btn.addEventListener('click', () => {
      showToast('El listado completo de widgets todavía no está implementado.', 'info');
    });
  });

  ['#cbCreateWidgetBtn', '#cbEmptyCreateWidgetBtn'].forEach(sel => {
    const btn = $(sel);
    if (btn) btn.addEventListener('click', () => {
      // Si existe al menos un widget en la grilla de tipos, llevamos foco ahí
      // como siguiente paso lógico (igual que hace Wigy: te manda a elegir tipo).
      const widgetsSection = $('.cb-dash-widgets-section');
      if (widgetsSection) {
        widgetsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        showToast('Elegí un tipo de widget para activarlo.', 'info');
      }
    });
  });

  /* =====================================================
     ACCIONES RÁPIDAS — Ver Productos / Ver Widgets
     =====================================================
     Mismo criterio: sin pantalla de Productos/Widgets propia todavía.
     ===================================================== */
  const quickViewProducts = $('#cbQuickViewProducts');
  if (quickViewProducts) {
    quickViewProducts.addEventListener('click', () => {
      showToast('La vista de Productos todavía no está implementada.', 'info');
    });
  }

  const quickViewWidgets = $('#cbQuickViewWidgets');
  if (quickViewWidgets) {
    quickViewWidgets.addEventListener('click', () => {
      const widgetsSection = $('.cb-dash-widgets-section');
      if (widgetsSection) widgetsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // Activar/desactivar widgets desde el dashboard (UI local;
  // conectar a tu API para persistir el estado real del widget).
  $$('.cb-dash-activate').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.cb-dash-widget-card');
      const widgetKey = card && card.dataset.widget;
      const isActive = btn.classList.contains('active');

      // TODO: conectar backend — persistir activación real del widget, ej:
      //   await fetch(`${API_BASE_URL}/widgets/${widgetKey}`, {
      //     method: 'PATCH',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify({ active: !isActive, storeId: cbState.store?.id })
      //   });

      btn.classList.toggle('active', !isActive);
      btn.textContent = !isActive ? 'Activado ✓' : 'Activar';

      activeWidgetsCount += !isActive ? 1 : -1;
      if (dashWidgets) dashWidgets.textContent = activeWidgetsCount;

      showToast(
        !isActive ? 'Widget activado correctamente.' : 'Widget desactivado.',
        !isActive ? 'success' : 'info'
      );
    });
  });

  /* =====================================================
     INIT: revisar si venimos de un callback de OAuth.
     El script está al final del body (defer implícito),
     por lo tanto el DOM ya está listo cuando se ejecuta.
     Una sola llamada directa es suficiente.
     ===================================================== */
  handleOAuthReturnParams();

  /* =====================================================
     TUTORIAL GUIADO (estilo Wigy) — spotlight + tooltip
     =====================================================
     Recorre elementos reales del Dashboard vía [data-tour-target].
     El texto de cada paso puede interpolar datos de la tienda
     recién conectada (nombre, cantidad de productos).
     ===================================================== */

  const tourWelcome = $('#cbTourWelcome');
  const tourOverlay = $('#cbTourOverlay');
  const tourSpotlight = $('#cbTourSpotlight');
  const tourTooltip = $('#cbTourTooltip');
  const tourTitleEl = $('#cbTourTitle');
  const tourDescEl = $('#cbTourDesc');
  const tourProgressEl = $('#cbTourProgress');
  const tourBackBtn = $('#cbTourBack');
  const tourNextBtn = $('#cbTourNext');
  const tourSkipBtn = $('#cbTourSkip');
  const tourStartBtn = $('#cbTourStart');

  let tourSteps = [];
  let tourIndex = 0;

  function buildTourSteps(store) {
    const name = (store && store.name) || 'tu tienda';
    const count = (store && store.productsCount) || 0;

    return [
      {
        target: 'store-card',
        title: `¡Bienvenido a CartBoost! 🚀`,
        desc: `Detectamos la tienda: ${name}. A partir de ahora vas a gestionar tus widgets de conversión desde acá.`
      },
      {
        target: 'products',
        title: 'Tus productos sincronizados',
        desc: count > 0
          ? `Ya sincronizamos ${count} producto${count === 1 ? '' : 's'} de ${name}. Se actualizan automáticamente cada vez que agregás o modificás algo en Tiendanube.`
          : `Acá vas a ver cuántos productos tiene ${name}. Se sincronizan automáticamente con Tiendanube.`
      },
      {
        target: 'sync-products',
        title: 'Sincronización manual',
        desc: 'Si tus productos no se actualizaron todavía, podés sincronizarlos manualmente presionando este botón.'
      },
      {
        target: 'widgets-count',
        title: 'Widgets activos',
        desc: 'Este contador te muestra cuántos widgets tenés funcionando ahora mismo en tu tienda. Por ahora está en cero — vamos a cambiar eso.'
      },
      {
        target: 'widgets-section',
        title: 'Tus primeros widgets',
        desc: 'Ahora vamos a crear tu primer widget. Acá abajo tenés todos los tipos disponibles: countdown, bundles, reviews y más.'
      },
      {
        target: 'first-widget-card',
        title: 'Activá tu primer widget',
        desc: 'Tocá "Activar" en cualquier widget para encenderlo en tu tienda. Podés activar y desactivar las veces que quieras.'
      }
    ];
  }

  function getTourTargetEl(key) {
    return document.querySelector(`[data-tour-target="${key}"]`);
  }

  function startCartBoostTutorial(store) {
    tourSteps = buildTourSteps(store);
    tourIndex = 0;
    openTourWelcome();
  }
  // Expuesta globalmente para poder relanzar el tutorial manualmente
  // (ej. desde un botón "Ver tutorial de nuevo" en el Dashboard).
  window.startCartBoostTutorial = () => startCartBoostTutorial(cbState.store);

  function openTourWelcome() {
    if (!tourWelcome) return;
    tourWelcome.classList.remove('hidden');
    requestAnimationFrame(() => tourWelcome.classList.add('active'));
  }

  function closeTourWelcome() {
    if (!tourWelcome) return;
    tourWelcome.classList.remove('active');
    setTimeout(() => tourWelcome.classList.add('hidden'), 300);
  }

  if (tourSkipBtn) {
    tourSkipBtn.addEventListener('click', () => {
      closeTourWelcome();
      markTutorialDone();
    });
  }

  if (tourStartBtn) {
    tourStartBtn.addEventListener('click', () => {
      closeTourWelcome();
      setTimeout(() => runTourStep(0), 320);
    });
  }

  function runTourStep(index) {
    if (index < 0 || index >= tourSteps.length) {
      return endTour();
    }
    tourIndex = index;
    const step = tourSteps[index];
    const targetEl = getTourTargetEl(step.target);

    if (!targetEl) {
      // Si el elemento target no existe en esta vista, saltamos el paso
      // en vez de mostrar un spotlight apuntando a la nada.
      return runTourStep(index + 1);
    }

    targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Pequeño delay para que el scroll termine antes de medir posiciones.
    setTimeout(() => positionTourStep(targetEl, step, index), 280);

    tourOverlay.classList.remove('hidden');
    requestAnimationFrame(() => tourOverlay.classList.add('active'));
  }

  function positionTourStep(targetEl, step, index) {
    const rect = targetEl.getBoundingClientRect();
    const padding = 8;

    // Spotlight: recuadro iluminado calcado sobre el elemento real.
    tourSpotlight.style.top = `${rect.top - padding}px`;
    tourSpotlight.style.left = `${rect.left - padding}px`;
    tourSpotlight.style.width = `${rect.width + padding * 2}px`;
    tourSpotlight.style.height = `${rect.height + padding * 2}px`;
    tourSpotlight.classList.remove('hidden');
    requestAnimationFrame(() => tourSpotlight.classList.add('active'));

    // Tooltip: contenido del paso.
    tourTitleEl.textContent = step.title;
    tourDescEl.textContent = step.desc;
    tourProgressEl.textContent = `${index + 1}/${tourSteps.length}`;
    tourBackBtn.classList.toggle('hidden-step', index === 0);
    tourNextBtn.textContent = index === tourSteps.length - 1 ? 'Finalizar' : 'Siguiente →';

    // Posicionamiento del tooltip relativo al spotlight, con flip si no entra en pantalla.
    tourTooltip.classList.remove('arrow-top', 'arrow-bottom', 'arrow-left', 'arrow-right');
    const vh = window.innerHeight;
    const vw = window.innerWidth;
    const tooltipWidth = 320;
    const spaceBelow = vh - rect.bottom;
    const spaceAbove = rect.top;

    let top, left, arrowClass;
    if (spaceBelow > 200 || spaceBelow > spaceAbove) {
      top = rect.bottom + 16;
      arrowClass = 'arrow-top';
      tourTooltip.style.transform = '';
    } else {
      top = rect.top - 16;
      arrowClass = 'arrow-bottom';
      tourTooltip.style.transform = 'translateY(-100%)';
    }

    left = Math.min(Math.max(rect.left, 16), vw - tooltipWidth - 16);

    tourTooltip.style.top = `${top}px`;
    tourTooltip.style.left = `${left}px`;
    tourTooltip.classList.add(arrowClass);
    tourTooltip.classList.remove('hidden');
    requestAnimationFrame(() => tourTooltip.classList.add('active'));
  }

  if (tourNextBtn) {
    tourNextBtn.addEventListener('click', () => runTourStep(tourIndex + 1));
  }
  if (tourBackBtn) {
    tourBackBtn.addEventListener('click', () => runTourStep(tourIndex - 1));
  }

  function endTour() {
    tourOverlay.classList.remove('active');
    tourSpotlight.classList.remove('active');
    tourTooltip.classList.remove('active');
    setTimeout(() => {
      tourOverlay.classList.add('hidden');
      tourSpotlight.classList.add('hidden');
      tourTooltip.classList.add('hidden');
    }, 300);
    markTutorialDone();
  }

  // Permitir cerrar el tour con Escape, marcándolo como visto.
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && tourOverlay && tourOverlay.classList.contains('active')) {
      endTour();
    }
  });

  // Reposicionar el paso actual si la ventana cambia de tamaño mientras el tour está activo.
  window.addEventListener('resize', () => {
    if (tourOverlay && tourOverlay.classList.contains('active') && tourSteps[tourIndex]) {
      const targetEl = getTourTargetEl(tourSteps[tourIndex].target);
      if (targetEl) positionTourStep(targetEl, tourSteps[tourIndex], tourIndex);
    }
  });

  console.log(
    '%c⚡ CartBoost Auth/OAuth module ready',
    'color:#2563EB;font-weight:800;'
  );
  console.log(
    '%cTiendanube OAuth URL configurada:',
    'color:#3B82F6;font-weight:600;',
    TIENDANUBE_CONNECT_URL
  );

})();
