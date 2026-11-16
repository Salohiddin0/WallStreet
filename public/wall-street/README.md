# WALL STREET English Center website

A responsive, static HTML/CSS/vanilla JavaScript website. The public site files are under `public/wall-street/`; this Next.js workspace serves them at `/wall-street/index.html` and embeds that static page in the project preview. No application framework is used for the website itself.

## Run locally

From the project root, run the existing development server (`pnpm dev`) and open `/wall-street/index.html`. The project Preview displays the same page. To host the static site independently, upload the contents of `public/wall-street/` to a static host and use `index.html` as the entry point.

## Update content

- **Certificates:** place owner-approved image files in `assets/certificates/`, then add entries in `js/certificates.js` to `window.WS_CERTIFICATES`. Each entry uses `src` (for example `./assets/certificates/sample.webp`), `student`, `title`, `year`, and a two-digit `month` (`01`–`12`). The gallery is empty until real certificates are registered. Year and month filters, swipe scrolling, arrow navigation, and click-to-enlarge are provided.
- **Prices:** update the confirmed Beginner starting price in `index.html` (`460 000 UZS / month`). Do not publish other prices until confirmed by the center.
- **Photos:** replace the photo URLs in `index.html` with approved local image paths. Update each image's alt text to accurately describe the photo.
- **Translations:** edit the centralized `window.WS_TRANSLATIONS` object in `js/translations.js`. Keep the same keys across `uz`, `ru`, and `en`; Uzbek is the default language. The selected language is remembered in local storage.
- **Contact details and address:** replace the clearly marked contact placeholders in `index.html` and `js/translations.js` with owner-confirmed phone, social, address, opening-hours, and map-embed details.
- **Courses:** course names, descriptions, audience, focus, and level are in `js/translations.js` (`course1` through `course6`). Update the six matching course records at the top of `js/script.js` if course level indicators change.
- **Founder, teachers, reviews, and statistics:** replace placeholder copy only with details and figures verified by the center. Demo review content is explicitly labeled; no student certificates, testimonials, or performance totals are fabricated.

## Registration integration

The trial form validates name, course selection, and phone-number length in the browser. It deliberately does not save or transmit submitted information. Connect it to a consent-aware API, email workflow, or Telegram handler before claiming online registration works; validate and protect submissions on the server as well.
