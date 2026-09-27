const fs = require('fs');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({});

const BOOKS = [
  { book: 'Genesis', file: 'genesis.jpg', target: 'Misty Meadow at First Light' },
  { book: 'Exodus', file: 'exodus.jpg', target: 'Waves Crashing on Rocky Shore' },
  { book: 'Leviticus', file: 'leviticus.jpg', target: 'Wildflowers in a Quiet Field' },
  { book: 'Numbers', file: 'numbers.jpg', target: 'Starry Sky Over Desert Dunes' },
  { book: 'Deuteronomy', file: 'deuteronomy.jpg', target: 'Rolling Hills Under Golden Clouds' },
  { book: 'Joshua', file: 'joshua.jpg', target: 'River Bend Through Green Forest' },
  { book: 'Judges', file: 'judges.jpg', target: 'Thunderstorm Over Open Plains' },
  { book: 'Ruth', file: 'ruth.jpg', target: 'Wheat Field Swaying in the Wind' },
  { book: '1 Samuel', file: '1-samuel.jpg', target: 'Sunlight Through Tall Trees' },
  { book: '2 Samuel', file: '2-samuel.jpg', target: 'Ancient Cedar Forest in Fog' },
  { book: '1 Kings', file: '1-kings.jpg', target: 'Rocky Cliff Above the Sea' },
  { book: '2 Kings', file: '2-kings.jpg', target: 'Fiery Sunset Over Mountain Ridge' },
  { book: '1 Chronicles', file: '1-chronicles.jpg', target: 'Old Oak Tree in a Meadow' },
  { book: '2 Chronicles', file: '2-chronicles.jpg', target: 'Glowing Campfire in the Woods' },
  { book: 'Ezra', file: 'ezra.jpg', target: 'Stone Bridge Over a Creek' },
  { book: 'Nehemiah', file: 'nehemiah.jpg', target: 'Morning Fog on a Lake' },
  { book: 'Esther', file: 'esther.jpg', target: 'Purple Wildflowers in Bloom' },
  { book: 'Job', file: 'job.jpg', target: 'Dust Storm on the Horizon' },
  { book: 'Psalms', file: 'psalms.jpg', target: 'Calm Lake Reflecting Mountains' },
  { book: 'Proverbs', file: 'proverbs.jpg', target: 'Winding Trail Through Pine Forest' },
  { book: 'Ecclesiastes', file: 'ecclesiastes.jpg', target: 'Autumn Leaves on a Riverbank' },
  { book: 'Song of Solomon', file: 'song-of-solomon.jpg', target: 'Rose Bushes in Full Bloom' },
  { book: 'Isaiah', file: 'isaiah.jpg', target: 'Snowy Mountain Peak at Dawn' },
  { book: 'Jeremiah', file: 'jeremiah.jpg', target: 'Weeping Willow by a Pond' },
  { book: 'Lamentations', file: 'lamentations.jpg', target: 'Raindrops on a Quiet Window' },
  { book: 'Ezekiel', file: 'ezekiel.jpg', target: 'Dry Desert Valley at Noon' },
  { book: 'Daniel', file: 'daniel.jpg', target: 'Moonlit Cave Entrance' },
  { book: 'Hosea', file: 'hosea.jpg', target: 'Vines Climbing a Broken Fence' },
  { book: 'Joel', file: 'joel.jpg', target: 'Golden Grasshopper on a Leaf' },
  { book: 'Amos', file: 'amos.jpg', target: 'Crooked River Through Flatlands' },
  { book: 'Obadiah', file: 'obadiah.jpg', target: 'Eagle Soaring Over Cliffs' },
  { book: 'Jonah', file: 'jonah.jpg', target: 'Stormy Ocean Waves at Dusk' },
  { book: 'Micah', file: 'micah.jpg', target: 'Rolling Hills Under Starry Sky' },
  { book: 'Nahum', file: 'nahum.jpg', target: 'Crumbling Ruins in the Desert' },
  { book: 'Habakkuk', file: 'habakkuk.jpg', target: 'Lone Tree on a Hilltop' },
  { book: 'Zephaniah', file: 'zephaniah.jpg', target: 'Sunset Behind City Skyline' },
  { book: 'Haggai', file: 'haggai.jpg', target: 'Fresh Soil in a Garden Bed' },
  { book: 'Zechariah', file: 'zechariah.jpg', target: 'Lantern Glow in the Night' },
  { book: 'Malachi', file: 'malachi.jpg', target: 'Bonfire Embers at Twilight' },
  { book: 'Matthew', file: 'matthew.jpg', target: 'Bright Star Over Quiet Fields' },
  { book: 'Mark', file: 'mark.jpg', target: 'Wild River Through the Wilderness' },
  { book: 'Luke', file: 'luke.jpg', target: 'Wooden Barn Under Cloudy Sky' },
  { book: 'John', file: 'john.jpg', target: 'Sunbeam Breaking Through Dark Clouds' },
  { book: 'Acts', file: 'acts.jpg', target: 'Wildfire Glow on the Horizon' },
  { book: 'Romans', file: 'romans.jpg', target: 'Cobblestone Path Through Autumn Woods' },
  { book: '1 Corinthians', file: '1-corinthians.jpg', target: 'Vineyard Rows on a Hillside' },
  { book: '2 Corinthians', file: '2-corinthians.jpg', target: 'Clay Pots in a Sunny Field' },
  { book: 'Galatians', file: 'galatians.jpg', target: 'Apple Orchard in Bloom' },
  { book: 'Ephesians', file: 'ephesians.jpg', target: 'Rocky Coastline at Sunrise' },
  { book: 'Philippians', file: 'philippians.jpg', target: 'Green Meadow After Rain' },
  { book: 'Colossians', file: 'colossians.jpg', target: 'Milky Way Over Quiet Lake' },
  { book: '1 Thessalonians', file: '1-thessalonians.jpg', target: 'Silver Clouds at Daybreak' },
  { book: '2 Thessalonians', file: '2-thessalonians.jpg', target: 'Sturdy Oak in a Windstorm' },
  { book: '1 Timothy', file: '1-timothy.jpg', target: 'Sheep Grazing in a Valley' },
  { book: '2 Timothy', file: '2-timothy.jpg', target: 'Sunrise Over a Campground' },
  { book: 'Titus', file: 'titus.jpg', target: 'Rugged Coastline with Blue Water' },
  { book: 'Philemon', file: 'philemon.jpg', target: 'Mossy Garden Path' },
  { book: 'Hebrews', file: 'hebrews.jpg', target: 'Anchor on a Sandy Beach' },
  { book: 'James', file: 'james.jpg', target: 'Wildflower Beside a Mountain Stream' },
  { book: '1 Peter', file: '1-peter.jpg', target: 'Rocks Along a Seashore' },
  { book: '2 Peter', file: '2-peter.jpg', target: 'Morning Star Fading Over Hills' },
  { book: '1 John', file: '1-john.jpg', target: 'Waterfall in a Sunlit Forest' },
  { book: '2 John', file: '2-john.jpg', target: 'Narrow Trail Through the Woods' },
  { book: '3 John', file: '3-john.jpg', target: 'Open Gate to a Green Field' },
  { book: 'Jude', file: 'jude.jpg', target: 'Waves Crashing Against Sea Cliffs' },
  { book: 'Revelation', file: 'revelation.jpg', target: 'River Through a Golden Valley at Sunset' }
];

