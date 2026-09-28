const CACHE_NAME = 'cog-bible-offline-v7.0.0';

const DEFAULT_BOOK_FILES = [
  '1 Chronicles.json',
  '1 Corinthians.json',
  '1 John.json',
  '1 Kings.json',
  '1 Peter.json',
  '1 Samuel.json',
  '1 Thessalonians.json',
  '1 Timothy.json',
  '2 Chronicles.json',
  '2 Corinthians.json',
  '2 John.json',
  '2 Kings.json',
  '2 Peter.json',
  '2 Samuel.json',
  '2 Thessalonians.json',
  '2 Timothy.json',
  '3 John.json',
  'Acts.json',
  'Amos.json',
  'Colossians.json',
  'Daniel.json',
  'Deuteronomy.json',
  'Ecclesiastes.json',
  'Ephesians.json',
  'Esther.json',
  'Exodus.json',
  'Ezekiel.json',
  'Ezra.json',
  'Galatians.json',
  'Genesis.json',
  'Habakkuk.json',
  'Haggai.json',
  'Hebrews.json',
  'Hosea.json',
  'Isaiah.json',
  'James.json',
  'Jeremiah.json',
  'Job.json',
  'Joel.json',
  'John.json',
  'Jonah.json',
  'Joshua.json',
  'Jude.json',
  'Judges.json',
  'Lamentations.json',
  'Leviticus.json',
  'Luke.json',
  'Malachi.json',
  'Mark.json',
  'Matthew.json',
  'Micah.json',
  'Nahum.json',
  'Nehemiah.json',
  'Numbers.json',
  'Obadiah.json',
  'Philemon.json',
  'Philippians.json',
  'Proverbs.json',
  'Psalms.json',
  'Revelation.json',
  'Romans.json',
  'Ruth.json',
  'Song of Solomon.json',
  'Titus.json',
  'Zechariah.json',
  'Zephaniah.json'
];

const DEFAULT_STATIC_ASSETS = [
  './',
  '',
  'index.html',
  './index.html',
  'manifest.json',
  './manifest.json',
  'logo.png',
  './logo.png',
  'logo.jpg',
  './logo.jpg',
  'app-icon.png',
  './app-icon.png',
  'app-icon-192.png',
  './app-icon-192.png',
  'app-icon-maskable.png',
  './app-icon-maskable.png',
  '404.html',
  './404.html',
  '.nojekyll',
  './.nojekyll',
  ...DEFAULT_BOOK_FILES.flatMap(file => [
    `./data/${file}`,
    `data/${file}`,
    `/data/${file}`,
    `./data/${encodeURIComponent(file)}`,
    `data/${encodeURIComponent(file)}`,
    `/data/${encodeURIComponent(file)}`
  ])
];

