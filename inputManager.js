const loginButton = document.getElementById('login');
const loginForm = document.getElementById('form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const errorOutput = document.getElementById('error');




window.addEventListener('DOMContentLoaded', () => {
    usernameInput.focus();
});






/*
    SHOW AND HIDE PASSWORD
*/
const toggleShowPassword = document.getElementById('showpw');
let show = false;
const updateShowPassword = s =>  {
    show = s;
    toggleShowPassword.style.opacity = show ? '1' : '.6';
    toggleShowPassword.textContent = show ? '\ue8f4' : '\ue8f5';
    passwordInput.type = show ? 'text' : 'password';
};
toggleShowPassword.addEventListener('mousedown', e => {
    e.preventDefault();
    updateShowPassword(!show);
});
passwordInput.addEventListener('blur', () => updateShowPassword(false));








/*
    SUCCESS TRANSITION
*/
const loginSuccess = () => {
    errorOutput.textContent = '';
    document.activeElement.blur();
    loginButton.animate([
        
        {
            filter: 'invert(.4) brightness(2)'
        }
    ],
    {
        fill: 'forwards',
        duration: 1000,
        easing: 'cubic-bezier(.7,0,.3,1)'
    })
};

document.getElementsByTagName('h1')[0].addEventListener('click', loginSuccess);








/*
    INPUT VALIDATION
*/
const hash = x => {
    x = Math.sin(x) * 43758.5453123;
    return x - Math.floor(x);
};

const tryLogin = (username, password, successCallback, failureCallback) => {
    if (username.length == 0) {
        failureCallback('Username is empty.');
        usernameInput.focus();
        return;
    }
    if (password.length == 0) {
        failureCallback('Password is empty.');
        passwordInput.focus();
        return;
    }

    loginButton.classList.add('active');

    setTimeout(() => {
        if (Array.from(username + password)
                .map((_, i) => (username + password).charCodeAt(i))
                .reduce((a, b) => hash(a*b + b))
            < .5) {
            failureCallback('Invalid username or password.');
            loginButton.classList.remove('active');
            return;
        }

        loginButton.textContent = '\u200b';
        successCallback();
    }, 500 + 500 * Math.random());
};

loginForm.addEventListener('submit', e => {
    e.preventDefault();
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    tryLogin(username, password, loginSuccess,
        err => { errorOutput.textContent = err; });
})