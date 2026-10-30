import from {}

class ControladorSignUp {

    constructor() {
        // Elementos de la vista
        
        this.form = document.getElementById('signupForm');
        this.emailImput = document.getElementById('email');
        this.passwordImput = document.getElementById('Password');
        this.passwordConfirm = document.getElementById('confirm');
        this.submitButton = this.form.querySelector('.signup-btn');
        this.succesMessage = document.getElementById('succesMessage');
        this.formError = document.getElementById('formError');
        
        // Añadimos addEventListener
        
         this.form.addEventListener('submit', (e) => this.handleSubmit(e));
         this.termsCheck.addEventListener('change', () => this.validateTerms());
         
    }
}


