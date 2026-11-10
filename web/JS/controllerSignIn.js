import { signIn } from './user-logic.js';
import { EMAIL_PATTERN, showFieldError, clearFieldError, showBox, hideBox } from './ui.js';

// Página a la que se va tras iniciar sesión
const NEXT_PAGE = 'deposits-payments.html';
// Clave de localStorage donde "Recuérdame" guarda el email
const REMEMBER_KEY = 'rememberedEmail';

/**
 * Sign In Form JavaScript controller.
 * Conecta la vista (sign-in.html) con la lógica de usuarios (user-logic.js).
 * @type SignInFormController
 */
class SignInFormController {

    /**
     * Obtiene los elementos de la página y registra los eventos.
     */
    constructor() {
        // Elementos de la vista
        this.form = document.getElementById('loginForm');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.passwordToggle = document.getElementById('passwordToggle');
        this.rememberCheck = this.form.elements['remember'];
        this.submitButton = this.form.querySelector('.login-btn');
        this.successMessage = document.getElementById('successMessage');
        this.formError = document.getElementById('formError');

        // Si el usuario marcó "Recuérdame" la última vez, se rellena el email
        this.loadRememberedEmail();

        // Add event listeners
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.emailInput.addEventListener('blur', () => this.validateEmail());
        this.passwordInput.addEventListener('blur', () => this.validatePassword());
        this.emailInput.addEventListener('input', () => this.clearError('email'));
        this.passwordInput.addEventListener('input', () => this.clearError('password'));
        this.passwordToggle.addEventListener('click', () => this.togglePassword());
    }

    /**
     * Muestra u oculta la contraseña cambiando el type del campo
     * entre "password" y "text".
     */
    togglePassword() {
        const isHidden = this.passwordInput.type === 'password';
        this.passwordInput.type = isHidden ? 'text' : 'password';
        this.passwordToggle.textContent = isHidden ? 'Ocultar' : 'Mostrar';
        this.passwordToggle.setAttribute('aria-pressed', String(isHidden));
    }

    /**
     * Valida el email: obligatorio y con formato correcto.
     * @returns {boolean} true si es válido
     */
    validateEmail() {
        const value = this.emailInput.value.trim();
        if (value === '') {
            showFieldError(this.emailInput, 'El email es obligatorio');
            return false;
        }
        if (!EMAIL_PATTERN.test(value)) {
            showFieldError(this.emailInput, 'Introduce un email válido');
            return false;
        }
        this.clearError('email');
        return true;
    }

    /**
     * Valida la contraseña: obligatoria y de al menos 8 caracteres.
     * @returns {boolean} true si es válida
     */
    validatePassword() {
        const value = this.passwordInput.value;
        if (value === '') {
            showFieldError(this.passwordInput, 'La contraseña es obligatoria');
            return false;
        }
        if (value.length < 8) {
            showFieldError(this.passwordInput, 'Mínimo 8 caracteres');
            return false;
        }
        this.clearError('password');
        return true;
    }

    /**
     * Quita el error de un campo ('email' o 'password').
     * @param {string} field
     */
    clearError(field) {
        const input = field === 'email' ? this.emailInput : this.passwordInput;
        clearFieldError(input);
        hideBox(this.formError);
    }

    /**
     * Envío del formulario: valida los campos e inicia sesión.
     * @param {Event} e
     */
    async handleSubmit(e) {
        e.preventDefault();               // evita que el formulario recargue la página
        hideBox(this.successMessage);
        hideBox(this.formError);

        // Se validan los dos campos (sin cortar en el primero) para mostrar todos los errores
        const emailOk = this.validateEmail();
        const passwordOk = this.validatePassword();
        if (!emailOk || !passwordOk) {
            // el foco va al primer campo incorrecto (igual que en sign-up)
            (emailOk ? this.passwordInput : this.emailInput).focus();
            return;
        }

        // Mientras se espera la respuesta, el botón queda bloqueado
        this.submitButton.disabled = true;
        try {
            const email = this.emailInput.value.trim();
            const user = await signIn(email, this.passwordInput.value);

            this.updateRememberedEmail(email);
            // Datos básicos de la sesión (sin contraseña), válidos mientras esté abierta la pestaña
            sessionStorage.setItem('currentUser', JSON.stringify({
                id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email
            }));
            showBox(this.successMessage, 'Inicio de sesión correcto');
            setTimeout(() => { window.location.href = NEXT_PAGE; }, 800);
        } catch (error) {
            showBox(this.formError, error.message);
            this.submitButton.disabled = false;
        }
    }

    /** Rellena el email guardado por "Recuérdame" (si lo hay). */
    loadRememberedEmail() {
        try {
            const saved = localStorage.getItem(REMEMBER_KEY);
            if (saved) {
                this.emailInput.value = saved;
                this.rememberCheck.checked = true;
            }
        } catch (error) {
            // sin localStorage, "Recuérdame" simplemente no funciona
        }
    }

    /** Guarda el email si "Recuérdame" está marcado; si no, lo borra. */
    updateRememberedEmail(email) {
        try {
            if (this.rememberCheck.checked) {
                localStorage.setItem(REMEMBER_KEY, email);
            } else {
                localStorage.removeItem(REMEMBER_KEY);
            }
        } catch (error) {
            // ver loadRememberedEmail
        }
    }
}

// Arranque: se crea el controlador cuando la página ya está cargada
new SignInFormController();
        
    
    
       

  
    