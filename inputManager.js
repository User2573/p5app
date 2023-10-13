const loginButton = document.getElementById('login');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

loginButton.onclick = e => {
    e.preventDefault();
    console.log(usernameInput.value);
    console.log(passwordInput.value);
}