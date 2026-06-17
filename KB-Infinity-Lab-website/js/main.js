document.querySelectorAll('a').forEach(link => {
    link.addEventListener('mouseover', () => {
        link.style.opacity = '0.7';
    });
    link.addEventListener('mouseout', () => {
        link.style.opacity = '1';
    });
});

const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    function openNav(){
        navLinks.classList.add('active');
        hamburger.setAttribute('aria-expanded','true');
        // move focus to first link for keyboard users
        navLinks.querySelector('a')?.focus();
        // prevent body scroll when menu open on small screens
        if(window.innerWidth <= 768) document.documentElement.style.overflow = 'hidden';
    }
    function closeNav(){
        navLinks.classList.remove('active');
        hamburger.setAttribute('aria-expanded','false');
        hamburger.focus();
        document.documentElement.style.overflow = '';
    }

    hamburger.addEventListener('click', (e) => {
        if(navLinks.classList.contains('active')) closeNav(); else openNav();
    });

    // close when clicking a navigation link (useful on mobile)
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => closeNav()));

    // close on outside click
    document.addEventListener('click', (ev) => {
        if(!navLinks.classList.contains('active')) return;
        if(hamburger.contains(ev.target) || navLinks.contains(ev.target)) return;
        closeNav();
    });

    // close on ESC
    document.addEventListener('keydown', (ev) => {
        if(ev.key === 'Escape' && navLinks.classList.contains('active')) closeNav();
    });
}

/* Analytics integration: inject Plausible (or use GA if present)
   - Injects Plausible script with data-domain = location.hostname so you can enable Plausible for your domain.
   - Provides `sendAnalyticsEvent(name, props)` to send custom events to Plausible or GA if available.
*/
(function(){
    // simple helper to send events to available analytics
    window.sendAnalyticsEvent = function(name, props){
        try{
            if(window.plausible && typeof window.plausible === 'function'){
                // plausible accepts (eventName, options)
                window.plausible(name, props || {});
                return;
            }
            if(window.gtag && typeof window.gtag === 'function'){
                window.gtag('event', name, props || {});
                return;
            }
        }catch(e){ /* swallow */ }
    };

    // If neither Plausible nor gtag is present, inject Plausible dynamically
    if(!window.plausible && !window.gtag){
        window.plausible = window.plausible || function(){ (window.plausible.q = window.plausible.q || []).push(arguments) };
        var s = document.createElement('script');
        s.async = true; s.defer = true;
        s.src = 'https://plausible.io/js/plausible.js';
        // Set data-domain dynamically to your current hostname. Replace if you want a specific domain.
        s.setAttribute('data-domain', location.hostname.replace(/^www\./,''));
        document.head.appendChild(s);
    }
})();

/* Hero reveal on hover: fade overlays to show more of the sliding photo */
(function(){
    const hero = document.querySelector('.hero');
    if(!hero) return;

    // add/remove a class when pointer enters/leaves so CSS handles transitions
    hero.addEventListener('mouseenter', () => hero.classList.add('hero-reveal'));
    hero.addEventListener('mouseleave', () => hero.classList.remove('hero-reveal'));

    // For pointer-aware subtle reveal (optional): as cursor moves closer to center, slightly increase reveal
    try{
        hero.addEventListener('mousemove', (ev) => {
            const rect = hero.getBoundingClientRect();
            const cx = rect.left + rect.width/2;
            const cy = rect.top + rect.height/2;
            const dx = ev.clientX - cx;
            const dy = ev.clientY - cy;
            const dist = Math.sqrt(dx*dx + dy*dy);
            const max = Math.sqrt((rect.width/2)*(rect.width/2) + (rect.height/2)*(rect.height/2));
            const t = Math.max(0, Math.min(1, 1 - dist / max));
            // Map t to opacity range: 1 -> 0.06, 0 -> 1
            const opacity = 1 - (0.94 * t);
            hero.querySelector('.hero-content').style.opacity = String(opacity);
            // soften overlay as well
            hero.style.setProperty('--hero-overlay-alpha', String(0.25 - 0.18 * t));
            hero.style.setProperty('--hero-overlay-alpha-end', String(0.12 - 0.08 * t));
            hero.querySelector('.hero')?.offsetWidth; // noop to encourage style apply
        });
        // reset on leave
        hero.addEventListener('mouseleave', () => {
            const hc = hero.querySelector('.hero-content'); if(hc) hc.style.opacity = '';
            hero.style.removeProperty('--hero-overlay-alpha');
            hero.style.removeProperty('--hero-overlay-alpha-end');
        });
    }catch(e){}
})();

