document.addEventListener('DOMContentLoaded', () => {
    const main = document.querySelector('main');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav ul li a');

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
