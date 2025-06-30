document.addEventListener('DOMContentLoaded', () => {
    const sectionsContainer = document.getElementById('sections-container');
    const sections = Array.from(sectionsContainer.children);
    let currentSectionIndex = 0;
    let isTransitioning = false;

    function scrollToSection(index) {
        if (index < 0 || index >= sections.length || isTransitioning) {
            return;
        }

        isTransitioning = true;
        currentSectionIndex = index;
        sectionsContainer.style.transform = `translateY(-${currentSectionIndex * 100}vh)`;

        // Reset scroll position of the projects section if navigating to it
        if (sections[currentSectionIndex].id === 'projects') {
            sections[currentSectionIndex].scrollTop = 0;
        }

        // Update active navigation link
        document.querySelectorAll('nav ul li a').forEach(link => {
            link.classList.remove('active');
        });
        const activeLink = document.querySelector(`nav ul li a[href="#${sections[currentSectionIndex].id}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        setTimeout(() => {
            isTransitioning = false;
        }, 700); // Match CSS transition duration
    }

    // Initial load
    scrollToSection(0);

    // Navigation clicks
    document.querySelectorAll('nav ul li a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            const index = sections.indexOf(targetSection);
            scrollToSection(index);
        });
    });

    // Scroll/Wheel events
    let scrollTimeout;
    window.addEventListener('wheel', (e) => {
        if (isTransitioning) return;

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const currentSection = sections[currentSectionIndex];
            if (e.deltaY > 0) { // Scrolling down
                if (currentSection.scrollHeight > currentSection.clientHeight && currentSection.scrollTop < currentSection.scrollHeight - currentSection.clientHeight) {
                    currentSection.scrollBy({ top: e.deltaY, behavior: 'smooth' });
                } else {
                    scrollToSection(currentSectionIndex + 1);
                }
            } else { // Scrolling up
                if (currentSection.scrollHeight > currentSection.clientHeight && currentSection.scrollTop > 0) {
                    currentSection.scrollBy({ top: e.deltaY, behavior: 'smooth' });
                } else {
                    scrollToSection(currentSectionIndex - 1);
                }
            }
        }, 100); // Debounce scroll events
    });

    // Keyboard arrow keys
    document.addEventListener('keydown', (e) => {
        if (isTransitioning) return;

        const currentSection = sections[currentSectionIndex];
        if (e.key === 'ArrowDown') {
            if (currentSection.scrollHeight > currentSection.clientHeight && currentSection.scrollTop < currentSection.scrollHeight - currentSection.clientHeight) {
                currentSection.scrollBy({ top: 100, behavior: 'smooth' }); // Scroll down by a fixed amount
            } else {
                scrollToSection(currentSectionIndex + 1);
            }
        } else if (e.key === 'ArrowUp') {
            if (currentSection.scrollHeight > currentSection.clientHeight && currentSection.scrollTop > 0) {
                currentSection.scrollBy({ top: -100, behavior: 'smooth' }); // Scroll up by a fixed amount
            } else {
                scrollToSection(currentSectionIndex - 1);
            }
        }
    });

    // Scroll/Wheel events
    
});