// Injected during build by vite.config.ts
const PRECACHE_ASSETS = [
  "./",
  "",
  "index.html",
  "./index.html",
  "app-icon-192.png",
  "./app-icon-192.png",
  "app-icon.png",
  "./app-icon.png",
  "app-icon-maskable.png",
  "./app-icon-maskable.png",
  "logo.jpg",
  "./logo.jpg",
  "logo.png",
  "./logo.png",
  "manifest.json",
  "./manifest.json",
  "404.html",
  "./404.html",
  ".nojekyll",
  "./.nojekyll",
  "./data/1 Chronicles.json",
  "data/1 Chronicles.json",
  "./data/1%20Chronicles.json",
  "data/1%20Chronicles.json",
  "./data/1 Corinthians.json",
  "data/1 Corinthians.json",
  "./data/1%20Corinthians.json",
  "data/1%20Corinthians.json",
  "./data/1 John.json",
  "data/1 John.json",
  "./data/1%20John.json",
  "data/1%20John.json",
  "./data/1 Kings.json",
  "data/1 Kings.json",
  "./data/1%20Kings.json",
  "data/1%20Kings.json",
  "./data/1 Peter.json",
  "data/1 Peter.json",
  "./data/1%20Peter.json",
  "data/1%20Peter.json",
  "./data/1 Samuel.json",
  "data/1 Samuel.json",
  "./data/1%20Samuel.json",
  "data/1%20Samuel.json",
  "./data/1 Thessalonians.json",
  "data/1 Thessalonians.json",
  "./data/1%20Thessalonians.json",
  "data/1%20Thessalonians.json",
  "./data/1 Timothy.json",
  "data/1 Timothy.json",
  "./data/1%20Timothy.json",
  "data/1%20Timothy.json",
  "./data/2 Chronicles.json",
  "data/2 Chronicles.json",
  "./data/2%20Chronicles.json",
  "data/2%20Chronicles.json",
  "./data/2 Corinthians.json",
  "data/2 Corinthians.json",
  "./data/2%20Corinthians.json",
  "data/2%20Corinthians.json",
  "./data/2 John.json",
  "data/2 John.json",
  "./data/2%20John.json",
  "data/2%20John.json",
  "./data/2 Kings.json",
  "data/2 Kings.json",
  "./data/2%20Kings.json",
  "data/2%20Kings.json",
  "./data/2 Peter.json",
  "data/2 Peter.json",
  "./data/2%20Peter.json",
  "data/2%20Peter.json",
  "./data/2 Samuel.json",
  "data/2 Samuel.json",
  "./data/2%20Samuel.json",
  "data/2%20Samuel.json",
  "./data/2 Thessalonians.json",
  "data/2 Thessalonians.json",
  "./data/2%20Thessalonians.json",
  "data/2%20Thessalonians.json",
  "./data/2 Timothy.json",
  "data/2 Timothy.json",
  "./data/2%20Timothy.json",
  "data/2%20Timothy.json",
  "./data/3 John.json",
  "data/3 John.json",
  "./data/3%20John.json",
  "data/3%20John.json",
  "./data/Acts.json",
  "data/Acts.json",
  "./data/Amos.json",
  "data/Amos.json",
  "./data/Colossians.json",
  "data/Colossians.json",
  "./data/Daniel.json",
  "data/Daniel.json",
  "./data/Deuteronomy.json",
  "data/Deuteronomy.json",
  "./data/Ecclesiastes.json",
  "data/Ecclesiastes.json",
  "./data/Ephesians.json",
  "data/Ephesians.json",
  "./data/Esther.json",
  "data/Esther.json",
  "./data/Exodus.json",
  "data/Exodus.json",
  "./data/Ezekiel.json",
  "data/Ezekiel.json",
  "./data/Ezra.json",
  "data/Ezra.json",
  "./data/Galatians.json",
  "data/Galatians.json",
  "./data/Genesis.json",
  "data/Genesis.json",
  "./data/Habakkuk.json",
  "data/Habakkuk.json",
  "./data/Haggai.json",
  "data/Haggai.json",
  "./data/Hebrews.json",
  "data/Hebrews.json",
  "./data/Hosea.json",
  "data/Hosea.json",
  "./data/Isaiah.json",
  "data/Isaiah.json",
  "./data/James.json",
  "data/James.json",
  "./data/Jeremiah.json",
  "data/Jeremiah.json",
  "./data/Job.json",
  "data/Job.json",
  "./data/Joel.json",
  "data/Joel.json",
  "./data/John.json",
  "data/John.json",
  "./data/Jonah.json",
  "data/Jonah.json",
  "./data/Joshua.json",
  "data/Joshua.json",
  "./data/Jude.json",
  "data/Jude.json",
  "./data/Judges.json",
  "data/Judges.json",
  "./data/Lamentations.json",
  "data/Lamentations.json",
  "./data/Leviticus.json",
  "data/Leviticus.json",
  "./data/Luke.json",
  "data/Luke.json",
  "./data/Malachi.json",
  "data/Malachi.json",
  "./data/Mark.json",
  "data/Mark.json",
  "./data/Matthew.json",
  "data/Matthew.json",
  "./data/Micah.json",
  "data/Micah.json",
  "./data/Nahum.json",
  "data/Nahum.json",
  "./data/Nehemiah.json",
  "data/Nehemiah.json",
  "./data/Numbers.json",
  "data/Numbers.json",
  "./data/Obadiah.json",
  "data/Obadiah.json",
  "./data/Philemon.json",
  "data/Philemon.json",
  "./data/Philippians.json",
  "data/Philippians.json",
  "./data/Proverbs.json",
  "data/Proverbs.json",
  "./data/Psalms.json",
  "data/Psalms.json",
  "./data/Revelation.json",
  "data/Revelation.json",
  "./data/Romans.json",
  "data/Romans.json",
  "./data/Ruth.json",
  "data/Ruth.json",
  "./data/Song of Solomon.json",
  "data/Song of Solomon.json",
  "./data/Song%20of%20Solomon.json",
  "data/Song%20of%20Solomon.json",
  "./data/Titus.json",
  "data/Titus.json",
  "./data/Zechariah.json",
  "data/Zechariah.json",
  "./data/Zephaniah.json",
  "data/Zephaniah.json",
  "./images/nature/1-chronicles.jpg",
  "images/nature/1-chronicles.jpg",
  "./images/nature/1-corinthians.jpg",
  "images/nature/1-corinthians.jpg",
  "./images/nature/1-john.jpg",
  "images/nature/1-john.jpg",
  "./images/nature/1-kings.jpg",
  "images/nature/1-kings.jpg",
  "./images/nature/1-peter.jpg",
  "images/nature/1-peter.jpg",
  "./images/nature/1-samuel.jpg",
  "images/nature/1-samuel.jpg",
  "./images/nature/1-thessalonians.jpg",
  "images/nature/1-thessalonians.jpg",
  "./images/nature/1-timothy.jpg",
  "images/nature/1-timothy.jpg",
  "./images/nature/2-chronicles.jpg",
  "images/nature/2-chronicles.jpg",
  "./images/nature/2-corinthians.jpg",
  "images/nature/2-corinthians.jpg",
  "./images/nature/2-john.jpg",
  "images/nature/2-john.jpg",
  "./images/nature/2-kings.jpg",
  "images/nature/2-kings.jpg",
  "./images/nature/2-peter.jpg",
  "images/nature/2-peter.jpg",
  "./images/nature/2-samuel.jpg",
  "images/nature/2-samuel.jpg",
  "./images/nature/2-thessalonians.jpg",
  "images/nature/2-thessalonians.jpg",
  "./images/nature/2-timothy.jpg",
  "images/nature/2-timothy.jpg",
  "./images/nature/3-john.jpg",
  "images/nature/3-john.jpg",
  "./images/nature/acts.jpg",
  "images/nature/acts.jpg",
  "./images/nature/amos.jpg",
  "images/nature/amos.jpg",
  "./images/nature/colossians.jpg",
  "images/nature/colossians.jpg",
  "./images/nature/daniel.jpg",
  "images/nature/daniel.jpg",
  "./images/nature/deuteronomy.jpg",
  "images/nature/deuteronomy.jpg",
  "./images/nature/ecclesiastes.jpg",
  "images/nature/ecclesiastes.jpg",
  "./images/nature/ephesians.jpg",
  "images/nature/ephesians.jpg",
  "./images/nature/esther.jpg",
  "images/nature/esther.jpg",
  "./images/nature/exodus.jpg",
  "images/nature/exodus.jpg",
  "./images/nature/ezekiel.jpg",
  "images/nature/ezekiel.jpg",
  "./images/nature/ezra.jpg",
  "images/nature/ezra.jpg",
  "./images/nature/galatians.jpg",
  "images/nature/galatians.jpg",
  "./images/nature/genesis.jpg",
  "images/nature/genesis.jpg",
  "./images/nature/habakkuk.jpg",
  "images/nature/habakkuk.jpg",
  "./images/nature/haggai.jpg",
  "images/nature/haggai.jpg",
  "./images/nature/hebrews.jpg",
  "images/nature/hebrews.jpg",
  "./images/nature/hosea.jpg",
  "images/nature/hosea.jpg",
  "./images/nature/isaiah.jpg",
  "images/nature/isaiah.jpg",
  "./images/nature/james.jpg",
  "images/nature/james.jpg",
  "./images/nature/jeremiah.jpg",
  "images/nature/jeremiah.jpg",
  "./images/nature/job.jpg",
  "images/nature/job.jpg",
  "./images/nature/joel.jpg",
  "images/nature/joel.jpg",
  "./images/nature/john.jpg",
  "images/nature/john.jpg",
  "./images/nature/jonah.jpg",
  "images/nature/jonah.jpg",
  "./images/nature/joshua.jpg",
  "images/nature/joshua.jpg",
  "./images/nature/jude.jpg",
  "images/nature/jude.jpg",
  "./images/nature/judges.jpg",
  "images/nature/judges.jpg",
  "./images/nature/lamentations.jpg",
  "images/nature/lamentations.jpg",
  "./images/nature/leviticus.jpg",
  "images/nature/leviticus.jpg",
  "./images/nature/luke.jpg",
  "images/nature/luke.jpg",
  "./images/nature/malachi.jpg",
  "images/nature/malachi.jpg",
  "./images/nature/mark.jpg",
  "images/nature/mark.jpg",
  "./images/nature/matthew.jpg",
  "images/nature/matthew.jpg",
  "./images/nature/micah.jpg",
  "images/nature/micah.jpg",
  "./images/nature/nahum.jpg",
  "images/nature/nahum.jpg",
  "./images/nature/nehemiah.jpg",
  "images/nature/nehemiah.jpg",
  "./images/nature/numbers.jpg",
  "images/nature/numbers.jpg",
  "./images/nature/obadiah.jpg",
  "images/nature/obadiah.jpg",
  "./images/nature/philemon.jpg",
  "images/nature/philemon.jpg",
  "./images/nature/philippians.jpg",
  "images/nature/philippians.jpg",
  "./images/nature/proverbs.jpg",
  "images/nature/proverbs.jpg",
  "./images/nature/psalms.jpg",
  "images/nature/psalms.jpg",
  "./images/nature/revelation.jpg",
  "images/nature/revelation.jpg",
  "./images/nature/romans.jpg",
  "images/nature/romans.jpg",
  "./images/nature/ruth.jpg",
  "images/nature/ruth.jpg",
  "./images/nature/song-of-solomon.jpg",
  "images/nature/song-of-solomon.jpg",
  "./images/nature/titus.jpg",
  "images/nature/titus.jpg",
  "./images/nature/zechariah.jpg",
  "images/nature/zechariah.jpg",
  "./images/nature/zephaniah.jpg",
  "images/nature/zephaniah.jpg",
  "./assets/1 Chronicles-BZWrvP1y.js",
  "assets/1 Chronicles-BZWrvP1y.js",
  "./assets/1 Corinthians--VZi7Lnm.js",
  "assets/1 Corinthians--VZi7Lnm.js",
  "./assets/1 John-Cb6nfyrL.js",
  "assets/1 John-Cb6nfyrL.js",
  "./assets/1 Kings-4SygjL-I.js",
  "assets/1 Kings-4SygjL-I.js",
  "./assets/1 Peter-UZWpHfyB.js",
  "assets/1 Peter-UZWpHfyB.js",
  "./assets/1 Samuel-Dud39puH.js",
  "assets/1 Samuel-Dud39puH.js",
  "./assets/1 Thessalonians-3cCQCCZ4.js",
  "assets/1 Thessalonians-3cCQCCZ4.js",
  "./assets/1 Timothy-BOLRhqE0.js",
  "assets/1 Timothy-BOLRhqE0.js",
  "./assets/2 Chronicles-CfRKMJwL.js",
  "assets/2 Chronicles-CfRKMJwL.js",
  "./assets/2 Corinthians-DYdpXpxx.js",
  "assets/2 Corinthians-DYdpXpxx.js",
  "./assets/2 John-e4mN4zVB.js",
  "assets/2 John-e4mN4zVB.js",
  "./assets/2 Kings-BsCvXXm0.js",
  "assets/2 Kings-BsCvXXm0.js",
  "./assets/2 Peter-D5YqUjal.js",
  "assets/2 Peter-D5YqUjal.js",
  "./assets/2 Samuel-Bw2j1GWv.js",
  "assets/2 Samuel-Bw2j1GWv.js",
  "./assets/2 Thessalonians-BiblXsQI.js",
  "assets/2 Thessalonians-BiblXsQI.js",
  "./assets/2 Timothy-C-SpXJl-.js",
  "assets/2 Timothy-C-SpXJl-.js",
  "./assets/3 John-BiFApTLD.js",
  "assets/3 John-BiFApTLD.js",
  "./assets/Acts-Bk8ZZNJP.js",
  "assets/Acts-Bk8ZZNJP.js",
  "./assets/Amos-C91M7HLd.js",
  "assets/Amos-C91M7HLd.js",
  "./assets/Colossians-CtykPyip.js",
  "assets/Colossians-CtykPyip.js",
  "./assets/Daniel-DNyFHCnP.js",
  "assets/Daniel-DNyFHCnP.js",
  "./assets/Deuteronomy-CPFNE_LE.js",
  "assets/Deuteronomy-CPFNE_LE.js",
  "./assets/Ecclesiastes-m_KEROEy.js",
  "assets/Ecclesiastes-m_KEROEy.js",
  "./assets/Ephesians-DsEcZkdK.js",
  "assets/Ephesians-DsEcZkdK.js",
  "./assets/Esther-DQy8KOVH.js",
  "assets/Esther-DQy8KOVH.js",
  "./assets/Exodus-Bn1-I2l5.js",
  "assets/Exodus-Bn1-I2l5.js",
  "./assets/Ezekiel-DI6JCvsL.js",
  "assets/Ezekiel-DI6JCvsL.js",
  "./assets/Ezra-C8EIujAb.js",
  "assets/Ezra-C8EIujAb.js",
  "./assets/Galatians-CS_Y3pVB.js",
  "assets/Galatians-CS_Y3pVB.js",
  "./assets/Genesis-BWXKE4rg.js",
  "assets/Genesis-BWXKE4rg.js",
  "./assets/Habakkuk-y8XOEdrN.js",
  "assets/Habakkuk-y8XOEdrN.js",
  "./assets/Haggai-DYgrI6dx.js",
  "assets/Haggai-DYgrI6dx.js",
  "./assets/Hebrews-yKlb9rhd.js",
  "assets/Hebrews-yKlb9rhd.js",
  "./assets/Hosea-BLAn9Qkk.js",
  "assets/Hosea-BLAn9Qkk.js",
  "./assets/Isaiah-BQTGR_6V.js",
  "assets/Isaiah-BQTGR_6V.js",
  "./assets/James-X_yd3_Gn.js",
  "assets/James-X_yd3_Gn.js",
  "./assets/Jeremiah-BCNmt6J2.js",
  "assets/Jeremiah-BCNmt6J2.js",
  "./assets/Job-CzA_Tzx-.js",
  "assets/Job-CzA_Tzx-.js",
  "./assets/Joel-B69Q2ECR.js",
  "assets/Joel-B69Q2ECR.js",
  "./assets/John-DDNWdEBg.js",
  "assets/John-DDNWdEBg.js",
  "./assets/Jonah-BS3CPFJ3.js",
  "assets/Jonah-BS3CPFJ3.js",
  "./assets/Joshua-DVJZLfhj.js",
  "assets/Joshua-DVJZLfhj.js",
  "./assets/Jude-vCjI-H6E.js",
  "assets/Jude-vCjI-H6E.js",
  "./assets/Judges-nk7IDAsC.js",
  "assets/Judges-nk7IDAsC.js",
  "./assets/Lamentations-Bq3HYzyx.js",
  "assets/Lamentations-Bq3HYzyx.js",
  "./assets/Leviticus-D5dXGy3U.js",
  "assets/Leviticus-D5dXGy3U.js",
  "./assets/Luke-B8PHXK0d.js",
  "assets/Luke-B8PHXK0d.js",
  "./assets/Malachi-i_P5DCrm.js",
  "assets/Malachi-i_P5DCrm.js",
  "./assets/Mark-D_7b83-q.js",
  "assets/Mark-D_7b83-q.js",
  "./assets/Matthew-pAhBcV9C.js",
  "assets/Matthew-pAhBcV9C.js",
  "./assets/Micah-CA3C0Lrs.js",
  "assets/Micah-CA3C0Lrs.js",
  "./assets/Nahum-JZFJo8cR.js",
  "assets/Nahum-JZFJo8cR.js",
  "./assets/Nehemiah-DAQI1rem.js",
  "assets/Nehemiah-DAQI1rem.js",
  "./assets/Numbers-BfVw25kY.js",
  "assets/Numbers-BfVw25kY.js",
  "./assets/Obadiah-Doc8Byn0.js",
  "assets/Obadiah-Doc8Byn0.js",
  "./assets/Philemon-5USrcYcM.js",
  "assets/Philemon-5USrcYcM.js",
  "./assets/Philippians-2OGshWMx.js",
  "assets/Philippians-2OGshWMx.js",
  "./assets/Proverbs-BTo4rw8u.js",
  "assets/Proverbs-BTo4rw8u.js",
  "./assets/Psalms-DSCRJG2S.js",
  "assets/Psalms-DSCRJG2S.js",
  "./assets/Revelation-Dm6TdO__.js",
  "assets/Revelation-Dm6TdO__.js",
  "./assets/Romans-DfVyWyxV.js",
  "assets/Romans-DfVyWyxV.js",
  "./assets/Ruth-CGxQBi_k.js",
  "assets/Ruth-CGxQBi_k.js",
  "./assets/Song of Solomon-Bx3p034N.js",
  "assets/Song of Solomon-Bx3p034N.js",
  "./assets/Titus-4yRFAR9C.js",
  "assets/Titus-4yRFAR9C.js",
  "./assets/Zechariah-DOtaYyo_.js",
  "assets/Zechariah-DOtaYyo_.js",
  "./assets/Zephaniah-D_3yjLD0.js",
  "assets/Zephaniah-D_3yjLD0.js",
  "./assets/index-BOkft1tp.css",
  "assets/index-BOkft1tp.css",
  "./assets/index-BlZfPHOG.js",
  "assets/index-BlZfPHOG.js",
  "./assets/web-TtHJYmiC.js",
  "assets/web-TtHJYmiC.js"
];

