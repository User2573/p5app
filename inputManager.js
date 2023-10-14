const loginButton = document.getElementById('login');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const errorOutput = document.getElementById('error');





const toggleShowPassword = document.getElementById('showpw');
let show = false;
const updateShowPassword = s =>  {
    show = s;
    toggleShowPassword.style.opacity = show ? '1' : '.6';
    toggleShowPassword.textContent = show ? '\ue8f4' : '\ue8f5';
    passwordInput.type = show ? 'text' : 'password';
};
toggleShowPassword.addEventListener('click', () => passwordInput.focus());
toggleShowPassword.addEventListener('click', () => updateShowPassword(!show));
passwordInput.addEventListener('blur', () => updateShowPassword(false));





const hash = x => {
    x = Math.sin(x) * 43758.5453123;
    return x - Math.floor(x);
};
const validateUsername = (username, error) => {
    if (username.length < 3) {
        error('Username must be at least 3 characters.');
        return false;
    }
    if (username.length > 15) {
        error('Username must be at most 15 characters.');
        return false;
    }
    if (Array.from(username).some(x => !'abcdef'.includes(x))) {
        error('Username can only contain alphanumeric characters and underscores.');
        return false;
    }
    if (Array.length > 0 &&
        hash((Array.from(username)
            .map(x => x.charCodeAt(0))
            .reduce((a,b) => a + b))
        ) < .3
        ) {
        error('Username already taken.');
        return false;
    };
    return true;
}
loginButton.addEventListener('click', e => {
    e.preventDefault();
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    validateUsername(username, x => {
        errorOutput.textContent = x;
    });
})