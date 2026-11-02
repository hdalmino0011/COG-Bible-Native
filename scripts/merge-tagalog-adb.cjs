const fs = require('node:fs');
const path = require('node:path');

const projectRoot = process.cwd();
const rawDataPath = '/tmp/tagalog.json';

if (!fs.existsSync(rawDataPath)) {
  console.error('/tmp/tagalog.json does not exist!');
  process.exit(1);
}

const rawTagalog = JSON.parse(fs.readFileSync(rawDataPath, 'utf8'));

// Canonical 66 Protestant Bible books
const BIBLE_BOOKS = [
  { name: "Genesis", chapters: 50 },
  { name: "Exodus", chapters: 40 },
  { name: "Leviticus", chapters: 27 },
  { name: "Numbers", chapters: 36 },
  { name: "Deuteronomy", chapters: 34 },
  { name: "Joshua", chapters: 24 },
  { name: "Judges", chapters: 21 },
  { name: "Ruth", chapters: 4 },
  { name: "1 Samuel", chapters: 31 },
  { name: "2 Samuel", chapters: 24 },
  { name: "1 Kings", chapters: 22 },
  { name: "2 Kings", chapters: 25 },
  { name: "1 Chronicles", chapters: 29 },
  { name: "2 Chronicles", chapters: 36 },
  { name: "Ezra", chapters: 10 },
  { name: "Nehemiah", chapters: 13 },
  { name: "Esther", chapters: 10 },
  { name: "Job", chapters: 42 },
  { name: "Psalms", chapters: 150 },
  { name: "Proverbs", chapters: 31 },
  { name: "Ecclesiastes", chapters: 12 },
  { name: "Song of Solomon", chapters: 8 },
  { name: "Isaiah", chapters: 66 },
  { name: "Jeremiah", chapters: 52 },
  { name: "Lamentations", chapters: 5 },
  { name: "Ezekiel", chapters: 48 },
  { name: "Daniel", chapters: 12 },
  { name: "Hosea", chapters: 14 },
  { name: "Joel", chapters: 3 },
  { name: "Amos", chapters: 9 },
  { name: "Obadiah", chapters: 1 },
  { name: "Jonah", chapters: 4 },
  { name: "Micah", chapters: 7 },
  { name: "Nahum", chapters: 3 },
  { name: "Habakkuk", chapters: 3 },
  { name: "Zephaniah", chapters: 3 },
  { name: "Haggai", chapters: 2 },
  { name: "Zechariah", chapters: 14 },
  { name: "Malachi", chapters: 4 },
  { name: "Matthew", chapters: 28 },
  { name: "Mark", chapters: 16 },
  { name: "Luke", chapters: 24 },
  { name: "John", chapters: 21 },
  { name: "Acts", chapters: 28 },
  { name: "Romans", chapters: 16 },
  { name: "1 Corinthians", chapters: 16 },
  { name: "2 Corinthians", chapters: 13 },
  { name: "Galatians", chapters: 6 },
  { name: "Ephesians", chapters: 6 },
  { name: "Philippians", chapters: 4 },
  { name: "Colossians", chapters: 4 },
  { name: "1 Thessalonians", chapters: 5 },
  { name: "2 Thessalonians", chapters: 3 },
  { name: "1 Timothy", chapters: 6 },
  { name: "2 Timothy", chapters: 4 },
  { name: "Titus", chapters: 3 },
  { name: "Philemon", chapters: 1 },
  { name: "Hebrews", chapters: 13 },
  { name: "James", chapters: 5 },
  { name: "1 Peter", chapters: 5 },
  { name: "2 Peter", chapters: 3 },
  { name: "1 John", chapters: 5 },
  { name: "2 John", chapters: 1 },
  { name: "3 John", chapters: 1 },
  { name: "Jude", chapters: 1 },
  { name: "Revelation", chapters: 22 }
];

let totalVersesUpdated = 0;
let booksProcessed = 0;

for (let i = 0; i < BIBLE_BOOKS.length; i++) {
  const bookInfo = BIBLE_BOOKS[i];
  const tagBook = rawTagalog.books[i];

  if (!tagBook) {
    console.error(`Tagalog book not found for index ${i}: ${bookInfo.name}`);
    continue;
  }

  const filePath = path.join(projectRoot, 'data', `${bookInfo.name}.json`);
  if (!fs.existsSync(filePath)) {
    console.error(`File does not exist: ${filePath}`);
    continue;
  }

  const currentData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  for (let ch = 1; ch <= bookInfo.chapters; ch++) {
    const chStr = String(ch);
    const versesList = currentData[chStr];
    if (!versesList || !Array.isArray(versesList)) {
      console.warn(`Missing chapter ${ch} in ${bookInfo.name}`);
      continue;
    }

    const tagChapter = tagBook.chapters.find((c) => c.chapter === ch);
    const tagVerseMap = new Map();
    if (tagChapter && Array.isArray(tagChapter.verses)) {
      tagChapter.verses.forEach((v) => {
        tagVerseMap.set(v.verse, v.text.trim());
      });
    }

    for (const vItem of versesList) {
      const tagText = tagVerseMap.get(vItem.v);
      if (tagText) {
        vItem.tag = tagText;
        totalVersesUpdated++;
      } else if (!vItem.tag) {
        // Fallback: keep existing tag if present, else empty string
        vItem.tag = '';
      }
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(currentData, null, 2), 'utf8');
  booksProcessed++;
}

console.log(`Successfully processed ${booksProcessed} books and updated ${totalVersesUpdated} verses with Ang Dating Biblia (1905).`);
