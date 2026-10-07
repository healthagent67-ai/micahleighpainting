(() => {
  const header = document.querySelector('[data-header]');
  const body = document.body;

  // header turns solid once the page scrolls
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // mobile menu
  const menuBtn = document.querySelector('[data-menu]');
  const nav = document.getElementById('site-nav');
  if (menuBtn && nav) {
    const setMenu = (open) => {
      body.classList.toggle('menu-open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.querySelector('.menu-label').textContent = open ? 'Close' : 'Menu';
    };
    menuBtn.addEventListener('click', () => setMenu(!body.classList.contains('menu-open')));
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && body.classList.contains('menu-open')) { setMenu(false); menuBtn.focus(); }
    });
    window.matchMedia('(min-width: 961px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });
  }

  // reveal on scroll
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add('in'));
  }

  // recent-work arrows
  const track = document.querySelector('[data-track]');
  document.querySelectorAll('[data-scroll]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!track) return;
      track.scrollBy({ left: Number(btn.dataset.scroll) * track.clientWidth * 0.7, behavior: 'smooth' });
    });
  });

  // quote form
  // Set data-endpoint on the <form> (Formspree, Netlify, etc.) to send real submissions.
  const form = document.querySelector('[data-quote-form]');
  if (form) {
    const status = form.querySelector('.form-status');
    const email = form.querySelector('[name="email"]');
    const emailErr = form.querySelector('#f-email-err');
    const say = (msg, state) => { status.hidden = false; status.dataset.state = state; status.textContent = msg; };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.hidden = true;

      const valid = email.value.trim() !== '' && email.checkValidity();
      email.setAttribute('aria-invalid', String(!valid));
      emailErr.hidden = valid;
      if (!valid) { email.focus(); return; }

      const endpoint = (form.dataset.endpoint || '').trim();
      if (!endpoint) {
        say('This form is not connected yet. To reach Micah Leigh Painting now, call (843) 442-1195.', 'error');
        return;
      }

      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      try {
        const res = await fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error(String(res.status));
        form.reset();
        say('Thanks! We got your details and will be in touch soon.', 'ok');
      } catch {
        say('Something went wrong sending your request. Please call (843) 442-1195.', 'error');
      } finally {
        btn.disabled = false;
      }
    });
  }
})();