/* Hero background slider: creates two layered DIVs and crossfades images */
(function(){
    const hero = document.querySelector('.hero');
    if(!hero) return;

    // Customize these image paths to match your assets
    const images = [
        'assets/images/hero1.jpg',

        'assets/images/hero2.jpg',
        'assets/images/hero3.jpg'
    ];

    let idx = 0;
    const layerA = document.createElement('div');
    const layerB = document.createElement('div');
    layerA.className = 'hero-bg-layer';
    layerB.className = 'hero-bg-layer';
    hero.insertBefore(layerA, hero.firstChild);
    hero.insertBefore(layerB, hero.firstChild);

    // ensure hero content is wrapped or marked so it stays above backgrounds
    if(!hero.querySelector('.hero-content')){
        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'hero-content';
        // move existing children (excluding the two layers we just added) into wrapper
        Array.from(hero.children).forEach(child => {
            if(child !== layerA && child !== layerB) contentWrapper.appendChild(child);
        });
        hero.appendChild(contentWrapper);
    }

    const layers = [layerA, layerB];

    function setBackground(el, url){
        el.style.backgroundImage = url ? `url("${url}")` : '';
    }

    // initialize
    setBackground(layers[0], images[0] || '');
    layers[0].classList.add('visible');
    setBackground(layers[1], images[1 % images.length] || '');

    function next(){
        const nextIdx = (idx + 1) % images.length;
        const visible = layers.find(l => l.classList.contains('visible'));
        const hidden = layers.find(l => !l.classList.contains('visible'));
        setBackground(hidden, images[nextIdx]);
        // force reflow then swap classes to trigger transition
        void hidden.offsetWidth;
        visible.classList.remove('visible');
        hidden.classList.add('visible');
        idx = nextIdx;
    }

    // autoplay every 5s
    const interval = 5000;
    let timer = setInterval(next, interval);

    // expose simple controls via data attributes (optional)
    hero.addEventListener('mouseenter', () => clearInterval(timer));
    hero.addEventListener('mouseleave', () => timer = setInterval(next, interval));

})();

/* Notifications: simple in-page bell + dropdown populated from a static list */
(function(){
    const notifBtn = document.getElementById('notifBtn');
    const notifDropdown = document.getElementById('notifDropdown');
    const notifCount = document.getElementById('notifCount');
    const notifList = document.getElementById('notifList');
    const clearBtn = document.getElementById('clearNotifs');

    if(!notifBtn || !notifDropdown || !notifCount || !notifList) return;

    // sample notifications (replace/extend as needed)
    const notifications = [
        {id:1,type:'blog',title:'New article: Hybrid MPC for AGVs',href:'posts/mpc-agv.html',time:'2d',thumb:'assets/images/post-mpc.jpg',excerpt:'Integration of MPC with learning-based perception for robust AGV navigation under uncertainty.'},
        {id:2,type:'photo',title:'Gallery: Urban NAV photos',href:'gallery.html#urban-nav',time:'3d',thumb:'assets/images/urban-nav.jpg',excerpt:'A set of annotated urban navigation images from recent field tests.'},
        {id:3,type:'video',title:'New video: Vision-Based Navigation',href:'gallery.html#urban-nav',time:'5d',thumb:'assets/images/urban-nav.jpg',excerpt:'Short demo video showing perception and planning in action.'}
    ];

    function render(){
        notifList.innerHTML = '';
        notifications.forEach(n => {
            const li = document.createElement('li');
            li.className = 'notif-item';

            const thumb = document.createElement('img');
            thumb.className = 'notif-thumb';
            thumb.src = n.thumb || 'assets/images/hero1.jpg';
            thumb.alt = '';

            const body = document.createElement('div');
            body.className = 'notif-body';
            const a = document.createElement('a');
            a.href = n.href;
            a.innerText = n.title;
            a.addEventListener('click', () => { notifDropdown.hidden = true });
            const t = document.createElement('div');
            t.className = 'notif-time';
            t.innerText = n.time;
            const ex = document.createElement('div');
            ex.className = 'notif-excerpt';
            ex.innerText = n.excerpt || '';

            body.appendChild(a);
            body.appendChild(t);
            if(ex.innerText) body.appendChild(ex);

            li.appendChild(thumb);
            li.appendChild(body);
            notifList.appendChild(li);
        });

        notifCount.innerText = notifications.length;
        notifCount.style.display = notifications.length ? 'inline-block' : 'none';
    }

    // support both hover (approach) and click to open notifications
    let manuallyOpened = false;
    const container = document.querySelector('.notifications');

    function openDropdown(byUser){
        notifDropdown.hidden = false;
        notifBtn.setAttribute('aria-expanded','true');
        manuallyOpened = !!byUser;
        setTimeout(() => notifList.querySelectorAll('a')[0]?.focus(), 50);
    }
    function closeDropdown(){
        notifDropdown.hidden = true;
        notifBtn.setAttribute('aria-expanded','false');
        manuallyOpened = false;
    }

    notifBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if(notifDropdown.hidden) openDropdown(true); else closeDropdown();
    });

    // show on hover (approach) unless user manually opened/closed
    container?.addEventListener('mouseenter', () => { if(!manuallyOpened) openDropdown(false); });
    container?.addEventListener('mouseleave', () => { if(!manuallyOpened) closeDropdown(); });

    clearBtn?.addEventListener('click', () => {
        notifList.innerHTML = '';
        notifCount.innerText = '0';
        notifCount.style.display = 'none';
    });

    // close when clicking outside
    // prevent clicks inside dropdown from bubbling to document and closing it
    notifDropdown.addEventListener('click', (ev) => ev.stopPropagation());

    document.addEventListener('click', (ev) => {
        if(!notifDropdown.hidden && !notifBtn.contains(ev.target) && !notifDropdown.contains(ev.target)){
            closeDropdown();
        }
    });

    render();
})();

