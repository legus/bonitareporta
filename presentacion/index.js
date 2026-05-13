document.addEventListener('DOMContentLoaded', function() {
    
    // ===== NAVEGACIÓN SUAVE =====
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Solo procesar si es un ancla interna válida
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Compensar navbar fijo
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ===== ANIMACIÓN DE ENTRADA AL SCROLL =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observar elementos para animar
    const animatableElements = document.querySelectorAll('.feature-card, .incidencia-card, .step, .stat-item');
    animatableElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Clase CSS dinámica para animación
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // ===== CONTADOR ANIMADO PARA ESTADÍSTICAS =====
    const statsSection = document.querySelector('.stats');
    let statsAnimated = false;

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsAnimated) {
                statsAnimated = true;
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    function animateCounters() {
        const counters = document.querySelectorAll('.stat-item h3');
        
        counters.forEach(counter => {
            const targetText = counter.textContent;
            const numericValue = parseInt(targetText.replace(/\D/g, ''));
            const suffix = targetText.replace(/[0-9]/g, '');
            const duration = 2000; // 2 segundos
            const startTime = performance.now();
            
            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing ease-out
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const currentValue = Math.floor(easeOut * numericValue);
                
                counter.textContent = currentValue + suffix;
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = targetText;
                }
            }
            
            requestAnimationFrame(updateCounter);
        });
    }

    // ===== EFECTO PARALLAX SUAVE EN HERO =====
    const hero = document.querySelector('.hero');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroContent = document.querySelector('.hero-content');
        
        if (heroContent && scrolled < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
            heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
        }
    });

    // ===== MENÚ MÓVIL (para futura implementación) =====
    const menuBtn = document.querySelector('.nav-menu-btn');
    const navLinksContainer = document.querySelector('.nav-links');

    if (menuBtn && navLinksContainer) {
        menuBtn.addEventListener('click', () => {
            navLinksContainer.classList.toggle('nav-active');
            menuBtn.classList.toggle('menu-open');
        });
    }

    // ===== TOOLTIP PARA BOTONES CON HREF="#" =====
    const placeholderLinks = document.querySelectorAll('a[href="#"]');
    
    placeholderLinks.forEach(link => {
        // Excluir anclas internas que ya tienen ID destino
        if (!link.getAttribute('href').startsWith('#funciona') && 
            !link.getAttribute('href').startsWith('#incidencias')) {
            
            link.addEventListener('click', function(e) {
                e.preventDefault();
                showToast('Esta funcionalidad estará disponible próximamente');
            });
        }
    });

    function showToast(message) {
        // Crear toast si no existe
        let toast = document.getElementById('toast');
        
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast';
            toast.style.cssText = `
                position: fixed;
                bottom: 2rem;
                left: 50%;
                transform: translateX(-50%) translateY(100px);
                background: var(--secondary);
                color: white;
                padding: 1rem 2rem;
                border-radius: 1rem;
                font-weight: 500;
                z-index: 9999;
                transition: transform 0.3s ease;
                box-shadow: var(--shadow-lg);
            `;
            document.body.appendChild(toast);
        }
        
        toast.textContent = message;
        toast.style.transform = 'translateX(-50%) translateY(0)';
        
        setTimeout(() => {
            toast.style.transform = 'translateX(-50%) translateY(100px)';
        }, 3000);
    }

    // ===== EFECTO HOVER EN TARJETAS DE REPORTES =====
    const reportItems = document.querySelectorAll('.hero-card-item');
    
    reportItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });

    // ===== DETECCIÓN DE TECLADO PARA ACCESIBILIDAD =====
    document.addEventListener('keydown', (e) => {
        // Escape cierra menú móvil si está abierto
        if (e.key === 'Escape' && navLinksContainer) {
            navLinksContainer.classList.remove('nav-active');
        }
    });

    console.log('🟢 BonitaReporta cargado correctamente');
});