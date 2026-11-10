// URL del servicio REST de GlassFish (UserFacadeREST, @Path("entities.user")) que guarda el usuario en MySQL
const SIGNUP_URL = '/Proyecto_Cliente/webresources/entities.user';
// Página a la que se va tras registrarse
const NEXT_PAGE = 'sign-in.html';

/**
 * Sign Up Form JavaScript controller.
 * Es el único archivo JS de la página: valida con las reglas que están en sign-up.html
 * (required, type, minlength, pattern, title), crea el XML del usuario y lo envía al
 * servidor, que lo guarda en la tabla user de la base de datos signdb.
 * La única regla que el HTML no puede expresar es que las dos contraseñas coincidan.
 * @type SignUpFormController
 */
class SignUpFormController {

    /**
     * Obtiene los elementos de la página y registra los eventos.
     */
    constructor() {
        // Elementos de la vista
        this.form = document.getElementById('signupForm');
        this.fields = Array.from(this.form.querySelectorAll('input'));
        this.passwordInput = this.form.elements['password'];
        this.confirmInput = this.form.elements['confirm'];
        this.termsInput = this.form.elements['terms'];
        this.submitButton = this.form.querySelector('.signup-btn');
        this.successMessage = document.getElementById('successMessage');
        this.formError = document.getElementById('formError');

        // Eventos
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        for (const input of this.fields) {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        }
        // La casilla de términos se valida en cuanto se marca o desmarca
        this.termsInput.addEventListener('change', () => this.validateField(this.termsInput));
        // Si cambia la contraseña y ya hay confirmación escrita, se vuelve a comprobar
        this.passwordInput.addEventListener('input', () => {
            if (this.confirmInput.value !== '') {
                this.validateField(this.confirmInput);
            }
        });
    }

    // ---------- Validación (reglas leídas del HTML) ----------

    /**
     * Valida un campo con las reglas de su HTML y muestra u oculta su error.
     * @param {HTMLInputElement} input
     * @returns {boolean} true si es válido
     */
    validateField(input) {
        if (input === this.confirmInput) {
            this.checkPasswordsMatch();
        }
        const message = this.getValidationError(input);
        if (message) {
            this.showFieldError(input, message);
            return false;
        }
        this.clearFieldError(input);
        return true;
    }

    /**
     * Devuelve el mensaje de error de un campo según sus atributos HTML, o '' si es válido.
     * @param {HTMLInputElement} input
     * @returns {string}
     */
    getValidationError(input) {
        // Error propio puesto con setCustomValidity (contraseñas distintas)
        if (input.validity.customError) {
            return input.validationMessage;
        }
        const isCheck = input.type === 'checkbox';
        // Las contraseñas no se recortan: los espacios cuentan
        const value = (input.type === 'password' || isCheck) ? input.value : input.value.trim();
        const name = this.getFieldName(input);

        if (input.required && (isCheck ? !input.checked : value === '')) {      // required
            return isCheck ? 'Debes marcar esta casilla' : `${name} es obligatorio`;
        }
        if (!isCheck && value === '') {                                          // opcional y vacío
            return '';
        }
        if (input.validity.typeMismatch) {                                       // type="email"
            return 'Introduce un email válido';
        }
        if (input.minLength > 0 && value.length < input.minLength) {             // minlength
            return `${name}: mínimo ${input.minLength} caracteres`;
        }
        if (input.pattern && !new RegExp(`^(?:${input.pattern})$`).test(value)) { // pattern + title
            return input.title || `${name} no tiene un formato válido`;
        }
        return '';
    }

    /** Nombre legible de un campo: el texto de su <label>. */
    getFieldName(input) {
        const label = document.querySelector(`label[for="${input.id}"]`) ?? input.closest('label');
        return (label?.textContent.trim()) || input.name;
    }

    /**
     * Comprueba que "Confirmar password" coincide con "Password".
     * setCustomValidity pone un error propio en el campo (HTML no puede comparar dos campos).
     */
    checkPasswordsMatch() {
        const differs = this.confirmInput.value !== ''
            && this.confirmInput.value !== this.passwordInput.value;
        this.confirmInput.setCustomValidity(differs ? 'Las contraseñas no coinciden' : '');
    }

