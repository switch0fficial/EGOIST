// Main entry point - ties everything together
import { config, icons } from './config.js';

// Render content from config
function renderContent() {
  // Hero CTA buttons
  const tiktokBtn = document.querySelector('[data-platform="tiktok"]');
  const youtubeBtn = document.querySelector('[data-platform="youtube"]');
  const whatsappBtn = document.querySelector('[data-platform="whatsapp"]');

  if (tiktokBtn) tiktokBtn.href = config.tiktok;
  if (youtubeBtn) youtubeBtn.href = config.youtube;
  if (whatsappBtn) whatsappBtn.href = config.whatsapp;

  // Funny clips
  renderClips('clips-grid', config.funnyClips, config.tiktok, 'funny');

  // Edits
  renderClips('edits-grid', config.edits, config.tiktok, 'edits');

  // Join cards
  renderJoinCards();

  // Business email
  renderBusinessEmail();

  // Footer social
  renderFooterSocial();

  // Current year
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
}

function renderClips(gridId, clips, profileUrl, type) {
  const grid = document.getElementById(gridId);
  if (!grid) return;

  clips.forEach((clip, index) => {
    const card = document.createElement('a');
    card.href = clip.url;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
    card.className = 'clip-card';
    card.setAttribute('aria-label', `Watch ${clip.label} on TikTok`);

    // Check for thumbnail image
    const thumbnailPath = `assets/images/clips/${type}-${String(index + 1).padStart(2, '0')}.jpg`;

    card.innerHTML = `
      <div class="clip-thumbnail">
        <img src="${thumbnailPath}" alt="${clip.label}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
        <div class="clip-placeholder" style="display: none;">
          <span class="clip-label">${clip.label}</span>
        </div>
      </div>
      <span class="clip-label">${clip.label}</span>
      <div class="play-icon">
        <svg viewBox="0 0 24 24"><path d="${icons.play}"/></svg>
      </div>
    `;

    grid.appendChild(card);
  });

  // "More on TikTok" card
  const moreCard = document.createElement('a');
  moreCard.href = profileUrl;
  moreCard.target = '_blank';
  moreCard.rel = 'noopener noreferrer';
  moreCard.className = 'clip-card clip-more';
  moreCard.setAttribute('aria-label', `View more ${type} on TikTok`);

  moreCard.innerHTML = `
    <div class="clip-placeholder">
      <span>More ${type} on TikTok →</span>
    </div>
  `;

  grid.appendChild(moreCard);
}

function renderJoinCards() {
  const container = document.getElementById('join-cards');
  if (!container) return;

  config.joinCards.forEach(card => {
    const cardEl = document.createElement('div');
    cardEl.className = 'join-card';

    cardEl.innerHTML = `
      <svg class="join-card-icon" viewBox="0 0 24 24">
        <path d="${icons[card.platform]}"/>
      </svg>
      <h3>${card.platform.charAt(0).toUpperCase() + card.platform.slice(1)}</h3>
      <p>${card.handle}</p>
      <a href="${card.url}" target="_blank" rel="noopener noreferrer" class="cta-button">
        <svg viewBox="0 0 24 24" width="20" height="20">
          <path d="${icons[card.platform]}"/>
        </svg>
        ${card.cta}
      </a>
    `;

    container.appendChild(cardEl);
  });
}

function renderBusinessEmail() {
  const emailDisplay = document.getElementById('email-display');
  const emailSend = document.getElementById('email-send');
  const emailCopy = document.getElementById('email-copy');

  if (emailDisplay) emailDisplay.textContent = config.email;

  if (emailSend) {
    emailSend.href = `mailto:${config.email}?subject=Business Inquiry - EGOIST`;
  }

  if (emailCopy) {
    emailCopy.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(config.email);
        showToast('Email copied to clipboard');
      } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = config.email;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('Email copied to clipboard');
      }
    });
  }
}

function renderFooterSocial() {
  const container = document.getElementById('footer-social');
  if (!container) return;

  config.footerSocial.forEach(link => {
    const a = document.createElement('a');
    a.href = link.url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.setAttribute('aria-label', `Follow EGOIST on ${link.platform}`);

    a.innerHTML = `
      <svg viewBox="0 0 24 24">
        <path d="${icons[link.platform]}"/>
      </svg>
    `;

    container.appendChild(a);
  });
}

// Profile picture handling
function initProfilePicture() {
  const profileImage = document.getElementById('profile-image');
  const profilePath = 'assets/images/profile.jpg';

  // Try to load existing profile picture
  const img = new Image();
  img.onload = () => {
    profileImage.innerHTML = `<img src="${profilePath}" alt="EGOIST profile picture">`;
  };
  img.onerror = () => {
    // Show placeholder if image doesn't exist
    profileImage.innerHTML = '<div class="profile-placeholder">ADD PHOTO</div>';
  };
  img.src = profilePath;
}

// Toast notification
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastText = toast.querySelector('.toast-text');

  toastText.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Initialize everything with isolated error handling
document.addEventListener('DOMContentLoaded', () => {
  // Render content (must work)
  try {
    renderContent();
    initProfilePicture();
  } catch (error) {
    console.error('Content rendering error:', error);
  }

  // Initialize 3D scene (isolated)
  try {
    import('./scene.js').then(module => {
      window.updateScrollProgress = module.updateScrollProgress;
      window.updateSectionMood = module.updateSectionMood;
      console.log('3D scene loaded');
    }).catch(err => {
      console.warn('3D scene failed to load, using CSS fallback:', err);
      // Fallback background is already in CSS
    });
  } catch (error) {
    console.warn('3D scene import failed:', error);
  }

  // Initialize animations (isolated)
  try {
    import('./animations.js').then(module => {
      module.initAnimations();
      window.showToast = showToast;
      console.log('Animations loaded');
    }).catch(err => {
      console.warn('Animations failed to load:', err);
      // Content is still visible without animations
    });
  } catch (error) {
    console.warn('Animations import failed:', error);
  }

  // Add JS class to html for animation hooks
  document.documentElement.classList.add('js');
});
