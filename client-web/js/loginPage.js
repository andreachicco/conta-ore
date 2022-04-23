import auth from './auth.js';

function getUser() {
    const usernameInput = document.querySelector('#username');
    const passwordInput = document.querySelector('#password');
    
    const user = {
        username: usernameInput.value,
        password: passwordInput.value 
    };
    
    return user;
}


function init() {

    const token = localStorage.getItem('jwtToken');

    if(token) {
        document.location.replace('http://localhost:5500/client-web/index.html');
        return;
    }

    const loginForm = document.querySelector('.login-form');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const user = getUser();

        try {
            await auth.login(user);
            document.location.replace('http://localhost:5500/client-web/index.html');
        } catch (error) {
            console.error(error.message);
            const errorParagraph = document.querySelector('.error');
            errorParagraph.innerText = error.message;

            setTimeout(() => {
                errorParagraph.innerText = '';
            }, 5000);
        }

        loginForm.reset();
    });

}

init();