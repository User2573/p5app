const loginButton = document.getElementById('login');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

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


loginButton.addEventListener('click', e => {
    e.preventDefault();
    console.log(usernameInput.value);
    console.log(passwordInput.value);
})