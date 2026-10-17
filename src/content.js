// =====================================================================
//  ✏️  EDIT ME: every word and photo in the surprise lives in this file.
//
//  • Text: change anything inside the quotes. Emojis are welcome.
//  • Photos: put image files in  public/photos/  and refer to them here
//    as 'photos/<file name>'. A missing photo shows a fun placeholder
//    instead of a broken image, so you can add photos whenever.
//  • Anything marked DEMO is placeholder text waiting for the real thing.
// =====================================================================

export const NAME = 'Ayush'
export const AGE = 29
export const COMPANY = 'Bread & Butter'

// ---------------------------------------------------------------------
//  READING TIME: everything that disappears or moves on by itself
//  (pop-ups, toasts, loading messages, teaser cards, news headlines…)
//  stays on screen this many times longer than the original timing.
//  1 = original speed · 1.3 = 30% longer · 1.5 = 50% longer
// ---------------------------------------------------------------------
export const READING_TIME = 1.3

// ---------------------------------------------------------------------
//  THE TEAM: who the surprise is from.
//  The gift boxes, the "hacked by N people" line and the finale
//  signatures all follow this list, so adding or removing a person
//  here updates every count on the site.
//    color:  the colour of their gift box
//    photo:  optional, e.g. 'photos/team/avanti.jpg', shown on the lid
//    note:   their personal note. Line breaks inside `backticks` show
//            up as line breaks on the card. Notes marked DEMO are
//            placeholders waiting for the real thing.
//    signed: true when the note already ends with its own sign-off,
//            so the card doesn't add "— Name" underneath
// ---------------------------------------------------------------------
export const TEAM = [
  {
    name: 'Avanti',
    emoji: '🌻',
    color: '#ff3d7f',
    photo: null,
    // DEMO
    note: "Happy 29th, Ayush! Thank you for being the calm in every chaotic room (and, let's be honest, the cause of half the chaos). Here's to your best year yet.",
  },
  {
    name: 'Mansi',
    emoji: '✨',
    color: '#ffd23f',
    photo: null,
    note: `yo ayush!!

happpyyyy birthdayyy !!!!
i really hope you enjoy your day to the fullest and have the best year ahead.

stay happy, stay healthy, and keep being the person you are 💗

and remember, as mike would say, you just got lucky to have me on your team 😎

with love
mansi 🫶`,
    signed: true,
  },
  {
    name: 'Khushab',
    emoji: '🚀',
    color: '#3bceac',
    photo: null,
    note: `Happy birthday, bhai! 🎂

Thank you for always being there for me and looking out for me like an elder brother. You inspire me to become a little better every single day, and I'm really grateful to have you in my corner.

Lots of love ❤️`,
  },
  {
    name: 'Vibhakar',
    emoji: '🌈',
    color: '#4d9de0',
    photo: null,
    // DEMO
    note: '29 looks good on you! Thanks for the late-night calls, the questionable puns and the endless belief in this team. Have the best year.',
  },
  {
    name: 'Chinmay',
    emoji: '⭐',
    color: '#ff8c42',
    photo: null,
    note: `Happy birthday Ayush bhai 🎂 I don't say this enough, so here it is. I see how much you carry, and you still show up with full energy every single time. When I joined in June I didn't know what working here would be like. Ab lagta hai team nahi, ek gang mil gayi 😂 You made it easy to care about bb.bio, and that matters to me more than I usually let on. So enjoy your day today fullest without slack notification. Cheers 🍻`,
  },
  {
    name: 'Srijeeta',
    emoji: '💛',
    color: '#9b5de5',
    photo: null,
    note: `Happy 29th, Ayush! Thanks for making the big swings feel less scary and “what if?” feel like a pretty good place to start. Here’s to another year of building cool things together ! 🚀`,
  },
  {
    name: 'Vibhor',
    emoji: '🎈',
    color: '#e63946',
    photo: null,
    // DEMO
    note: "Happy birthday to the co-founder who celebrates every tiny win like it's the World Cup final. Never change. Here's to the next chapter!",
  },
]

