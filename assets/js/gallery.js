/* ==========================================================================
   VIBEONN PARTY HALL - GALLERY MASONRY & LIGHTBOX MODAL
   ========================================================================== */

export function initGallery() {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let currentCategory = 'all';
  let visibleItems = Array.from(galleryItems);
  let currentIndex = 0;

  // Filter functionality
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      currentCategory = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (currentCategory === 'all' || itemCategory === currentCategory) {
          item.style.display = 'block';
          item.classList.add('reveal');
          setTimeout(() => item.classList.add('active'), 50);
        } else {
          item.style.display = 'none';
          item.classList.remove('active');
        }
      });

      visibleItems = Array.from(galleryItems).filter(item => {
        const itemCat = item.getAttribute('data-category');
        return currentCategory === 'all' || itemCat === currentCategory;
      });
    });
  });

  // Lightbox functionality
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.getAttribute('data-title') || 'VibeOnn Party Hall Vijayawada';

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
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', () => {
      if (!visibleItems.length) return;
      currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
      const prevItem = visibleItems[currentIndex];
      const img = prevItem.querySelector('img');
      const title = prevItem.getAttribute('data-title') || 'VibeOnn Party Hall Vijayawada';
      openLightbox(img.src, title);
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', () => {
      if (!visibleItems.length) return;
      currentIndex = (currentIndex + 1) % visibleItems.length;
      const nextItem = visibleItems[currentIndex];
      const img = nextItem.querySelector('img');
      const title = nextItem.getAttribute('data-title') || 'VibeOnn Party Hall Vijayawada';
      openLightbox(img.src, title);
    });
  }

  // Keyboard escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}
