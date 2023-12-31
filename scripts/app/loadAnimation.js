import { startAnimation } from './app.js';

const username = sessionStorage.getItem('username');
const animationPlayed = sessionStorage.getItem('played');
const animationBox = document.getElementById('animation');

if (!username) {
    window.location.replace('index.html');
}

if (!animationPlayed) {
    sessionStorage.setItem('played', true);
    const welcomeMessage = document.getElementById('animation-welcome');
    const newParent = document.getElementById('username-display');
    
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
            left: [childL+'px', destL+'px'],
            fontSize: ['2rem', '1.5rem']
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
else {
    document.getElementById('username-display').textContent = username;
}

startAnimation();

animationBox.remove();
