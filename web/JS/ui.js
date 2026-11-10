export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Devuelve el <span class="error"> de un campo; si no existe, lo crea al final de su .field.
 * Es el mismo elemento y la misma clase que usa sign-up (controllerSignUp.js),
 * así el error se ve igual en las dos páginas.
 */
function getErrorElement(input) {
  const id = `${input.id || input.name}Error`;
  let error = document.getElementById(id);
  if (!error) {
    error = document.createElement('span');
    error.id = id;
    error.className = 'error';
    error.setAttribute('role', 'alert');
    error.hidden = true;
    input.parentElement.appendChild(error);
  }
  return error;
}

/** Marca un campo como no válido (borde rojo) y muestra su mensaje debajo. */
export function showFieldError(input, message) {
  const error = getErrorElement(input);
  error.textContent = message;
  error.hidden = false;
  input.classList.add('invalid');
  input.setAttribute('aria-invalid', 'true');
}

/** Quita el error de un campo. */
export function clearFieldError(input) {
  const error = getErrorElement(input);
  error.textContent = '';
  error.hidden = true;
  input.classList.remove('invalid');
  input.removeAttribute('aria-invalid');
}

/** Muestra una caja de aviso general (.message): error por defecto, verde si lleva .ok. */
export function showBox(box, message) {
  box.textContent = message;
  box.hidden = false;
}

export function hideBox(box) {
  box.hidden = true;
  box.textContent = '';
}