// ---------------------------------------------------------------------
//  Little "loading" cards shown between pages. They tease what's next
//  without giving it away.
// ---------------------------------------------------------------------
export const TEASERS = {
  photos: { emoji: '📸', text: 'Wait… we found photos.', color: '#9b5de5' },
  team: { emoji: '🫣', text: 'Okay. Now it gets personal.', color: '#ff3d7f' },
  gate: { emoji: '⏪', text: 'Rewinding the chaos…', color: '#3bceac' },
}

// =====================================================================
//  PAGE 0: the "are you Ayush?" check (it also switches sound on)
// =====================================================================
export const GATE = {
  eyebrow: 'Incoming transmission 📡',
  yes: "Yes, it's me 🙋‍♂️",
  no: 'No 🙅',
  yesReply: "Identity confirmed ✅ Now let's find out how old you are…",
  noReply: "Nice try. Our AI is 97.3% sure you're Ayush. Proceeding anyway 😏",
  soundHint: '🔊 Sound ON. Trust us.',
}

// =====================================================================
//  PAGE 1: THE HOOK
// =====================================================================

// Joke icons on the retro desktop behind the age calculator.
export const DESKTOP_ICONS = [
  { icon: '🗑️', label: 'Recycle Bin (old jokes)' },
  { icon: '📁', label: 'My Bad Decisions' },
  { icon: '🎂', label: `${NAME}_age.exe` },
]

// Taunts for the calculator window's buttons.
export const WINDOW_TAUNTS = {
  close: "Nice try 😏 You can't close this.",
  minimize: 'Minimizing age… failed. It only goes up.',
}

// The fake progress bar. Each step moves the bar to `to` percent over
// `ms` milliseconds and shows `text`. A lower `to` makes it go backwards.
// Repeating a step with the same `to` and text pauses the bar while that
// line stays up to be read (used after the fast jumps).
export const LOADING_SCRIPT = [
  { to: 9, ms: 800, text: 'Counting candles… 🕯️' },
  { to: 16, ms: 900, text: 'Not enough candles in the country. Importing more…' },
  { to: 16, ms: 1300, text: 'Converting to dog years… 203?! 🐶' },
  { to: 54, ms: 400, text: 'Skipping the embarrassing years ⏩' },
  { to: 54, ms: 700, text: 'Skipping the embarrassing years ⏩' },
  { to: 37, ms: 800, text: 'Wait. Going back. We missed some grey hairs.' },
  { to: 63, ms: 1100, text: 'Consulting a carbon-dating lab 🔬' },
  { to: 63, ms: 1100, text: 'Asking his knees for a second opinion…' },
  { to: 91, ms: 350, text: 'Downloading more RAM to store this number 💾' },
  { to: 91, ms: 700, text: 'Downloading more RAM to store this number 💾' },
  { to: 77, ms: 700, text: 'Hmm. Recalculating 🤨' },
  { to: 98, ms: 900, text: 'Almost there…' },
  { to: 99, ms: 1300, text: 'Final number incoming…' },
  { to: 99, ms: 1600, text: 'Final number incoming…… 😬' },
]

// Shown when the bar crashes at 99%, followed by the roast pop-ups.
export const CRASH_TEXT = 'ERROR: Age too high. System cannot handle it.'

export const ERROR_ROASTS = [
  `Age exceeds maximum allowed value (28). Please try being younger.`,
  'Back Pain DLC was installed automatically.',
  'Warning: you are now officially closer to 30 than to 20. 👀',
  'Cannot display age: not enough candles in memory.',
  'Hangover recovery time updated to 3–5 business days.',
  `${NAME}.exe has stopped responding. (It's past 10:30 PM.)`,
]

export const BLUE_SCREEN = {
  lead: `Your ${NAME} ran into a problem and needs a nap.`,
  error: 'ERROR: AGE TOO HIGH.\nSYSTEM CANNOT HANDLE IT.',
  stopCode: 'TOO_OLD_TO_COMPUTE',
  whatFailed: 'knees.sys',
}

