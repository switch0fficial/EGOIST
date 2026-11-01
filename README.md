# EGOIST - Cinematic 3D Cyberpunk Website

A cinematic, immersive 3D cyberpunk website for EGOIST, a verified Blood Strike content creator. Features a Blade Runner 2049-inspired orange haze aesthetic with tactical FPS HUD elements.

## Features

- **Immersive 3D Background**: Procedural cyberpunk city canyon with Three.js (InstancedMesh buildings, fog, particles, holographic elements)
- **Smooth Animations**: GSAP + ScrollTrigger for scroll-based animations, Lenis smooth scroll on desktop
- **Mobile-First Design**: Optimized for touch devices with native scrolling, responsive 9:16 clip cards
- **Custom Cursor**: Tactical crosshair cursor with hover effects (desktop only)
- **Cinematic Preloader**: Terminal-style boot sequence with letterbox transitions
- **Glitch Effects**: Text scramble reveals, chromatic aberration, scanlines, film grain
- **No Build Step**: Pure HTML/CSS/JS with ES modules, runs on any static server

## Tech Stack

- HTML5, CSS3, Modern JavaScript (ES modules)
- Three.js (CDN import map, pinned v0.160.0)
- GSAP + ScrollTrigger (CDN)
- Lenis smooth scroll (CDN, desktop only)
- Google Fonts: Orbitron, Rajdhani, Share Tech Mono

## Running Locally

**Important**: ES modules don't load from `file://` protocol. You must use a local server.

### Option 1: Using npx serve (recommended)

```bash
cd EGOIST
npx serve
```

Then open http://localhost:3000 in your browser.

### Option 2: Using Python

```bash
cd EGOIST
python -m http.server 8000
```

Then open http://localhost:8000 in your browser.

### Option 3: Using VS Code Live Server

1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

## Deployment

The site can be deployed for free on:

- **Netlify**: Drag and drop the EGOIST folder
- **Vercel**: Connect your Git repository or use CLI
- **GitHub Pages**: Push to a GitHub repo and enable Pages from the EGOIST folder

## Customization

### Editing Content

All editable content is in `js/config.js`:

- Social links (TikTok, YouTube, WhatsApp)
- Business email
- Funny clips and edits (TikTok URLs)
- Join card details
- Footer social links

Simply edit the values in the `config` object.

### Adding Profile Picture

**Temporary (local preview only)**:
1. Click on the profile frame in the hero section
2. Select an image from your device
3. The image will be saved to localStorage for preview

**Permanent**:
1. Place your profile picture at `assets/images/profile.jpg`
2. Recommended size: 400x400px or larger
3. The image will automatically load on next visit

### Adding Clip Thumbnails

Optional: Add custom thumbnails for clips

1. Place images in `assets/images/clips/`
2. Name them:
   - `funny-01.jpg`, `funny-02.jpg`, etc. (for funny clips)
   - `edits-01.jpg`, `edits-02.jpg`, etc. (for edits)
3. Recommended aspect ratio: 9:16 (vertical)
4. If images are missing, stylish glitchy placeholders will be shown

### Color Theme

Colors are defined as CSS variables in `css/style.css` and reused in Three.js:

```css
--black: #0b0807
--dark-brown: #1d130f
--reddish-brown: #5a2e22
--dark-maroon: #3a1317
--red: #8f2d27
--orange: #a85a2a
--amber: #b07a2a
--golden-yellow: #a98a3a
--bright-yellow: #c9ad4f
--cream: #e3d7bd
--pale-yellow: #d8cc9a
--peach: #d2a285
```

To change colors, update the CSS variables and the corresponding hex values in `js/scene.js`.

## File Structure

```
EGOIST/
├── index.html              # Main HTML structure
├── README.md               # This file
├── css/
│   └── style.css          # All styles with CSS variables
├── js/
│   ├── config.js          # All editable content
│   ├── scene.js           # Three.js 3D background
│   ├── animations.js      # GSAP animations & interactions
│   └── main.js            # Main entry point
└── assets/
    ├── favicon.svg        # Site favicon
    └── images/
        ├── profile.jpg    # Profile picture (add your own)
        └── clips/         # Optional clip thumbnails
```

## Performance

- Desktop: Targets 60fps with post-processing (bloom, grain, vignette)
- Mobile: Targets 30+fps with reduced particle count and no post-processing
- Pixel ratio capped at 1.5 to balance quality and performance
- 3D loop pauses when tab is hidden
- WebGL fallback to CSS gradient if 3D fails

## Accessibility

- Semantic HTML with proper heading hierarchy
- Skip link for keyboard navigation
- ARIA labels on icon-only links
- Visible focus states
- AA contrast ratios
- Respects `prefers-reduced-motion` (static camera, no glitch/flicker)
- Touch targets 44px or larger
- No horizontal scroll

## Browser Support

- Modern browsers with ES6 module support
- WebGL for 3D background (graceful fallback if unavailable)
- iOS Safari, Chrome, Firefox, Edge

## License

This project is for EGOIST's personal brand use.
