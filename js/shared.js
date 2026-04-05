/* ========================================================
   NUTD — Shared JavaScript
   Extracted from inline scripts across all pages.
   ======================================================== */

// ─── Language System ───
let currentLang = localStorage.getItem('lang') || 'en';

function setLang(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
    document.body.classList.toggle('lang-ar', lang === 'ar');
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    const btnEn = document.getElementById('btn-en');
    const btnAr = document.getElementById('btn-ar');
    if (btnEn) btnEn.classList.toggle('active', lang === 'en');
    if (btnAr) btnAr.classList.toggle('active', lang === 'ar');

    document.querySelectorAll('[data-en]').forEach(el => {
        const t = el.getAttribute('data-' + lang);
        if (t) el.innerHTML = t;
    });
    document.querySelectorAll('[data-placeholder-en]').forEach(el => {
        el.placeholder = el.getAttribute('data-placeholder-' + lang) || el.placeholder;
    });

    // Notify other scripts
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }));
}

// ─── Mobile Navigation ───
function initMobileNav() {
    const hamburger = document.querySelector('.nav-hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (!hamburger || !navLinks) return;

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'mobile-nav-overlay';
    document.body.appendChild(overlay);

    // Clone nav links into overlay
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-nav-menu';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'mobile-nav-close';
    closeBtn.innerHTML = '<i class="fa fa-xmark"></i>';
    mobileMenu.appendChild(closeBtn);

    const clonedLinks = navLinks.cloneNode(true);
    clonedLinks.style.display = 'flex';
    mobileMenu.appendChild(clonedLinks);

    // Add language toggle for mobile
    const langToggle = document.querySelector('.nav-actions .lang-toggle');
    if (langToggle) {
        const mobileLang = langToggle.cloneNode(true);
        mobileLang.style.marginTop = '24px';
        // Re-attach event listeners for cloned buttons
        const mobileBtnEn = mobileLang.querySelector('[onclick*="en"]') || mobileLang.children[0];
        const mobileBtnAr = mobileLang.querySelector('[onclick*="ar"]') || mobileLang.children[1];
        if (mobileBtnEn) mobileBtnEn.addEventListener('click', () => { setLang('en'); closeMobileNav(); });
        if (mobileBtnAr) mobileBtnAr.addEventListener('click', () => { setLang('ar'); closeMobileNav(); });
        mobileMenu.appendChild(mobileLang);
    }

    overlay.appendChild(mobileMenu);

    function openMobileNav() {
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileNav() {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', openMobileNav);
    closeBtn.addEventListener('click', closeMobileNav);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeMobileNav();
    });

    // Close on link click
    clonedLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMobileNav);
    });
}

// ─── Navbar Scroll Effect ───
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                navbar.classList.toggle('scrolled', window.scrollY > 30);
                ticking = false;
            });
            ticking = true;
        }
    });
    // Initial check
    navbar.classList.toggle('scrolled', window.scrollY > 30);
}

// ─── Active Nav Link ───
function initActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// ─── Scroll Reveal ───
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    if (window._revealObserver) {
        window._revealObserver.disconnect();
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: remove unobserve if we want it to animate every time it scrolls into view
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    window._revealObserver = observer;
    reveals.forEach(el => observer.observe(el));
}

// ─── Back to Top ───
function initBackToTop() {
    const btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.innerHTML = '<i class="fa fa-chevron-up"></i>';
    btn.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(btn);

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                btn.classList.toggle('visible', window.scrollY > 400);
                ticking = false;
            });
            ticking = true;
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ─── Loading Bar ───
function initLoadingBar() {
    const bar = document.createElement('div');
    bar.className = 'page-loading-bar';
    document.body.prepend(bar);

    // Animate the bar
    requestAnimationFrame(() => {
        bar.style.width = '70%';
    });

    window.addEventListener('load', () => {
        bar.style.width = '100%';
        setTimeout(() => {
            bar.style.opacity = '0';
            setTimeout(() => bar.remove(), 300);
        }, 200);
    });
}

