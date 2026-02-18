# Lifewood Data Technology - Modern Animated Website

A fully-featured, responsive multipage website for Lifewood Data Technology built with React, Vite, GSAP, and React Router. The site features smooth animations, modern design, and a comprehensive brand identity.

## Project Structure

```
lifewood/
├── src/
│   ├── components/
│   │   ├── Navigation.jsx       # Main navigation component
│   │   └── Navigation.css       # Navigation styles
│   ├── pages/
│   │   ├── Hero.jsx            # Hero/Home page
│   │   ├── AiInitiatives.jsx   # AI Services & Projects page
│   │   ├── OurCompany.jsx       # About & Offices page
│   │   ├── Philanthropy.jsx     # Impact & Sustainability page
│   │   ├── Careers.jsx          # Job listings & Benefits page
│   │   ├── Contact.jsx          # Contact form & Info page
│   │   └── [Page].css           # Individual page styles
│   ├── styles/
│   │   └── global.css           # Global design system & brand colors
│   ├── App.jsx                  # Main app with routing
│   ├── App.css                  # App-level styles
│   ├── main.jsx                 # Entry point
│   └── index.css                # Base styles
├── public/                       # Static assets
├── vite.config.js               # Vite configuration
├── package.json                 # Dependencies & scripts
└── index.html                   # HTML entry point
```

## Pages & Features

### 1. **Hero Page** (`/`)
- Animated headline with GSAP text reveal
- Subheadline fade-in animation
- Dual CTA buttons with hover effects
- Background parallax animation on mouse movement
- Modern gradient background

**Animations:**
- Title reveal with 1s ease-out
- Subtitle fade-in with stagger
- CTA button elastic bounce on entrance
- Smooth parallax on mouse movement

### 2. **AI Initiatives Page** (`/ai-initiatives`)
- Two subsections: AI Services and Featured Projects
- Service cards (6 total) with tilt/hover animations
- Project cards with status badges
- Scroll-triggered entrance animations
- Staggered card animations on scroll

**Features:**
- 6 Service cards: Machine Learning, NLP, Computer Vision, Analytics, Strategy, Custom Development
- 4 Featured Projects with status tracking
- Card hover effects with elevation and tilt
- Smooth scroll transitions

**Animations:**
- Scroll-triggered card reveals
- 3D tilt effects on card hover
- Entrance animations with stagger (0.2s delay between cards)

### 3. **Our Company Page** (`/company`)
- About Us section with text and image layout
- Company statistics with animated counters
- Global offices section with 4 locations
- Responsive grid layouts

**Features:**
- Animated counters (150+, 98%, 50+, 12)
- 4 office cards with contact information
- Professional statistics display
- Structured company information

**Animations:**
- Text slide-in from left/right
- Counter animations with number increment
- Card entrance with scale effect
- Scroll-triggered reveals

### 4. **Philanthropy & Impact Page** (`/philanthropy`)
- Impact metrics with scaling animations
- Sustainability goals progress bars
- Four main initiatives cards
- Animated counters and progress fills

**Features:**
- 4 Impact metrics cards (Lives, Trees, Energy, Water)
- 4 Sustainability progress bars with animated fills
- 4 Initiative cards with focus tags
- Professional impact presentation

**Animations:**
- Metric cards scale-up on scroll
- Progress bars fill from 0-100% with counter
- Initiative cards slide-in from alternating directions
- Smooth progress animations

### 5. **Careers Page** (`/careers`)
- 6 Job position cards with detailed information
- 8 Employee benefits cards
- CTA section for unsolicited applications
- Flip animations on job cards

**Features:**
- Job listings with: title, department, location, type, experience, description
- Benefits display with icons and descriptions
- Responsive grid layout
- Professional job card design

**Animations:**
- Job card flip (rotationY) entrance animations
- Benefit card staggered reveals
- Hover elevation effects
- Smooth transitions

### 6. **Contact Page** (`/contact`)
- Interactive contact form with validation
- Form field focus animations
- Contact information cards
- Success message animation
- Responsive form layout

**Features:**
- Form fields: Name, Email, Subject, Message
- 4 Contact info cards (Address, Email, Phone, Social)
- Success submission feedback
- Map placeholder area
- Form validation

**Animations:**
- Form scale entrance on scroll
- Input focus scaling (1.02x)
- Submit button press feedback
- Success message slide-in
- Contact info cards slide from left

## Brand Identity

### Color Palette
```css
--paper: #ffffff (Primary White)
--white: #F9F7F7 (Off-white)
--sea-salt: #FFB347 (Primary Orange/Gold)
--saffron: #FFC370 (Secondary Orange)
--castleton-green: #046241 (Primary Green)
--dark-serpent: #133020 (Dark Text)
```

### Typography
- **Font Family:** Manrope (from Google Fonts)
- **Font Weights:** 200, 300, 400, 500, 600, 700, 800

### Design System
- Consistent padding and margins
- Rounded corners: 8-20px (context dependent)
- Box shadows: Subtle elevation system
- Responsive breakpoints: 480px, 768px, 968px

