const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const toast = document.getElementById('toast');
const form = document.getElementById('enquiryForm');
const interest = document.getElementById('interest');
const feedback = document.getElementById('formFeedback');

// Add the gym's verified WhatsApp number here, digits only with country code.
// Example format: 919876543210
const GYM_WHATSAPP_NUMBER = '';

let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3600);
}

menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
});

mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  mainNav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

document.querySelectorAll('[data-plan]').forEach(button => {
  button.addEventListener('click', () => {
    interest.value = button.dataset.plan.includes('Personal Training')
      ? 'Personal Training — 12 sessions / ₹2,000'
      : button.dataset.plan;
    document.getElementById('join').scrollIntoView({ behavior: 'smooth' });
    document.getElementById('name').focus({ preventScroll: true });
  });
});

form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const message = [
    'Hello Fitness Factory 2.0, I would like to make an enquiry.',
    `Name: ${data.get('name')}`,
    `Phone: ${data.get('phone')}`,
    `Interested in: ${data.get('interest')}`,
    data.get('message') ? `Message: ${data.get('message')}` : ''
  ].filter(Boolean).join('\n');

  if (GYM_WHATSAPP_NUMBER && /^\d{10,15}$/.test(GYM_WHATSAPP_NUMBER)) {
    window.open(`https://wa.me/${GYM_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
    feedback.textContent = 'Your enquiry message has been opened in WhatsApp. Please press Send there to contact the gym.';
    showToast('WhatsApp enquiry opened — press Send to submit.');
  } else {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(message).then(() => {
        feedback.textContent = 'Your enquiry has been formatted and copied. Add the gym’s verified WhatsApp number in script.js to enable direct sending.';
        showToast('Enquiry message copied. WhatsApp number needs to be connected.');
      }).catch(() => {
        feedback.textContent = message;
        showToast('Add a verified WhatsApp number to connect this form.');
      });
    } else {
      feedback.textContent = message;
      showToast('Add a verified WhatsApp number to connect this form.');
    }
  }
});

document.getElementById('year').textContent = new Date().getFullYear();
