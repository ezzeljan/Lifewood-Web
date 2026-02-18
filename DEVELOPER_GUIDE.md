# Lifewood Website - Developer Guide

## Code Examples & Extension Points

This guide provides practical examples for extending and customizing the Lifewood website.

## Adding a New Page

### Step 1: Create Page Component
`src/pages/Blog.jsx`
```jsx
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Blog.css';

gsap.registerPlugin(ScrollTrigger);

export default function Blog() {
  const titleRef = useRef(null);
  const postsRef = useRef([]);

  useEffect(() => {
    // Animate title on page load
    gsap.from(titleRef.current, {
      opacity: 0,
      y: 50,
      duration: 0.8,
      ease: 'power3.out'
    });

    // Animate blog posts on scroll
    postsRef.current.forEach((post, index) => {
      gsap.from(post, {
        scrollTrigger: {
          trigger: post,
          start: 'top 85%',
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power3.out',
        delay: index * 0.1
      });
    });
  }, []);

  const posts = [
    {
      title: 'The Future of AI',
      excerpt: 'Exploring emerging trends...',
      date: 'Feb 15, 2026',
      category: 'AI'
    },
    // ... more posts
  ];

  return (
    <main className="blog">
      <section className="blog-section">
        <div className="container">
          <h1 ref={titleRef} className="section-title">Blog</h1>
          
          <div className="posts-grid">
            {posts.map((post, index) => (
              <article
                key={index}
                ref={(el) => (postsRef.current[index] = el)}
                className="blog-card"
              >
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <div className="post-meta">
                  <span>{post.date}</span>
                  <span className="category">{post.category}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
```

### Step 2: Create Styles
`src/pages/Blog.css`
```css
.blog {
  background: linear-gradient(180deg, var(--paper) 0%, var(--white) 100%);
}

.blog-section {
  padding: 5rem 2rem;
  margin-top: 70px;
}

.blog-section .section-title {
  font-size: 3rem;
  text-align: center;
  margin-bottom: 3rem;
  color: var(--dark-serpent);
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2.5rem;
}

.blog-card {
  background: var(--white);
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(4, 98, 65, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.blog-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
  border-color: var(--saffron);
}

.blog-card h3 {
  font-size: 1.3rem;
  color: var(--dark-serpent);
  margin-bottom: 1rem;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  margin-top: 1rem;
  font-size: 0.85rem;
  color: #666;
}

.category {
  background: rgba(255, 179, 71, 0.15);
  color: #d4860d;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

@media (max-width: 768px) {
  .blog-section {
    padding: 3rem 1rem;
  }

  .posts-grid {
    grid-template-columns: 1fr;
  }
}
```

### Step 3: Add Route in App.jsx
```jsx
// Add import
import Blog from './pages/Blog';

// Add route in AppRoutes
function AppRoutes() {
  return (
    <Routes>
      {/* ... existing routes */}
      <Route path="/blog" element={<PageTransition><Blog /></PageTransition>} />
    </Routes>
  );
}
```

### Step 4: Add Navigation Link
In `src/components/Navigation.jsx`, update the `navLinks` array:
```jsx
const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/ai-initiatives', label: 'AI Initiatives' },
  { path: '/company', label: 'Company' },
  { path: '/philanthropy', label: 'Impact' },
  { path: '/careers', label: 'Careers' },
  { path: '/blog', label: 'Blog' },        // Add this
  { path: '/contact', label: 'Contact' }
];
```

## Customizing Brand Colors

### Global Color Variables
Edit `src/styles/global.css`:
```css
:root {
  --paper: #ffffff;
  --white: #F9F7F7;
  --sea-salt: #FFB347;        /* Primary action color */
  --saffron: #FFC370;         /* Hover/highlight color */
  --castleton-green: #046241; /* Primary brand color */
  --dark-serpent: #133020;    /* Text color */
}
```

### Using Colors in Components
```css
/* Button with brand colors */
.btn-primary {
  background-color: var(--sea-salt);
  color: var(--dark-serpent);
}

.btn-primary:hover {
  background-color: var(--saffron);
}

/* Theme a section */
.green-section {
  background-color: var(--castleton-green);
  color: var(--paper);
}
```

## Advanced GSAP Patterns

### Multiple Timelines
```jsx
useEffect(() => {
  // Timeline 1: Hero animations
  const heroTl = gsap.timeline();
  heroTl.from('.hero-title', { opacity: 0, y: 20 })
        .from('.hero-subtitle', { opacity: 0, y: 20 }, 0.2);

  // Timeline 2: Feature animations (independent)
  const featureTl = gsap.timeline();
  featureTl.from('.feature-card', { 
    opacity: 0, 
    scale: 0.8,
    stagger: 0.1
  });

  // Timeline 3: Scroll-triggered animation
  const scrollTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.stats-section',
      start: 'top 80%',
    }
  });
  scrollTl.from('.stat', { 
    textContent: 0, 
    duration: 2,
    snap: { textContent: 1 }
  });

}, []);
```

### Conditional Animations
```jsx
// Different animations for desktop vs mobile
useEffect(() => {
  const isMobile = window.innerWidth < 768;

  if (isMobile) {
    // Simple animation for mobile
    gsap.from(titleRef.current, {
      opacity: 0,
      duration: 0.6
    });
  } else {
    // Complex animation for desktop
    gsap.from(titleRef.current, {
      opacity: 0,
      rotationX: 90,
      duration: 1,
      ease: 'back.out(1.7)'
    });
  }

  const handleResize = () => window.innerWidth < 768;
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);
```