## Animation Techniques Used

### GSAP Core Animations
1. **From/To Animations:** Element entrance animations
2. **Timeline Animations:** Coordinated multi-element sequences
3. **Scroll Triggers:** Scroll-based animation triggers
4. **Stagger Effects:** Sequential child animations
5. **Counter Animations:** Number increment effects

### Animation Types
- **Opacity:** Fade-in/fade-out effects
- **Transform:** Translate (x, y), scale, rotate, rotationX, rotationY
- **Box Shadow:** Dynamic elevation changes
- **Width/Height:** Progress bar fills
- **Color:** Background and border color transitions

### Popular Animation Combinations
- **Entrance:** Opacity 0 + Transform (translate/scale) → Normal state
- **Hover:** Scale + Translate Y + Box Shadow increase
- **Focus:** Scale 1.02x (subtle emphasis)
- **Progress:** Width 0-100% with counter animation
- **Flip:** rotationY 90° → 0° with stagger

## Responsive Design

The website is fully responsive with breakpoints at:
- **Desktop:** 1200px+ (full layout)
- **Tablet:** 768px - 1199px (grid adjustments, stacked navigation)
- **Mobile:** Below 768px (single column, optimized spacing)

### Mobile Optimizations
- Navigation hamburger menu
- Stacked layouts
- Larger touch targets
- Optimized font sizes
- Reduced gap and padding on small screens

## Getting Started

### Prerequisites
- Node.js 14+
- npm or yarn

### Installation
```bash
cd lifewood
npm install
```

### Development
```bash
npm run dev
```
Server will run at `http://localhost:5173`

### Production Build
```bash
npm run build
```

Output files in `dist/` directory

### Preview Production Build
```bash
npm run preview
```

## Dependencies

### Core Libraries
- **react:** ^19.2.0 - UI framework
- **react-dom:** ^19.2.0 - DOM rendering
- **react-router-dom:** ^7.13.0 - Client-side routing
- **gsap:** ^3.14.2 - Animation library
- **@gsap/react:** ^2.1.2 - React integration for GSAP

### Development Tools
- **vite:** ^7.3.1 - Build tool and dev server
- **@vitejs/plugin-react:** ^5.1.1 - React support in Vite
- **eslint:** ^9.39.1 - Code linting

## Advanced Features

### ScrollTrigger Plugin
All scroll-based animations use GSAP's ScrollTrigger plugin for optimized performance:
- Lazy initialization (animations only start when element enters viewport)
- Automatic cleanup
- Smooth performance on mobile

### Page Transitions
- Automatic scroll-to-top on page navigation
- Fade-in animation on page mount
- Context-aware routing

### Form Handling
- Controlled input components with React state
- Real-time form validation
- Success message display with auto-reset
- Dynamic form feedback animations

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid and Flexbox support required
- CSS custom properties (CSS variables)
- ES6+ JavaScript support

## Performance Optimizations

1. **Lazy Loading:** Animations trigger on scroll entry only
2. **Hardware Acceleration:** 3D transforms use GPU
3. **Minimal Repaints:** Efficient animation properties
4. **Code Splitting:** React Router enables lazy page loading
5. **Image Optimization:** Emoji icons (zero HTTP requests)

## Customization

### Changing Brand Colors
Edit `src/styles/global.css` CSS variables:
```css
:root {
  --paper: #ffffff;
  --sea-salt: #FFB347;
  /* ... etc */
}
```

### Updating Content
Edit individual page components in `src/pages/[Page].jsx`

### Modifying Animations
- GSAP animations are in component `useEffect` hooks
- Adjust duration, delay, ease properties
- See GSAP documentation: https://gsap.com/docs

### Adding New Pages
1. Create `src/pages/PageName.jsx` and `src/pages/PageName.css`
2. Import in `src/App.jsx`
3. Add route: `<Route path="/page-name" element={<PageName />} />`
4. Add navigation link in `src/components/Navigation.jsx`

## File Size Reference

The compiled website is lightweight:
- HTML: ~5KB
- CSS: ~45KB (including all pages)
- JS (Prod): ~150KB (gzipped: ~45KB)

## SEO Considerations

The site uses semantic HTML with proper heading hierarchy. For production:
1. Add `<title>` and `<meta>` tags to `index.html`
2. Use proper image alt texts
3. Add structured data (schema.org)
4. Implement sitemap and robots.txt

## Future Enhancements

Potential additions:
- Blog section with search functionality
- Dark mode toggle
- Advanced form validation and backend integration
- Analytics integration (Google Analytics)
- PWA capabilities
- Multi-language support
- CMS integration

## Support & Maintenance

- Regular dependency updates recommended
- Monitor GSAP updates for new features
- Test animations on various devices
- Consider A/B testing animation effects

## License

[Specify your license here]

---

**Created:** February 2026
**Version:** 1.0.0
**Technology Stack:** React 19 + Vite + GSAP + React Router
