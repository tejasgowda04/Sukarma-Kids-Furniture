/* ============================================================
   SUKARMA INTERIORS — JavaScript Interactions
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ---- Sticky Navbar ----
    const navbar = document.getElementById('navbar');
    const handleScroll = () => {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Update active nav link based on scroll position
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 140;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-link[href="#${id}"]`);
            if (link) {
                if (scrollPos >= top && scrollPos < top + height) {
                    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // ---- Hamburger Menu ----
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when a link is clicked
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // ---- Hero Slideshow ----
    const slides = document.querySelectorAll('.hero-slide');
    let currentHeroSlide = 0;
    const slideInterval = 6000;

    function nextHeroSlide() {
        slides[currentHeroSlide].classList.remove('active');
        currentHeroSlide = (currentHeroSlide + 1) % slides.length;
        slides[currentHeroSlide].classList.add('active');
    }

    if (slides.length > 1) {
        setInterval(nextHeroSlide, slideInterval);
    }

    // ---- Scroll Animations (Intersection Observer) ----
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.12
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });

    // ---- Portfolio Filters ----
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            portfolioItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });

    // ---- Portfolio Lightbox ----
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    let lightboxImages = [];
    let lightboxIndex = 0;

    function openLightbox(index) {
        // Collect visible portfolio images
        lightboxImages = [];
        document.querySelectorAll('.portfolio-item:not(.hidden)').forEach(item => {
            const img = item.querySelector('img');
            const h3 = item.querySelector('.portfolio-overlay h3');
            lightboxImages.push({
                src: img.src,
                alt: img.alt,
                caption: h3 ? h3.textContent : ''
            });
        });

        lightboxIndex = index;
        updateLightbox();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateLightbox() {
        if (lightboxImages[lightboxIndex]) {
            lightboxImg.src = lightboxImages[lightboxIndex].src;
            lightboxImg.alt = lightboxImages[lightboxIndex].alt;
            lightboxCaption.textContent = lightboxImages[lightboxIndex].caption;
        }
    }

    portfolioItems.forEach((item, i) => {
        item.addEventListener('click', () => {
            // Calculate visible index
            const visibleItems = [...document.querySelectorAll('.portfolio-item:not(.hidden)')];
            const visibleIndex = visibleItems.indexOf(item);
            openLightbox(visibleIndex >= 0 ? visibleIndex : 0);
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', () => {
            lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
            updateLightbox();
        });
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', () => {
            lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
            updateLightbox();
        });
    }

    // Close lightbox on outside click
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    // Close lightbox with Escape key, navigate with arrow keys
    document.addEventListener('keydown', (e) => {
        if (lightbox && lightbox.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') {
                lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
                updateLightbox();
            }
            if (e.key === 'ArrowRight') {
                lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
                updateLightbox();
            }
        }
    });

    // ---- Testimonials Carousel ----
    const track = document.getElementById('testimonialsTrack');
    const dotsContainer = document.getElementById('testimonialDots');
    const prevBtn = document.getElementById('testPrev');
    const nextBtn = document.getElementById('testNext');

    if (track && dotsContainer) {
        const cards = track.querySelectorAll('.testimonial-card');
        let currentSlide = 0;
        let autoSlideInterval;

        // Create dots
        cards.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        function goToSlide(index) {
            currentSlide = index;
            track.style.transform = `translateX(-${index * 100}%)`;
            dotsContainer.querySelectorAll('.dot').forEach((d, i) => {
                d.classList.toggle('active', i === index);
            });
        }

        function nextSlide() {
            goToSlide((currentSlide + 1) % cards.length);
        }

        function prevSlide() {
            goToSlide((currentSlide - 1 + cards.length) % cards.length);
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetAutoSlide();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                resetAutoSlide();
            });
        }

        function startAutoSlide() {
            autoSlideInterval = setInterval(nextSlide, 5000);
        }

        function resetAutoSlide() {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        }

        startAutoSlide();
    }

    // ---- Contact Form ----
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const email = document.getElementById('email').value.trim();

            if (!name || !phone || !email) {
                return;
            }

            form.innerHTML = `
                <div class="form-success">
                    <div class="success-icon">✨</div>
                    <h3>Thank You, ${name}!</h3>
                    <p>We've received your enquiry and our design team will reach out within 24 hours. Get ready to transform your home with Sukarma!</p>
                </div>
            `;
        });
    }

    // ---- Smooth scroll for all anchor links ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ---- Counter animation for stats ----
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const text = el.textContent;
                const numMatch = text.match(/(\d+)/);
                if (numMatch) {
                    const target = parseInt(numMatch[1]);
                    const suffix = text.replace(numMatch[1], '');
                    let current = 0;
                    const step = Math.ceil(target / 50);
                    const timer = setInterval(() => {
                        current += step;
                        if (current >= target) {
                            current = target;
                            clearInterval(timer);
                        }
                        el.textContent = current + suffix;
                    }, 25);
                }
                statsObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(num => statsObserver.observe(num));

    // ---- Parallax-like effect on hero ----
    window.addEventListener('scroll', () => {
        const hero = document.querySelector('.hero');
        if (hero) {
            const scrolled = window.scrollY;
            const heroHeight = hero.offsetHeight;
            if (scrolled < heroHeight) {
                const overlay = document.querySelector('.hero-overlay');
                if (overlay) {
                    overlay.style.opacity = 0.5 + (scrolled / heroHeight) * 0.5;
                }
            }
        }
    }, { passive: true });
});