// ─── Toast Notification System ───
function showToast(message, type = 'info', duration = 3500) {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icons = { success: 'fa-circle-check', error: 'fa-circle-xmark', warning: 'fa-triangle-exclamation', info: 'fa-circle-info' };
    toast.innerHTML = `<i class="fa ${icons[type] || icons.info}"></i><span>${message}</span>`;

    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// ─── Dealer Authentication Bindings ───
function initDealerProfileSidebar() {
    const dealerStr = localStorage.getItem('dealerData');
    // Basic verification that we are inside a dealer view (checking for the specific sidebar-footer pattern)
    const sidebarFooterBox = document.querySelector('.sidebar-footer .d-flex > div:nth-child(2)');
    if (dealerStr && sidebarFooterBox && !window.location.pathname.includes('/admin')) {
        try {
            const data = JSON.parse(dealerStr);
            const name = data.contactPerson || 'Dealer';
            const company = data.companyNameEn || (data.companyNameAr || 'Company');
            const initials = name.substring(0, 2).toUpperCase();

            // Update Avatars (if not already overwritten by an image via profile fetch)
            document.querySelectorAll('.topbar-avatar').forEach(el => {
                if(!el.innerHTML.includes('<img')) {
                    el.textContent = initials;
                }
            });

            // Update the sidebar text dynamically
            if (sidebarFooterBox.children.length >= 2) {
                sidebarFooterBox.children[0].textContent = name;
                sidebarFooterBox.children[1].textContent = company;
                // Remove data-en/data-ar so setLang doesn't overwrite it!
                sidebarFooterBox.children[1].removeAttribute('data-en');
                sidebarFooterBox.children[1].removeAttribute('data-ar');
            }
        } catch(e) {}
    }
}

// ─── Initialize Everything ───
document.addEventListener('DOMContentLoaded', () => {
    setLang(currentLang);
    initMobileNav();
    initNavbarScroll();
    initActiveNavLink();
    initScrollReveal();
    initBackToTop();
    initLoadingBar();
    fetchDynamicSettings();
    initDealerProfileSidebar();
});

// ─── Dynamic Settings ───
async function fetchDynamicSettings() {
    try {
        const res = await fetch('http://localhost:5000/api/settings');
        const json = await res.json();
        if(json.success && json.data) {
            const data = json.data;
            
            // 1) Legacy ID mappings
            if(document.getElementById('dynamic_phone')) document.getElementById('dynamic_phone').textContent = data.contact_phone || '';
            if(document.getElementById('dynamic_email')) document.getElementById('dynamic_email').textContent = data.contact_email || '';
            if(document.getElementById('dynamic_phone2')) document.getElementById('dynamic_phone2').textContent = data.contact_phone || '';
            if(document.getElementById('dynamic_email2')) document.getElementById('dynamic_email2').textContent = data.contact_email || '';
            
            const legacyKeys = ['hero_title', 'hero_sub', 'about_mission', 'about_vision', 'catalog_hero', 'brand_borsehung', 'brand_vika', 'brand_kdd'];
            legacyKeys.forEach(key => {
                const el = document.getElementById('dyn_' + key) || document.getElementById(key + '_dynamic_en');
                if(el) {
                    if(data[key + '_en']) el.setAttribute('data-en', data[key + '_en']);
                    if(data[key + '_ar']) el.setAttribute('data-ar', data[key + '_ar']);
                }
            });

            // Universal CMS Engine: Process all [data-cms] attributes statically assigned in HTML
            document.querySelectorAll('[data-cms]').forEach(el => {
                const key = el.getAttribute('data-cms');
                if(!key) return;
                
                // If the setting is a direct string (e.g. image URL, simple number, or icon string)
                if (data[key] !== undefined && typeof data[key] === 'string') {
                    if (el.tagName === 'IMG') {
                        el.src = data[key];
                    } else if (el.tagName === 'I') {
                        if (data[key].startsWith('http') || data[key].startsWith('data:image')) {
                            const img = document.createElement('img');
                            img.src = data[key];
                            img.setAttribute('data-cms', el.getAttribute('data-cms'));
                            img.style.width = '100%';
                            img.style.height = '100%';
                            img.style.objectFit = 'contain';
                            el.replaceWith(img);
                        } else {
                            el.className = data[key].includes('fa-') && data[key].includes('fa ') ? data[key] : 'fa ' + data[key].replace('fa ', '');
                        }
                    } else if (el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA') {
                        el.textContent = data[key];
                    }
                }
                
                // If the setting has localized _en and _ar versions
                if (data[key + '_en']) {
                    if(el.tagName === 'INPUT') el.setAttribute('data-placeholder-en', data[key + '_en']);
                    else el.setAttribute('data-en', data[key + '_en']);
                }
                if (data[key + '_ar']) {
                    if(el.tagName === 'INPUT') el.setAttribute('data-placeholder-ar', data[key + '_ar']);
                    else el.setAttribute('data-ar', data[key + '_ar']);
                }
            });

            // 3) Global Selector Overrides (Injects into all pages without needing HTML changes)
            const footerObj = document.querySelector('.footer-bottom > span');
            if(footerObj) {
                if(data.footer_copyright_en) footerObj.setAttribute('data-en', data.footer_copyright_en);
                if(data.footer_copyright_ar) footerObj.setAttribute('data-ar', data.footer_copyright_ar);
            }
            
            // Reapply current lang text immediately
            setLang(currentLang);
        }
    } catch(e) {
        console.error('Dynamic Settings Load Error:', e);
    }
}

// ─── CMS Live Preview Receiver ───
window.addEventListener('message', (event) => {
    if(event.data && event.data.type === 'cms-update') {
        const {key, value, lang} = event.data;
        const els = document.querySelectorAll(`[data-cms="${key}"]`);
        
        els.forEach(el => {
            if(lang) {
                // Localized field
                if(el.tagName === 'INPUT') el.setAttribute('data-placeholder-' + lang, value);
                else el.setAttribute('data-' + lang, value); // Keep data attribute updated
                
                // If it's the current language, update visually
                if(currentLang === lang) {
                    if (el.tagName === 'INPUT') el.placeholder = value;
                    else el.innerHTML = value;
                }
            } else {
                // Non-localized field (Icons, URLs, Colors, etc)
                if (el.tagName === 'IMG') {
                    el.src = value;
                } else if (el.tagName === 'I') {
                    if (value.startsWith('http') || value.startsWith('data:image')) {
                        const img = document.createElement('img');
                        img.src = value;
                        img.setAttribute('data-cms', key);
                        img.style.width = '100%';
                        img.style.height = '100%';
                        img.style.objectFit = 'contain';
                        el.replaceWith(img);
                    } else {
                        el.className = value.includes('fa-') && value.includes('fa ') ? value : 'fa ' + value.replace('fa ', '');
                    }
                } else if (el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA') {
                    el.textContent = value;
                }
            }
        });

        // Specific overrides like global footer
        if (key === 'footer_copyright' && lang) {
            const footerObj = document.querySelector('.footer-bottom > span');
            if(footerObj) {
                footerObj.setAttribute('data-' + lang, value);
                if(currentLang === lang) footerObj.innerHTML = value;
            }
        }
    }
});
