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
toggleShowPassword.addEventListener('mousedown', e => {
    e.preventDefault();
    updateShowPassword(!show);
});
passwordInput.addEventListener('blur', () => updateShowPassword(false));





const hash = x => {
    x = Math.sin(x) * 43758.5453123;
    return x - Math.floor(x);
};
const validateUsername = (username, error) => {
    if (username.length < 3) {
        error('Username too short.');
        return false;
    }
    if (username.length > 20) {
        error('Username too long.');
        return false;
    }
    if (!/^[a-zA-z0-9_]+$/.test(username)) {
        error('Username can only contain alphanumeric characters and underscores.');
        return false;
    }
    if (hash((Array.from(username)
            .map(x => x.charCodeAt(0))
            .reduce((a,b) => a + b))) < .3) {
        error('Username already taken.');
        return false;
    };
    return true;
};

const validatePassword = (password, error) => {
    if (password.length < 5) {
        error('Password too short.');
        return false;
    }
    if (password.length > 30) {
        error('Password too long.');
        return false;
    }
    return true;
};

loginButton.addEventListener('click', e => {
    e.preventDefault();
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    const error = s => errorOutput.textContent = s;
    if (validateUsername(username, error) &&
        validatePassword(password, error)) {
        loginSuccess();
    }
})

const loginSuccess = () => {
    errorOutput.textContent = 'succ';
};