### Reverse Animation on Hover
```jsx
// Hover animation that reverses on mouse leave
card.addEventListener('mouseenter', () => {
  gsap.to(card, {
    backgroundColor: var(--saffron),
    scale: 1.05,
    duration: 0.3
  });
});

card.addEventListener('mouseleave', () => {
  gsap.to(card, {
    backgroundColor: var(--white),
    scale: 1,
    duration: 0.3
  });
});
```

## Form Integration

### Basic Form with Validation
```jsx
import { useState } from 'react';
import gsap from 'gsap';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Animate success
    gsap.to('.form-container', {
      scale: 0.95,
      opacity: 0.5,
      duration: 0.3
    });

    setSuccess(true);
    setIsLoading(false);
    setEmail('');

    // Reset after 3 seconds
    setTimeout(() => {
      gsap.to('.form-container', {
        scale: 1,
        opacity: 1,
        duration: 0.3
      });
      setSuccess(false);
    }, 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      {success && <p className="success-msg">✓ Subscribed!</p>}
      {!success && (
        <>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            required
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Subscribing...' : 'Subscribe'}
          </button>
        </>
      )}
    </form>
  );
}
```

## Dynamic Content Loading

### Infinite Scroll Pattern
```jsx
import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function InfiniteScroll() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const sentryRef = useRef(null);
  const itemsRef = useRef([]);

  const loadMoreItems = useCallback(() => {
    if (isLoading) return;
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setItems(prev => [...prev, ...new Array(12).fill(null)]);
      setIsLoading(false);
    }, 800);
  }, [isLoading]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        loadMoreItems();
      }
    });

    if (sentryRef.current) {
      observer.observe(sentryRef.current);
    }

    return () => observer.disconnect();
  }, [loadMoreItems]);

  // Animate new items when they're added
  useEffect(() => {
    const newItems = itemsRef.current.slice(-12);
    newItems.forEach((item, index) => {
      gsap.from(item, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'power3.out',
        delay: index * 0.05
      });
    });
  }, [items.length]);

  return (
    <div className="items-grid">
      {items.map((_, index) => (
        <div
          key={index}
          ref={(el) => {
            if (el) itemsRef.current[index] = el;
          }}
          className="item-card"
        />
      ))}
      <div ref={sentryRef} className="sentry-element" />
      {isLoading && <div className="loading">Loading...</div>}
    </div>
  );
}
```

## Dark Mode Implementation

### Add Dark Mode Toggle
```jsx
// In Navigation.jsx
import { useState } from 'react';

export default function Navigation() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute(
      'data-theme',
      isDarkMode ? 'light' : 'dark'
    );
  };

  return (
    <nav className="navbar">
      {/* ... existing nav code ... */}
      <button onClick={toggleDarkMode} className="theme-toggle">
        {isDarkMode ? '☀️' : '🌙'}
      </button>
    </nav>
  );
}
```

### Dark Mode CSS
```css
/* In styles/global.css */
[data-theme='dark'] {
  --paper: #1a1a1a;
  --white: #2d2d2d;
  --dark-serpent: #f0f0f0;
}

[data-theme='dark'] .btn-primary {
  background-color: var(--sea-salt);
  color: var(--white);
}

[data-theme='dark'] .card {
  background: var(--white);
  color: var(--dark-serpent);
}

/* Smooth transition between themes */
* {
  transition: background-color 0.3s ease, color 0.3s ease;
}
```

## SEO Enhancements

### Add Meta Components
```jsx
// Create src/components/SEO.jsx
import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, image, url }) {
  return (
    <Helmet>
      <title>{title} | Lifewood Data Technology</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <link rel="canonical" href={url} />
    </Helmet>
  );
}

// In page components
import SEO from '../components/SEO';

export default function Hero() {
  return (
    <>
      <SEO
        title="Home | AI Innovation & Sustainability"
        description="Lifewood Data Technology - Transforming data into innovation"
        url="https://lifewood.tech"
      />
      {/* Page content */}
    </>
  );
}
```

## Analytics Integration

```jsx
// In src/utils/analytics.js
export const trackPageView = (pageName) => {
  // Google Analytics
  if (window.gtag) {
    window.gtag('config', 'GA_ID', {
      page_path: window.location.pathname,
      page_title: pageName
    });
  }
};

export const trackEvent = (category, action, label) => {
  if (window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label
    });
  }
};

// Use in components
useEffect(() => {
  trackPageView('Hero');
}, []);

// Track button clicks
const handleCTA = () => {
  trackEvent('engagement', 'cta_click', 'hero_button');
};
```

## Performance Optimization

### Image Lazy Loading
```jsx
// Using native lazy loading
<img 
  src="image.jpg" 
  alt="Description"
  loading="lazy"
  width="400"
  height="300"
/>

// Or with Intersection Observer
const Image = ({ src, alt }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setImageSrc(src);
        observer.unobserve(entry.target);
      }
    });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [src]);

  return <img ref={ref} src={imageSrc} alt={alt} />;
};
```

### Code Splitting
```jsx
// In App.jsx
import { lazy, Suspense } from 'react';

const Hero = lazy(() => import('./pages/Hero'));
const Blog = lazy(() => import('./pages/Blog'));

function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/blog" element={<Blog />} />
      </Routes>
    </Suspense>
  );
}
```

---

**For more information, see WEBSITE_DOCUMENTATION.md and ANIMATION_GUIDE.md**