async function audit() {
  const results = [];
  console.log(`Auditing ${BOOKS.length} photos...`);

  for (let i = 0; i < BOOKS.length; i++) {
    const item = BOOKS[i];
    const imgPath = path.join(__dirname, '../public/images/nature', item.file);
    if (!fs.existsSync(imgPath)) {
      results.push({ ...item, status: 'MISSING', reason: 'File does not exist' });
      continue;
    }

    const data = fs.readFileSync(imgPath);
    const base64 = data.toString('base64');

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: base64
                }
              },
              {
                text: `You are an auditor verifying nature photos.
Target description for this image: "${item.target}".
1. Briefly describe what is visibly shown in the image (subject, environment, lighting, weather).
2. Rate if it accurately matches the target description: Answer MATCH or MISMATCH.
Explain briefly in JSON format: {"description": "...", "status": "MATCH" | "MISMATCH", "reason": "..."}`
              }
            ]
          }
        ]
      });

      const text = response.text || '';
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        console.log(`[${i + 1}/${BOOKS.length}] ${item.book} (${item.target}): ${parsed.status} - ${parsed.description}`);
        results.push({ ...item, ...parsed });
      } else {
        console.log(`[${i + 1}/${BOOKS.length}] ${item.book}: Raw response`, text.slice(0, 100));
        results.push({ ...item, status: 'UNKNOWN', raw: text });
      }
    } catch (err) {
      console.error(`Error on ${item.book}:`, err.message);
      results.push({ ...item, status: 'ERROR', error: err.message });
    }

    // small pause
    await new Promise(r => setTimeout(r, 200));
  }

  fs.writeFileSync(path.join(__dirname, '../audit-results.json'), JSON.stringify(results, null, 2));
  console.log('AUDIT COMPLETE. Saved to audit-results.json');
}

audit().catch(console.error);
