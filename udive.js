/* UDIVE Tioman — homepage behaviour */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = typeof window.gsap === 'function';
  var skipIntro = document.documentElement.classList.contains('skip-intro') || reduceMotion;

  function loadDeferredImages(root) {
    (root || document).querySelectorAll('img[data-src]').forEach(function (img) {
      if (!img.getAttribute('src')) img.setAttribute('src', img.getAttribute('data-src'));
    });
  }

  /* ── Intro overlay ── */
  (function () {
    var overlay = document.getElementById('introOverlay');
    if (!overlay) return;

    function dismiss() {
      overlay.classList.add('is-hidden');
      setTimeout(function () {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      }, 900);
      try { sessionStorage.setItem('udive_intro', '1'); } catch (err) {}
    }

    if (skipIntro) {
      overlay.remove();
      return;
    }

    if (hasGsap) {
      var beam = document.getElementById('introBeam');
      var logo = document.getElementById('introLogo');
      var divider = document.querySelector('.intro-overlay__divider');
      var padi = document.getElementById('introPadi');
      var tl = gsap.timeline({ ease: 'power1.out', onComplete: dismiss });
      tl.to(beam, { x: '200%', duration: 0.9, ease: 'sine.inOut', delay: 0.15 }, 0)
        .to(beam, { opacity: 0, duration: 0.35, ease: 'power1.in' }, '-=0.2')
        .to(logo, { opacity: 0.85, duration: 0.7, ease: 'power2.out' }, '-=0.1')
        .to(divider, { opacity: 1, duration: 0.35 }, '-=0.25')
        .to(padi, { opacity: 1, duration: 0.55 }, '-=0.15')
        .to(overlay, { opacity: 0, duration: 0.5, ease: 'power2.inOut' }, '+=0.55');
    } else {
      overlay.classList.add('intro-overlay--css');
      setTimeout(dismiss, 1600);
    }
  })();

  /* ── Nav scroll + spy ── */
  var nav = document.getElementById('nav');
  var navLinks = document.querySelectorAll('.nav__link[data-section]');
  var sections = ['stay', 'courses', 'team', 'faq', 'contact'];

  window.addEventListener('scroll', function () {
    if (nav) nav.classList.toggle('nav--scrolled', window.scrollY > 80);
    var current = '';
    sections.forEach(function (id) {
      var el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 120) current = id;
    });
    navLinks.forEach(function (l) {
      l.classList.toggle('active', l.dataset.section === current);
    });
  }, { passive: true });

  /* ── Mobile nav drawer ── */
  (function () {
    var btn = document.querySelector('.nav__mobile-btn');
    var overlay = document.getElementById('navOverlay');
    var drawer = document.getElementById('navDrawer');
    var drawerLinks = drawer && drawer.querySelectorAll('a');
    if (!btn || !overlay || !drawer) return;

    function setOpen(isOpen) {
      drawer.classList.toggle('open', isOpen);
      overlay.classList.toggle('open', isOpen);
      btn.classList.toggle('nav__mobile-btn--open', isOpen);
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.classList.toggle('nav-open', isOpen);
    }
    function open() { setOpen(true); }
    function close() { setOpen(false); }

    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', 'navDrawer');
    btn.addEventListener('click', function () {
      drawer.classList.contains('open') ? close() : open();
    });
    overlay.addEventListener('click', close);
    if (drawerLinks) {
      drawerLinks.forEach(function (a) {
        a.addEventListener('click', function () { setTimeout(close, 280); });
      });
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('open')) close();
    });
  })();

  /* ── Hero entrance ── */
  if (hasGsap && !reduceMotion) {
    var heroMobile = window.matchMedia('(max-width: 767px)').matches;
    var heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    heroTl
      .fromTo('#heroEyebrow', { opacity: 0, y: heroMobile ? 0 : 16 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.05 })
      .fromTo('#heroTitle', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.35')
      .fromTo('#heroScript', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.55 }, '-=0.4')
      .fromTo('#heroSubtitle', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.55 }, '-=0.35')
      .fromTo('#heroCtas', { opacity: 0 }, { opacity: 1, duration: 0.5 }, '-=0.3');
  }

  /* Hero subtitle rotation */
  (function () {
    var subtitles = [
      "Beneath the surface lies a universe you've never seen. Professional diving experiences that transform the way you see the ocean — and yourself.",
      'Weightless. Silent. Alive. There is nothing on Earth that compares to the feeling of breathing underwater.',
      'Tioman Island holds secrets that only divers get to see. Crystal waters, ancient turtles, and coral forests that glow in the dark.'
    ];
    var subIdx = 0;
    var subEl = document.getElementById('heroSubtitle');
    if (!subEl || reduceMotion) return;

    function rotateSubtitle() {
      if (document.body.classList.contains('about-open')) return;
      subIdx = (subIdx + 1) % subtitles.length;
      if (hasGsap) {
        gsap.timeline()
          .to(subEl, { opacity: 0, y: 12, duration: 0.35, ease: 'power2.in' })
          .call(function () { subEl.textContent = subtitles[subIdx]; })
          .to(subEl, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
      } else {
        subEl.textContent = subtitles[subIdx];
      }
    }
    setInterval(rotateSubtitle, 7000);
  })();

  /* Hero parallax */
  if (hasGsap && !reduceMotion && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.fromTo('#heroTitle', { opacity: 1, y: 0 }, {
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
      y: 80, opacity: 0.15, ease: 'none'
    });
  }

  /* ── Scroll reveal ── */
  if (reduceMotion) {
    document.querySelectorAll('[data-anim]').forEach(function (el) {
      el.classList.add('el-in', el.dataset.anim || 'fadeIn');
    });
  } else if ('IntersectionObserver' in window) {
    var animObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.style.animationDelay = (parseInt(el.dataset.delay || '0', 10)) + 'ms';
        el.classList.add('el-in', el.dataset.anim || 'fadeInUp');
        animObserver.unobserve(el);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('[data-anim]').forEach(function (el) {
      animObserver.observe(el);
    });
  } else {
    document.querySelectorAll('[data-anim]').forEach(function (el) {
      el.classList.add('el-in', el.dataset.anim || 'fadeIn');
    });
  }

  /* ── FAQ accordion ── */
  document.querySelectorAll('.faq__q').forEach(function (btn, index) {
    var item = btn.closest('.faq__item');
    var panel = item && item.querySelector('.faq__a');
    var panelId = 'faq-a-' + (index + 1);
    btn.setAttribute('type', 'button');
    btn.setAttribute('aria-expanded', 'false');
    if (panel) {
      panel.id = panel.id || panelId;
      btn.setAttribute('aria-controls', panel.id);
    }

    btn.addEventListener('click', function () {
      var open = item.classList.contains('open');
      document.querySelectorAll('.faq__item').forEach(function (other) {
        other.classList.remove('open');
        var q = other.querySelector('.faq__q');
        if (q) q.setAttribute('aria-expanded', 'false');
      });
      if (!open) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ── Particle canvas ── */
  (function () {
    var canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    var isNarrow = window.matchMedia('(max-width: 767px)').matches;
    if (reduceMotion || isNarrow) {
      canvas.remove();
      return;
    }
    var ctx = canvas.getContext('2d');
    if (!ctx) return;
    var PARTICLES = 40;
    var particles = [];
    var running = true;
    var rafId = null;

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    function P() { this.reset(); }
    P.prototype.reset = function () {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + Math.random() * 80;
      this.r = Math.random() * 2 + 0.4;
      this.vy = Math.random() * 0.35 + 0.08;
      this.a = Math.random() * 0.35 + 0.08;
      this.w = Math.random() * Math.PI * 2;
      this.ws = (Math.random() * 0.008) + 0.004;
    };
    P.prototype.update = function () {
      this.y -= this.vy;
      this.w += this.ws;
      this.x += Math.sin(this.w) * 0.28;
      if (this.y < -8) this.reset();
    };
    P.prototype.draw = function () {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(160,210,255,' + this.a + ')';
      ctx.fill();
    };

    for (var i = 0; i < PARTICLES; i++) {
      var p = new P();
      p.y = Math.random() * canvas.height;
      particles.push(p);
    }

    function loop() {
      if (!running) { rafId = null; return; }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(function (particle) {
        particle.update();
        particle.draw();
      });
      rafId = requestAnimationFrame(loop);
    }

    var hero = document.querySelector('.hero');
    if (hero && 'IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function (entries) {
        running = entries[0].isIntersecting;
        if (running && !rafId) rafId = requestAnimationFrame(loop);
      }, { threshold: 0 });
      obs.observe(hero);
    }
    loop();
  })();

  /* ── Side-curtain cards ── */
  document.querySelectorAll('.kh-curtain-panel').forEach(function (panel) {
    panel.addEventListener('mouseenter', function () { panel.classList.add('is-open'); });
    panel.addEventListener('mouseleave', function () { panel.classList.remove('is-open'); });
    panel.addEventListener('click', function (e) {
      if (e.target.closest('a, button')) return;
      if (e.pointerType === 'touch' || !('ontouchstart' in window)) {
        panel.classList.toggle('is-open');
      }
    });
    panel.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        panel.classList.toggle('is-open');
      }
      if (e.key === 'Escape') panel.classList.remove('is-open');
    });
  });

  /* Smooth scroll for in-page anchors */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var href = a.getAttribute('href');
      if (!href || href === '#') return;
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      var offset = href === '#courses' ? 72 : 80;
      window.scrollTo({ top: target.offsetTop - offset, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });

  /* ── Pin chapters ── */
  (function initPinChapters() {
    var wrapEl = document.getElementById('pin-wrap');
    var dotsEl = document.getElementById('pin-dots');
    var fillEl = document.getElementById('pin-bar-fill');
    var chapters = Array.prototype.slice.call(document.querySelectorAll('.pin-chapter'));
    var panels = Array.prototype.slice.call(document.querySelectorAll('.pin-panel'));
    if (!wrapEl || !chapters.length) return;

    var N = chapters.length;
    var SCREENS_PER = 1.35;
    var currentIndex = 0;
    var desktop = window.matchMedia('(min-width: 900px)').matches;

    function setHeight() {
      desktop = window.matchMedia('(min-width: 900px)').matches;
      wrapEl.style.height = desktop ? (N * SCREENS_PER * 100) + 'vh' : 'auto';
    }
    setHeight();

    if (dotsEl) {
      dotsEl.removeAttribute('hidden');
      dotsEl.removeAttribute('aria-hidden');
      chapters.forEach(function (_, i) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'pin-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Chapter ' + String(i + 1).padStart(2, '0'));
        dot.addEventListener('click', function () { scrollToChapter(i); });
        dotsEl.appendChild(dot);
      });
    }

    function setActive(i) {
      if (i === currentIndex && desktop) return;
      currentIndex = i;
      chapters.forEach(function (el, idx) { el.classList.toggle('active', idx === i); });
      if (desktop) {
        panels.forEach(function (el, idx) { el.classList.toggle('visible', idx === i); });
      } else {
        panels.forEach(function (el) { el.classList.add('visible'); });
      }
      if (dotsEl) {
        dotsEl.querySelectorAll('.pin-dot').forEach(function (el, idx) {
          el.classList.toggle('active', idx === i);
        });
      }
      if (fillEl) fillEl.style.width = (((i + 1) / N) * 100) + '%';
    }

    function scrollToChapter(i) {
      if (!desktop) {
        setActive(i);
        var panel = panels[i];
        if (panel) panel.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
        return;
      }
      var wrapTop = window.scrollY + wrapEl.getBoundingClientRect().top;
      var target = wrapTop + (i / N) * wrapEl.offsetHeight + 8;
      window.scrollTo({ top: target, behavior: reduceMotion ? 'auto' : 'smooth' });
    }

    chapters.forEach(function (ch, i) {
      ch.addEventListener('click', function () { scrollToChapter(i); });
    });

    var st;
    function bindScroll() {
      if (st) { st.kill(); st = null; }
      setHeight();
      if (!desktop) {
        panels.forEach(function (el) { el.classList.add('visible'); });
        if (fillEl) fillEl.style.width = '100%';
        return;
      }
      if (hasGsap && window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
        st = ScrollTrigger.create({
          trigger: wrapEl,
          start: 'top top',
          end: 'bottom bottom',
          onUpdate: function (self) {
            var index = Math.min(N - 1, Math.floor(self.progress * N));
            setActive(index);
          }
        });
      }
      setActive(0);
      if (fillEl) fillEl.style.width = ((1 / N) * 100) + '%';
    }

    bindScroll();
    window.addEventListener('resize', function () {
      clearTimeout(window.__pinResize);
      window.__pinResize = setTimeout(function () {
        if (hasGsap && window.ScrollTrigger) ScrollTrigger.refresh();
        bindScroll();
      }, 150);
    });
  })();

  /* ── i18n ── */
  (function () {
    var LANG = {
      'nav.courses':        { en: 'Courses', zh: '課程' },
      'nav.sites':          { en: 'Dive Sites', zh: '潛點' },
      'nav.team':           { en: 'Team', zh: '團隊' },
      'nav.faq':            { en: 'FAQ', zh: '常見問題' },
      'nav.contact':        { en: 'Contact', zh: '聯絡我們' },
      'nav.book':           { en: 'Book Now', zh: '立即預訂' },
      'nav.menu':           { en: 'Menu', zh: '選單' },
      'hero.eyebrow':       { en: 'Paya Village, Tioman Island', zh: '刁曼島·Paya 村' },
      'hero.title':         { en: 'ONE ISLAND<br>ENDLESS<br>DEPTHS<span style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;"> — UDIVE Tioman: PADI 5 Star Scuba Diving Courses &amp; Certification, Tioman Island, Malaysia</span>', zh: '一座島<br>無盡<br>深度<span style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;"> — UDIVE刁曼岛：PADI 5星潜水课程与认证</span>' },
      'hero.script':        { en: 'From your first breath to your best dive', zh: '從第一口呼吸到最棒的一潛' },
      'hero.start':         { en: 'Start Diving', zh: '開始潛水' },
      'hero.book':          { en: 'Book a Dive', zh: '預訂潛水' },
      'hero.about':         { en: 'About Us', zh: '關於我們' },
      'hero.accommodation': { en: 'Accommodation', zh: '住宿' },
      'hero.courses':       { en: 'Courses', zh: '課程' },
      'hero.stay':          { en: 'Stay', zh: '住宿' },
      'hero.contact':       { en: 'Contact Us', zh: '聯絡我們' },
      'hero.event':         { en: 'Our Event', zh: '我們的活動' },
      'hero.scroll':        { en: 'Scroll', zh: '往下' },
      'stay.ask':           { en: 'Ask about availability', zh: '詢問空房' },
      'courses.eyebrow':    { en: 'Our Programs', zh: '我們的課程' },
      'courses.title':      { en: 'A JOURNEY<br>THAT UNFOLDS<br>IN DEPTHS', zh: '深度<br>鋪展<br>的旅程' },
      'courses.body':       { en: "Every diver's path is unique. From your very first breath underwater to mastery of the deep — each program is a chapter in your story.", zh: '每位潛水員的路徑都獨一無二。從水下第一口呼吸到深海精通——每門課程都是你故事裡的一章。' },
      'ch1.script':         { en: 'The World Opens Up', zh: '世界為你敞開' },
      'ch1.body':           { en: 'The world\'s most popular certification. 3–4 days of theory, confined water and 4 open water dives to 18m.', zh: '全球最受歡迎的認證。3-4 天理論課程、平靜水域訓練及 4 次開放水域潛水至 18 米。' },
      'ch2.script':         { en: 'Go Deeper', zh: '更深探索' },
      'ch2.body':           { en: 'Five adventure dives including deep diving to 30m, navigation, and underwater photography.', zh: '五次探險潛水，含深潛至 30 米、導航及水下攝影。' },
      'ch3.script':         { en: 'Lead Others to Safety', zh: '帶領他人安全' },
      'ch3.body':           { en: 'Become the diver others rely on. Accident prevention, self-rescue, and emergency management.', zh: '成為他人信賴的潛水員。事故預防、自救及應急處理。' },
      'ch4.script':         { en: 'Explore Freely', zh: '自由探索' },
      'ch4.body':           { en: "Already certified? Join guided dives across Tioman's 20+ sites. Equipment included.", zh: '已有證照？加入刁曼 20+ 潛點的導潛之旅。裝備包含。' },
      'ch5.script':         { en: 'One Breath. One World.', zh: '一口氣。一個世界。' },
      'cta.whatsapp':       { en: 'Book on WhatsApp', zh: '透過 WhatsApp 預訂' },
      'cta.instagram':      { en: 'DM on Instagram', zh: 'Instagram 私訊' },
      'footer.desc':        { en: 'Professional diving experiences in Tioman Island, Malaysia. PADI-certified courses, fun dives, and underwater adventures since 2010.', zh: '馬來西亞刁曼島專業潛水體驗。PADI 認證課程、歡樂潛與水下探險，自 2010 年起。' },
      'footer.courses':     { en: 'Courses', zh: '課程' },
      'footer.explore':     { en: 'Explore', zh: '探索' },
      'footer.packages':    { en: 'Packages', zh: '配套' },
      'footer.accom':       { en: 'Accommodation', zh: '住宿' },
      'footer.address':     { en: 'Paya Village, Tioman Island, Malaysia', zh: '馬來西亞刁曼島·Paya Village' },
      'footer.instagram':   { en: 'Instagram', zh: 'Instagram' },
      'footer.whatsapp':    { en: 'WhatsApp', zh: 'WhatsApp' },
      'footer.discover':    { en: 'Discover Scuba', zh: '體驗潛水' },
      'footer.ow':          { en: 'Open Water', zh: '開放水域' },
      'footer.aow':         { en: 'Advanced OW', zh: '進階開放水域' },
      'footer.rescue':      { en: 'Rescue Diver', zh: '救援潛水員' },
      'footer.specialty':   { en: 'Specialty Courses', zh: '專長課程' },
      'footer.fundive':      { en: 'Fun Dive', zh: '歡樂潛' },
      'pricing.dive':       { en: 'Enquire on WhatsApp', zh: 'WhatsApp 詢問' }
    };

    function translate(lang) {
      document.documentElement.lang = lang === 'zh' ? 'zh' : 'en';
      document.querySelectorAll('[data-i18n]').forEach(function (el) {
        var key = el.dataset.i18n;
        if (!LANG[key]) return;
        var val = LANG[key][lang];
        if (val === undefined) return;
        if (el.dataset.i18nHtml !== undefined) {
          el.innerHTML = val;
        } else {
          el.textContent = val;
        }
      });
      document.querySelectorAll('#lang-en, #lang-zh, [data-lang]').forEach(function (btn) {
        if (btn.id === 'lang-en' || btn.dataset.lang === 'en') btn.classList.toggle('active', lang === 'en');
        if (btn.id === 'lang-zh' || btn.dataset.lang === 'zh') btn.classList.toggle('active', lang === 'zh');
      });
      try { localStorage.setItem('udive_lang', lang); } catch (err) {}
    }

    document.querySelectorAll('#lang-en, #lang-zh, [data-lang]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var lang = btn.id === 'lang-en' || btn.dataset.lang === 'en' ? 'en' : 'zh';
        translate(lang);
      });
    });

    var saved = null;
    try { saved = localStorage.getItem('udive_lang'); } catch (err) {}
    translate(saved === 'zh' ? 'zh' : 'en');
  })();

  /* ── About Us toggle ── */
  (function () {
    var aboutBtn = document.querySelector('[data-i18n="hero.about"]');
    if (!aboutBtn) return;
    var panel = document.getElementById('heroAboutPanel');
    if (!panel) return;
    var backBtn = document.getElementById('heroAboutBack');
    if (!backBtn) return;
    var mapEl = document.querySelector('.hero__map-hover');

    var eyebrowEl = document.getElementById('heroEyebrow');
    var titleEl = document.getElementById('heroTitle');
    var scriptEl = document.getElementById('heroScript');
    var subEl = document.getElementById('heroSubtitle');

    var orig = {
      eyebrow: eyebrowEl ? (eyebrowEl.getAttribute('data-i18n-orig') || eyebrowEl.textContent || '') : '',
      title: titleEl ? (titleEl.getAttribute('data-i18n-orig') || titleEl.innerHTML || '') : '',
      script: scriptEl ? (scriptEl.getAttribute('data-i18n-orig') || scriptEl.textContent || '') : '',
      sub: subEl ? (subEl.getAttribute('data-i18n-orig') || subEl.textContent || '') : ''
    };
    if (eyebrowEl && !eyebrowEl.getAttribute('data-i18n-orig')) eyebrowEl.setAttribute('data-i18n-orig', orig.eyebrow);
    if (titleEl && !titleEl.getAttribute('data-i18n-orig')) titleEl.setAttribute('data-i18n-orig', orig.title);
    if (scriptEl && !scriptEl.getAttribute('data-i18n-orig')) scriptEl.setAttribute('data-i18n-orig', orig.script);
    if (subEl && !subEl.getAttribute('data-i18n-orig')) subEl.setAttribute('data-i18n-orig', orig.sub);

    var showing = false;

    function fadeLeft(els) {
      if (hasGsap) {
        els.forEach(function (el) { gsap.killTweensOf(el); gsap.set(el, { clearProps: 'transform' }); });
        gsap.fromTo(els, { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' });
      }
    }

    function toggleAbout(e) {
      if (e) e.preventDefault();
      var leftEls = [eyebrowEl, titleEl, scriptEl, subEl].filter(Boolean);

      if (!showing) {
        loadDeferredImages(document.querySelector('.hero'));
        if (eyebrowEl) eyebrowEl.textContent = 'Est. Since 2010';
        if (titleEl) titleEl.innerHTML = 'ABOUT<br>UDIVE';
        if (scriptEl) scriptEl.textContent = '';
        if (subEl) subEl.textContent = '';
        fadeLeft(leftEls);
        panel.classList.add('open');
        if (hasGsap) {
          gsap.killTweensOf(panel);
          var els = panel.querySelectorAll('.hero__about-badges, .hero__about-heading, .hero__about-text, .hero__about-divider, .hero__about-tagline');
          gsap.fromTo(els, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.55, stagger: 0.1, ease: 'power2.out', delay: 0.15 });
        }
        if (mapEl) mapEl.classList.add('visible');
        document.body.classList.add('about-open');
        showing = true;
      } else {
        if (eyebrowEl) eyebrowEl.textContent = orig.eyebrow;
        if (titleEl) titleEl.innerHTML = orig.title;
        if (scriptEl) scriptEl.textContent = orig.script;
        if (subEl) subEl.textContent = orig.sub;
        fadeLeft(leftEls);
        panel.classList.remove('open');
        if (mapEl) mapEl.classList.remove('visible');
        document.body.classList.remove('about-open');
        showing = false;
      }
    }

    aboutBtn.addEventListener('click', toggleAbout);
    backBtn.addEventListener('click', toggleAbout);
  })();

  /* ── Our Event toggle ── */
  (function () {
    var eventBtn = document.querySelector('[data-i18n="hero.event"]');
    var poster = document.getElementById('heroEventPoster');
    if (!eventBtn || !poster) return;

    eventBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      loadDeferredImages(poster.parentNode || document);
      var isOpen = poster.classList.toggle('open');
      if (hasGsap) {
        gsap.killTweensOf(poster);
        gsap.to(poster, { opacity: isOpen ? 1 : 0, duration: isOpen ? 1.2 : 0.4, ease: 'power2.out', overwrite: true });
      } else {
        poster.style.opacity = isOpen ? '1' : '0';
      }
      eventBtn.textContent = isOpen ? 'Close' : (document.documentElement.lang === 'zh' ? '我們的活動' : 'Our Event');
    });
  })();

  /* ── Map pin highlight ── */
  (function () {
    var pins = document.querySelectorAll('.map-pin');
    var cards = document.querySelectorAll('.map-card');
    if (!pins.length || !cards.length || !('IntersectionObserver' in window)) return;
    var cardToPin = { 3: 0, 4: 1 };
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var idx = Array.prototype.indexOf.call(cards, entry.target);
        var pinIdx = cardToPin[idx];
        if (pinIdx !== undefined && pinIdx < pins.length) {
          pins[pinIdx].classList.toggle('visible', entry.isIntersecting);
        }
      });
    }, { threshold: 0.3 });
    cards.forEach(function (c) { observer.observe(c); });
  })();
})();
