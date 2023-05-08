const loginForm = document.getElementById('login-form');
const loginFormFieldsError = document.querySelectorAll('.form-field-error');

const loginResponseError = document.querySelector('.response-error');
const loginResponseErrorMessage = document.querySelector('.response-error-message');

if (window.localStorage.getItem('retroGamesUser') !== null) {
    window.location.href = '/';
}

loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // Reseteamos los 'div' de mensajes de error del formulario.
    loginFormFieldsError[0].innerHTML = '';
    loginFormFieldsError[0].classList.add('d-none');
    loginFormFieldsError[1].innerHTML = '';
    loginFormFieldsError[1].classList.add('d-none');
    
    // Reseteamos el 'div' de error de respuesta de la llamada de login.
    loginResponseErrorMessage.innerHTML = '';
    loginResponseError.classList.remove('d-flex');
    loginResponseError.classList.add('d-none');

    const loginData = new FormData(loginForm);
    const email = loginData.get('email');
    const password = loginData.get('password');

    loginFormFieldsError[0].innerHTML = email === '' ? 'Este campo es requerido' : '';
    loginFormFieldsError[1].innerHTML = password === '' ? 'Este campo es requerido' : '';

    if (email !== '' && password !== '') {
        const body = { email, password };

        fetch('/api/users/login', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: new Headers({ 'Content-Type':  'application/json' })          
        })
        .then(data => data.json()) 
        .then(response => {
            if (response.status && response.status !== 200) {
                loginResponseErrorMessage.innerHTML = response.message;
                loginResponseError.classList.remove('d-none');
                loginResponseError.classList.add('d-flex');
            }
            else {
                window.localStorage.setItem('retroGamesUser', JSON.stringify(response));
                window.location.href = '/';
            }
        })
        .catch(error => {
            loginResponseErrorMessage.innerHTML = error;
            loginResponseError.classList.remove('d-none');
            loginResponseError.classList.add('d-flex');
        });
    } else {
        if (email === '') {
            loginFormFieldsError[0].classList.remove('d-none');
        }

        if (password === '') {
            loginFormFieldsError[1].classList.remove('d-none');
        }
    }
})