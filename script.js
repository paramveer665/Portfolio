document.addEventListener('DOMContentLoaded', () => {
    const main = document.querySelector('main');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav ul li a');
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const nav = document.querySelector('nav');
    const themeToggle = document.getElementById('theme-toggle');
    const projectsGrid = document.querySelector('.projects-grid');
    const viewResumeBtn = document.getElementById('view-resume-btn');
    const resumeOverlay = document.getElementById('resume-overlay');
    const closeResumeBtn = document.querySelector('.close-resume');

    let isOverlayOpen = false;

    // Theme switching logic
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.documentElement.classList.add(currentTheme);
        if (currentTheme === 'light-theme') {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        document.documentElement.classList.add('light-theme');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    themeToggle.addEventListener('click', () => {
        if (document.documentElement.classList.contains('light-theme')) {
            document.documentElement.classList.remove('light-theme');
            localStorage.setItem('theme', 'dark-theme');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            document.documentElement.classList.add('light-theme');
            localStorage.setItem('theme', 'light-theme');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    });

    // Intersection observer for nav links
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href').substring(1) === entry.target.id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.7 });

    sections.forEach(section => {
        observer.observe(section);
    });

    // Hamburger menu
    hamburgerMenu.addEventListener('click', () => {
        nav.classList.toggle('active');
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
            }
        });
    });

    // --- RESUME OVERLAY ---
    function openResumeOverlay() {
        resumeOverlay.style.display = 'flex';
        isOverlayOpen = true;
    }

    function closeResumeOverlay() {
        resumeOverlay.style.display = 'none';
        isOverlayOpen = false;
    }

    if (viewResumeBtn && resumeOverlay && closeResumeBtn) {
        viewResumeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openResumeOverlay();
        });

        closeResumeBtn.addEventListener('click', closeResumeOverlay);

        resumeOverlay.addEventListener('click', (e) => {
            if (e.target === resumeOverlay) {
                closeResumeOverlay();
            }
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isOverlayOpen) {
                closeResumeOverlay();
            }
        });
    }

    // --- SMOOTH SCROLLING FOR SECTIONS ---
    let isThrottled = false;
    let currentSectionIndex = 0;

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = Array.from(sections).indexOf(entry.target);
                if (index !== -1) {
                    currentSectionIndex = index;
                }
            }
        });
    }, { threshold: 0.6 });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    function handleMainScroll(evt) {
        if (isOverlayOpen || evt.target.closest('.projects-grid')) {
            return;
        }
        evt.preventDefault();
        if (isThrottled) {
            return;
        }
        isThrottled = true;
        setTimeout(() => {
            isThrottled = false;
        }, 1000); // Increased throttle time for better feel

        const direction = evt.deltaY > 0 ? 1 : -1;
        const nextSectionIndex = currentSectionIndex + direction;

        if (nextSectionIndex >= 0 && nextSectionIndex < sections.length) {
            sections[nextSectionIndex].scrollIntoView({ behavior: 'smooth' });
        }
    }

    if (window.innerWidth > 768) {
        main.addEventListener('wheel', handleMainScroll, { passive: false });
    }
    
    // Horizontal scroll for projects grid
    projectsGrid.addEventListener('wheel', (evt) => {
        if (window.innerWidth > 768) {
            evt.preventDefault();
            projectsGrid.scrollBy({
                left: evt.deltaY > 0 ? 300 : -300, // scroll amount
                behavior: 'smooth'
            });
        }
    });
});
