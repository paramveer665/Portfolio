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
});