// The breaking-news broadcast. Sub-headlines rotate every few seconds.
// DEMO inside jokes: swap in your real ones.
export const NEWS = {
  channel: `${COMPANY.toUpperCase()} NEWS NETWORK`,
  photo: 'photos/ayush-pottery-selfie.jpg',
  feedLabel: 'EXCLUSIVE FOOTAGE',
  headline: `Local legend ${NAME} turns ${AGE}. Experts are shocked he survived this long.`,
  subheadlines: [
    'Co-founder caught making pottery. Investors ask if this is "the pivot". 🏺',
    '"Quick 5-minute call" enters its third hour. Witnesses say it was "just one thing".',
    'Office bread supply vanishes overnight. One suspect. Zero regrets. 🍞',
  ],
  ticker: [
    'Candle shortage declared nationwide',
    `Cake industry braces for ${NAME}'s birthday`,
    'Experts: "29 is basically 22 with a credit score"',
    'Weather: 100% chance of birthday chaos',
    `Markets: Bread ⬆ Butter ⬆ ${NAME}'s age ⬆⬆⬆`,
    `${NAME} denies being old: "I'm vintage"`,
  ],
  next: 'Police issued a poster 👀 →',
}

// The wanted poster.
export const WANTED = {
  intro: 'Meanwhile, the sheriff put this up all over town…',
  photo: 'photos/ayush-pottery-1.jpg',
  crime: 'FOR BEING TOO AWESOME',
  correction: 'Alive. He owes us a party.',
  reward: '₹29 + a lifetime supply of bread & butter 🍞🧈',
  lastSeen:
    'Leaving a pottery studio with a suspicious-looking pot, still saying "one last thing" on a call that ended 40 minutes ago.',
  charges: ['Excessive charm', 'Unlicensed pottery', 'Saying "quick call" (it never is)'],
  tapHint: '(tap the photo to catch him)',
  caughtText: '🚨 Suspect apprehended. He seems weirdly happy about it.',
  next: 'See what we did →',
}

// =====================================================================
//  PAGE 2: THE PHOTO UNIVERSE
// =====================================================================
export const UNIVERSE = {
  title: 'Welcome to the',
  titleBig: `${NAME}-verse`,
  subtitle: 'Population: 1 legend. Photo quality: questionable.',
  scrollHint: 'scroll if you dare ↓',
  // small photos that orbit the planet at the top
  orbit: [
    'photos/tiles/126.jpg',
    'photos/tiles/056.jpg',
    'photos/tiles/070.jpg',
    'photos/tiles/125.jpg',
    'photos/tiles/078.jpg',
    'photos/tiles/052.jpg',
  ],
  flipKicker: 'Exhibit A',
  flipTitle: 'Every photo has a secret',
  flipHint: 'Tap a photo to flip it.',
  teaser1: "Okay, but zoom out for a second… 🔍",
  mosaicKicker: 'Exhibit B',
  mosaicTitle: 'The big picture',
  mosaicHint: 'Keep scrolling, or tap, to put him together.',
  mosaicDone: (count) => `1 legend, made of ${count} memories. ✨`,
  teaser2: 'Then Hollywood called. 🎬',
  postersKicker: 'Exhibit C',
  postersTitle: 'Now showing',
  postersHint: 'Swipe for more. Not happy with a movie? Remake it.',
  posterPresents: 'Bread & Butter Pictures presents',
  posterBilling: `${NAME} as HIMSELF · a film by ${TEAM.length} friends with too much free time · music by his keyboard at 2 AM · no pots were harmed (some were)`,
  outro: "That was the fun part. Now the team wants a word with you… 😶",
  next: 'Meet the culprits →',
}

// Flip cards: front = photo, back = caption. Add or remove freely.
export const FLIP_CARDS = [
  {
    photo: 'photos/memory-balloon-selfie.jpg',
    caption: 'Bread & Butter team photo, but make it literal. 🍞 Nobody can explain the toast.',
  },
  {
    photo: 'photos/memory-pottery-class.jpg',
    caption: 'The pottery era. Five people, five "bowls". He swears his is a vase.',
  },
  {
    photo: 'photos/memory-cafe.jpg',
    caption: '"Quick breakfast catch-up." 3 hours, 2 juices, 1 lonely slice of toast.',
  },
  {
    photo: 'photos/memory-game-night.jpg',
    caption: "Game night: where friendships are tested and someone always 'didn't know that rule'.",
  },
  {
    photo: 'photos/memory-ethnic-day.jpg',
    caption: "The 'we're a very serious startup' pose. It lasted four seconds.",
  },
  {
    photo: 'photos/memory-outdoor-group.jpg',
    caption: 'Team outing. The statue was the only one who stood still for the photo.',
  },
  {
    photo: 'photos/memory-antlers.jpg',
    caption: 'Festive season: antlers optional, vibes mandatory. 🦌',
  },
  {
    photo: 'photos/memory-yellow-wall.jpg',
    caption: 'We take birthdays VERY seriously around here. Consider yourself warned. 😏',
  },
]