const STATIC_ASSETS = Array.from(
  new Set([...PRECACHE_ASSETS, ...DEFAULT_STATIC_ASSETS])
);

// Install event: Precache core assets
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // 1. First cache the critical shell (index.html, manifest, icons)
      const criticalShell = [
        './',
        'index.html',
        './index.html',
        'manifest.json',
        './manifest.json',
        'logo.png',
        './logo.png',
        'logo.jpg',
        './logo.jpg',
        'app-icon.png',
        './app-icon.png',
        'app-icon-192.png',
        './app-icon-192.png'
      ];

      await Promise.allSettled(
        criticalShell.map(async (url) => {
          try {
            const res = await fetch(url, { cache: 'reload' });
            if (res && res.status === 200) {
              await cache.put(url, res.clone());
            }
          } catch (e) {
            console.warn('[SW] Shell item precache error:', url, e);
          }
        })
      );

      // 2. Precache remaining assets in background
      await Promise.allSettled(
        STATIC_ASSETS.map(async (url) => {
          try {
            const res = await fetch(url, { cache: 'no-cache' });
            if (res && res.status === 200) {
              const ct = res.headers.get('content-type') || '';
              if (url.endsWith('.json') && ct.includes('text/html')) {
                return;
              }
              await cache.put(url, res.clone());
              const decoded = decodeURIComponent(url);
              if (decoded !== url) {
                await cache.put(decoded, res.clone());
              }
            }
          } catch (err) {
            // Silently skip non-critical asset errors during install
          }
        })
      );
    })
  );
});

