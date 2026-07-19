# Web Development Guidelines

## Mobile Safari Compatibility
- **Fullscreen API**: Do not rely on `requestFullscreen()` for mobile web apps, as it is unsupported on iOS Safari. Always implement a CSS-based "faux-fullscreen" fallback (e.g., `fixed inset-0 z-[100] w-full h-[100vh]`) for mobile users.
- **Gradient Text Clipping**: When using `bg-clip-text` for gradient text, ensure there is sufficient vertical padding (e.g., `py-4`) applied **directly to the element with `bg-clip-text`** (not its parent wrapper) to prevent ascenders/descenders from clipping on iOS rendering engines.
- **Gradient Text Opacity Repaint Bug**: WebKit/Safari often fails to visually repaint elements when animating `opacity` inside a `bg-clip-text` container. To fix this, apply `bg-clip-text` directly to individual elements rather than a parent wrapper.
- **Gradient Text Drop Shadow Bug**: When combining `drop-shadow` on a parent and `bg-clip-text` on a child, animating the child's `opacity` causes iOS Safari to draw a solid rectangular shadow around the bounding box instead of the text shape. Avoid combining these three properties on the same visual layer (e.g., use a solid text color instead of a gradient for the animated element).

## Vite Network Testing
- When building web applications that the user intends to test on their mobile device (via LAN or Tailscale), always configure `vite.config.js` with `server: { allowedHosts: true }` and run the dev server with the `--host` flag to expose it to the network.