// The photo mosaic: `photo` is built out of all the tiny `tiles`.
export const MOSAIC = {
  photo: 'photos/ayush-throwback-2.jpg',
  columns: 16,
  tiles: Array.from({ length: 147 }, (_, i) => `photos/tiles/${String(i + 1).padStart(3, '0')}.jpg`),
}

// Movie posters. The first four are shown (each with one of these
// photos); the "Remake" button swaps in another movie from the list.
// genre sets the look: action, romance, mafia, spy, horror, scifi, cartoon
export const POSTER_PHOTOS = [
  'photos/ayush-throwback-2.jpg',
  'photos/ayush-pottery-2.jpg',
  'photos/ayush-throwback-1.jpg',
  'photos/ayush-pottery-selfie.jpg',
]

export const MOVIES = [
  {
    genre: 'action',
    title: `The Legend: Part ${AGE}`,
    tagline: "He's back. He's older. He still hasn't replied to that email.",
    date: 'In theatres never',
    rating: `PG-${AGE}`,
  },
  {
    genre: 'romance',
    title: 'Ghosted',
    tagline: 'He came for the clay. He stayed for the vibes. The pot did not survive.',
    date: 'This Valentine’s, probably',
    rating: 'R (Romantic)',
  },
  {
    genre: 'mafia',
    title: 'The Dough Father',
    tagline: "He's going to make you a bread you can't refuse.",
    date: 'Coming soon to a bakery near you',
    rating: 'B&B',
  },
  {
    genre: 'spy',
    title: 'Mission: Inbox Zero',
    tagline: '4,812 unread. One man. No backup.',
    date: 'This summer',
    rating: 'U/A 29+',
  },
  {
    genre: 'horror',
    title: 'A Quiet Place: The Calendar',
    tagline: 'If he hears you say "quick call", he will find you.',
    date: 'Every Monday, 9:30 AM',
    rating: 'R',
  },
  {
    genre: 'scifi',
    title: 'Interstartup',
    tagline: "Humanity's last hope: a co-founder on 3% battery.",
    date: 'In IMAX (Imagination Max)',
    rating: 'PG-13½',
  },
  {
    genre: 'cartoon',
    title: `Toast Story ${AGE}`,
    tagline: 'To thirty… and beyond!',
    date: 'This holiday season',
    rating: 'G (for Gluten)',
  },
  {
    genre: 'action',
    title: 'Knead for Speed',
    tagline: 'Fast. Furious. Slightly toasted.',
    date: 'Summer 2027',
    rating: `PG-${AGE}`,
  },
  {
    genre: 'romance',
    title: 'The Notebook (It’s a MacBook)',
    tagline: 'Every great love story starts with "one more feature".',
    date: 'Bring tissues',
    rating: 'PG',
  },
  {
    genre: 'mafia',
    title: 'The Loaf of Wall Street',
    tagline: 'Money. Power. Carbs.',
    date: 'Opening at the market bell',
    rating: 'R',
  },
]

// =====================================================================
//  PAGE 3: THE TEAM REVEAL
// =====================================================================
export const RED_BUTTON = {
  title: 'One rule on this page:',
  label: 'DO NOT CLICK THIS',
  // What the button says after each click (the last one starts the "hack")
  taunts: [
    "Whatever you do… don't press the button.",
    'HEY! It literally says DO NOT. 😤',
    'Catch me if you can 🏃‍♂️💨',
    'Okay, RUDE. 📯',
    "Fine, I'm tiny now. Happy? 🥺",
    'Which one is real? 😏',
    'Stop. Seriously. Last warning. ⚠️',
    'FINE. YOU ASKED FOR IT. 💀',
  ],
  // A random one pops up as a reward on some clicks
  compliments: [
    'You make hard things look easy.',
    'Your laugh is a public good.',
    'Best co-founder energy in the building.',
    'Certified 10/10 human. 2/10 sleep schedule.',
    'You make everyone around you braver.',
    'Even your bad ideas are better than most good ones.',
    'The office is 73% more fun when you walk in.',
  ],
}

