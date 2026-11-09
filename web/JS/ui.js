export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function showFieldError(input, message) {
  input.classList.add('invalid');
  let msg = input.parentElement.querySelector('.field-error');
  if (!msg) {
    msg = document.createElement('small');
    msg.className = 'field-error';
    input.insertAdjacentElement('afterend', msg);
  }
  msg.textContent = message;
}

export function clearFieldError(input) {
  input.classList.remove('invalid');
  const msg = input.parentElement.querySelector('.field-error');
  if (msg) msg.remove();
}

export function showBox(box, message) {
  box.textContent = message;
  box.hidden = false;
}

export function hideBox(box) {
  box.hidden = true;
  box.textContent = '';
}

