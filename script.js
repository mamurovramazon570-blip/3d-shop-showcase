(() => {
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const body = document.body;
  const toast = $('.toast');
  const cart = [];

  const notify = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(notify.timer);
    notify.timer = window.setTimeout(() => toast.classList.remove('show'), 2600);
  };

  const syncCart = () => {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    $$('.cart-count').forEach((node) => { node.textContent = cart.length; });
    const list = $('.cart-items');
    if (!list) return;
    list.innerHTML = cart.length
      ? cart.map((item, index) => `<div class="cart-item"><span>${index + 1}. ${item.name}</span><b>$${item.price}</b></div>`).join('')
      : '<p class="empty-cart">Sizning savatingiz hozircha bo‘sh.</p>';
    const totalNode = $('.cart-total strong b');
    if (totalNode) totalNode.textContent = total;
  };

  const openModal = (id) => {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    body.classList.add('modal-open');
  };

  const closeModal = (modal) => {
    const target = modal || $('.modal.open');
    if (!target) return;
    target.classList.remove('open');
    target.setAttribute('aria-hidden', 'true');
    if (!$('.modal.open')) body.classList.remove('modal-open');
  };

  $$('[data-open]').forEach((button) => button.addEventListener('click', () => openModal(button.dataset.open)));
  $$('.modal').forEach((modal) => {
    $$('[data-close]', modal).forEach((button) => button.addEventListener('click', () => closeModal(modal)));
    $('.modal-close', modal)?.addEventListener('click', () => closeModal(modal));
  });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeModal(); });

  $$('.add-btn').forEach((button) => button.addEventListener('click', () => {
    cart.push({ name: button.dataset.add, price: Number(button.dataset.price) });
    syncCart();
    notify(`${button.dataset.add} savatga qo‘shildi ✓`);
  }));

  $$('.quick-view').forEach((button) => button.addEventListener('click', (event) => {
    event.stopPropagation();
    const card = button.closest('.shop-card');
    $('.modal-title').textContent = card.dataset.name;
    $('.modal-price').textContent = `$${card.dataset.price}`;
    $('.modal-add').onclick = () => {
      cart.push({ name: card.dataset.name, price: Number(card.dataset.price) });
      syncCart();
      closeModal();
      notify(`${card.dataset.name} savatga qo‘shildi ✓`);
    };
    openModal('productModal');
  }));

  $$('.filter').forEach((filter) => filter.addEventListener('click', () => {
    $$('.filter').forEach((item) => item.classList.remove('active'));
    filter.classList.add('active');
    const value = filter.dataset.filter;
    $$('.shop-card').forEach((card) => {
      card.style.display = value === 'all' || card.dataset.type === value ? '' : 'none';
    });
  }));

  const navToggle = $('.nav-toggle');
  navToggle?.addEventListener('click', () => {
    const menu = $('.nav-menu');
    const isOpen = menu.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  $$('.nav-menu a').forEach((link) => link.addEventListener('click', () => $('.nav-menu')?.classList.remove('is-open')));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: .12 });
  $$('.reveal').forEach((element) => observer.observe(element));

  let reviewIndex = 0;
  const reviews = $$('.review');
  const showReview = (index) => {
    reviews.forEach((review, i) => review.classList.toggle('active', i === index));
  };
  $('.next-review')?.addEventListener('click', () => {
    reviewIndex = (reviewIndex + 1) % reviews.length;
    showReview(reviewIndex);
  });
  $('.prev-review')?.addEventListener('click', () => {
    reviewIndex = (reviewIndex - 1 + reviews.length) % reviews.length;
    showReview(reviewIndex);
  });
  window.setInterval(() => {
    if (reviews.length) {
      reviewIndex = (reviewIndex + 1) % reviews.length;
      showReview(reviewIndex);
    }
  }, 7000);

  $$('.category-card').forEach((card) => {
    card.addEventListener('click', () => {
      notify(`${card.dataset.category} kategoriyasi tanlandi`);
      document.querySelector('#products')?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  $('.subscribe-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    event.currentTarget.reset();
    notify('Rahmat! Yangiliklar emailingizga yuboriladi ✓');
  });

  $('.checkout-btn')?.addEventListener('click', () => {
    cart.length ? notify('Checkout tez orada ishga tushadi!') : notify('Avval mahsulot tanlang');
  });

  const glow = $('.cursor-glow');
  window.addEventListener('pointermove', (event) => {
    if (glow) {
      glow.style.left = `${event.clientX}px`;
      glow.style.top = `${event.clientY}px`;
    }
  });

  $$('.magnetic').forEach((element) => {
    element.addEventListener('pointermove', (event) => {
      const rect = element.getBoundingClientRect();
      element.style.transform = `translate(${(event.clientX - rect.left - rect.width / 2) * .12}px, ${(event.clientY - rect.top - rect.height / 2) * .12}px)`;
    });
    element.addEventListener('pointerleave', () => { element.style.transform = ''; });
  });

  syncCart();
})();