// The friendly "hacker" terminal. {device} becomes "PHONE" or "COMPUTER",
// {count} becomes the number of people in TEAM.
// kind: cmd | ok | warn | big | blank
export const HACK_LINES = [
  { text: '> Initiating birthday breach…', kind: 'cmd' },
  { text: '> Bypassing firewall………… done', kind: 'ok' },
  { text: '> Bypassing founder mode……… done', kind: 'ok' },
  { text: '> Scanning camera roll……… 4,281 screenshots of dashboards 😐', kind: 'warn' },
  { text: '> Checking search history… "is 29 old" (searched 3 times)', kind: 'warn' },
  { text: '> Measuring heart size……… unusually large ❤️', kind: 'ok' },
  { text: '', kind: 'blank' },
  { text: 'YOUR {device} HAS BEEN HACKED BY {count} PEOPLE WHO LOVE YOU.', kind: 'big', speed: 45, pause: 1500 },
  { text: '', kind: 'blank' },
  { text: '> Our demands:', kind: 'cmd' },
  { text: '  1. Eat cake. A lot of it.', kind: 'ok' },
  { text: '  2. Take a day off. (We know. Terrifying.)', kind: 'ok' },
  { text: '  3. Open the {count} presents hidden on your {device}.', kind: 'ok' },
  { text: '', kind: 'blank' },
  { text: '> Unlocking {count} gift boxes [██████████] 100%', kind: 'ok', speed: 45 },
]

export const HACK = {
  breach: '⚠ SYSTEM BREACH ⚠',
  skip: 'tap to speed up ⏩',
  accept: '[ ACCEPT THE HACK ❤️ ]',
}

export const GIFTS = {
  title: 'Your hackers left you presents',
  close: 'Close 💛',
  subtitle: 'One from each of us. Open them all to unlock the finale.',
  counter: (opened, total) => {
    if (opened === 0) return `${total} presents. 0 opened. What are you waiting for? 👀`
    if (opened < total - 1) return `${opened}/${total} opened… keep going`
    if (opened === total - 1) return `${opened}/${total} opened… one more 🥺`
    return `${opened}/${total} opened! Something just unlocked 🔓`
  },
  locked: (opened, total) => `🔒 Finale locked · ${opened}/${total}`,
  lockedNudge: 'Open every present first 😤',
  unlocked: '🔓 Open the finale →',
}

// =====================================================================
//  PAGE 4: THE FINALE
// =====================================================================
export const FINALE = {
  line1: 'HAPPY BIRTHDAY',
  line2: `${NAME.toUpperCase()}!`,
  tapHint: 'Tap anywhere for fireworks 🎆',
  more: 'There’s one more thing ↓',
  wishTitle: 'Make a wish…',
  wishHint: 'then tap the candles to blow them out 🌬️',
  // DEMO: the final group message. Blank lines start a new paragraph.
  message: `${NAME},

Somewhere between the late nights, the "quick calls" that were never quick and the hundred tiny wins nobody else saw, you became so much more than a co-founder to us.

You're the person we call when things go wrong, and the first person we want to tell when they go right.

Thank you for building something we're proud to be part of, and for making it feel like family along the way.

${AGE} is going to be a big one. We'll be right here for all of it.

Happy birthday. We love you. ❤️`,
  signoff: 'With all our love,',
  groupPhoto: 'photos/team-photo.jpg',
  groupCaption: 'Your people. Always. 💛',
  replay: 'Replay the surprise ↺',
}

// =====================================================================
//  HIDDEN EASTER EGG: a tiny 🍞 hidden on the photo page.
// =====================================================================
export const EASTER_EGG = {
  photo: 'photos/ayush-throwback-1.jpg',
  title: 'SECRET LEVEL UNLOCKED 🍞',
  message:
    "Only true legends find the hidden bread. Your reward: a certified rare throwback. Before the beard, before the startup, already grinning like he knew something we didn't.",
  close: 'Keep it secret 🤫',
  hintFound: 'P.S. You found the secret bread. Respect. 🍞',
  hintMissing: "P.S. There's a hidden 🍞 somewhere in this surprise. Replay to find it 👀",
}
