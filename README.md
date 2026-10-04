# Dr. Gyanendra Ratna Tuladhar: portfolio site

Plain HTML, CSS and JavaScript. No build step, no libraries. Open `index.html` in a browser, or serve the folder with any static server.

## Structure

```
index.html  about.html  work.html  writing.html  contact.html  article.html
robots.txt  sitemap.xml  site.webmanifest  favicon.ico
assets/
  css/    tokens, base, layout, components, sections, utilities  (load in this order)
  js/     nav.js, reveal.js, carousel.js, form.js   (small scripts, no globals, data-attribute hooks)
  fonts/  Anton, Instrument Sans (variable), Instrument Serif italic  (self-hosted, latin subset)
  images/ WebP at 480 / 960 / 1600 px plus one JPG fallback per photo, favicons, og-image.jpg
```

All asset paths are relative. Fonts are declared once in `assets/css/tokens.css`. Images are referenced from the HTML with `<picture>`.

## Design tokens

Every color, type size, space, radius, easing curve and duration is a custom property in `assets/css/tokens.css`. Change a value there and it changes everywhere.

- Palette: warm white canvas, black ink, and a saffron glow (`--c-glow-*`) for the hero and inner-page headers.
- Type: Anton for headlines, Instrument Sans for text, Instrument Serif italic for the greeting and the logo only.
- Glass surfaces use `--glass-*` tokens. A solid fallback applies where `backdrop-filter` is not supported.
- Motion uses `--ease-out` and `--ease-in-out`. Every transition is under 300 ms.

## How to replace demo content

The pages are filled with demo data so the layout can be judged. Every demo item sits next to an HTML comment `<!-- DEMO -->`. Search for that comment, replace the text that follows it, and delete the comment.

1. Photos on the project cards and article cards are stand-ins. Match each to its own photo and rewrite the alt text.
2. Replace `https://www.example.com` with the real domain in every `<head>`, in `sitemap.xml` and in `robots.txt`.
3. Check the JSON-LD blocks (`sameAs`, `alumniOf`) at the top of each page.
4. Contact form: set `data-endpoint="https://..."` on the `<form data-form>` in `contact.html`. With no endpoint the form runs in demo mode: it validates, shows the sending state, then shows the success message without sending anything.
5. The full list is in `CONTENT-TO-REPLACE.md`.

## The portrait

`portrait-cutout-*.webp` is the supplied 600 px passport photo with its background removed and lightly sharpened, scaled to 1000 px. It is soft at large sizes. Replace it with a higher-resolution original, cut out the same way, when one is available.

## The carousel

`assets/js/carousel.js` runs the Selected work strip on the home page. It moves left to right at 36 px per second and loops. Visitors can drag it either way, scroll sideways, or use the arrow buttons. It pauses on hover, on keyboard focus and when scrolled out of view, and has a visible pause button. With `prefers-reduced-motion` it starts paused. Without JavaScript it is a normal sideways scroller.

## Converting to a WordPress theme

Comments mark the boundaries:

| Marker | Becomes |
|---|---|
| `<!-- WP: header.php -->` | `header.php` |
| `<!-- WP: footer.php -->` | `footer.php` |
| `<!-- WP: template-part: name -->` | `get_template_part( 'template-parts/name' )` |
| `<!-- WP: dynamic ... -->` | a loop or option: projects, posts, experience, testimonials, contact details |
| `<!-- WP: single.php -->` | `single.php` for `article.html` |

Page map: `index.html` is `front-page.php`, `about.html`, `work.html` and `contact.html` are page templates, `writing.html` is the posts archive, `article.html` is `single.php`.

Class names follow BEM (`block__element--modifier`). JavaScript finds elements through `data-` attributes, not class names. Enqueue the six CSS files in the order listed above, and the three scripts with `defer`.

## Accessibility and performance notes

- Skip link, one `h1` per page, landmark elements, visible focus, `aria-current` on the active nav link.
- The mobile menu is a full-screen panel. Focus stays inside it while open. Escape closes it.
- Scroll reveals use `IntersectionObserver` and play once. Without JavaScript all content is visible.
- With `prefers-reduced-motion: reduce` movement is removed and only a short fade remains.
- The hero image has `fetchpriority="high"`. Images below the first screen use `loading="lazy"`.
