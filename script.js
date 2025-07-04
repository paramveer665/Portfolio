document.addEventListener('DOMContentLoaded', () => {
    const main = document.querySelector('main');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav ul li a');
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const nav = document.querySelector('nav');
    const themeToggle = document.getElementById('theme-toggle');

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

    hamburgerMenu.addEventListener('click', () => {
        nav.classList.toggle('active');
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetId === '#skills') {
                document.querySelector('.skills-grid').scrollTop = 0;
            }

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }

            // Close hamburger menu on click if open
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
            }
        });
    });

    // Project scroll indicator
    const projectsSection = document.getElementById('projects');
    const projectsGrid = projectsSection.querySelector('.projects-grid');
    const scrollIndicator = projectsSection.querySelector('.scroll-indicator');
    const projects = projectsGrid.querySelectorAll('.project');
    const numProjects = projects.length;

    // Create dots
    for (let i = 0; i < numProjects; i++) {
        const dot = document.createElement('div');
        dot.classList.add('scroll-indicator-dot');
        scrollIndicator.appendChild(dot);
    }

    const dots = scrollIndicator.querySelectorAll('.scroll-indicator-dot');
    dots[0].classList.add('active');

    projectsGrid.addEventListener('scroll', () => {
        const scrollLeft = projectsGrid.scrollLeft;
        const projectWidth = projects[0].offsetWidth;
        const activeIndex = Math.round(scrollLeft / projectWidth);

        dots.forEach((dot, index) => {
            if (index === activeIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    });

    // --- SMOOTH SCROLLING FOR SECTIONS ---
    let isThrottled = false;
    let currentSectionIndex = 0;

    // Update the current section index based on which section is in view
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = Array.from(sections).indexOf(entry.target);
                if (index !== -1) {
                    currentSectionIndex = index;
                }
            }
        });
    }, { threshold: 0.6 }); // Use a threshold of 0.6

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    function handleMainScroll(evt) {
        // Do not interfere with project grid scrolling
        if (evt.target.closest('.projects-grid')) {
            return;
        }

        // Prevent default browser scroll to implement our own logic
        evt.preventDefault();

        if (isThrottled) {
            return; // Don't do anything if a scroll is already in progress
        }
        isThrottled = true;

        // Set a timeout to reset the throttle flag.
        // This ensures we only process one scroll action at a time.
        setTimeout(() => {
            isThrottled = false;
        }, 800); // 800ms throttle period

        const direction = evt.deltaY > 0 ? 1 : -1;
        const nextSectionIndex = currentSectionIndex + direction;

        if (nextSectionIndex >= 0 && nextSectionIndex < sections.length) {
            sections[nextSectionIndex].scrollIntoView({ behavior: 'smooth' });
        }
    }

    main.addEventListener('click', () => {
        if (nav.classList.contains('active')) {
            nav.classList.remove('active');
        }
    });

    main.addEventListener('wheel', handleMainScroll, { passive: false });

    // Horizontal scroll for projects grid
    projectsGrid.addEventListener('wheel', (evt) => {
        evt.preventDefault();
        const scrollAmount = evt.deltaY > 0 ? projects[0].offsetWidth : -projects[0].offsetWidth;
        projectsGrid.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });
});