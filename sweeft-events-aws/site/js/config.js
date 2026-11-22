/* =========================================================
   Sweeft Events — site settings (edit this file only)
   ========================================================= */
window.SWEEFT = {
  /* ---------- Contact ---------- */
  email: "sweeftevents@gmail.com",
  whatsapp: "2349050725099",            // country code + number, no "+" or spaces
  whatsappGreeting: "Hi Sweeft Events! I’d like to plan an event.",

  /* ---------- Enquiry form ----------
     Forms are sent straight to the inbox with FormSubmit (free, no account).
     The FIRST time someone submits, FormSubmit emails sweeftevents@gmail.com
     an "Activate form" link — click it once and every enquiry after that
     lands in the inbox. (Optional: after activating, FormSubmit gives you a
     random address like "https://formsubmit.co/ajax/a1b2c3…" — paste it below
     to hide the email address from spam bots.) */
  formEndpoint: "https://formsubmit.co/ajax/sweeftevents@gmail.com",

  /* ---------- Videos ----------
     Each video plays ON the website in a pop-up player.
     • file:      put the MP4 in assets/videos/ (best — plays instantly, no Instagram UI)
     • instagram: OR paste the reel link, e.g. "https://www.instagram.com/reel/C9abc123XYZ/"
                  (it plays inside the site using Instagram's embed player)
     If both are set, the MP4 is used first. Keep MP4s under ~15 MB (720p) so they load fast.
     NOTE: the MP4s in assets/videos/ right now are photo reels made from Sweeft's own event
     photos. Replace each with the real Instagram footage (same file name) whenever it's ready. */
  videos: {
    "mk-decor":  { title: "Inside a Sweeft décor reveal", file: "assets/videos/mk-decor.mp4", instagram: "" },
    "bola60":    { title: "Celebrations — Bola @60 & more",                     file: "assets/videos/bola60.mp4",   instagram: "" },
    "owambe":    { title: "Owambe & aso-ebi moments",             file: "assets/videos/owambe.mp4",   instagram: "" },
    "nsib":      { title: "Corporate — NSIB conference & more",              file: "assets/videos/nsib.mp4",     instagram: "" },
  },
};
