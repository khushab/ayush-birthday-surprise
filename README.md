# A surprise for Ayush 🎁

A multi-page birthday surprise for Ayush's 29th, from the Bread & Butter team.

**Live site:** https://khushab.github.io/ayush-birthday-surprise/

## What happens

1. **The gate:** "Are you Ayush?" (this tap also switches sound on).
2. **The hook:** a fake age calculator that stalls and goes backwards, crashes at 99% with roast pop-ups and a blue screen, cuts to a breaking-news broadcast, and ends on a WANTED poster.
3. **The photo universe:** flip cards, a photo mosaic that builds his face from 147 tiny photos as he scrolls, and a movie-poster maker.
4. **The team reveal:** a DO NOT CLICK button, a friendly "hack", and one gift box per teammate. The finale stays locked until every box is open.
5. **The finale:** two seconds of darkness, HAPPY BIRTHDAY with fireworks that follow his taps, a cake to blow out, and the group letter.

There's also a hidden 🍞 on the photo page that unlocks a bonus photo.

## Edit the words and photos

Everything he reads lives in **`src/content.js`**, with comments explaining each part. Text marked `DEMO` is a placeholder:

- `TEAM`: each person's name, gift colour, optional photo and **personal note**
- `FINALE.message`: the **final group message**
- `NEWS.subheadlines` and `NEWS.ticker`: the **inside jokes**

Photos live in **`public/photos/`**. Point `content.js` at any file there as `'photos/<file name>'`. A missing photo shows a placeholder instead of breaking. The mosaic tiles are in `public/photos/tiles/`.

The link-preview text (WhatsApp, iMessage) is in the `<title>` and `og:` tags of `index.html`.

## Run locally

```bash
npm install
npm run dev
```

## Deploy

Every push to `main` builds the site and publishes it to GitHub Pages through `.github/workflows/deploy.yml`.
