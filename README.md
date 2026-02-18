# Lifewood Data Technology - Modern Animated Website

## 🚀 Complete Multipage Website with GSAP Animations

A fully-featured, production-ready website for Lifewood Data Technology featuring:
- ✨ **6 Animated Pages** with smooth GSAP animations
- 📱 **Fully Responsive** design (desktop, tablet, mobile)
- 🎨 **Brand-Aligned Design** with custom color system
- 🔄 **Client-Side Routing** with React Router
- ⚡ **Fast Development** with Vite
- 🎭 **Scroll Triggers** for performance-optimized animations
- 📧 **Interactive Forms** with validation and feedback

---

## 📁 Website Pages

### 1. **Hero (Home)** - `/`
The landing page featuring:
- Animated headline reveal with GSAP text animation
- Subheadline fade-in effect
- Dual CTA buttons with hover animations
- Parallax background movement on mouse move
- Modern gradient background with floating elements

### 2. **AI Initiatives** - `/ai-initiatives`
Showcasing AI services and projects:
- **6 Service Cards** with 3D tilt hover effects
- **4 Featured Projects** with status tracking
- Scroll-triggered entrance animations
- Staggered card reveals
- Interactive card interactions

### 3. **Our Company** - `/company`
Company information and presence:
- **About Section** with slide-in text animations
- **Animated Statistics** with counter effects
- **Team Member Count:** 150+
- **Client Satisfaction:** 98%
- **Global Offices** in 4 major cities (SF, London, Singapore, Berlin)

### 4. **Philanthropy & Impact** - `/philanthropy`
Social impact and sustainability:
- **4 Impact Metrics** with scale-up animations
- **Animated Progress Bars** for sustainability goals
- **4 Key Initiatives** (Climate, Education, Health, Social Equity)
- Smooth counter animations
- Professional data visualization

### 5. **Careers** - `/careers`
Job listings and company benefits:
- **6 Open Positions** with flip-card animations
- **8 Employee Benefits** with icons
- Career growth opportunities
- Responsive job card layout
- Call-to-action for direct applications

### 6. **Contact** - `/contact`
Communication hub:
- **Interactive Contact Form** with validation
- **Form Focus Animations** on input interaction
- **4 Contact Info Cards** (Address, Email, Phone, Social)
- **Success Message Animation** on form submission
- Map placeholder area

---

## 🎯 Animation Features

### Global GSAP Animations
- ✓ **Text Reveals** - Animated title entrances
- ✓ **Fade Effects** - Smooth opacity transitions  
- ✓ **Scroll Triggers** - Performance-optimized scroll animations
- ✓ **Stagger Animations** - Sequential element animations
- ✓ **3D Transforms** - rotationX, rotationY, perspective effects
- ✓ **Counter Animations** - Number increment effects
- ✓ **Progress Fills** - Animated bars and progress indicators
- ✓ **Hover Effects** - Interactive element responses
- ✓ **Form Interactions** - Input focus and blur animations

### Animation Easing Functions
- `power3.out` - Smooth deceleration (most common)
- `elastic.out()` - Bouncy exit animations
- `back.out()` - Anticipation effects
- `cubic-bezier()` - Custom timing curves

---

## 🎨 Brand Identity

### Color Palette
```
Paper           #ffffff     - Primary white background
White           #F9F7F7     - Off-white accent
Sea Salt        #FFB347     - Primary action color (orange)
Saffron         #FFC370     - Secondary highlight (lighter orange)
Castleton Green #046241     - Primary brand color (green)
Dark Serpent    #133020     - Text color (dark green-black)
```

### Typography
- **Font:** Manrope
- **Weights:** 200, 300, 400, 500, 600, 700, 800
- **Imported from:** Google Fonts

---

## 🛠️ Technology Stack

### Frontend Framework
- **React** 19.2.0 - UI library
- **React Router** 7.13.0 - Client-side routing
- **Vite** 7.3.1 - Build tool & dev server

### Animation & Effects
- **GSAP** 3.14.2 - Professional animation library
- **GSAP ScrollTrigger** - Scroll-based animations
- **@gsap/react** 2.1.2 - React integration

---

## 📦 Project Structure

```
src/
├── components/
│   ├── Navigation.jsx
│   └── Navigation.css
├── pages/
│   ├── Hero.jsx & Hero.css
│   ├── AiInitiatives.jsx & AiInitiatives.css
│   ├── OurCompany.jsx & OurCompany.css
│   ├── Philanthropy.jsx & Philanthropy.css
│   ├── Careers.jsx & Careers.css
│   └── Contact.jsx & Contact.css
├── styles/
│   └── global.css
├── App.jsx
├── main.jsx
└── index.css
```

---

## 🚀 Getting Started

### Installation
```bash
cd lifewood
npm install
```

### Development Server
```bash
npm run dev
```
Server runs at: `http://localhost:5173`

### Production Build
```bash
npm run build
npm run preview
```

---

## 📱 Responsive Design

The website is fully responsive:
- **Mobile:** < 768px (single column, optimized layout)
- **Tablet:** 768px - 1024px (2-column grid)
- **Desktop:** > 1024px (full responsive grid)

All animations are optimized for both desktop and mobile devices.

---

## 📚 Documentation

Comprehensive documentation files included:

1. **WEBSITE_DOCUMENTATION.md** - Complete feature breakdown
2. **ANIMATION_GUIDE.md** - GSAP animation reference
3. **DEVELOPER_GUIDE.md** - Code examples and extensions

---

## ⚡ Performance

- **Optimized animations** using GSAP ScrollTrigger
- **Fast build tool** with Vite
- **Lazy loading** of animations (only when visible)
- **Hardware accelerated** 3D transforms
- **Minimal dependencies** - only essential packages

---

## 🎨 Customization

### Change Brand Colors
Edit `src/styles/global.css` CSS variables

### Add Navigation Links
Edit `src/components/Navigation.jsx`

### Create New Pages
1. Add page component in `src/pages/`
2. Add route in `src/App.jsx`
3. Add navigation link

See **DEVELOPER_GUIDE.md** for detailed examples.

---

## ✨ Features

- [x] 6 fully animated pages
- [x] Responsive design (mobile, tablet, desktop)
- [x] GSAP animations with ScrollTrigger
- [x] Contact form with validation
- [x] Interactive components
- [x] Brand color system
- [x] Smooth page transitions
- [x] Performance optimized

---

**Version:** 1.0.0 | **Status:** Production Ready | **Created:** February 2026

Enjoy your modern Lifewood website! 🚀
