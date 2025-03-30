document.addEventListener('DOMContentLoaded', function() {
    // Global Navigation
    const menuButton = document.querySelector('.nav-menu-button');
    const mobileNav = document.querySelector('.mobile-nav');
    const closeMenuButton = document.querySelector('.close-menu');
    const searchLink = document.querySelector('.search-link');
    const searchOverlay = document.querySelector('.search-overlay');
    const closeSearchButton = document.querySelector('.close-search');
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    const carousel = document.querySelector('.carousel');
    const carouselItems = document.querySelectorAll('.carousel-item');
    const carouselDots = document.querySelectorAll('.carousel-dots .dot');
    
    // Sticky header on scroll
    const navWrapper = document.querySelector('.nav-wrapper');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 20) {
            navWrapper.classList.add('sticky');
            
            // Hide on scroll down, show on scroll up
            if (window.scrollY > lastScrollY) {
                navWrapper.classList.add('hidden');
            } else {
                navWrapper.classList.remove('hidden');
            }
        } else {
            navWrapper.classList.remove('sticky');
            navWrapper.classList.remove('hidden');
        }
        
        lastScrollY = window.scrollY;
    });
    
    // Mobile navigation toggle
    if (menuButton) {
        menuButton.addEventListener('click', function(e) {
            e.preventDefault();
            mobileNav.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (closeMenuButton) {
        closeMenuButton.addEventListener('click', function() {
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Accordion Menu for Mobile
    if (accordionHeaders.length > 0) {
        accordionHeaders.forEach(header => {
            header.addEventListener('click', function() {
                const content = this.nextElementSibling;
                const icon = this.querySelector('i');
                
                // Toggle the accordion
                if (content.style.display === 'block') {
                    content.style.display = 'none';
                    icon.classList.replace('fa-minus', 'fa-plus');
                } else {
                    // Close all accordion items
                    document.querySelectorAll('.accordion-content').forEach(item => {
                        item.style.display = 'none';
                    });
                    document.querySelectorAll('.accordion-header i').forEach(i => {
                        i.classList.replace('fa-minus', 'fa-plus');
                    });
                    
                    // Open the clicked one
                    content.style.display = 'block';
                    icon.classList.replace('fa-plus', 'fa-minus');
                }
            });
        });
    }
    
    // Search overlay
    if (searchLink) {
        searchLink.addEventListener('click', function(e) {
            e.preventDefault();
            searchOverlay.style.display = 'block';
            setTimeout(() => {
                document.querySelector('.search-input input').focus();
            }, 100);
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (closeSearchButton) {
        closeSearchButton.addEventListener('click', function() {
            searchOverlay.style.display = 'none';
            document.body.style.overflow = '';
        });
    }
    
    // Close search overlay on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            searchOverlay.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
    
    // Carousel functionality
    let currentSlide = 0;
    
    function showSlide(index) {
        // Update current slide
        currentSlide = index;
        
        // Scroll carousel to selected slide
        if (carousel) {
            const slideWidth = carouselItems[0].offsetWidth;
            const slidePosition = slideWidth * index;
            carousel.scrollTo({
                left: slidePosition,
                behavior: 'smooth'
            });
            
            // Update dots
            carouselDots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === index);
            });
        }
    }
    
    // Add click events to dots
    if (carouselDots.length > 0) {
        carouselDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
            });
        });
    }
    
    // Handle carousel scroll end
    if (carousel) {
        let isScrolling;
        
        carousel.addEventListener('scroll', function() {
            clearTimeout(isScrolling);
            
            isScrolling = setTimeout(function() {
                // Get current scroll position
                const slideWidth = carouselItems[0].offsetWidth;
                const scrollLeft = carousel.scrollLeft;
                
                // Calculate which slide is most visible
                const slideIndex = Math.round(scrollLeft / slideWidth);
                
                // Update dots without scrolling again
                carouselDots.forEach((dot, idx) => {
                    dot.classList.toggle('active', idx === slideIndex);
                });
                
                currentSlide = slideIndex;
            }, 100);
        });
    }
    
    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
    anchorLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Mega Menu interactions for desktop
    const navCategories = document.querySelectorAll('.global-nav-categories li');
    const megaMenu = document.querySelector('.mega-menu');
    
    if (navCategories.length > 0 && megaMenu) {
        navCategories.forEach(category => {
            category.addEventListener('mouseenter', function() {
                megaMenu.style.opacity = '1';
                megaMenu.style.visibility = 'visible';
                megaMenu.style.transform = 'translateY(0)';
            });
            
            category.addEventListener('mouseleave', function(e) {
                // Check if the mouse is not moving to the mega menu
                if (!e.relatedTarget || !e.relatedTarget.closest('.mega-menu')) {
                    megaMenu.style.opacity = '0';
                    megaMenu.style.visibility = 'hidden';
                    megaMenu.style.transform = 'translateY(-10px)';
                }
            });
        });
        
        megaMenu.addEventListener('mouseleave', function() {
            megaMenu.style.opacity = '0';
            megaMenu.style.visibility = 'hidden';
            megaMenu.style.transform = 'translateY(-10px)';
        });
    }
    
    // Smooth Image Parallax Effect
    const handleParallax = () => {
        const parallaxSections = document.querySelectorAll('.hero-video-section, .story-section');
        
        parallaxSections.forEach(section => {
            const top = section.getBoundingClientRect().top;
            const scrollPosition = window.scrollY;
            
            if (top < window.innerHeight && top > -section.offsetHeight) {
                const speed = 0.3;
                const yPos = -(top * speed);
                const image = section.querySelector('img, video');
                
                if (image) {
                    image.style.transform = `translate3d(0, ${yPos}px, 0)`;
                }
            }
        });
    };
    
    window.addEventListener('scroll', handleParallax);
    window.addEventListener('resize', handleParallax);
    
    // Intersection Observer for fade-in animations
    const fadeElements = document.querySelectorAll('.category-link, .featured-product-grid, .collection-grid, .product-highlight-grid, .story-section');
    
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    fadeElements.forEach(element => {
        fadeObserver.observe(element);
    });
    
    // Language selector dropdown
    const languageSelector = document.querySelector('.language-selector-content');
    
    if (languageSelector) {
        languageSelector.addEventListener('click', function(e) {
            e.stopPropagation();
            const dropdown = this.querySelector('.language-dropdown');
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        });
        
        document.addEventListener('click', function() {
            const dropdown = document.querySelector('.language-dropdown');
            if (dropdown) {
                dropdown.style.display = 'none';
            }
        });
    }
    
    // Newsletter Subscription form validation
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            
            if (!emailInput.value || !isValidEmail(emailInput.value)) {
                emailInput.classList.add('error');
            } else {
                emailInput.classList.remove('error');
                // Submit the form
                alert('Bültenimize abone olduğunuz için teşekkür ederiz!');
                newsletterForm.reset();
            }
        });
        
        function isValidEmail(email) {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(email);
        }
    }
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        .nav-wrapper.sticky {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            transition: transform 0.3s ease;
            z-index: 1000;
        }
        
        .nav-wrapper.hidden {
            transform: translateY(-100%);
        }
        
        .category-link, .featured-product-grid, .collection-grid, .product-highlight-grid, .story-section {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease, transform 0.8s ease;
        }
        
        .fade-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        .newsletter-form input.error {
            border-color: #ff3b30;
        }
    `;
    
    document.head.appendChild(style);

    // Slider işlevselliği
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slider-arrow.prev');
    const nextBtn = document.querySelector('.slider-arrow.next');
    let currentSlide = 0;
    let slideInterval;

    // Slider görsellerinin boyutunu ayarlama
    function resizeSliderImages() {
        const sliderHeight = document.querySelector('.slider').offsetHeight;
        const sliderWidth = document.querySelector('.slider').offsetWidth;
        
        slides.forEach(slide => {
            const img = slide.querySelector('img');
            if (img) {
                // Görüntünün orijinal boyutlarını al
                const imgRatio = img.naturalWidth / img.naturalHeight;
                const containerRatio = sliderWidth / sliderHeight;
                
                // Görüntü container'dan daha genişse
                if (imgRatio > containerRatio) {
                    img.style.width = '100%';
                    img.style.height = 'auto';
                } else {
                    img.style.height = '100%';
                    img.style.width = 'auto';
                }
            }
        });
    }

    // Sayfa yüklendiğinde ve yeniden boyutlandırıldığında görselleri ayarla
    resizeSliderImages();
    window.addEventListener('resize', resizeSliderImages);

    // Slider otomatik geçiş fonksiyonu
    function startSlideInterval() {
        slideInterval = setInterval(() => {
            goToSlide((currentSlide + 1) % slides.length);
        }, 5000);
    }

    // Slider geçiş fonksiyonu
    function goToSlide(index) {
        if (slides.length) {
            slides[currentSlide].classList.remove('active');
            dots[currentSlide].classList.remove('active');
            
            currentSlide = index;
            
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        }
    }

    // Slider kontrolleri
    if (slides.length && dots.length) {
        // Nokta ile geçiş
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                clearInterval(slideInterval);
                goToSlide(index);
                startSlideInterval();
            });
        });

        // Önceki/sonraki oklar
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                clearInterval(slideInterval);
                goToSlide((currentSlide - 1 + slides.length) % slides.length);
                startSlideInterval();
            });

            nextBtn.addEventListener('click', () => {
                clearInterval(slideInterval);
                goToSlide((currentSlide + 1) % slides.length);
                startSlideInterval();
            });
        }

        // Slider başlat
        startSlideInterval();
    }

    // CSS Animation on Mobile
    // ... existing code ...
}); 