// Activate event: Clean old caches and claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

// Helper to look up a request flexibly in Cache across URL variants
async function matchCacheFlexible(request) {
  const cache = await caches.open(CACHE_NAME);
  
  // 1. Direct match with ignoreSearch
  let matched = await cache.match(request, { ignoreSearch: true });
  if (matched && matched.status === 200) return matched;

  const urlStr = typeof request === 'string' ? request : request.url;

  // 2. Try URL Decoded match
  try {
    const decodedUrl = decodeURIComponent(urlStr);
    matched = await cache.match(decodedUrl, { ignoreSearch: true });
    if (matched && matched.status === 200) return matched;
  } catch {}

  // 3. Match by pathname or filename suffix (e.g. "Genesis.json" or "data/Genesis.json" or "assets/...")
  try {
    const parsed = new URL(urlStr, self.location.origin);
    const pathname = parsed.pathname;
    const filename = pathname.split('/').filter(Boolean).pop();
    const allKeys = await cache.keys();

    for (const key of allKeys) {
      const keyParsed = new URL(key.url, self.location.origin);
      if (keyParsed.pathname === pathname || decodeURIComponent(keyParsed.pathname) === decodeURIComponent(pathname)) {
        const item = await cache.match(key);
        if (item && item.status === 200) return item;
      }
      
      const keyFilename = keyParsed.pathname.split('/').filter(Boolean).pop();
      if (filename && keyFilename && (filename === keyFilename || decodeURIComponent(filename) === decodeURIComponent(keyFilename))) {
        const item = await cache.match(key);
        if (item && item.status === 200) return item;
      }
    }
  } catch {}

  return null;
}

