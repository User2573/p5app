const loginButton = document.getElementById('login');
const loginForm = document.getElementById('form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const verifyInput = document.getElementById('vpassword')
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
toggleLogin.addEventListener('click', () => {
    setLoginPage(!isLoginPage);
    usernameInput.focus();
})






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
const loginSuccessAnimation = async (posX, posY) => new Promise(async resolve => {
    await loginButton.animate(
        {
            filter: ['invert(.4) brightness(2)']
        },
        {
            fill: 'forwards',
            duration: 500,
            easing: 'ease-in'
        }
    ).finished;

    const ripple1 = document.getElementById('ripple1');
    const ripple2 = document.getElementById('ripple2');
    const rect = loginButton.getBoundingClientRect();
    ripple1.style.top = ripple2.style.top = (rect.top + rect.bottom) / 2 + 'px';
    ripple1.style.left = ripple2.style.left = (rect.left + rect.right) / 2 + 'px';
    const size = 4*Math.max(window.innerWidth, window.innerHeight)+'px';
    for (const [ripple, opacity] of [[ripple1, 0], [ripple2, 1]]) {
        console.log(ripple);
        await ripple.animate(
            {
                width: [0, size],
                height: [0, size],
                opacity: [opacity, 1]
            },
            {
                fill: 'forwards',
                duration: 500,
                easing: 'cubic-bezier(1,0,.25,1.75)'
            }
        ).finished;
    }

    resolve();
});

document.getElementsByTagName('h1')[0].onclick = () => {
    usernameInput.value = isLoginPage ? 'adasda' : 'adasds';
    passwordInput.value = verifyInput.value = 'abfhd3fgh';
}








/*
    INPUT VALIDATION
*/



const submitPreliminaries = (username, password, verify, failureCallback) => {
    if (username.length === 0) {
        usernameInput.focus();
        errorOutput.textContent = '\u200b';
        return false;
    }
    if (username.length < 5|| username.length > 20) {
        failureCallback(isLoginPage ?
            'Invalid username.' :
            'Username needs to be between 5 and 20 characters long.');
        usernameInput.focus();
        return false;
    }
    if (!/^[a-zA-z0-9_]+$/.test(username)) {
        failureCallback(isLoginPage ?
            'Invalid username.' :
            'Username can only contain alphanumerical characters and underscores');
        usernameInput.focus();
        return false;
    }
    if (password.length === 0) {
        passwordInput.focus();
        errorOutput.textContent = '\u200b';
        return false;
    }
    if (password.length < 8 || password.length > 30) {
        failureCallback(isLoginPage ?
            'Invalid password.' :
            'Password needs to be between 8 and 30 characters long.');
        passwordInput.focus();
        return false;
    }

    if (isLoginPage)
        return true;

    if (verify.length === 0) {
        verifyInput.focus();
        errorOutput.textContent = '\u200b';
        return false;
    }
    if (verify !== password) {
        failureCallback('Password mismatch.')
        verifyInput.value = '';
        return false;
    }

    return true;
}

const trySubmit = (username, password, successCallback, failureCallback) => {
    loginButton.classList.add('waiting');

    const hash = s => Array.from(s).map(c => c.charCodeAt(0)).reduce((a, b) => (x => x - Math.floor(x))(Math.sin(a*b + b) * 43758.5453123), 0);


    setTimeout(() => {
        loginButton.classList.remove('waiting')
        if (isLoginPage) {
            if (hash(username) >= .3 || hash(password) < .3) {
                failureCallback('Invalid username or password.');
                return;
            }
        }
        else {
            if (hash(username) < .3) {
                failureCallback('Username already taken.');
                usernameInput.focus();
                return;
            };
        }
        loginButton.classList.add('success');
        successCallback();
    }, 500 + 500 * Math.random());
};

loginForm.addEventListener('submit', e => {
    e.preventDefault();
    console.log(e);
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    const verify = verifyInput.value;

    const failureCallback = err => {
        errorOutput.textContent = err;
    };

    if (!submitPreliminaries(username, password, verify, failureCallback))
        return;

    document.activeElement.blur();
    trySubmit(username, password,
        async () => {        
            errorOutput.textContent = '\u200b';
            toggleLogin.textContent = '\u200b';
            usernameInput.disabled = true;
            passwordInput.disabled = true;
            verifyInput.disabled = true;
            await new Promise(resolve => setTimeout(resolve, 800));
            await loginSuccessAnimation();
            sessionStorage.setItem('username', username);
            window.location.href = 'app.html';
        }, failureCallback);
})