    // ---------- Mensajes en pantalla ----------

    /** Devuelve el <span class="error"> del campo; si no existe, lo crea debajo de él. */
    getErrorElement(input) {
        const id = `${input.id || input.name}Error`;
        let error = document.getElementById(id);
        if (!error) {
            error = document.createElement('span');
            error.id = id;
            error.className = 'error';
            error.setAttribute('role', 'alert');
            error.hidden = true;
            (input.closest('label') ?? input).insertAdjacentElement('afterend', error);
        }
        return error;
    }

    /** Marca un campo como no válido y muestra su mensaje. */
    showFieldError(input, message) {
        const error = this.getErrorElement(input);
        error.textContent = message;
        error.hidden = false;
        input.classList.add('invalid');
        input.setAttribute('aria-invalid', 'true');
    }

    /** Quita el error de un campo. */
    clearFieldError(input) {
        const error = this.getErrorElement(input);
        error.textContent = '';
        error.hidden = true;
        input.classList.remove('invalid');
        input.removeAttribute('aria-invalid');
    }

    /** Quita el error de un campo y el aviso general. */
    clearError(input) {
        this.clearFieldError(input);
        this.hideBox(this.formError);
    }

    showBox(box, text) {
        box.textContent = text;
        box.hidden = false;
    }

    hideBox(box) {
        box.textContent = '';
        box.hidden = true;
    }

    // ---------- Envío ----------

    /**
     * Envío del formulario: valida todo y lo guarda en la base de datos.
     * @param {Event} e
     */
    async handleSubmit(e) {
        e.preventDefault();               // evita que el formulario recargue la página
        this.hideBox(this.successMessage);
        this.hideBox(this.formError);

        // Se validan todos los campos (sin cortar en el primero) para mostrar todos los errores
        const results = this.fields.map(input => ({ input, ok: this.validateField(input) }));
        const firstInvalid = results.find(r => !r.ok);
        if (firstInvalid) {
            firstInvalid.input.focus();   // el foco va al primer campo incorrecto
            return;
        }

        // Mientras se espera la respuesta, el botón queda bloqueado
        this.submitButton.disabled = true;
        try {
            await this.saveUser();
            this.showBox(this.successMessage, 'Cuenta creada. Te llevamos al inicio de sesión...');
            setTimeout(() => { window.location.href = NEXT_PAGE; }, 1500);
        } catch (error) {
            this.showBox(this.formError, error.message);
            this.submitButton.disabled = false;
        }
    }

    /**
     * Envía el usuario en XML al servidor (INSERT en signdb.user).
     * Si el servidor responde con error (400, 409, 500...) lanza un Error con su mensaje.
     */
    async saveUser() {
        let response;
        try {
            response = await fetch(SIGNUP_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/xml' },
                body: this.buildXml()
            });
        } catch {
            throw new Error('No se pudo conectar con el servidor. ¿Está arrancado?');
        }
        if (!response.ok) {
            // 500: el servidor no da detalle (por ejemplo, email repetido o fallo de la base de datos)
            throw new Error(response.status >= 500
                ? 'No se pudo crear la cuenta. Puede que el email ya esté registrado'
                : 'No se pudo crear la cuenta (error ' + response.status + ')');
        }
    }

    /** Construye el XML <user> con los datos del formulario. */
    buildXml() {
        const value = (name) => this.form.elements[name].value.trim();
        const data = {
            firstName: value('firstName'),
            lastName: value('lastName'),
            middleInitial: value('middleInitial').toUpperCase(),
            street: value('street'),
            city: value('city'),
            state: value('state'),
            zip: value('zip'),
            phone: value('phone'),
            email: value('email'),
            password: this.passwordInput.value      // sin recortar
        };
        const xml = document.implementation.createDocument(null, 'user');
        for (const [tag, text] of Object.entries(data)) {
            const node = xml.createElement(tag);
            node.textContent = text;                // textContent escapa &, < y > solos
            xml.documentElement.appendChild(node);
        }
        return new XMLSerializer().serializeToString(xml);
    }
}

// Arranque: se crea el controlador cuando la página ya está cargada
new SignUpFormController();