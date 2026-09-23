const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const modal = document.getElementById('quickViewModal');
const modalBackdrop = modal?.querySelector('.modal-backdrop');
const closeModalBtn = modal?.querySelector('.close-modal');
const modalButtons = document.querySelectorAll('.modal-btn');
const tiltCards = document.querySelectorAll('.tilt-card');
const slides = document.querySelectorAll('.slide');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');

let currentSlide = 0;

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('is-open');
  });
}

function openModal() {
  if (!modal) return;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
}

modalButtons.forEach((button) => {
  button.addEventListener('click', () => {
    openModal();
  });
});

if (modalBackdrop) {
  modalBackdrop.addEventListener('click', closeModal);
}

if (closeModalBtn) {
  closeModalBtn.addEventListener('click', closeModal);
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal?.classList.contains('is-open')) {
    closeModal();
  }
});

tiltCards.forEach((card) => {
  card.addEventListener('pointermove', (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 18;
    const rotateX = (0.5 - (y / rect.height)) * 18;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener('pointerleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
  });
});

function renderSlide(index) {
  slides.forEach((slide, idx) => {
    slide.classList.toggle('active', idx === index);
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  renderSlide(currentSlide);
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  renderSlide(currentSlide);
}

if (prevBtn && nextBtn && slides.length) {
  prevBtn.addEventListener('click', prevSlide);
  nextBtn.addEventListener('click', nextSlide);

  setInterval(nextSlide, 6000);
}




























































