# Lifewood Website - Animation Quick Reference

## Animation Overview by Page

### Hero Page (`src/pages/Hero.jsx`)
```javascript
// Timeline setup with stagger
const tl = gsap.timeline();

// 1. Title reveal (1s)
tl.from(titleRef.current, {
  opacity: 0,
  y: 50,
  duration: 1,
  ease: 'power3.out'
})

// 2. Subtitle (0.8s, starts 0.5s before title ends)
.from(subtitleRef.current, {
  opacity: 0,
  y: 30,
  duration: 0.8,
  ease: 'power3.out'
}, '-=0.5')

// 3. CTA Button (0.6s, elastic bounce)
.from(ctaRef.current, {
  opacity: 0,
  scale: 0.8,
  duration: 0.6,
  ease: 'elastic.out(1, 0.5)'
}, '-=0.4');

// Parallax mouse movement
gsap.to(containerRef.current, {
  rotationY: xPercent * 0.3,
  duration: 1,
  ease: 'power2.out'
});
```

### AI Initiatives Page (`src/pages/AiInitiatives.jsx`)
```javascript
// Scroll-triggered card animations
gsap.from(card, {
  scrollTrigger: {
    trigger: card,
    start: 'top 85%',  // Trigger when card top is 85% down viewport
  },
  opacity: 0,
  y: 60,
  duration: 0.8,
  ease: 'power3.out',
  delay: index * 0.2  // Stagger by 0.2s between cards
});

// Tilt effect on mouse move
const tiltX = (y - rect.height / 2) / 10;
const tiltY = -(x - rect.width / 2) / 10;

gsap.to(card, {
  rotationX: tiltX,
  rotationY: tiltY,
  duration: 0.3,
  ease: 'power2.out'
});
```

### Our Company Page (`src/pages/OurCompany.jsx`)
```javascript
// Animated counter
gsap.from({ value: 0 }, {
  scrollTrigger: {
    trigger: stat,
    start: 'top 85%',
  },
  value: finalValue,
  duration: 2,
  ease: 'power2.out',
  onUpdate: function() {
    numberElement.textContent = Math.round(this.targets()[0].value) + '+';
  }
});

// Slide-in animations
gsap.from(aboutRef.current?.querySelector('h2'), {
  scrollTrigger: {
    trigger: aboutRef.current,
    start: 'top 80%',
  },
  opacity: 0,
  x: -50,           // Slide from left
  duration: 0.8,
  ease: 'power3.out'
});
```

### Philanthropy Page (`src/pages/Philanthropy.jsx`)
```javascript
// Scale entrance
gsap.from(item, {
  scrollTrigger: {
    trigger: item,
    start: 'top 85%',
  },
  opacity: 0,
  scale: 0.7,
  duration: 0.7,
  ease: 'back.out(1.7)',  // Bouncy exit curve
  delay: index * 0.1
});

// Progress bar fill
gsap.from(bar.querySelector('.progress-fill'), {
  scrollTrigger: {
    trigger: bar,
    start: 'top 85%',
  },
  width: '0%',
  duration: 1.5,
  ease: 'power3.out',
  delay: index * 0.1
});
```

### Careers Page (`src/pages/Careers.jsx`)
```javascript
// Flip card entrance
gsap.from(card, {
  scrollTrigger: {
    trigger: card,
    start: 'top 85%',
  },
  opacity: 0,
  rotationY: 90,      // 90 degree rotation on Y axis
  duration: 0.8,
  ease: 'back.out(1.7)',
  delay: index * 0.15
});

// Hover elevation
card.addEventListener('mouseenter', () => {
  gsap.to(card, {
    y: -10,           // Move up 10px
    duration: 0.3,
    ease: 'power2.out'
  });
});
```

### Contact Page (`src/pages/Contact.jsx`)
```javascript
// Input focus animation
input.addEventListener('focus', () => {
  gsap.to(input, {
    scale: 1.02,      // Subtle 2% scale
    duration: 0.3,
    ease: 'power2.out'
  });
});

// Form submission feedback
gsap.timeline()
  .to(submitBtn, {
    scale: 0.95,
    duration: 0.1
  })
  .to(submitBtn, {
    scale: 1,
    duration: 0.1
  });
```

## GSAP Animation Properties

### Common Transform Properties
```javascript
{
  opacity: 0,          // Transparency (0-1)
  x: 50,              // Horizontal move (pixels)
  y: 50,              // Vertical move (pixels)
  scale: 0.5,         // Scale (0.5 = 50% size)
  rotation: 45,       // 2D rotation (degrees)
  rotationX: 90,      // 3D X rotation (degrees)
  rotationY: 90,      // 3D Y rotation (degrees)
  skewX: 10,          // Skew X (degrees)
  skewY: 10,          // Skew Y (degrees)
}
```

