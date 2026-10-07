(() => {
  'use strict';
  const scenes = [...document.querySelectorAll('.scene')];
  const ids = ['home', 'coffee', 'desserts'];
  const links = [...document.querySelectorAll('a[href^="#"]')];
  const progress = document.querySelector('#progress');
  const motionButton = document.querySelector('#motion-toggle');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const mobileQuery = matchMedia('(max-width: 760px)');
  let mobile = mobileQuery.matches;
  let mobileIndex = Math.max(0, ids.indexOf(location.hash.slice(1)));
  let sceneTransition = null;
  let hintSeen = false;
  try { hintSeen = localStorage.getItem('fox-coffee-swipe-seen') === '1'; } catch {}
  const swipeHint = document.querySelector('.swipe-hint');
  document.documentElement.classList.toggle('swipe-mobile', mobile);
  let motionOff = reduced.matches;
  let active = -1;
  let queued = false;
  let pointerX = 0, pointerY = 0;
  let lastScroll = scrollY;
  let scrollEnergy = 0;
  const vapor = createVapor();
  const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
  const smooth = v => v * v * (3 - 2 * v);
  const maxScroll = () => Math.max(1, document.querySelector('#journey').offsetHeight - innerHeight);
  const position = () => clamp(scrollY / maxScroll()) * 3;
  function draw(time = performance.now()) {
    queued = false;
    const p = mobile ? mobileIndex + .3 : position();
    let current = mobile ? mobileIndex : Math.min(2, Math.floor(p));
    const local = mobile ? .3 : p - current;
    // A scene fades out before the boundary. The next fades in after it.
    // Only one scene is ever visible, including during the transition.
    let opacity = mobile || motionOff ? 1 : (current > 0 && local < .13 ? smooth(local / .13) : current < 2 && local > .83 ? 1 - smooth((local - .83) / .17) : 1);
    let finishedFocus = false;
    if (mobile && sceneTransition) {
      const t = motionOff ? 1 : clamp((time - sceneTransition.start) / 460);
      if (t < .5) {
        current = sceneTransition.from;
        opacity = 1 - smooth(t * 2);
      } else {
        current = sceneTransition.to;
        opacity = smooth((t - .5) * 2);
      }
      if (t >= 1) {
        mobileIndex = current;
        finishedFocus = sceneTransition.focus;
        sceneTransition = null;
      } else schedule();
    }
    scenes.forEach((scene, i) => {
      const isCurrent = i === current;
      scene.style.opacity = isCurrent ? opacity : 0;
      scene.classList.toggle('is-active', isCurrent);
      scene.inert = !isCurrent;
      scene.setAttribute('aria-hidden', String(!isCurrent));
    });
    if (current !== active) {
      active = current;
      document.body.classList.toggle('light-ui', current > 0);
      document.querySelectorAll('.header nav a,.scene-dots a,.mobile-navigation a').forEach(a => {
        const selected = a.hash === '#' + ids[current];
        a.classList.toggle('active', selected);
        if (selected) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      });
      document.querySelector('#scroll-label').textContent = ['Листайте. Здесь хорошо.', 'Ещё немного сладкого.', 'Вернуться к атмосфере'][current];
      document.querySelector('.scene-announcement').textContent = `${['Атмосфера', 'Кофе', 'Десерты'][current]}, раздел ${current + 1} из 3`;
    }
    swipeHint.hidden = !mobile || hintSeen || current !== 0 || !!sceneTransition;
    progress.style.width = `${mobile ? (current + 1) / 3 * 100 : p / 3 * 100}%`;
    if (finishedFocus) focusHeading(current);
    vapor.update(current === 0 && !motionOff);
    if (!motionOff) {
      const scene = scenes[current];
      const photo = scene.querySelector('.hero-photo img,.menu-visual>img');
      const travel = (clamp(local) - .4) * (current === 0 ? 36 : 20);
      photo.style.transform = `translate(${pointerX * 5}px,${travel + pointerY * 4}px) scale(${1.06 + clamp(local) * .035})`;
      if (current === 0) {
        scene.querySelector('.hero-foreground img').style.transform = `translate(${pointerX * 8}px,${travel + pointerY * 6 + clamp(local) * 17}px) scale(${1.06 + clamp(local) * .035})`;
        scene.querySelector('.hero-copy').style.transform = `translateY(${-clamp(local) * 28}px)`;
        scene.querySelector('.hero-note').style.transform = `translateY(${-clamp(local) * 52}px)`;
      }
      const steam = scene.querySelector('.steam');
      if (steam) steam.style.marginTop = `${-clamp(local) * 38}px`;
      const orbit = scene.querySelector('.orbit');
      if (orbit) orbit.style.transform = `rotate(${-12 + clamp(local) * 35}deg)`;
    }
  }
  function schedule() { if (!queued) { queued = true; requestAnimationFrame(draw); } }
  function focusHeading(index) {
    const heading = scenes[index].querySelector('h1,h2');
    heading.setAttribute('tabindex', '-1');
    heading.focus({ preventScroll: true });
  }
  function dismissHint() {
    hintSeen = true;
    swipeHint.hidden = true;
    try { localStorage.setItem('fox-coffee-swipe-seen', '1'); } catch {}
  }
  function navigate(id, focus = false) {
    const index = ids.indexOf(id);
    if (index < 0) return;
    if (mobile) {
      if (sceneTransition) return;
      dismissHint();
      if (index !== mobileIndex) {
        if (motionOff) { mobileIndex = index; draw(); if (focus) focusHeading(index); }
        else { sceneTransition = { from: mobileIndex, to: index, start: performance.now(), focus }; schedule(); }
      } else if (focus) focusHeading(index);
      history.replaceState(null, '', '#' + id);
      return;
    }
    const target = (index + (index ? .19 : 0)) / 3 * maxScroll();
    window.scrollTo({ top: target, behavior: motionOff ? 'instant' : 'smooth' });
    history.replaceState(null, '', '#' + id);
    if (focus) {
      // Move keyboard focus after scrolling has reached the destination.
      let attempts = 0;
      const finish = () => {
        if (Math.abs(scrollY - target) < 3) {
          draw();
          focusHeading(index);
        } else if (++attempts < 150) requestAnimationFrame(finish);
      };
      requestAnimationFrame(finish);
    }
  }
  links.forEach(link => link.addEventListener('click', e => {
    const id = link.hash.slice(1);
    if (ids.includes(id) || id === 'coffee-title') {
      e.preventDefault(); navigate(id === 'coffee-title' ? 'coffee' : id, e.detail === 0 || id === 'coffee-title');
    }
  }));
  document.querySelector('#next-scene').addEventListener('click', () => navigate(ids[(active + 1) % 3]));
  function updateMotion() {
    document.body.classList.toggle('motion-off', motionOff);
    motionButton.setAttribute('aria-pressed', String(motionOff));
    motionButton.setAttribute('aria-label', motionOff ? 'Включить анимацию' : 'Отключить анимацию');
    motionButton.firstElementChild.textContent = motionOff ? '▷' : 'Ⅱ';
    if (motionOff) document.querySelectorAll('.hero-photo img,.hero-foreground img,.menu-visual>img,.hero-copy,.hero-note,.orbit').forEach(el => el.style.removeProperty('transform'));
    schedule();
  }
  motionButton.addEventListener('click', () => { motionOff = !motionOff; updateMotion(); });
  reduced.addEventListener('change', e => { motionOff = e.matches; updateMotion(); });
  const menu = window.FOX_MENU;
  const selections = { coffee: menu.products.coffee[0].id, desserts: menu.products.desserts[0].id };
  const swaps = new WeakMap();
  let chosenOffer = null;
  const findProduct = (kind, id) => menu.products[kind].find(p => p.id === id);
  const opposite = kind => kind === 'coffee' ? 'desserts' : 'coffee';
  const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function cardHTML(p, selected) {
    return '<button class="product-card' + (selected ? ' selected' : '') + '" data-product="' + p.id + '" aria-pressed="' + selected + '"><img src="' + p.image + '" alt="" width="160" height="120"><span class="card-name">' + escapeHTML(p.name) + '</span><span class="card-meta">' + p.size + '<strong>' + p.price + ' ₽</strong></span></button>';
  }
  function renderCategory(kind, category) {
    const scene = document.getElementById(kind);
    scene.querySelectorAll('[data-category]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.category === category)));
    scene.querySelector('.product-grid').innerHTML = menu.products[kind].filter(p => p.category === category).map(p => cardHTML(p, p.id === selections[kind])).join('');
  }
  function updatePair(kind, product) {
    const pairKind = opposite(kind);
    const pairId = chosenOffer ? chosenOffer[pairKind === 'coffee' ? 'coffee' : 'dessert'] : product.pair;
    const pair = findProduct(pairKind, pairId);
    const button = document.getElementById(kind).querySelector('.pairing');
    button.dataset.pair = pair.id;
    button.querySelector('img').src = pair.image;
    button.querySelector('strong').textContent = pair.name;
    button.querySelector('small').textContent = chosenOffer ? chosenOffer.name : kind === 'coffee' ? 'К этой чашке' : 'К этому десерту';
    button.setAttribute('aria-label', 'Посмотреть ' + pair.name);
  }
  async function changePhoto(kind, product) {
    const scene = document.getElementById(kind);
    const photo = scene.querySelector('.menu-visual>img');
    const token = {};
    swaps.set(photo, token);
    const incoming = new Image();
    incoming.src = product.image;
    try { await incoming.decode(); } catch { return; }
    if (swaps.get(photo) !== token) return;
    if (!motionOff) {
      photo.style.opacity = '0';
      await new Promise(resolve => setTimeout(resolve, 140));
    }
    if (swaps.get(photo) !== token) return;
    photo.src = product.image;
    photo.alt = product.alt;
    photo.dataset.product = product.id;
    await photo.decode().catch(() => {});
    if (swaps.get(photo) !== token) return;
    scene.querySelector('.photo-caption h3').textContent = product.name;
    scene.querySelector('.photo-caption p').textContent = product.tagline;
    scene.querySelector('.photo-price').textContent = product.price + ' ₽';
    scene.querySelector('.photo-index').textContent = String(menu.products[kind].indexOf(product) + 1).padStart(2, '0') + ' / ' + String(menu.products[kind].length).padStart(2, '0');
    scene.querySelector('.photo-badge').textContent = product.badge || (kind === 'coffee' ? product.size : 'К вашему кофе');
    requestAnimationFrame(() => { if (swaps.get(photo) === token) photo.style.opacity = '1'; });
  }
  function selectProduct(kind, id, keepOffer = false) {
    const product = findProduct(kind, id);
    if (!product) return;
    if (!keepOffer) chosenOffer = null;
    selections[kind] = id;
    const scene = document.getElementById(kind);
    renderCategory(kind, product.category);
    scene.querySelector('.detail-heading h3').textContent = product.name;
    scene.querySelector('.detail-heading>span').textContent = product.size + ' · ' + product.price + ' ₽';
    scene.querySelector('.tasting-note').textContent = product.description;
    scene.querySelector('.ingredient-text').textContent = product.ingredients;
    scene.querySelector('.allergen-text').textContent = product.allergens;
    scene.querySelector('.ingredients').open = false;
    for (const section of ['coffee', 'desserts']) updatePair(section, findProduct(section, selections[section]));
    changePhoto(kind, product);
  }
  for (const kind of ['coffee', 'desserts']) {
    const scene = document.getElementById(kind);
    scene.querySelector('.category-tabs').innerHTML = menu.categories[kind].map(category => '<button data-category="' + category.id + '" aria-pressed="false">' + escapeHTML(category.name) + '<span>' + menu.products[kind].filter(p => p.category === category.id).length + '</span></button>').join('');
    scene.querySelector('.category-tabs').addEventListener('click', e => {
      const button = e.target.closest('[data-category]');
      if (!button || button.getAttribute('aria-pressed') === 'true') return;
      const product = menu.products[kind].find(p => p.category === button.dataset.category);
      selectProduct(kind, product.id);
    });
    scene.querySelector('.product-grid').addEventListener('click', e => {
      const button = e.target.closest('[data-product]');
      if (!button) return;
      const id = button.dataset.product;
      selectProduct(kind, id);
      if (e.detail === 0) scene.querySelector('.product-card[data-product="' + id + '"]').focus({ preventScroll: true });
      else if (mobile) scene.scrollTo({ top: 0, behavior: motionOff ? 'instant' : 'smooth' });
    });
    scene.querySelector('.pairing').addEventListener('click', e => {
      const targetKind = opposite(kind);
      selectProduct(targetKind, e.currentTarget.dataset.pair, !!chosenOffer);
      document.getElementById(targetKind).scrollTop = 0;
      document.getElementById(targetKind).querySelector('.menu-copy').scrollTop = 0;
      navigate(targetKind, e.detail === 0);
    });
  }
  const offersDialog = document.querySelector('.offers-dialog');
  offersDialog.querySelector('.offer-grid').innerHTML = menu.offers.map(offer => {
    const coffee = findProduct('coffee', offer.coffee), dessert = findProduct('desserts', offer.dessert);
    const total = (coffee.price + dessert.price) * offer.count;
    return '<article class="offer-card"><div class="offer-images"><img src="' + coffee.image + '" alt="' + escapeHTML(coffee.name) + '"><img src="' + dessert.image + '" alt="' + escapeHTML(dessert.name) + '"></div><h3>' + escapeHTML(offer.name) + '</h3><p>' + escapeHTML(offer.caption) + '</p><div><strong>' + total + ' ₽</strong><span>' + (offer.count === 2 ? 'На двоих' : 'Напиток + десерт') + '</span></div><button data-offer="' + offer.id + '">Посмотреть сочетание <span aria-hidden="true">↗</span></button></article>';
  }).join('');
  for (const kind of ['coffee', 'desserts']) selectProduct(kind, selections[kind]);
  document.querySelectorAll('.offers-button').forEach(button => button.addEventListener('click', () => {
    offersDialog.showModal();
    document.documentElement.classList.add('dialog-open');
  }));
  const closeOffers = () => offersDialog.close();
  offersDialog.querySelector('.dialog-close').addEventListener('click', closeOffers);
  offersDialog.addEventListener('close', () => document.documentElement.classList.remove('dialog-open'));
  offersDialog.addEventListener('click', e => {
    if (e.target === offersDialog) {
      const r = offersDialog.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeOffers();
    }
    const button = e.target.closest('[data-offer]');
    if (!button) return;
    chosenOffer = menu.offers.find(offer => offer.id === button.dataset.offer);
    selectProduct('coffee', chosenOffer.coffee, true);
    selectProduct('desserts', chosenOffer.dessert, true);
    closeOffers();
    document.getElementById('coffee').scrollTop = 0;
    document.querySelector('#coffee .menu-copy').scrollTop = 0;
    navigate('coffee', e.detail === 0);
  });
  const preload = () => Object.values(menu.products).flat().forEach(product => {
    const image = new Image(); image.src = product.image;
  });
  if ('requestIdleCallback' in window) requestIdleCallback(preload, { timeout: 2000 }); else setTimeout(preload, 600);
  window.addEventListener('scroll', () => {
    scrollEnergy = Math.min(1, scrollEnergy + Math.abs(scrollY - lastScroll) / 160);
    lastScroll = scrollY;
    schedule();
  }, { passive: true });
  window.addEventListener('resize', schedule);
  mobileQuery.addEventListener('change', e => {
    const index = sceneTransition ? sceneTransition.to : Math.max(0, active);
    sceneTransition = null;
    mobile = e.matches;
    mobileIndex = index;
    document.documentElement.classList.toggle('swipe-mobile', mobile);
    active = -1;
    window.scrollTo({ top: mobile ? 0 : (index + (index ? .19 : 0)) / 3 * maxScroll(), behavior: 'instant' });
    pointerX = 0; pointerY = 0;
    schedule();
  });
  let gesture = null;
  let suppressClickUntil = 0;
  const stage = document.querySelector('.stage');
  stage.addEventListener('pointerdown', e => {
    if (mobile && e.isPrimary && e.pointerType !== 'mouse') suppressClickUntil = 0;
    if (!mobile || sceneTransition || e.pointerType === 'mouse' || !e.isPrimary || e.clientX < 24 || e.clientX > innerWidth - 24) return;
    gesture = { id: e.pointerId, x: e.clientX, y: e.clientY, start: performance.now(), direction: null };
  });
  stage.addEventListener('pointermove', e => {
    if (!gesture || gesture.id !== e.pointerId) return;
    const dx = e.clientX - gesture.x, dy = e.clientY - gesture.y;
    if (!gesture.direction && Math.max(Math.abs(dx), Math.abs(dy)) > 12) {
      if (Math.abs(dx) > Math.abs(dy) * 1.35) gesture.direction = 'horizontal';
      else if (Math.abs(dy) > Math.abs(dx)) gesture = null;
    }
    if (gesture?.direction === 'horizontal') {
      suppressClickUntil = performance.now() + 500;
      if (mobileIndex === 0) scrollEnergy = Math.min(1, Math.abs(dx) / 100);
    }
  });
  stage.addEventListener('pointerup', e => {
    if (!gesture || gesture.id !== e.pointerId) return;
    const dx = e.clientX - gesture.x, dy = e.clientY - gesture.y;
    const duration = Math.max(1, performance.now() - gesture.start);
    const horizontal = gesture.direction === 'horizontal' || Math.abs(dx) > Math.abs(dy) * 1.35;
    gesture = null;
    if (!horizontal || Math.abs(dx) < 26 || (Math.abs(dx) < 48 && Math.abs(dx) / duration < .35)) return;
    suppressClickUntil = performance.now() + 500;
    const next = mobileIndex + (dx < 0 ? 1 : -1);
    if (next >= 0 && next < ids.length) navigate(ids[next]);
  });
  stage.addEventListener('pointercancel', () => { gesture = null; });
  stage.addEventListener('click', e => {
    if (mobile && performance.now() < suppressClickUntil && e.detail !== 0) { e.preventDefault(); e.stopImmediatePropagation(); }
  }, true);
  window.addEventListener('hashchange', () => { if (ids.includes(location.hash.slice(1))) navigate(location.hash.slice(1)); });
  if (matchMedia('(pointer:fine)').matches) {
    window.addEventListener('pointermove', e => { pointerX = e.clientX / innerWidth - .5; pointerY = e.clientY / innerHeight - .5; schedule(); }, { passive: true });
  }
  updateMotion(); draw();
  if (!mobile && ids.includes(location.hash.slice(1))) requestAnimationFrame(() => navigate(location.hash.slice(1)));

  function createVapor() {
    const canvas = document.querySelector('.coffee-vapor');
    const ctx = canvas.getContext('2d');
    let running = false, frame = 0, previous = 0;
    const wisps = Array.from({ length: 24 }, (_, i) => ({
      cup: i % 2, phase: (i * .618033) % 1,
      drift: Math.sin(i * 7.13), speed: .14 + (i % 5) * .016
    }));
    function render(time) {
      if (!running || document.hidden) { frame = 0; return; }
      const delta = Math.min(.05, (time - (previous || time)) / 1000);
      previous = time;
      scrollEnergy *= Math.exp(-delta * 2.2);
      const width = canvas.clientWidth, height = canvas.clientHeight;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
        canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      // Map the actual cup rims through object-fit, responsive crop and parallax.
      const image = document.querySelector('.hero-foreground img');
      const rect = image.getBoundingClientRect();
      const scale = Math.max(rect.width / 1536, rect.height / 1024);
      const iw = 1536 * scale, ih = 1024 * scale;
      const cropX = (rect.width - iw) * (innerWidth <= 760 ? .66 : .65);
      const cropY = (rect.height - ih) * .5;
      const rims = [[.537, .598], [.697, .576]];
      ctx.filter = 'blur(2px)';
      for (const wisp of wisps) {
        wisp.phase = (wisp.phase + delta * wisp.speed * (1 + scrollEnergy * .55)) % 1;
        const phase = wisp.phase;
        const [rx, ry] = rims[wisp.cup];
        const x = rect.left + cropX + rx * iw;
        const y = rect.top + cropY + ry * ih;
        const rise = Math.min(150, iw * .09) * (.65 + phase * .6);
        const base = y - phase * rise;
        const opacity = Math.sin(phase * Math.PI) * (.10 + scrollEnergy * .09);
        const gradient = ctx.createLinearGradient(x, base, x, base - rise * .65);
        gradient.addColorStop(0, `rgba(255,249,235,${opacity * .3})`);
        gradient.addColorStop(.3, `rgba(255,249,235,${opacity})`);
        gradient.addColorStop(1, 'rgba(255,249,235,0)');
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2 + phase * 3;
        ctx.lineCap = 'round';
        ctx.beginPath();
        for (let step = 0; step <= 18; step++) {
          const t = step / 18;
          const spread = (4 + phase * 12) * wisp.drift;
          const px = x + spread + Math.sin(t * 7 + time / 1800 + wisp.drift * 3) * t * (9 + phase * 10);
          const py = base - t * rise * .65;
          if (!step) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }
      ctx.filter = 'none';
      frame = requestAnimationFrame(render);
    }
    document.addEventListener('visibilitychange', () => { if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else if (running && !frame) { previous = 0; frame = requestAnimationFrame(render); } });
    return { update(enabled) {
      running = enabled;
      if (enabled && !frame && !document.hidden) { previous = 0; frame = requestAnimationFrame(render); }
      if (!enabled) { cancelAnimationFrame(frame); frame = 0; ctx.clearRect(0, 0, canvas.width, canvas.height); }
    } };
  }
})();
