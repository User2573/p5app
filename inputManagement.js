const loginButton = document.getElementById('login');
const loginForm = document.getElementById('form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const errorOutput = document.getElementById('error');




window.addEventListener('DOMContentLoaded', () => {
    usernameInput.focus();
});





/*
    TOGGLE LOGIN OR SIGN UP
*/
let isLoginPage = false;
const toggleLogin = document.getElementById('togglelogin');
const loginHeader = document.getElementById('login-header');
const signupHeader = document.getElementById('signup-header');
const verifySection = document.getElementById('signup-verify');
const loginSubmit = document.getElementById('login-submit');
const signupSubmit = document.getElementById('signup-submit');
const setLoginPage = state => {
    isLoginPage = state;
    toggleLogin.textContent = isLoginPage ? 'Sign up instead' : 'Log in instead'
    loginHeader.style.display = isLoginPage ? 'unset' : 'none';
    signupHeader.style.display = isLoginPage ? 'none' : 'unset';
    verifySection.style.display = isLoginPage ? 'none' : 'unset';
    loginSubmit.style.display = isLoginPage ? 'unset' : 'none';
    signupSubmit.style.display = isLoginPage ? 'none' : 'unset';
}
toggleLogin.addEventListener('click', () => { setLoginPage(!isLoginPage); })






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
const loginSuccessAnimation = async () => {
    await loginButton.animate([
        
        {
            filter: 'invert(.4) brightness(2)'
        }
    ],
    {
        fill: 'forwards',
        duration: 1000,
        easing: 'cubic-bezier(.3,0,1,.7)'
    }).finished;
};








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

    loginButton.classList.add('waiting');

    setTimeout(() => {
        loginButton.classList.remove('waiting');
        if (Array.from(username + password)
                .map((_, i) => (username + password).charCodeAt(i))
                .reduce((a, b) => hash(a*b + b))
            < .5) {
            failureCallback('Invalid username or password.');
            return;
        }
        loginButton.classList.add('success');
        successCallback();
    }, 500 + 500 * Math.random());
};

loginForm.addEventListener('submit', e => {
    console.log('submitted');
    e.preventDefault();
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    tryLogin(username, password,
        () => {        
            errorOutput.textContent = '';
            document.activeElement.blur();
            setTimeout(loginSuccessAnimation, 300);
        },
        err => {
            errorOutput.textContent = err;
        }
    );
})