// Fetch handler: Complete offline resilience
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const requestUrl = event.request.url;

  // 1. HTML Navigation requests (Page loading & refresh)
  if (event.request.mode === 'navigate' || event.request.destination === 'document') {
    event.respondWith(
      fetch(event.request)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const copy = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, copy);
              cache.put('./index.html', networkRes.clone());
              cache.put('index.html', networkRes.clone());
            });
          }
          return networkRes;
        })
        .catch(async () => {
          // Offline fallback: Return cached HTML
          const cached = await matchCacheFlexible(event.request);
          if (cached) return cached;
          const indexHtml = await matchCacheFlexible('./index.html');
          if (indexHtml) return indexHtml;
          const root = await matchCacheFlexible('./');
          if (root) return root;
          const rootSlash = await matchCacheFlexible('/');
          if (rootSlash) return rootSlash;
          return new Response(
            '<!DOCTYPE html><html><head><meta charset="utf-8"><title>COG Bible Offline</title></head><body><h2>Offline</h2><p>Please reopen when installed.</p></body></html>',
            { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
          );
        })
    );
    return;
  }

  // 2. All Assets, JSON Data, Scripts, Styles & Images (Cache-First)
  event.respondWith(
    matchCacheFlexible(event.request).then(async (cachedResponse) => {
      if (cachedResponse) {
        // Guard against corrupted HTML fallbacks in JSON
        const ct = cachedResponse.headers.get('content-type') || '';
        if (requestUrl.endsWith('.json') && ct.includes('text/html')) {
          const cache = await caches.open(CACHE_NAME);
          await cache.delete(event.request);
        } else {
          return cachedResponse;
        }
      }

      // If not in cache, fetch from network and store in cache
      return fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const ct = networkResponse.headers.get('content-type') || '';
            if (!requestUrl.endsWith('.json') || !ct.includes('text/html')) {
              const copy = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, copy);
                try {
                  const decoded = decodeURIComponent(event.request.url);
                  if (decoded !== event.request.url) {
                    cache.put(decoded, networkResponse.clone());
                  }
                } catch {}
              });
            }
          }
          return networkResponse;
        })
        .catch(async () => {
          // Network failed (Offline): Last-chance flexible cache search
          const lastChance = await matchCacheFlexible(event.request);
          if (lastChance) return lastChance;

          if (requestUrl.endsWith('.json')) {
            return new Response('{}', {
              status: 404,
              headers: { 'Content-Type': 'application/json' }
            });
          }

          return new Response('Asset not found offline', {
            status: 503,
            headers: { 'Content-Type': 'text/plain' }
          });
        });
    })
  );
});

