document.addEventListener('DOMContentLoaded', () => {
    // 1. Scroll Animations Setup
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigered when 15% is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Unobserve so it only happens once
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in, .reveal');
    animatedElements.forEach(el => observer.observe(el));

    // Force visible immediately for Hero section
    setTimeout(() => {
        const heroElements = document.querySelectorAll('.hero .fade-in');
        heroElements.forEach(el => el.classList.add('visible'));
    }, 100);

    // 2. Mock Form Submission
    const form = document.getElementById('waitlist-form');
    const successMsg = document.getElementById('form-success');
    const emailInput = document.getElementById('email');

    if (form && successMsg && emailInput) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = emailInput.value.trim();
            if (email) {
                // UI changes for feedback
                const btn = form.querySelector('.btn-primary');
                btn.innerHTML = '<span class="btn-text">CADASTRANDO...</span>';
                btn.style.opacity = '0.8';
                btn.style.pointerEvents = 'none';

                // Send data to Netlify via AJAX
                const formData = new FormData(form);
                
                fetch("/", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: new URLSearchParams(formData).toString()
                })
                .then(() => {
                    form.style.display = 'none';
                    successMsg.classList.remove('hidden');
                    
                    // Simple POP animation using Web Animations API
                    successMsg.animate([
                        { opacity: 0, transform: 'scale(0.95) translateY(10px)' },
                        { opacity: 1, transform: 'scale(1) translateY(0)' }
                    ], {
                        duration: 500,
                        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
                        fill: 'forwards'
                    });
                })
                .catch(error => {
                    alert("Ocorreu um erro ao enviar. Tente novamente.");
                    btn.innerHTML = '<span class="btn-text">QUERO SER AVISADO</span>';
                    btn.style.opacity = '1';
                    btn.style.pointerEvents = 'auto';
                });
            }
        });
    }

    // 3. Optional: Subtle Mouse Parallax on Cover Image (Desktop Only)
    const bookWrapper = document.querySelector('.book-wrapper');
    const hero = document.querySelector('.hero');
    
    if (bookWrapper && hero && window.innerWidth > 992) {
        hero.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth / 2 - e.pageX) / 45;
            const y = (window.innerHeight / 2 - e.pageY) / 45;
            
            // Adjust current rotation with mouse movement
            bookWrapper.style.transform = `rotateY(${-8 + x}deg) rotateX(${4 + y}deg)`;
        });

        hero.addEventListener('mouseleave', () => {
            bookWrapper.style.transform = `rotateY(-8deg) rotateX(4deg)`;
        });
    }
});
