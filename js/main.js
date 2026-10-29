'use strict';

/* =========================================================
   Portfolio JavaScript — Nur Abyatul Adawiah
   Each feature is its own function for readability.
   ========================================================= */

/* ---------- 1. Mobile nav toggle ---------- */
function initNavToggle() {
    const btn = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');
    if (!btn || !menu) return;

    btn.addEventListener('click', function () {
        const open = menu.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', String(open));
    });

    // Close mobile menu after clicking a link
    menu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            menu.classList.remove('is-open');
            btn.setAttribute('aria-expanded', 'false');
        });
    });
}

/* ---------- 2. Dark mode with persistence + aria-pressed ---------- */
function initThemeToggle() {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;

    function apply(mode) {
        const dark = mode === 'dark';
        document.body.classList.toggle('dark', dark);
        btn.setAttribute('aria-pressed', String(dark));
        btn.textContent = dark ? '☀️ Light Mode' : '🌙 Dark Mode';
    }

    let saved = 'light';
    try {
        saved = localStorage.getItem('theme') || 'light';
    } catch (e) {
        // localStorage unavailable — ignore, stay light
    }
    apply(saved);

    btn.addEventListener('click', function () {
        const next = document.body.classList.contains('dark') ? 'light' : 'dark';
        apply(next);
        try {
            localStorage.setItem('theme', next);
        } catch (e) {
            // ignore
        }
    });
}

/* ---------- 3. Live clock ---------- */
function initClock() {
    const clock = document.getElementById('clock');
    if (!clock) return;

    function tick() {
        clock.textContent = 'Current time: ' + new Date().toLocaleTimeString();
    }
    tick();
    setInterval(tick, 1000);
}

/* ---------- 4. Dynamic year in footer ---------- */
function initYear() {
    const el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
}

/* ---------- 5. Back to top button ---------- */
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    btn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', function () {
        btn.style.display = window.scrollY > 400 ? 'inline-block' : 'none';
    }, { passive: true });

    // Initial state
    btn.style.display = window.scrollY > 400 ? 'inline-block' : 'none';
}

/* ---------- 6. Time-based greeting ---------- */
function initGreeting() {
    const h1 = document.querySelector('.hero h1');
    if (!h1) return;

    const hour = new Date().getHours();
    let greeting = 'Good evening';
    if (hour < 12) greeting = 'Good morning';
    else if (hour < 18) greeting = 'Good afternoon';

    h1.textContent = greeting + ", I'm Nur Abyatul! ♡";
}

/* ---------- 7. Active nav link on scroll ---------- */
function initActiveNav() {
    const sections = document.querySelectorAll('main section[id]');
    const links = document.querySelectorAll('nav a[href^="#"]');
    if (!sections.length || !links.length) return;

    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            links.forEach(function (a) {
                const match = a.getAttribute('href') === '#' + entry.target.id;
                a.classList.toggle('is-active', match);
                if (match) a.setAttribute('aria-current', 'page');
                else a.removeAttribute('aria-current');
            });
        });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(function (s) { observer.observe(s); });
}

/* ---------- 8. Scroll progress bar ---------- */
function initProgressBar() {
    const bar = document.getElementById('progressBar');
    if (!bar) return;

    function update() {
        const h = document.documentElement;
        const max = h.scrollHeight - h.clientHeight;
        const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
        bar.style.width = pct + '%';
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
}

/* ---------- 9. Scroll reveal for cards ---------- */
function initScrollReveal() {
    const items = document.querySelectorAll('.card');
    if (!items.length || !('IntersectionObserver' in window)) return;

    items.forEach(function (el) { el.classList.add('reveal'); });

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    items.forEach(function (el) { observer.observe(el); });
}

/* ---------- 10. Copy email to clipboard ---------- */
function initCopyEmail() {
    const btn = document.getElementById('copyEmail');
    const link = document.getElementById('emailLink');
    if (!btn || !link) return;

    btn.addEventListener('click', function () {
        const email = link.textContent.trim();
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(email).then(function () {
                btn.textContent = 'Copied!';
                setTimeout(function () { btn.textContent = 'Copy'; }, 2000);
            }).catch(function () {
                btn.textContent = 'Failed';
            });
        } else {
            btn.textContent = 'Unavailable';
        }
    });
}

/* ---------- 11. Contact form validation ---------- */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function validateField(field) {
        const errEl = document.getElementById(field.id + 'Error');
        let msg = '';

        if (!field.value.trim()) {
            msg = 'This field is required.';
        } else if (field.type === 'email' && !emailRx.test(field.value)) {
            msg = 'Please enter a valid email address.';
        }

        if (errEl) errEl.textContent = msg;
        field.setAttribute('aria-invalid', String(Boolean(msg)));
        return !msg;
    }

    form.querySelectorAll('input, textarea').forEach(function (field) {
        field.addEventListener('blur', function () { validateField(field); });
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const fields = form.querySelectorAll('input, textarea');
        let valid = true;
        fields.forEach(function (f) {
            if (!validateField(f)) valid = false;
        });

        const status = document.getElementById('formStatus');
        if (status) {
            status.textContent = valid
                ? '✅ Thanks! Your message has been validated (front-end demo).'
                : '⚠️ Please fix the errors above.';
        }
        if (valid) form.reset();
    });
}

/* ---------- 12. Project filter ---------- */
function initProjectFilter() {
    const buttons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.project');
    if (!buttons.length || !cards.length) return;

    buttons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            buttons.forEach(function (b) { b.classList.remove('is-active'); });
            btn.classList.add('is-active');

            const filter = btn.dataset.filter;
            cards.forEach(function (card) {
                const tags = (card.dataset.tags || '').split(/\s+/);
                const show = filter === 'all' || tags.indexOf(filter) !== -1;
                card.style.display = show ? '' : 'none';
            });
        });
    });
}

/* ---------- Boot ---------- */
document.addEventListener('DOMContentLoaded', function () {
    initNavToggle();
    initThemeToggle();
    initClock();
    initYear();
    initBackToTop();
    initGreeting();
    initActiveNav();
    initProgressBar();
    initScrollReveal();
    initCopyEmail();
    initContactForm();
    initProjectFilter();
});