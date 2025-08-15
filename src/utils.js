/**
 * @file utils.js
 * @description Utility functions for the portfolio website, such as custom cursor and scrollbar logic.
 */

export function initCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'cursor';
    document.body.appendChild(cursor);

    let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;
    const speed = 0.1;

    function animate() {
        cursorX += (mouseX - cursorX) * speed;
        cursorY += (mouseY - cursorY) * speed;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    document.addEventListener('mouseover', (e) => {
        if (e.target.closest('a, button, .router-link, .view-pdf-btn, .toggle-summary')) {
            cursor.classList.add('grow');
        }
    });
    document.addEventListener('mouseout', (e) => {
        if (e.target.closest('a, button, .router-link, .view-pdf-btn, .toggle-summary')) {
            cursor.classList.remove('grow');
        }
    });

    document.addEventListener('mousedown', () => cursor.classList.add('clicked'));
    document.addEventListener('mouseup', () => cursor.classList.remove('clicked'));
    document.body.addEventListener('mouseleave', () => cursor.classList.add('hidden'));
    document.body.addEventListener('mouseenter', () => cursor.classList.remove('hidden'));
}

export function handleScroll() {
    const scrollbarLiquid = document.getElementById('scrollbar-liquid');
    const scrollbarPercentage = document.getElementById('scrollbar-percentage');
    if (!scrollbarLiquid || !scrollbarPercentage) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    
    if (scrollHeight === clientHeight) {
        scrollbarLiquid.style.height = '0%';
        scrollbarPercentage.textContent = '0%';
        return;
    }

    const scrollPercent = (scrollTop / (scrollHeight - clientHeight)) * 100;
    const clampedPercent = Math.min(100, scrollPercent);

    scrollbarLiquid.style.height = `${clampedPercent}%`;
    scrollbarPercentage.textContent = `${Math.round(clampedPercent)}%`;
}
