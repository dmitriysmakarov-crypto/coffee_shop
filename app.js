(() => {
  'use strict';
  const scenes = [...document.querySelectorAll('.scene')];
  const ids = ['home', 'coffee', 'desserts'];
  const links = [...document.querySelectorAll('a[href^="#"]')];
  const progress = document.querySelector('#progress');
  const motionButton = document.querySelector('#motion-toggle');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
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
  function draw() {
    queued = false;
    const p = position();
    const current = Math.min(2, Math.floor(p));
    const local = p - current;
    // A scene fades out before the boundary. The next fades in after it.
    // Only one scene is ever visible, including during the transition.
    const opacity = motionOff ? 1 : (current > 0 && local < .13 ? smooth(local / .13) : current < 2 && local > .83 ? 1 - smooth((local - .83) / .17) : 1);
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
      document.querySelectorAll('.header nav a,.scene-dots a').forEach(a => {
        const selected = a.hash === '#' + ids[current];
        a.classList.toggle('active', selected);
        if (selected) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      });
      document.querySelector('#scroll-label').textContent = ['Листайте. Здесь хорошо.', 'Ещё немного сладкого.', 'Вернуться к атмосфере'][current];
    }
    progress.style.width = `${p / 3 * 100}%`;
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
  function navigate(id, focus = false) {
    const index = ids.indexOf(id);
    if (index < 0) return;
    const target = (index + (index ? .19 : 0)) / 3 * maxScroll();
    window.scrollTo({ top: target, behavior: motionOff ? 'instant' : 'smooth' });
    history.replaceState(null, '', '#' + id);
    if (focus) {
      // Move keyboard focus after scrolling has reached the destination.
      let attempts = 0;
      const finish = () => {
        if (Math.abs(scrollY - target) < 3) {
          draw();
          const heading = scenes[index].querySelector('h1,h2');
          heading.setAttribute('tabindex', '-1');
          heading.focus({ preventScroll: true });
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
  const notes = {
    coffee: ['Нежная молочная пена и насыщенный кофе. 200 мл.', 'Чистый вкус кофе с шоколадными нотами. 30 мл.', 'Эспрессо, прохладное молоко и лёд. 300 мл.'],
    desserts: ['Тонкие слои теста и аромат сливочного масла. 80 г.', 'Кремовая текстура и карамельная корочка. 140 г.', 'Насыщенный шоколад и нежный крем. 130 г.']
  };
  const products = {
    coffee: [
      ['cappuccino', 'Одна чашка капучино с латте-артом на деревянном столе'],
      ['espresso', 'Одна маленькая чашка эспрессо с золотистой крема'],
      ['iced-latte', 'Один стакан айс-латте со льдом и молочными слоями']
    ],
    desserts: [
      ['croissant', 'Один золотистый круассан на керамической тарелке'],
      ['cheesecake', 'Один кусочек баскского чизкейка на керамической тарелке'],
      ['chocolate-cake', 'Один кусочек шоколадного торта на керамической тарелке']
    ]
  };
  const swaps = new WeakMap();
  Object.values(products).flat().forEach(([file]) => { const image = new Image(); image.src = `./assets/${file}.webp`; });
  async function changePhoto(kind, index) {
    const scene = scenes[ids.indexOf(kind)];
    const photo = scene.querySelector('.menu-visual>img');
    const token = {};
    swaps.set(photo, token);
    const [file, alt] = products[kind][index];
    const src = `./assets/${file}.webp`;
    const incoming = new Image();
    incoming.src = src;
    try { await incoming.decode(); } catch { return; }
    if (swaps.get(photo) !== token) return;
    photo.style.opacity = motionOff ? '1' : '0';
    if (!motionOff) await new Promise(resolve => setTimeout(resolve, 160));
    if (swaps.get(photo) !== token) return;
    photo.src = src;
    photo.alt = alt;
    photo.style.objectPosition = '50% 50%';
    photo.dataset.product = file;
    scene.querySelector('.menu-steam')?.classList.toggle('cold-drink', file === 'iced-latte');
    await photo.decode().catch(() => {});
    if (swaps.get(photo) !== token) return;
    requestAnimationFrame(() => { if (swaps.get(photo) === token) photo.style.opacity = '1'; });
  }
  document.querySelectorAll('.product').forEach(button => button.addEventListener('click', () => {
    const { kind, index } = button.dataset;
    button.parentElement.querySelectorAll('.product').forEach(item => {
      item.classList.toggle('selected', item === button);
      item.setAttribute('aria-pressed', String(item === button));
    });
    document.querySelector(`#${kind}-note`).textContent = notes[kind][Number(index)];
    changePhoto(kind, Number(index));
  }));
  window.addEventListener('scroll', () => {
    scrollEnergy = Math.min(1, scrollEnergy + Math.abs(scrollY - lastScroll) / 160);
    lastScroll = scrollY;
    schedule();
  }, { passive: true });
  window.addEventListener('resize', schedule);
  if (matchMedia('(pointer:fine)').matches) {
    window.addEventListener('pointermove', e => { pointerX = e.clientX / innerWidth - .5; pointerY = e.clientY / innerHeight - .5; schedule(); }, { passive: true });
  }
  updateMotion(); draw();
  if (ids.includes(location.hash.slice(1))) requestAnimationFrame(() => navigate(location.hash.slice(1)));

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
