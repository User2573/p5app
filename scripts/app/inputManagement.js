document.getElementById('back').addEventListener('click', () => {
    sessionStorage.removeItem('played');
    window.location.href = 'index.html';
});


document.getElementById('reload').addEventListener('click', () => {
    sessionStorage.removeItem('played');
    window.location.reload();
})