### Common Easing Functions
```javascript
// Linear
'none'

// Power (slow start/end)
'power0.inOut'  // Linear equivalent
'power1.inOut'  // Slightly eased
'power2.inOut'  // More eased (default middle ground)
'power3.inOut'  // Heavy easing
'power4.inOut'  // Very heavy easing

// Elastic (bouncy)
'elastic.out(1, 0.5)'     // Bounce out with controlled oscillation
'elastic.inOut(1, 0.5)'   // Bounce in and out

// Back (anticipation)
'back.out(1.7)'           // Bounce back effect when exiting
'back.in(1.7)'            // Anticipation when entering
'back.inOut(1.7)'         // Both

// Bounce
'bounce.out'              // Cartoon bounce exit
'bounce.inOut'            // Bounce in and out

// Circ (circular)
'circ.inOut'              // Smooth circular motion

// Sine (smooth wave)
'sine.inOut'              // Even smoother than power3
```

## Timing Patterns

### Stagger Effect
```javascript
// Offset each animation
delay: index * 0.2  // First: 0s, Second: 0.2s, Third: 0.4s, etc

// Or use timeline stagger
tl.staggerFrom(elements, 0.1, {
  y: 20,
  opacity: 0
}, 0.1)  // 0.1s between each element
```

### Timeline Sequencing
```javascript
// Absolute positioning (default)
tl.from(element1, { ... })      // Start at 0s
   .from(element2, { ... })     // Starts when element1 finishes

// Relative positioning
tl.from(element1, { ... })      // Starts at 0s
   .from(element2, { ... }, 0)  // Starts at same time as element1

tl.from(element1, { ... })      // Starts at 0s
   .from(element2, { ... }, '-=0.5') // Starts 0.5s before element1 ends
```

## ScrollTrigger Triggers

### Trigger Point Syntax
```javascript
// When element top reaches 80% of viewport height
start: 'top 80%'        // Most common usage

// Other examples
start: 'top top'        // Element top at viewport top
start: 'top center'     // Element top at viewport center
start: 'center center'  // Element center at viewport center
start: 'bottom bottom'  // Element bottom at viewport bottom

// With offsets
start: 'top 80%+=100'   // 80% plus 100 extra pixels
start: 'top 80%-100'    // 80% minus 100 pixels
```

### Auto-Kill (Performance)
```javascript
// By default, ScrollTrigger animations auto-kill when no longer needed
// This is good for performance - animations clean up after themselves
```

## Performance Tips

1. **Use ScrollTrigger:** Only animate when element is in view
2. **Avoid simultaneous animations:** Stagger them for better performance
3. **Use transform properties:** `x, y, scale, rotate` use GPU
4. **Avoid animating:** `width, height, top, left` (causes reflows)
5. **Cache references:** Store DOM references in `useRef` once
6. **Cleanup:** Scroll animations auto-cleanup, but mouse listeners need manual removal

## Browser DevTools

### Chrome DevTools Animation Inspector
1. Open DevTools (F12)
2. Go to Animations tab
3. Observe running GSAP animations in real-time
4. Slow down animations for debugging (⚙️ → 10% speed)

### Common Debugging
```javascript
// Check if animation is running
gsap.getAll().forEach(animation => console.log(animation));

// Pause all animations
gsap.globalTimeline.pause();

// Resume all animations
gsap.globalTimeline.resume();

// See ScrollTrigger triggers
ScrollTrigger.getAll().forEach(trigger => console.log(trigger));
```

## Responsive Animation Adjustments

The website automatically adjusts animations on small screens:
- Duration remains the same (users expect instant feedback on mobile)
- Stagger delays adjust proportionally
- 3D transforms work on modern mobile devices
- Touch interactions replace mouse-based effects

## Custom Animation Example

```javascript
// Create your own animation
useEffect(() => {
  const tl = gsap.timeline({
    defaults: {
      duration: 0.5,
      ease: 'power2.out'
    }
  });

  // Sequence multiple animations
  tl.from('.title', { opacity: 0, y: 20 })
    .from('.subtitle', { opacity: 0, y: 20 }, 0.2)
    .from('.content', { opacity: 0, scale: 0.9 }, 0.4);

}, []);
```

## Animation Performance Monitoring

```javascript
// Enable GSAP stats
if (process.env.NODE_ENV === 'development') {
  gsap.set('.selector', { '--stat': 'GSAP animations active' });
}

// Check frame rate
gsap.globalTimeline.timeScale();  // Returns current speed multiplier
```

---

**Note:** All animations use GSAP 3.14.2+ with React integration via @gsap/react 2.1.2
