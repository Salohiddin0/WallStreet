(() => {
  const translations = window.WS_TRANSLATIONS;
  const courses = [
    { id: 1, icon: 'A', level: 'A1', symbol: '01' },
    { id: 2, icon: 'B', level: 'A2', symbol: '02' },
    { id: 3, icon: '↗', level: 'B1', symbol: '03' },
    { id: 4, icon: '◎', level: 'B1+', symbol: '04' },
    { id: 5, icon: '✳', level: 'B2', symbol: '05' },
    { id: 6, icon: 'IELTS', level: 'EXAM', symbol: '06' },
  ];
  const monthNames = {
    uz: ['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentabr','Oktabr','Noyabr','Dekabr'],
    ru: ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
    en: ['January','February','March','April','May','June','July','August','September','October','November','December'],
  };
  let language = 'uz';
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

  function renderCourses() {
    const copy = translations[language];
    $('#course-grid').innerHTML = courses.map(({ id, icon, level, symbol }) => `
      <article class="course-card"><div class="course-top"><span class="course-icon">${icon}</span><span class="level-pill">${copy.level} ${level}</span></div>
      <h3>${copy[`course${id}`]}</h3><p>${copy[`course${id}d`]}</p>
      <div class="course-meta"><div>${copy.suitable}<b>${copy[`course${id}who`]}</b></div><div>${copy.benefits}<b>${copy[`course${id}benefit`]}</b></div></div>
      <a href="#trial" class="course-cta" data-course="${id}">${copy.join}<span>↗</span></a></article>`).join('');
    const select = $('#course-select');
    const selected = select.value;
    select.innerHTML = `<option value="">${copy.selectCourse}</option>` + courses.map(({ id }) => `<option value="${id}">${copy[`course${id}`]}</option>`).join('');
    if (selected) select.value = selected;
  }

  function applyLanguage(next) {
    language = translations[next] ? next : 'uz';
    const copy = translations[language];
    document.documentElement.lang = language;
    $('#language').value = language;
    $$('[data-i18n]').forEach((node) => {
      const value = copy[node.dataset.i18n];
      if (value !== undefined) node.innerHTML = value;
    });
    $$('[data-placeholder]').forEach((node) => {
      const value = copy[node.dataset.placeholder];
      if (value !== undefined) node.placeholder = value;
    });
    $('#year-filter option[value="all"]').textContent = copy.allYears;
    const monthFilter = $('#month-filter');
    const selectedMonth = monthFilter.value;
    monthFilter.innerHTML = `<option value="all">${copy.allMonths}</option>` + monthNames[language].map((month, index) => `<option value="${String(index + 1).padStart(2, '0')}">${month}</option>`).join('');
    monthFilter.value = selectedMonth;
    renderCourses();
    renderCertificates();
    localStorage.setItem('wall-street-language', language);
  }

  function setupFilters() {
    const certificates = window.WS_CERTIFICATES || [];
    const years = [...new Set(certificates.map((item) => String(item.year)))].sort((a, b) => b - a);
    $('#year-filter').insertAdjacentHTML('beforeend', years.map((year) => `<option value="${year}">${year}</option>`).join(''));
    $('#month-filter').insertAdjacentHTML('beforeend', monthNames.uz.map((month, index) => `<option value="${String(index + 1).padStart(2, '0')}">${month}</option>`).join(''));
  }

  function renderCertificates() {
    const copy = translations[language];
    const year = $('#year-filter').value;
    const month = $('#month-filter').value;
    const data = (window.WS_CERTIFICATES || []).filter((item) => (year === 'all' || String(item.year) === year) && (month === 'all' || String(item.month).padStart(2, '0') === month));
    const track = $('#certificate-track');
    if (!data.length) {
      track.innerHTML = `<div class="empty-gallery">${copy.emptyGallery}</div>`;
      $('#gallery-count').textContent = '';
      $('#gallery-pagination').innerHTML = '';
      return;
    }
    track.innerHTML = data.map((item) => {
      const monthName = monthNames[language][Number(item.month) - 1] || '';
      const title = [item.student, item.title].filter(Boolean).join(' — ');
      return `<button class="certificate-card" type="button" data-src="${item.src}" data-title="${title}" aria-label="${title}"><img src="${item.src}" alt="${title}" loading="lazy"><span class="certificate-info"><b>${item.student || ''}</b><span>${item.title || ''} · ${monthName} ${item.year}</span></span></button>`;
    }).join('');
    $('#gallery-count').textContent = `${data.length}`;
    $('#gallery-pagination').innerHTML = data.map((item, index) => `<button class="gallery-dot${index === 0 ? ' active' : ''}" type="button" aria-label="Certificate ${index + 1}" aria-current="${index === 0 ? 'true' : 'false'}" data-slide="${index}"></button>`).join('');
  }

  function setupMenu() {
    const toggle = $('.menu-toggle');
    const menu = $('.nav-menu');
    const close = () => { toggle.setAttribute('aria-expanded', 'false'); menu.classList.remove('open'); };
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      menu.classList.toggle('open', open);
    });
    $$('.nav-menu a').forEach((link) => link.addEventListener('click', close));
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') close(); });
  }

  function setupForm() {
    const form = $('#trial-form');
    const message = $('#form-message');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const copy = translations[language];
      const name = $('#full-name').value.trim();
      const phone = $('#phone').value.trim();
      const digits = phone.replace(/\D/g, '');
      const course = $('#course-select').value;
      message.classList.remove('success');
      if (name.length < 2 || !course || digits.length < 9 || digits.length > 15) {
        message.textContent = digits.length < 9 || digits.length > 15 ? copy.formInvalidPhone : copy.formError;
        return;
      }
      message.textContent = copy.formSuccess;
      message.classList.add('success');
    });
    form.addEventListener('input', () => { message.textContent = ''; message.classList.remove('success'); });
  }

  function setupGallery() {
    $('#year-filter').addEventListener('change', renderCertificates);
    $('#month-filter').addEventListener('change', renderCertificates);
    $('#prev-certificate').addEventListener('click', () => $('#certificate-track').scrollBy({ left: -300, behavior: 'smooth' }));
    $('#next-certificate').addEventListener('click', () => $('#certificate-track').scrollBy({ left: 300, behavior: 'smooth' }));
    const track = $('#certificate-track');
    const pagination = $('#gallery-pagination');
    pagination.addEventListener('click', (event) => {
      const dot = event.target.closest('[data-slide]');
      const card = track.querySelectorAll('.certificate-card')[Number(dot?.dataset.slide)];
      if (card) track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: 'smooth' });
    });
    track.addEventListener('scroll', () => {
      const cards = [...track.querySelectorAll('.certificate-card')];
      if (!cards.length) return;
      const current = cards.reduce((best, card, index) => Math.abs(card.offsetLeft - track.offsetLeft - track.scrollLeft) < Math.abs(cards[best].offsetLeft - track.offsetLeft - track.scrollLeft) ? index : best, 0);
      $$('.gallery-dot', pagination).forEach((dot, index) => {
        dot.classList.toggle('active', index === current);
        dot.setAttribute('aria-current', String(index === current));
      });
    }, { passive: true });
    const dialog = $('#lightbox');
    $('#certificate-track').addEventListener('click', (event) => {
      const card = event.target.closest('.certificate-card');
      if (!card) return;
      $('img', dialog).src = card.dataset.src;
      $('img', dialog).alt = card.dataset.title;
      $('p', dialog).textContent = card.dataset.title;
      dialog.showModal();
    });
    $('.lightbox-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  }

  function setupBackToTop() {
    const button = $('#back-to-top');
    window.addEventListener('scroll', () => button.classList.toggle('visible', window.scrollY > 500), { passive: true });
    button.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  setupFilters();
  setupMenu();
  setupForm();
  setupGallery();
  setupBackToTop();
  $('#language').addEventListener('change', (event) => applyLanguage(event.target.value));
  $$('.course-grid').forEach((grid) => grid.addEventListener('click', (event) => {
    const link = event.target.closest('[data-course]');
    if (link) $('#course-select').value = link.dataset.course;
  }));
  applyLanguage(localStorage.getItem('wall-street-language') || 'uz');
})();
