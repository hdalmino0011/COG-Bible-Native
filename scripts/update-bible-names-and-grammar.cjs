const fs = require('node:fs');
const path = require('node:path');

const projectRoot = process.cwd();

function transformEnglishVerse(text) {
  if (!text) return text;
  let s = text;

  // Compound names
  s = s.replace(/\bJehovah–jireh\b/g, 'LORD–jireh');
  s = s.replace(/\bJehovah–nissi\b/g, 'LORD–nissi');
  s = s.replace(/\bJehovah–shalom\b/g, 'LORD–shalom');
  s = s.replace(/\bJehovah–shammah\b/g, 'LORD–shammah');
  s = s.replace(/\bJehovah–tsidkenu\b/g, 'LORD–tsidkenu');
  s = s.replace(/\bJehovah-jireh\b/g, 'LORD-jireh');
  s = s.replace(/\bJehovah-nissi\b/g, 'LORD-nissi');
  s = s.replace(/\bJehovah-shalom\b/g, 'LORD-shalom');
  s = s.replace(/\bJehovah-shammah\b/g, 'LORD-shammah');
  s = s.replace(/\bJehovah-tsidkenu\b/g, 'LORD-tsidkenu');

  // Specific verse cleanups
  s = s.replace(/\bthe Lord Jehovah\b/g, 'the LORD');
  s = s.replace(/\bLord Jehovah\b/g, 'the LORD');
  s = s.replace(/\bwhose name alone is, Jehovah art\b/g, 'whose name alone is the LORD, art');
  s = s.replace(/I am the: Lord Lord: or, Jehovah/g, 'I am the LORD');
  s = s.replace(/The\. Lord Lord: or, Jehovah/g, 'The LORD');
  s = s.replace(/THE\. OUR RIGHTEOUSNESS Lord …: Heb\. Jehovah–tsidkenu Lord/g, 'THE LORD OUR RIGHTEOUSNESS');
  s = s.replace(/The\. our righteousness Lord …: Heb\. Jehovah–tsidkenu Lord/g, 'The LORD our righteousness');
  s = s.replace(/Lord is: or, Jehovah, etc/g, 'the LORD is his name');
  s = s.replace(/Lord: or, Jehovah/g, 'LORD');
  s = s.replace(/Lord …: Heb\. Jehovah–shammah/g, 'The LORD is there');
  s = s.replace(/Lord …: Heb\. Jehovah–tsidkenu/g, 'The LORD our righteousness');

  // General Jehovah replacements
  s = s.replace(/\bJEHOVAH\b/g, 'LORD');
  s = s.replace(/\bJehovah\b/g, 'LORD');
  s = s.replace(/\bjehovah\b/g, 'lord');

  return s;
}

function transformCebuanoVerse(text) {
  if (!text) return text;
  let s = text;

  // Clean any remaining Jehovah/Jehova
  s = s.replace(/\b[Ss]i\s+Jehovah?\b/g, (m) => (m[0] === 'S' ? 'Ang Ginoo' : 'ang Ginoo'));
  s = s.replace(/\b[Nn]i\s+Jehovah?\b/g, (m) => (m[0] === 'N' ? 'Sa Ginoo' : 'sa Ginoo'));
  s = s.replace(/\b[Kk]ang\s+Jehovah?\b/g, (m) => (m[0] === 'K' ? 'Sa Ginoo' : 'sa Ginoo'));
  s = s.replace(/\bJehovah?\b/g, 'Ginoo');
  s = s.replace(/\bJEHOVAH?\b/g, 'GINOO');

  // Fix Ginoong Ginoo (Adonai YHWH -> Ginoong Dios)
  s = s.replace(/\b([Aa]ng|[Ss]a|[Oo]h|[Oo])\s+[Gg]inoong\s+[Gg]inoo\b/g, (m, p1) => `${p1} Ginoong Dios`);
  s = s.replace(/\b[Gg]inoong\s+[Gg]inoo\b/g, (m) => (m[0] === 'G' ? 'Ginoong Dios' : 'ginoong Dios'));

  // Fix grammatical markers before Ginoo
  // 1. si Ginoo -> ang Ginoo
  s = s.replace(/\bSi\s+Ginoo\b/g, 'Ang Ginoo');
  s = s.replace(/\bsi\s+Ginoo\b/g, 'ang Ginoo');
  s = s.replace(/\bSI\s+GINOO\b/g, 'ANG GINOO');

  // 2. ni Ginoo -> sa Ginoo
  s = s.replace(/\bNi\s+Ginoo\b/g, 'Sa Ginoo');
  s = s.replace(/\bni\s+Ginoo\b/g, 'sa Ginoo');
  s = s.replace(/\bNI\s+GINOO\b/g, 'SA GINOO');

  // 3. kang Ginoo -> sa Ginoo
  s = s.replace(/\bKang\s+Ginoo\b/g, 'Sa Ginoo');
  s = s.replace(/\bkang\s+Ginoo\b/g, 'sa Ginoo');
  s = s.replace(/\bKANG\s+GINOO\b/g, 'SA GINOO');

  return s;
}

function processDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  const files = fs.readdirSync(dirPath).filter((f) => f.endsWith('.json'));
  let totalUpdatedVerses = 0;

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const content = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    let fileModified = false;

    for (const [ch, verses] of Object.entries(content)) {
      for (let i = 0; i < verses.length; i++) {
        const v = verses[i];
        const newCeb = transformCebuanoVerse(v.ceb);
        const newEn = transformEnglishVerse(v.en);

        if (newCeb !== v.ceb || newEn !== v.en) {
          v.ceb = newCeb;
          v.en = newEn;
          fileModified = true;
          totalUpdatedVerses++;
        }
      }
    }

    if (fileModified) {
      fs.writeFileSync(fullPath, JSON.stringify(content, null, 2), 'utf8');
    }
  }

  console.log(`Updated ${totalUpdatedVerses} verses in ${dirPath}`);
}

// 1. Process data/, public/data/, and android assets
console.log('Applying grammatical corrections and name updates to Bible data files...');
processDirectory(path.join(projectRoot, 'data'));
processDirectory(path.join(projectRoot, 'public/data'));
const androidDataDir = path.join(projectRoot, 'android/app/src/main/assets/public/data');
if (fs.existsSync(androidDataDir)) {
  processDirectory(androidDataDir);
}

// 2. Update dailyVerses.ts
const dailyVersesPath = path.join(projectRoot, 'src/data/dailyVerses.ts');
if (fs.existsSync(dailyVersesPath)) {
  let dvText = fs.readFileSync(dailyVersesPath, 'utf8');
  dvText = transformCebuanoVerse(dvText);
  dvText = transformEnglishVerse(dvText);
  fs.writeFileSync(dailyVersesPath, dvText, 'utf8');
  console.log('Updated src/data/dailyVerses.ts');
}

// 3. Update bookDescriptions.ts
const bookDescPath = path.join(projectRoot, 'src/data/bookDescriptions.ts');
if (fs.existsSync(bookDescPath)) {
  let bdText = fs.readFileSync(bookDescPath, 'utf8');
  bdText = transformCebuanoVerse(bdText);
  bdText = transformEnglishVerse(bdText);
  fs.writeFileSync(bookDescPath, bdText, 'utf8');
  console.log('Updated src/data/bookDescriptions.ts');
}

console.log('Completed successfully!');