// Message Listener for explicit caching triggers from App
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CACHE_ALL_SCRIPTURES') {
    event.waitUntil(
      caches.open(CACHE_NAME).then(async (cache) => {
        let successCount = 0;
        for (const bookFile of DEFAULT_BOOK_FILES) {
          const urls = [
            `./data/${bookFile}`,
            `data/${bookFile}`,
            `./data/${encodeURIComponent(bookFile)}`
          ];
          for (const u of urls) {
            try {
              const res = await fetch(u);
              if (res && res.status === 200) {
                const ct = res.headers.get('content-type') || '';
                if (!ct.includes('text/html')) {
                  await cache.put(u, res.clone());
                  successCount++;
                  break;
                }
              }
            } catch {}
          }
        }
        if (event.source && event.source.postMessage) {
          event.source.postMessage({
            type: 'CACHE_ALL_SCRIPTURES_DONE',
            count: successCount
          });
        }
      })
    );
  }
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const data = event.notification.data || {};
  const book = data.book || 'Genesis';
  const chapter = data.chapter || 1;
  const verse = data.verse || 1;
  const targetUrl = `./#bible?book=${encodeURIComponent(book)}&chapter=${chapter}&verse=${verse}`;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          client.postMessage({
            type: 'NAVIGATE_TO_VERSE',
            book: book,
            chapter: chapter,
            verse: verse
          });
          if (client.navigate) {
            client.navigate(targetUrl);
          }
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