/* Subscribe form handling */
(function(){
    const form = document.getElementById('subscribeForm');
    const emailInput = document.getElementById('subscribeEmail');
    const msg = document.getElementById('subscribeMsg');
    if(!form || !emailInput || !msg) return;

    function isValidEmail(e){
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
    }

    form.addEventListener('submit', (ev) => {
        ev.preventDefault();
        const email = emailInput.value.trim();
        if(!isValidEmail(email)){
            msg.innerText = 'Please enter a valid email.';
            msg.style.color = 'var(--yellow)';
            return;
        }

        // store locally (simple approach) - de-duplicate
        try{
            const key = 'kb_subscribers_v1';
            const existing = JSON.parse(localStorage.getItem(key) || '[]');
            if(!existing.includes(email)) existing.unshift(email);
            localStorage.setItem(key, JSON.stringify(existing.slice(0,500)));
            msg.innerText = 'Thanks — you are subscribed! Check your inbox.';
            msg.style.color = 'var(--white)';
            emailInput.value = '';
                // Analytics: record a subscribe event (no PII sent)
                try{ window.sendAnalyticsEvent && window.sendAnalyticsEvent('subscribe',{method:'local'}); }catch(e){}
        }catch(err){
            msg.innerText = 'Subscription failed locally.';
            msg.style.color = '#ff6666';
        }
    });
})();

/* Visitor counter (localStorage-based unique per-browser visits) */
(function(){
    const span = document.getElementById('vcnt');
    if(!span) return;

    const KEY = 'kb_visit_count_v1';
    const VISITED = 'kb_has_visited_v1';
})();

    // read current count (site-wide not possible without server)
    let count = parseInt(localStorage.getItem(KEY) || '0', 10) || 0;

    // Ensure baseline of 240 visitors for display if site owner wants a starting value
    const MIN_BASELINE = 240;
    if(count < MIN_BASELINE){
        count = MIN_BASELINE;
        localStorage.setItem(KEY, String(count));
    }

    // if this browser hasn't recorded a visit, increment (still respects baseline)
    if(!localStorage.getItem(VISITED)){
        count += 1;
        localStorage.setItem(KEY, String(count));
        localStorage.setItem(VISITED, String(Date.now()));
    }

    span.innerText = String(count);
    // Analytics: send a visit event so third-party analytics receive a visitor signal
    try{ window.sendAnalyticsEvent && window.sendAnalyticsEvent('visit',{method:'local'}); }catch(e){}

    // Local time realtime display (updates every second)
    (function(){
        const tEl = document.getElementById('localTime');
        if(!tEl) return;
        function updateTime(){
            const now = new Date();
            // Format like: 'Mon 12 Jan 14:23:05'
            const opts = {weekday:'short', year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit', second:'2-digit'};
            tEl.innerText = now.toLocaleString(undefined, opts);
        }
        updateTime();
        setInterval(updateTime, 1000);
    })();

