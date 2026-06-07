export const articles = [
  {
    slug: 'future-interactive-web',
    title: 'The Future of Interactive Web Experiences',
    category: 'Web Engineering',
    categoryColor: 'text-brand',
    categoryBg: 'from-brand/40 to-blue-600/40',
    date: 'June 8, 2026',
    excerpt: 'Exploring how WebGL and React are bridging the gap between flat interfaces and immersive digital environments.',
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800',
    content: `
# The Future of Interactive Web Experiences

For years, the web has been defined by the DOM—a two-dimensional document layout model. We optimized for grids, typography, and responsive breakpoints. But recently, a massive paradigm shift has begun accelerating.

## The Convergence of 2D and 3D

With libraries like React Three Fiber, we are no longer just building websites; we are building *spaces*. 

> "We are moving from a web that we read, to a web that we occupy."

Consider how fluid it feels when a button click doesn't just change a CSS state, but actively shifts a 3D camera, altering the lighting and physics of the environment around your content. 

### Key Technologies Driving This Shift:
* **WebGL & WebGPU:** Pushing millions of polygons directly in the browser without plugins.
* **React Ecosystem:** Allowing declarative orchestration of complex 3D scenes alongside standard DOM elements.
* **WASM (WebAssembly):** Running heavy physics engines (like Rapier) at near-native speeds.

## The Challenges Ahead

Of course, it isn't all perfect yet. Performance optimization is critical. You can't just throw a 50MB GLTF model onto a homepage and expect a good Lighthouse score. We have to be smart about texture compression, geometry instancing, and graceful degradation for mobile devices.

But the tools are getting better every day. The web of 2030 won't look like a digital newspaper—it will look like a digital universe.
    `
  },
  {
    slug: 'friction-in-design',
    title: 'Why We Seek Friction in Design',
    category: 'Philosophy',
    categoryColor: 'text-purple-400',
    categoryBg: 'from-purple-500/40 to-pink-600/40',
    date: 'May 22, 2026',
    excerpt: 'Not all friction is bad. Sometimes, adding cognitive load intentionally creates more memorable and meaningful user interactions.',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
    content: `
# Why We Seek Friction in Design

As product designers, we are taught that "friction" is the enemy. We spend our careers trying to reduce the number of clicks, streamline checkout processes, and make onboarding as "seamless" as possible. 

But what if seamless is sometimes... boring?

## The Value of Effort

Think about physical luxury goods. A heavy, mechanical watch doesn't tell time better than an Apple Watch. In fact, it requires *more* effort—you have to wind it. But that friction creates a sense of tactile connection and value.

In digital design, we can leverage intentional friction:

* **Confirmation Steps:** Making someone explicitly type "DELETE" before removing an account forces them to pause and reflect.
* **Pacing and Anticipation:** Adding a slight delay or complex animation before revealing a highly-anticipated result (like a loot box or test score) heightens the emotional payoff.
* **Easter Eggs:** Forcing a user to click a button 10 times to unlock a secret room isn't "good UX" by traditional metrics, but it is *delightful UX*.

> Friction isn't always a barrier. Sometimes, friction is the texture that makes an experience memorable.

Next time you design a flow, ask yourself: Am I making this too easy to forget?
    `
  },
  {
    slug: 'art-of-dark-mode',
    title: 'The Art of the Perfect Dark Mode',
    category: 'UI / UX',
    categoryColor: 'text-blue-400',
    categoryBg: 'from-blue-600/40 to-indigo-600/40',
    date: 'April 14, 2026',
    excerpt: 'True black vs. off-black, managing contrast ratios, and why glowing accents look so good on dark surfaces.',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
    content: `
# The Art of the Perfect Dark Mode

Dark mode is no longer a niche feature for developers; it is an expectation. But designing a truly beautiful dark UI is much harder than simply inverting the colors.

## Pure Black vs. Dark Gray

Many designers debate whether to use \`#000000\` (pure black) or a very dark gray (like \`#121212\`). 

On OLED screens, pure black actually turns off the pixels, saving battery and creating infinite contrast. However, pure black can cause "OLED smearing" when scrolling text, and it can sometimes feel too stark.

A great compromise is a pure black background with dark gray elevated surfaces.

## Glows and Shadows

In light mode, we use drop shadows to indicate elevation. In dark mode, shadows disappear into the background. Instead, we must rely on:

1. **Surface Illumination:** Lighter shades of gray to indicate elements closer to the user.
2. **Neon Accents:** Subtle, glowing box-shadows colored with your primary brand accent (e.g., a green or purple blur).

Mastering these techniques is the key to creating a dark mode that doesn't just look like an afterthought, but rather feels like a premium, native experience.
    `
  }
];
