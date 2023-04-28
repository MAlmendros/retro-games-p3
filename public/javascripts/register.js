const registerForm = document.getElementById('register-form');
const registerFormFieldsError = document.querySelectorAll('.form-field-error');
const registerResponseError = document.querySelector('.response-error');
const registerResponseErrorMessage = document.querySelector('.response-error-message');

console.log('RegisterModule');

registerForm.addEventListener('submit', (event) => {
    console.log('registerForm');
    console.log('------------------------');

    event.preventDefault();

    // Reseteamos los 'div' de mensajes de error del formulario.
    registerFormFieldsError[0].innerHTML = null;
    registerFormFieldsError[0].classList.remove('d-flex');
    registerFormFieldsError[0].classList.add('d-none');
    registerFormFieldsError[1].innerHTML = '';
    registerFormFieldsError[1].classList.remove('d-flex');
    registerFormFieldsError[1].classList.add('d-none');
    registerFormFieldsError[2].innerHTML = '';
    registerFormFieldsError[2].classList.remove('d-flex');
    registerFormFieldsError[2].classList.add('d-none');
    registerFormFieldsError[3].innerHTML = '';
    registerFormFieldsError[3].classList.remove('d-flex');
    registerFormFieldsError[3].classList.add('d-none');
    
    // Reseteamos el 'div' de error de respuesta de la llamada de register.
    registerResponseErrorMessage.innerHTML = '';
    registerResponseError.classList.remove('d-flex');
    registerResponseError.classList.add('d-none');

    const registerData = new FormData(registerForm);
    const avatar = registerData.get('avatar');
    const email = registerData.get('email');
    const username = registerData.get('username');
    const password = registerData.get('password');

    registerFormFieldsError[0].innerHTML = avatar === null ? 'Elija un avatar' : null;
    registerFormFieldsError[1].innerHTML = email === '' ? 'Este campo es requerido' : '';
    registerFormFieldsError[2].innerHTML = username === '' ? 'Este campo es requerido' : '';
    registerFormFieldsError[3].innerHTML = password === '' ? 'Este campo es requerido' : '';

    if (avatar !== null && email !== '' && username !== '' && password !== '') {
        console.log(avatar, email, username, password);
        const body = { avatar, email, username, password };

        fetch('/api/users', {
            method: "POST",
            body: JSON.stringify(body),
            headers: new Headers({ 'Content-Type':  'application/json' })          
        })
        .then(data => data.json()) 
        .then(response => {
            if (response.status && response.status !== 200) {
                registerResponseErrorMessage.innerHTML = response.message;
                registerResponseError.classList.remove('d-none');
                registerResponseError.classList.add('d-flex');
            }
            else {
                window.localStorage.setItem('retroGamesUser', JSON.stringify(response))
                window.location.href = '/';
            }
        })
        .catch(error => {
            registerResponseErrorMessage.innerHTML = error;
            registerResponseError.classList.remove('d-none');
            registerResponseError.classList.add('d-flex');
        });
    } else {
        if (avatar === null) {
            registerFormFieldsError[0].classList.remove('d-none');
            registerFormFieldsError[0].classList.add('d-flex');
        }

        if (email === '') {
            registerFormFieldsError[1].classList.remove('d-none');
            registerFormFieldsError[1].classList.add('d-flex');
        }

        if (username === '') {
            registerFormFieldsError[2].classList.remove('d-none');
            registerFormFieldsError[2].classList.add('d-flex');
        }

        if (password === '') {
            registerFormFieldsError[3].classList.remove('d-none');
            registerFormFieldsError[3].classList.add('d-flex');
        }
    }

    console.log('------------------------');
})