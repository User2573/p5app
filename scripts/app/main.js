const username = await new URLSearchParams(window.location.search).get('username');
if (username === null) window.location.replace('login.html');
document.body.innerHTML += ' ' + username;
console.log(username);