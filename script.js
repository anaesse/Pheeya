// Pheeya.com Interactive Features
// Modern, smooth interactions inspired by Sarah Drasner's animation philosophy

document.addEventListener('DOMContentLoaded', function() {
    // Navigation scroll effect
    const nav = document.querySelector('.nav');
    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove background opacity based on scroll
        if (scrollTop > 50) {
            nav.style.background = 'rgba(255, 255, 255, 0.98)';
            nav.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
        } else {
            nav.style.background = 'rgba(255, 255, 255, 0.95)';
            nav.style.boxShadow = 'none';
        }

        // Hide nav on scroll down, show on scroll up
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }
        lastScrollTop = scrollTop;
    });

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed nav
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Stagger animation for collection cards
                if (entry.target.classList.contains('collection-card')) {
                    const cards = entry.target.parentElement.children;
                    Array.from(cards).forEach((card, index) => {
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                }
                
                // Stagger animation for process steps
                if (entry.target.classList.contains('process-step')) {
                    const steps = entry.target.parentElement.children;
                    Array.from(steps).forEach((step, index) => {
                        setTimeout(() => {
                            step.style.opacity = '1';
                            step.style.transform = 'translateY(0)';
                        }, index * 150);
                    });
                }
            }
        });
    }, observerOptions);

    // Apply fade-in animation to elements
    const animatedElements = document.querySelectorAll('.collections, .about, .process, .cta');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Collection cards hover effect enhancement
    const collectionCards = document.querySelectorAll('.collection-card');
    collectionCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-12px) rotateX(5deg)';
            card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) rotateX(0deg)';
        });
    });

    // Button interactions with modern feel
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        btn.addEventListener('click', (e) => {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            btn.style.position = 'relative';
            btn.style.overflow = 'hidden';
            btn.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Floating beads animation enhancement
    const beads = document.querySelectorAll('.bead');
    beads.forEach((bead, index) => {
        // Add random movement to make beads feel more organic
        setInterval(() => {
            const randomX = (Math.random() - 0.5) * 10;
            const randomY = (Math.random() - 0.5) * 10;
            bead.style.transform = `translate(${randomX}px, ${randomY}px)`;
        }, 3000 + (index * 500));
        
        // Add hover effect to beads
        bead.addEventListener('mouseenter', () => {
            bead.style.transform = 'scale(1.1)';
            bead.style.transition = 'transform 0.3s ease';
        });
        
        bead.addEventListener('mouseleave', () => {
            bead.style.transform = 'scale(1)';
        });
    });

    // Stats counter animation
    const stats = document.querySelectorAll('.stat-number');
    const animateStats = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = parseInt(target.textContent);
                const increment = finalValue / 50;
                let current = 0;
                
                const updateCounter = () => {
                    if (current < finalValue) {
                        current += increment;
                        target.textContent = Math.ceil(current) + (target.textContent.includes('+') ? '+' : '') + (target.textContent.includes('%') ? '%' : '');
                        requestAnimationFrame(updateCounter);
                    } else {
                        target.textContent = target.dataset.originalValue || target.textContent;
                    }
                };
                
                if (!target.dataset.originalValue) {
                    target.dataset.originalValue = target.textContent;
                    target.textContent = '0';
                    updateCounter();
                }
            }
        });
    };

    const statsObserver = new IntersectionObserver(animateStats, {
        threshold: 0.5,
        triggerOnce: true
    });

    stats.forEach(stat => {
        statsObserver.observe(stat);
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating-elements');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // Form submission handlers (if forms are added later)
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // Add form handling logic here
            showNotification('Thank you! We\'ll be in touch soon.', 'success');
        });
    });

    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#6366f1'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            z-index: 9999;
            max-width: 300px;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Performance optimization: Debounce scroll events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Easter egg: Konami code for developers
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    
    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.code);
        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }
        
        if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
            // Developer easter egg
            document.body.style.filter = 'hue-rotate(180deg)';
            showNotification('🎉 Developer mode activated! Nice coding skills!', 'success');
            
            setTimeout(() => {
                document.body.style.filter = 'none';
            }, 3000);
            
            konamiCode = [];
        }
    });

    console.log('🎨 Pheeya.com loaded with love, code, and craft! 🎵');
    console.log('Built with modern web technologies and artistic passion.');
});

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .notification {
        font-family: inherit;
        font-weight: 500;
    }
    
    @media (max-width: 768px) {
        .nav-menu.active {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border-top: 1px solid var(--color-gray-200);
            padding: 1rem;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }
        
        .mobile-menu-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .mobile-menu-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .mobile-menu-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    }
`;
document.head.appendChild(style);
