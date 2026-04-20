# Jordan Climbing Federation — www.jcf.jo

Static website for the Jordan Climbing Federation.

## Project Structure

```
jcf/
├── index.html          # Main page
├── css/
│   └── style.css       # All styles
├── js/
│   └── app.js          # Header scroll, mobile menu, animations
└── img/                # Site images
```

## How to Run

This is a plain static site — no build step or dependencies required.

### Option 1: Open directly

Open `index.html` in a browser.

### Option 2: Local server (recommended)

```bash
# Python 3
python3 -m http.server 8080

# Then visit http://localhost:8080
```

### Option 3: Node

```bash
npx serve .
```

## Notes

- **Fonts** are loaded from Google Fonts (Poppins + Montserrat) — an internet connection is required.
- The hero section expects a video file at `img/hero-video.mp4`. If absent, the fallback poster image (`img/video-fallback.jpg`) is shown instead.

