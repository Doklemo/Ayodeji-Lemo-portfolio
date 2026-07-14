/**
 * Portfolio — Main Script
 * The only JavaScript in this portfolio. No libraries. No frameworks.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* -------------------------------------------------------
     1. MOBILE NAV TOGGLE
     ------------------------------------------------------- */
  const toggle = document.querySelector('.btn-menu');
  const navLinks = document.querySelector('.nav-links');

  if (toggle && navLinks) {
    const siteNav = document.querySelector('.site-nav');
    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isOpen));
      navLinks.classList.toggle('is-open');
      if (siteNav) siteNav.classList.toggle('menu-open', !isOpen);
    });

    // Close mobile nav when a link is clicked
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        toggle.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('is-open');
        if (siteNav) siteNav.classList.remove('menu-open');
      });
    });
  }

  /* -------------------------------------------------------
     2. ACTIVE NAV LINK
     ------------------------------------------------------- */
  const currentPath = window.location.pathname;
  const navAnchors = document.querySelectorAll('.nav-links a');

  navAnchors.forEach((a) => {
    const href = a.getAttribute('href');

    // Match exact path or filename
    const linkPath = href.replace(/^\.\.\//, '/').replace(/^\.\//, '/');
    const isActive =
      currentPath === href ||
      currentPath.endsWith(href) ||
      (href.includes('work') && currentPath.includes('/work')) ||
      (href === '/' && (currentPath === '/' || currentPath.endsWith('index.html')));

    if (isActive) {
      a.setAttribute('aria-current', 'page');
    } else {
      a.removeAttribute('aria-current');
    }
  });

  /* -------------------------------------------------------
     3. CONTACT FORM VALIDATION & SUBMISSION
     ------------------------------------------------------- */
  const form = document.getElementById('contact-form');
  const success = document.getElementById('contact-success');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Native validation
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const formData = new FormData(form);
      formData.append("access_key", "9bf20111-7a7e-475c-b8fa-126dadeb7d3f");

      const submitBtn = form.querySelector('[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }

      try {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: formData
        });
        const result = await response.json();

        if (result.success) {
          if (success) {
            form.hidden = true;
            success.hidden = false;
            
            // Hide success message and reset form after 5 seconds
            setTimeout(() => {
              success.hidden = true;
              form.hidden = false;
              form.reset();
              if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send message';
              }
            }, 5000);
          }
        } else {
          alert('Something went wrong. Please email me directly.');
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send message';
          }
        }
      } catch (error) {
        alert('Something went wrong. Please email me directly.');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send message';
        }
      }
    });

    // Handle Back-Forward Cache (bfcache) so the form correctly resets if the user leaves and returns
    window.addEventListener('pageshow', (e) => {
      if (e.persisted) {
        success.hidden = true;
        form.hidden = false;
        form.reset();
        const submitBtn = form.querySelector('[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send message';
        }
      }
    });
  }

  /* -------------------------------------------------------
     4. LAZY IMAGE LOADING FALLBACK
     ------------------------------------------------------- */
  if (!('loading' in HTMLImageElement.prototype)) {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');

    if (lazyImages.length && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target;
              if (img.dataset.src) {
                img.src = img.dataset.src;
              }
              obs.unobserve(img);
            }
          });
        },
        { rootMargin: '200px 0px' }
      );

      lazyImages.forEach((img) => observer.observe(img));
    }
  }

  /* -------------------------------------------------------
     6. NAV COLOR ADAPTATION (light ↔ dark backgrounds)
     ------------------------------------------------------- */
  const siteNav = document.querySelector('.site-nav');
  const darkSections = document.querySelectorAll('.site-footer');

  if (siteNav && darkSections.length) {
    const checkNavOverlap = () => {
      const navRect = siteNav.getBoundingClientRect();
      const navMid = navRect.top + navRect.height / 2;
      let onDark = false;

      darkSections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (navMid >= rect.top && navMid <= rect.bottom) {
          onDark = true;
        }
      });

      siteNav.classList.toggle('nav--on-dark', onDark);
    };

    window.addEventListener('scroll', checkNavOverlap, { passive: true });
    checkNavOverlap(); // run on load
  }

  /* -------------------------------------------------------
     7. TAB CONTROLLER (Case studies ↔ UI visuals)
     ------------------------------------------------------- */
  const tabButtons = document.querySelectorAll('.tab-btn');
  const viewAllLink = document.querySelector('.section-link');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Deactivate all buttons in this tab list
      const tabList = btn.closest('.tab-list');
      const paneIds = [];
      
      tabList.querySelectorAll('.tab-btn').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
        paneIds.push(b.getAttribute('aria-controls'));
      });

      // Activate clicked button
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Hide all panels associated with this tab group
      paneIds.forEach(id => {
        const pane = document.getElementById(id);
        if (pane) {
          pane.classList.remove('active');
        }
      });

      // Show target panel
      const targetId = btn.getAttribute('aria-controls');
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });

  // =========================================
  // LIGHTBOX MODAL CONTROLLER (UI VISUALS)
  // =========================================
  const lightbox = document.getElementById('visuals-lightbox');
  if (lightbox) {
    const lightboxImg = lightbox.querySelector('.lightbox-image');
    const lightboxVideo = lightbox.querySelector('.lightbox-video');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const visualCards = document.querySelectorAll('.visual-card[data-src]');

    visualCards.forEach(card => {
      card.addEventListener('click', () => {
        const fullSrc = card.getAttribute('data-src');
        const isVideo = card.getAttribute('data-type') === 'video';

        if (fullSrc) {
          if (isVideo) {
            if (lightboxImg) lightboxImg.style.display = 'none';
            if (lightboxVideo) {
              lightboxVideo.style.display = 'block';
              lightboxVideo.src = fullSrc;
              lightboxVideo.load();
              lightboxVideo.play().catch(err => console.log('Autoplay blocked:', err));
            }
          } else {
            if (lightboxVideo) {
              lightboxVideo.style.display = 'none';
              lightboxVideo.src = '';
            }
            if (lightboxImg) {
              lightboxImg.style.display = 'block';
              lightboxImg.src = fullSrc;
              const imgEl = card.querySelector('img');
              lightboxImg.alt = imgEl ? (imgEl.alt || 'UI Visual Zoomed View') : 'UI Visual Zoomed View';
            }
          }
          lightbox.showModal();
        }
      });
    });

    // Close on clicking close button
    if (lightboxClose) {
      lightboxClose.addEventListener('click', () => {
        lightbox.close();
      });
    }

    // Close on clicking backdrop
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.close();
      }
    });

    // Reset image/video src on close to clean up memory/load state
    lightbox.addEventListener('close', () => {
      if (lightboxImg) {
        lightboxImg.src = '';
        lightboxImg.alt = '';
      }
      if (lightboxVideo) {
        lightboxVideo.pause();
        lightboxVideo.src = '';
      }
    });
  }
});
