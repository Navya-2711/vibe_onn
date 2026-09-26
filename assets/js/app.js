/* ==========================================================================
   VIBEONN PARTY HALL IN VIJAYAWADA - MAIN APP & CINEMATIC HERO SLIDER
   Pure Vanilla HTML, CSS & JavaScript (No Framework / Vite required)
   ========================================================================== */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initHeroSlider();
    initVideoPlayer();
    initSparkleCanvas();
    initScrollAnimations();
    initGallery();
    initBookingForm();
    initStickyHeader();
    initMobileDrawer();
    initRouter();
    initReviewSlider();
  });


  function initVideoPlayer() {
    var video = document.getElementById('vibeonn-video');
    var playButton = document.getElementById('video-play-btn');
    var overlay = document.getElementById('video-overlay');

    if (!video || !playButton || !overlay) return;

    playButton.addEventListener('click', function () {
      var playback = video.play();
      if (playback && typeof playback.then === 'function') {
        playback.then(function () {
          overlay.classList.add('is-hidden');
        }).catch(function () {
          overlay.classList.remove('is-hidden');
        });
      }
    });

    video.addEventListener('play', function () {
      overlay.classList.add('is-hidden');
    });

    video.addEventListener('pause', function () {
      if (!video.ended) overlay.classList.remove('is-hidden');
    });
  }
  /* ==========================================================================
     1. HERO AUTOPLAY CINEMATIC SLIDER (5 SLIDES)
     ========================================================================== */
  function initHeroSlider() {
    var slides = document.querySelectorAll('.hero-slide');
    var dots = document.querySelectorAll('.hero-dot');
    var prevBtn = document.getElementById('hero-prev');
    var nextBtn = document.getElementById('hero-next');

    if (!slides.length) return;

    var currentSlide = 0;
    var slideInterval = null;
    var slideDuration = 4500; // 4.5s autoplay interval

    function goToSlide(index) {
      // Remove active from all slides and dots
      for (var i = 0; i < slides.length; i++) {
        slides[i].classList.remove('active');
      }
      for (var j = 0; j < dots.length; j++) {
        dots[j].classList.remove('active');
      }

      // Loop index continuously (1 -> 2 -> 3 -> 4 -> 5 -> 1)
      currentSlide = (index + slides.length) % slides.length;

      // Add active to current slide & dot
      slides[currentSlide].classList.add('active');
      if (dots[currentSlide]) {
        dots[currentSlide].classList.add('active');
      }
    }

    function nextSlide() {
      goToSlide(currentSlide + 1);
    }

    function prevSlide() {
      goToSlide(currentSlide - 1);
    }

    function startAutoplay() {
      stopAutoplay();
      slideInterval = setInterval(nextSlide, slideDuration);
    }

    function stopAutoplay() {
      if (slideInterval) {
        clearInterval(slideInterval);
        slideInterval = null;
      }
    }

    // Next / Prev Button Click Handlers
    if (nextBtn) {
      nextBtn.addEventListener('click', function (e) {
        e.preventDefault();
        nextSlide();
        startAutoplay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function (e) {
        e.preventDefault();
        prevSlide();
        startAutoplay();
      });
    }

    // Pagination Dots Click Handlers
    dots.forEach(function (dot, idx) {
      dot.addEventListener('click', function (e) {
        e.preventDefault();
        goToSlide(idx);
        startAutoplay();
      });
    });

    // Touch Swipe Support for Mobile
    var heroSection = document.querySelector('.hero-section');
    if (heroSection) {
      var touchStartX = 0;
      var touchEndX = 0;

      heroSection.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      heroSection.addEventListener('touchend', function (e) {
        touchEndX = e.changedTouches[0].screenX;
        var swipeDistance = touchEndX - touchStartX;
        if (Math.abs(swipeDistance) > 40) {
          if (swipeDistance < 0) {
            nextSlide();
          } else {
            prevSlide();
          }
          startAutoplay();
        }
      }, { passive: true });
    }

    // Initialize first slide and start automatic loop
    goToSlide(0);
    startAutoplay();
  }

  /* ==========================================================================
     2. GOLDEN SPARKLE PARTICLE CANVAS
     ========================================================================== */
  function initSparkleCanvas() {
    var canvas = document.getElementById('sparkle-canvas');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var width, height;
    var particles = [];
    var particleCount = 40;

    function resize() {
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    function Particle() {
      this.reset();
    }

    Particle.prototype.reset = function () {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2.2 + 0.8;
      this.speedY = -(Math.random() * 0.5 + 0.2);
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.7 + 0.3;
      this.fadeSpeed = Math.random() * 0.008 + 0.003;
    };

    Particle.prototype.update = function () {
      this.y += this.speedY;
      this.x += this.speedX;
      this.opacity -= this.fadeSpeed;

      if (this.y < 0 || this.opacity <= 0) {
        this.reset();
        this.y = height + 10;
      }
    };

    Particle.prototype.draw = function () {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

      var gradient = ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, this.size * 2
      );
      gradient.addColorStop(0, '#FFF5C0');
      gradient.addColorStop(0.5, '#D4AF37');
      gradient.addColorStop(1, 'rgba(212, 175, 55, 0)');

      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.restore();
    };

    for (var i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(function (p) {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animate);
    }

    animate();
  }

  /* ==========================================================================
     3. SCROLL ANIMATIONS & 3D CARD TILTS
     ========================================================================== */
  function initScrollAnimations() {
    var revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .bubble-entrance');

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

      revealElements.forEach(function (el) { observer.observe(el); });
    } else {
      revealElements.forEach(function (el) { el.classList.add('active'); });
    }

    // 3D Tilt Card Effect
    var cards3D = document.querySelectorAll('.card-3d');
    cards3D.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;
        var rotateX = ((y - centerY) / centerY) * -8;
        var rotateY = ((x - centerX) / centerX) * 8;
        card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale3d(1.02, 1.02, 1.02)';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    });
  }

  /* ==========================================================================
     4. GALLERY MASONRY FILTER & LIGHTBOX MODAL
     ========================================================================== */
  function initGallery() {
    var filterBtns = document.querySelectorAll('.gallery-filter-btn');
    var galleryItems = document.querySelectorAll('.gallery-item');
    var lightbox = document.getElementById('lightbox-modal');
    var lightboxImg = document.getElementById('lightbox-img');
    var lightboxCaption = document.getElementById('lightbox-caption');
    var lightboxClose = document.getElementById('lightbox-close');
    var lightboxPrev = document.getElementById('lightbox-prev');
    var lightboxNext = document.getElementById('lightbox-next');

    var visibleItems = Array.from(galleryItems);
    var currentIndex = 0;

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        var filter = btn.getAttribute('data-filter');

        galleryItems.forEach(function (item) {
          var category = item.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            item.style.display = 'block';
            item.classList.add('active');
          } else {
            item.style.display = 'none';
          }
        });

        visibleItems = Array.from(galleryItems).filter(function (item) {
          var cat = item.getAttribute('data-category');
          return filter === 'all' || cat === filter;
        });
      });
    });

    galleryItems.forEach(function (item) {
      item.addEventListener('click', function () {
        var img = item.querySelector('img');
        var title = item.getAttribute('data-title') || 'VibeOnn Party Hall Vijayawada';
        currentIndex = visibleItems.indexOf(item);
        openLightbox(img.src, title);
      });
    });

    function openLightbox(src, title) {
      if (!lightbox || !lightboxImg) return;
      lightboxImg.src = src;
      if (lightboxCaption) lightboxCaption.textContent = title;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      if (!lightbox) return;
      lightbox.classList.remove('active');
      document.body.style.overflow = 'auto';
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightbox) {
      lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) closeLightbox();
      });
    }

    if (lightboxPrev) {
      lightboxPrev.addEventListener('click', function () {
        if (!visibleItems.length) return;
        currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
        var prevItem = visibleItems[currentIndex];
        openLightbox(prevItem.querySelector('img').src, prevItem.getAttribute('data-title') || 'VibeOnn Party Hall');
      });
    }

    if (lightboxNext) {
      lightboxNext.addEventListener('click', function () {
        if (!visibleItems.length) return;
        currentIndex = (currentIndex + 1) % visibleItems.length;
        var nextItem = visibleItems[currentIndex];
        openLightbox(nextItem.querySelector('img').src, nextItem.getAttribute('data-title') || 'VibeOnn Party Hall');
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  /* ==========================================================================
     5. BOOKING FORM & WHATSAPP INTEGRATION (8519963801)
     ========================================================================== */
  function initBookingForm() {
    var bookingForms = document.querySelectorAll('.booking-form');

    bookingForms.forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();

        var nameInput = form.querySelector('[name="name"]');
        var phoneInput = form.querySelector('[name="phone"]');
        var addressInput = form.querySelector('[name="address"]');
        var partyTypeSelect = form.querySelector('[name="party_type"]');
        var dateInput = form.querySelector('[name="slot_date"]');
        var timeSelect = form.querySelector('[name="slot_time"]');
        var partyVibeRadio = form.querySelector('[name="party_vibe"]:checked');

        var isValid = true;
        var errorMsg = '';

        if (!nameInput || !nameInput.value.trim()) {
          isValid = false;
          errorMsg += '• Please enter your Full Name.\n';
        }

        var phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneInput || !phoneRegex.test(phoneInput.value.trim())) {
          isValid = false;
          errorMsg += '• Please enter a valid 10-digit Phone Number.\n';
        }

        if (!addressInput || !addressInput.value.trim()) {
          isValid = false;
          errorMsg += '• Please enter your Address / Locality in Vijayawada.\n';
        }

        if (!partyTypeSelect || !partyTypeSelect.value) {
          isValid = false;
          errorMsg += '• Please select a Party Type.\n';
        }

        if (!dateInput || !dateInput.value) {
          isValid = false;
          errorMsg += '• Please choose your preferred Slot Date.\n';
        }

        if (!timeSelect || !timeSelect.value) {
          isValid = false;
          errorMsg += '• Please choose your Slot Time.\n';
        }

        if (!partyVibeRadio) {
          isValid = false;
          errorMsg += '• Please select your Party Vibe (Inside Party Hall or Another Place).\n';
        }

        if (!isValid) {
          alert('Please correct the following fields:\n\n' + errorMsg);
          return;
        }

        var name = nameInput.value.trim();
        var phone = phoneInput.value.trim();
        var address = addressInput.value.trim();
        var partyType = partyTypeSelect.value;
        var slotDate = dateInput.value;
        var slotTime = timeSelect.value;
        var partyVibe = partyVibeRadio.value;

        var message = '🎉 *NEW BOOKING ENQUIRY - VIBEONN PARTY HALL VIJAYAWADA* 🎉\n\n' +
          '👤 *Name:* ' + name + '\n' +
          '📞 *Phone:* ' + phone + '\n' +
          '📍 *Address:* ' + address + '\n' +
          '🎈 *Party Type:* ' + partyType + '\n' +
          '📅 *Slot Date:* ' + slotDate + '\n' +
          '⏰ *Slot Time:* ' + slotTime + '\n' +
          '✨ *Party Vibe:* ' + partyVibe + '\n\n' +
          'Please confirm slot availability and details!';

        var encodedMessage = encodeURIComponent(message);
        var whatsappUrl = 'https://wa.me/918519963801?text=' + encodedMessage;

        window.open(whatsappUrl, '_blank');
        alert('Thank you, ' + name + '! Your booking enquiry has been submitted. Opening WhatsApp to connect with VibeOnn team (8519963801)...');
        form.reset();
      });
    });
  }

  /* ==========================================================================
     6. STICKY HEADER & MOBILE DRAWER
     ========================================================================== */
  function initStickyHeader() {
    var header = document.querySelector('.header');
    if (!header) return;

    function updateHeaderState() {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', updateHeaderState, { passive: true });
    updateHeaderState();
  }

  function initMobileDrawer() {
    var hamburger = document.getElementById('hamburger');
    var mobileDrawer = document.getElementById('mobile-drawer');

    if (hamburger && mobileDrawer) {
      hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('active');
        mobileDrawer.classList.toggle('active');
      });

      document.querySelectorAll('.mobile-drawer a').forEach(function (link) {
        link.addEventListener('click', function () {
          hamburger.classList.remove('active');
          mobileDrawer.classList.remove('active');
        });
      });
    }
  }

  /* ==========================================================================
     7. ROUTER & PAGE VIEW CONTROLLER
     ========================================================================== */
  function initRouter() {
    var views = document.querySelectorAll('.page-view');
    var navLinks = document.querySelectorAll('.nav-link, .dropdown-item a, .mobile-drawer a, .route-btn');

    function handleRoute() {
      var hash = window.location.hash || '#home';

      views.forEach(function (view) {
        view.style.display = 'none';
        view.classList.remove('active');
      });

      var targetView = document.querySelector(hash);
      if (targetView) {
        targetView.style.display = 'block';
        targetView.classList.add('active');
      } else {
        var homeView = document.querySelector('#home');
        if (homeView) {
          homeView.style.display = 'block';
          homeView.classList.add('active');
        }
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });

      navLinks.forEach(function (link) {
        var href = link.getAttribute('href');
        if (href === hash) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });

      setTimeout(function () {
        initScrollAnimations();
      }, 100);
    }

    window.addEventListener('hashchange', handleRoute);
    handleRoute();
  }

  /* ==========================================================================
     8. REVIEW CAROUSEL
     ========================================================================== */
  function initReviewSlider() {
    var reviewsTrack = document.querySelector('.reviews-track');
    var reviewCards = document.querySelectorAll('.review-card');
    var reviewPrev = document.getElementById('review-prev');
    var reviewNext = document.getElementById('review-next');

    if (reviewsTrack && reviewCards.length) {
      var reviewIndex = 0;

      function updateReviewSlide() {
        reviewsTrack.style.transform = 'translateX(-' + (reviewIndex * 100) + '%)';
      }

      if (reviewNext) {
        reviewNext.addEventListener('click', function () {
          reviewIndex = (reviewIndex + 1) % reviewCards.length;
          updateReviewSlide();
        });
      }

      if (reviewPrev) {
        reviewPrev.addEventListener('click', function () {
          reviewIndex = (reviewIndex - 1 + reviewCards.length) % reviewCards.length;
          updateReviewSlide();
        });
      }

      setInterval(function () {
        reviewIndex = (reviewIndex + 1) % reviewCards.length;
        updateReviewSlide();
      }, 6000);
    }
  }

})();
