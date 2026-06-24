document.addEventListener('DOMContentLoaded', function() {
    /* HEADER STICKY */
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 10) {
            header.style.borderBottom = '1px solid #e2e8f0';
        } else {
            header.style.borderBottom = 'none';
        }
    });

    /* MOBILE MENU */
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    menuBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
        // Animación botón hamburguesa
        const spans = this.querySelectorAll('span');
        if(!mobileMenu.classList.contains('hidden')) {
            spans[0].style.transform = 'rotate(45deg) translate(4px, 4px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(4px, -4px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    /* SLIDER CONFIG */
    const sliderTrack = document.querySelector('.slider-track');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slider-dots .dot');
    const prevBtn = document.querySelector('.slider-arrow.prev');
    const nextBtn = document.querySelector('.slider-arrow.next');
    let currentIndex = 0;
    const slideCount = slides.length;

    function updateSlider() {
        sliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentIndex);
        });
    }

    nextBtn.addEventListener('click', function() {
        currentIndex = (currentIndex + 1) % slideCount;
        updateSlider();
    });
    prevBtn.addEventListener('click', function() {
        currentIndex = (currentIndex - 1 + slideCount) % slideCount;
        updateSlider();
    });

    // Autoplay
    let sliderInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % slideCount;
        updateSlider();
    }, 3000);

    // Pausar autoplay al hover
    const sliderCard = document.querySelector('.slider-container');
    sliderCard.addEventListener('mouseenter', () => clearInterval(sliderInterval));
    sliderCard.addEventListener('mouseleave', () => {
        sliderInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % slideCount;
            updateSlider();
        }, 3000);
    });

    /* COPIAR CUPÓN */
    window.copyCode = function() {
        navigator.clipboard.writeText("EXTRA20").then(() => {
            const btn = document.querySelector('.btn-copy-red');
            const original = btn.innerText;
            btn.innerText = "¡Copiado!";
            btn.style.background = "rgba(255,255,255,0.5)";
            setTimeout(() => {
                btn.innerText = original;
                btn.style.background = "rgba(255,255,255,0.3)";
            }, 2000);
        });
    };

    /* COUNTDOWN TIMER */
    function startCountdown(h, m, s) {
        const hEl = document.getElementById('hours');
        const mEl = document.getElementById('minutes');
        const sEl = document.getElementById('seconds');
        let totalSeconds = h * 3600 + m * 60 + s;

        const timer = setInterval(() => {
            if(totalSeconds <= 0) { clearInterval(timer); return; }
            totalSeconds--;
            const hh = Math.floor(totalSeconds / 3600);
            const mm = Math.floor((totalSeconds % 3600) / 60);
            const ss = totalSeconds % 60;
            hEl.innerText = String(hh).padStart(2, '0');
            mEl.innerText = String(mm).padStart(2, '0');
            sEl.innerText = String(ss).padStart(2, '0');
        }, 1000);
    }
    startCountdown(6, 20, 50);

    /* SHIPPING TIMER */
    const shipHours = document.getElementById('ship-hours');
    const shipMins = document.getElementById('ship-mins');
    let shipTotalMins = 35;
    const shipTimer = setInterval(() => {
        if(shipTotalMins <= 0) clearInterval(shipTimer);
        shipTotalMins--;
        const h = Math.floor(shipTotalMins / 60);
        const m = shipTotalMins % 60;
        shipHours.innerText = `${h}h`;
        shipMins.innerText = `${m}m`;
    }, 60000);

    /* CUSTOMIZER (WYSIWYG) */
    const btnColor = document.getElementById('btn-color');
    const previewBtn = document.getElementById('preview-btn');
    const gradientCheck = document.getElementById('gradient-bg');
    const styleOptions = document.querySelectorAll('.style-opt');

    btnColor.addEventListener('input', function() {
        previewBtn.style.backgroundColor = this.value;
        if(!gradientCheck.checked) {
            previewBtn.style.backgroundImage = 'none';
        }
    });

    gradientCheck.addEventListener('change', function() {
        if(this.checked) {
            previewBtn.style.backgroundImage = 'linear-gradient(to right, #2563eb, #3b82f6)';
        } else {
            previewBtn.style.backgroundImage = 'none';
            previewBtn.style.backgroundColor = btnColor.value;
        }
    });

    styleOptions.forEach(btn => {
        btn.addEventListener('click', function() {
            const parent = this.parentElement;
            parent.querySelectorAll('.style-opt').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const style = this.dataset.style;
            const effect = this.dataset.effect;

            if(style === 'round') previewBtn.style.borderRadius = '9999px';
            else if(style === 'square') previewBtn.style.borderRadius = '4px';

            if(effect === 'pulse') {
                previewBtn.style.animation = 'pulse 2s infinite';
            } else {
                previewBtn.style.animation = 'none';
            }
        });
    });

    /* AGREGAR AL CARRITO INTERACCIÓN */
    document.querySelector('.add-to-cart')?.addEventListener('click', function() {
        const original = this.innerText;
        this.innerText = "Agregando...";
        this.style.opacity = "0.7";
        setTimeout(() => {
            this.innerText = "¡Agregado!";
            this.style.backgroundColor = "#059669";
            setTimeout(() => {
                this.innerText = original;
                this.style.backgroundColor = "#1e293b";
                this.style.opacity = "1";
            }, 2000);
        }, 1000);
    });
});
