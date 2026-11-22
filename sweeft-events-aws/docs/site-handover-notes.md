# Sweeft Events website

Built from the Figma file **Tech-Consultant › Page 5** (Home, Services, Experience, Gallery, Contact).
Plain HTML/CSS/JS with no build step. Fonts and images are bundled locally. Page hero images were AI-upscaled to 2000px so they stay sharp on large screens.

## Open it
- Double-click `index.html`, or upload the whole folder to any static host (Netlify, Vercel, cPanel, GitHub Pages).
- Keep the folder structure as it is: `assets/`, `css/`, `fonts/`, `js/`.

## Pages
| File | Page |
|---|---|
| `index.html` | Home |
| `services.html` | Services (sticky quick-links that highlight as you scroll) |
| `experience.html` | The Sweeft experience / founder story |
| `gallery.html` | Gallery with filters, lightbox, reels |
| `contact.html` | Enquiry form, FAQ, map |

## Birthday splash for Solomon
`js/birthday.js` shows a full-screen splash: golden flash, fireworks, confetti, balloons, "Happy Birthday, Solomon", a cake you can tap to make a wish, then curtains open onto the site.

- **When it shows:** on the dates in `showOn` (Lagos time): **17 Nov 2026** (approval preview) and **28 Nov 2026** (the real day). It appears only on the **first visit that day on each device**; later visits that day go straight to the website. From 29 November it never shows again.
- **Preview any day:** add `?birthday=preview` to the address, e.g. `index.html?birthday=preview`. Previews never count as "seen".
- **Edit it:** change the `CONFIG` block at the top of `js/birthday.js`:
  - `title`, `name`, `to`, `message`, `signOff`, `button`: the wording
  - `age: null`: set to a number (e.g. `50`) to add a big golden age badge
  - `requireLink: true`: show it only to someone who opens a private link ending in `?bday`

## Site settings — `js/config.js`
Everything you might need to change lives in **one file**: email, WhatsApp number, form endpoint and videos.

### Videos (play on the site, not on Instagram)
Every play button opens a pop-up player on the page. For each video in `js/config.js` you can either:
- **Drop in an MP4** at the path shown (e.g. `assets/videos/mk-decor.mp4`), best option — or
- **Paste the Instagram reel link** in `instagram:` and it plays inside the site with Instagram's embed player.

Videos wired up: `mk-decor` (home hero reel + gallery tile + reel 1), `bola60`, `owambe`, `nsib`.
**The MP4s in `assets/videos/` are photo reels made from Sweeft's own event photos**, so every play button works today. When the real Instagram footage is ready, replace each file with the real video under the same name; nothing else needs to change.
The home hero card autoplays the décor reel silently. Tapping play widens the card **in place** into a landscape (16:9) player with sound; ✕, Esc or the video ending folds it back. The hero video (`mk-decor.mp4`) is landscape 1280×720, so a real replacement should be landscape too. Other reels open in a pop-up player that adapts to portrait or landscape.

### Enquiry forms → straight to sweeftevents@gmail.com
Forms send directly via **FormSubmit** (free, no account, no build step).
**One-time step:** the very first enquiry triggers an email to sweeftevents@gmail.com titled *"Action Required: Activate FormSubmit"*. Click **Activate** once and every enquiry after that arrives in the inbox as a neat table. (Submit a test enquiry yourself after uploading the site, then activate.)
Under each form there is also **"Or send it on WhatsApp"**, which opens WhatsApp with the enquiry typed out.
If the network fails, the form falls back to opening the visitor's email app so no enquiry is lost.
Note: forms only send when the site is online (on a host), not when opened by double-clicking the file.

### WhatsApp chat button
A floating green WhatsApp button sits bottom-right on every page and opens a chat with +234 905 072 5099.

## Still to confirm
- Contact page: the budget ranges and FAQ answers (the design only had the first one written).
- TikTok handle `@sweeftevents_`.

## Navigation
Services · Experience · Gallery, plus the **Plan my event** button, which goes to the contact page. The language switcher was removed to match the Figma. The nav stays fixed while scrolling; it only lifts slightly and gains a shadow once you scroll.

## Animations included
Smooth scrolling (Lenis) · fonts preloaded so text never jumps · headline words fade up gently · self-scrolling photo band (pauses on hover) · hero card fan (drift + spread on scroll) · pulsing reel play button · brand marquee · word-by-word reveal on the intro statement · giant step words sliding in · hover lifts/tilts on cards, polaroids and notes · sliding filter pill with animated gallery filtering · lightbox · Ken Burns page heroes · on-site video player · floating WhatsApp button · sticky scroll-spy chips · FAQ accordion · animated map pin.
All motion respects the device's "reduce motion" setting.

## Responsive
Laid out and checked at phone (390px), tablet (820px) and desktop (1440px) widths; no sideways scrolling on any page.
