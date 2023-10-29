window.addEventListener('DOMContentLoaded', async () => {
    const username = sessionStorage.getItem('username');
    const animationPlayed = sessionStorage.getItem('played');
    const animationBox = document.getElementById('animation');
    
    if (!username) {
        window.location.replace('login.html');
    }

    if (animationPlayed) {
        const welcomeMessage = document.getElementById('animation-welcome');
        const newParent = document.getElementById('username-display');
        
        sessionStorage.setItem('played', true);
        await new Promise(resolve => setTimeout(resolve, 200));
        
        welcomeMessage.style.opacity = 0;
        welcomeMessage.innerHTML = `Welcome back,<br /><span>${username}</span>`; // username contains only alphanumerical and underscores
        await welcomeMessage.animate(
            {
                top: ['0', '8rem'],
                opacity: [0, 1]
            },
            {
                duration: 1500,
                fill: 'forwards',
                easing: 'cubic-bezier(.25,1,.5,1)'
            }
        ).finished;
            
        
        const child = welcomeMessage.children[1];
        const { top: childT, bottom: childB, left: childL, right: childR } = child.getBoundingClientRect();
        const { top: destT, bottom: destB, left: destL, right: destR } = newParent.getBoundingClientRect();

        child.style.position = 'fixed';
        await child.animate(
            {
                top: [childT+'px', destT+'px'],
                left: [childL+'px', destL+'px']
            },
            {
                duration: 1000,
                fill: 'forwards',
                easing: 'ease-in-out'
            }
        ).finished;

        // await new Promise(r => document.body.onclick = r);

        const outerHeading = document.createElement('h1');
        document.body.appendChild(outerHeading);
        outerHeading.appendChild(child);
        
        await animationBox.animate(
            { opacity: [1, 0] },
            {
                duration: 500,
                fill: 'forwards',
                easing: 'ease-in-out'
            }
        ).finished;
        
        newParent.textContent = '';
        newParent.appendChild(child);
        child.style.position = 'unset';
        outerHeading.remove();
    }

    animationBox.remove();
})


document.getElementById('back').addEventListener('click', () => {
    sessionStorage.removeItem('played');
    window.location.href = 'index.html';
});