const fs = require('fs');
const path = require('path');

const BOOKS_SPECS = [
  {
    book: 'Genesis',
    title: 'Misty Meadow at First Light',
    terms: ['morning mist meadow sunrise landscape', 'misty meadow sunrise dawn', 'foggy meadow morning sunrise', 'meadow morning mist']
  },
  {
    book: 'Exodus',
    title: 'Waves Crashing on Rocky Shore',
    terms: ['waves crashing rocky shore coast', 'ocean waves crashing rocks coast', 'sea waves crashing rocky coast']
  },
  {
    book: 'Leviticus',
    title: 'Wildflowers in a Quiet Field',
    terms: ['wildflowers field meadow nature', 'wildflower meadow field summer', 'blooming wildflowers field peaceful']
  },
  {
    book: 'Numbers',
    title: 'Starry Sky Over Desert Dunes',
    terms: ['stars night sky desert dunes', 'milky way desert sand dunes night', 'desert dunes starry night sky']
  },
  {
    book: 'Deuteronomy',
    title: 'Rolling Hills Under Golden Clouds',
    terms: ['rolling hills golden clouds sunset', 'rolling hills golden sunset light', 'green rolling hills golden evening clouds']
  },
  {
    book: 'Joshua',
    title: 'River Bend Through Green Forest',
    terms: ['river bend green forest trees', 'meandering river forest trees bend', 'river curving through forest']
  },
  {
    book: 'Judges',
    title: 'Thunderstorm Over Open Plains',
    terms: ['thunderstorm open plains prairie sky', 'supercell thunderstorm prairie plains', 'storm clouds over open plains']
  },
  {
    book: 'Ruth',
    title: 'Wheat Field Swaying in the Wind',
    terms: ['wheat field golden ripe summer', 'golden wheat field landscape', 'ripe wheat field wind']
  },
  {
    book: '1 Samuel',
    title: 'Sunlight Through Tall Trees',
    terms: ['sunlight through forest tall trees', 'sunbeams through forest trees', 'crepuscular rays forest trees']
  },
  {
    book: '2 Samuel',
    title: 'Ancient Cedar Forest in Fog',
    terms: ['cedar forest fog mist trees', 'ancient cedar forest misty', 'foggy cedar forest evergreen']
  },
  {
    book: '1 Kings',
    title: 'Rocky Cliff Above the Sea',
    terms: ['rocky cliff above sea ocean', 'sea cliff rocky coastline ocean view', 'high rocky cliff ocean coastline']
  },
  {
    book: '2 Kings',
    title: 'Fiery Sunset Over Mountain Ridge',
    terms: ['fiery sunset mountain ridge horizon', 'dramatic fiery sunset mountains', 'vibrant sunset mountain silhouette']
  },
  {
    book: '1 Chronicles',
    title: 'Old Oak Tree in a Meadow',
    terms: ['ancient oak tree green meadow', 'solitary oak tree meadow pasture', 'old oak tree grass meadow']
  },
  {
    book: '2 Chronicles',
    title: 'Glowing Campfire in the Woods',
    terms: ['campfire glowing woods forest night', 'camp fire forest night woods glow', 'campfire night forest flames']
  },
  {
    book: 'Ezra',
    title: 'Stone Bridge Over a Creek',
    terms: ['stone bridge creek stream forest', 'old stone arch bridge creek', 'stone bridge stream trees']
  },
  {
    book: 'Nehemiah',
    title: 'Morning Fog on a Lake',
    terms: ['morning fog mist quiet calm lake', 'morning mist over calm lake water', 'lake morning fog sunrise calm']
  },
  {
    book: 'Esther',
    title: 'Purple Wildflowers in Bloom',
    terms: ['purple wildflowers blooming field', 'purple lupines wildflowers meadow', 'field of purple wildflowers bloom']
  },
  {
    book: 'Job',
    title: 'Dust Storm on the Horizon',
    terms: ['dust storm desert horizon haboob', 'sandstorm approaching desert horizon', 'dust storm desert landscape wall']
  },
  {
    book: 'Psalms',
    title: 'Calm Lake Reflecting Mountains',
    terms: ['calm alpine lake reflecting mountains', 'placid lake mountain reflection mirror', 'mountain reflection still lake water']
  },
  {
    book: 'Proverbs',
    title: 'Winding Trail Through Pine Forest',
    terms: ['winding trail path pine forest trees', 'path winding through pine trees forest', 'winding footpath pine forest nature']
  },
  {
    book: 'Ecclesiastes',
    title: 'Autumn Leaves on a Riverbank',
    terms: ['autumn leaves riverbank fall foliage river', 'autumn leaves stream bank water fall', 'riverbank colorful autumn leaves']
  },
  {
    book: 'Song of Solomon',
    title: 'Rose Bushes in Full Bloom',
    terms: ['rose bushes garden full bloom flowers', 'blooming rose bushes garden pink red', 'roses blooming garden shrubs']
  },
  {
    book: 'Isaiah',
    title: 'Snowy Mountain Peak at Dawn',
    terms: ['snowy mountain peak dawn sunrise', 'snow capped mountain peak sunrise pink', 'alpenglow snowy mountain summit dawn']
  },
  {
    book: 'Jeremiah',
    title: 'Weeping Willow by a Pond',
    terms: ['weeping willow tree pond water', 'weeping willow lake reflection water', 'willow tree beside calm pond']
  },
  {
    book: 'Lamentations',
    title: 'Raindrops on a Quiet Window',
    terms: ['raindrops on window glass rain moody', 'rain drops glass window pane', 'rain on window pane cloudy water droplets']
  },
  {
    book: 'Ezekiel',
    title: 'Dry Desert Valley at Noon',
    terms: ['dry desert valley arid landscape noon', 'arid desert valley canyon dry landscape', 'desert valley sunny dry arid terrain']
  },
  {
    book: 'Daniel',
    title: 'Moonlit Cave Entrance',
    terms: ['cave entrance night moonlight darkness', 'cave entrance looking out night sky moon', 'rock cave entrance night moonlit']
  },
  {
    book: 'Hosea',
    title: 'Vines Climbing a Broken Fence',
    terms: ['vines climbing wooden fence rustic', 'ivy climbing old wooden fence garden', 'creeper vines wooden fence']
  },
  {
    book: 'Joel',
    title: 'Golden Grasshopper on a Leaf',
    terms: ['grasshopper sitting on green leaf macro', 'grasshopper on leaf insect nature macro', 'locust grasshopper on plant leaf']
  },
  {
    book: 'Amos',
    title: 'Crooked River Through Flatlands',
    terms: ['meandering crooked river flat plains landscape', 'winding meandering river flatland prairie', 'river meandering through flat valley']
  },
  {
    book: 'Obadiah',
    title: 'Eagle Soaring Over Cliffs',
    terms: ['golden eagle soaring sky flight cliffs', 'eagle flying soaring over mountain cliffs', 'eagle soaring mountains cliff sky']
  },
  {
    book: 'Jonah',
    title: 'Stormy Ocean Waves at Dusk',
    terms: ['stormy ocean waves dusk rough sea', 'stormy waves sunset ocean dusk rough', 'dramatic ocean storm waves twilight']
  },
  {
    book: 'Micah',
    title: 'Rolling Hills Under Starry Sky',
    terms: ['night sky stars rolling hills landscape', 'milky way stars over rolling hills', 'rolling hills starry night landscape']
  },
  {
    book: 'Nahum',
    title: 'Crumbling Ruins in the Desert',
    terms: ['ancient crumbling stone ruins desert landscape', 'desert ancient ruins stone crumbling', 'desert archaeological stone ruins']
  },
  {
    book: 'Habakkuk',
    title: 'Lone Tree on a Hilltop',
    terms: ['lone solitary tree hilltop green landscape', 'single tree on hilltop horizon green', 'solitary tree crest of hill scenic']
  },
  {
    book: 'Zephaniah',
    title: 'Sunset Behind City Skyline',
    terms: ['sunset behind city skyline golden hour', 'dramatic sunset city skyline silhouette', 'sunset skyline urban city buildings']
  },
  {
    book: 'Haggai',
    title: 'Fresh Soil in a Garden Bed',
    terms: ['fresh dark garden soil earth bed', 'rich garden soil earth fertile ground', 'fresh turned garden soil bed']
  },
  {
    book: 'Zechariah',
    title: 'Lantern Glow in the Night',
    terms: ['oil lantern glowing night dark warm', 'lantern glowing warm light darkness night', 'vintage lantern glowing in the dark']
  },
  {
    book: 'Malachi',
    title: 'Bonfire Embers at Twilight',
    terms: ['glowing bonfire embers twilight night fire', 'fire embers glowing twilight coals', 'campfire hot glowing embers evening']
  },
  {
    book: 'Matthew',
    title: 'Bright Star Over Quiet Fields',
    terms: ['bright evening star night sky quiet field', 'bright star night sky meadow countryside', 'night sky bright single star field']
  },
  {
    book: 'Mark',
    title: 'Wild River Through the Wilderness',
    terms: ['wild river rapids wilderness forest canyon', 'rushing white water river wilderness rapids', 'wild river flowing through rocky canyon']
  },
  {
    book: 'Luke',
    title: 'Wooden Barn Under Cloudy Sky',
    terms: ['rustic old wooden barn cloudy sky farm', 'weathered wooden barn countryside clouds', 'historic wooden barn rural field clouds']
  },
  {
    book: 'John',
    title: 'Sunbeam Breaking Through Dark Clouds',
    terms: ['crepuscular rays sunbeams dark storm clouds sky', 'sunlight breaking through dark clouds sky', 'sun rays piercing through storm clouds']
  },
  {
    book: 'Acts',
    title: 'Wildfire Glow on the Horizon',
    terms: ['distant wildfire smoke glow night horizon', 'wildfire horizon smoke evening orange glow', 'distant forest fire horizon twilight']
  },
  {
    book: 'Romans',
    title: 'Cobblestone Path Through Autumn Woods',
    terms: ['cobblestone path autumn trees park fallen leaves', 'stone cobblestone pathway autumn forest', 'cobblestone walkway through autumn trees']
  },
  {
    book: '1 Corinthians',
    title: 'Vineyard Rows on a Hillside',
    terms: ['vineyard grape vines rows hillside slope', 'vineyard rows hillside landscape grapevines', 'scenic vineyard hillside rolling rows']
  },
  {
    book: '2 Corinthians',
    title: 'Clay Pots in a Sunny Field',
    terms: ['terracotta clay pots sunny garden field', 'clay pottery pots in sunny outdoor garden', 'terracotta planters sunny yard field']
  },
  {
    book: 'Galatians',
    title: 'Apple Orchard in Bloom',
    terms: ['apple orchard in bloom spring blossoms', 'blooming apple trees orchard spring', 'apple blossom orchard spring rows']
  },
  {
    book: 'Ephesians',
    title: 'Rocky Coastline at Sunrise',
    terms: ['rocky coastline sunrise ocean morning shore', 'sunrise rocky coast morning sea rocks', 'rocky coastline morning golden sunrise']
  },
  {
    book: 'Philippians',
    title: 'Green Meadow After Rain',
    terms: ['lush green meadow fresh rain droplets grass', 'green grass meadow fresh rain sunny', 'fresh green meadow raindrops lush pasture']
  },
  {
    book: 'Colossians',
    title: 'Milky Way Over Quiet Lake',
    terms: ['milky way galaxy stars calm lake reflection', 'milky way night sky quiet still lake', 'night sky stars milky way reflecting on lake']
  },
  {
    book: '1 Thessalonians',
    title: 'Silver Clouds at Daybreak',
    terms: ['silver morning clouds dawn daybreak sky', 'luminous silver dawn clouds daybreak morning', 'silver clouds sunrise daybreak pastel sky']
  },
  {
    book: '2 Thessalonians',
    title: 'Sturdy Oak in a Windstorm',
    terms: ['sturdy oak tree wind storm dark sky', 'large oak tree stormy windy weather sky', 'oak tree stormy sky wind field']
  },
  {
    book: '1 Timothy',
    title: 'Sheep Grazing in a Valley',
    terms: ['flock of sheep grazing in green valley', 'sheep grazing green hillside valley pasture', 'sheep pasture valley green hills meadow']
  },
  {
    book: '2 Timothy',
    title: 'Sunrise Over a Campground',
    terms: ['sunrise morning forest campground campsite', 'campsite tent sunrise morning forest mist', 'sunrise morning over camping forest']
  },
  {
    book: 'Titus',
    title: 'Rugged Coastline with Blue Water',
    terms: ['rugged rocky coastline turquoise blue water sea', 'rocky coast blue turquoise ocean water scenic', 'rugged coast turquoise clear sea water']
  },
  {
    book: 'Philemon',
    title: 'Mossy Garden Path',
    terms: ['mossy stone path garden woods green', 'moss covered stone pathway forest garden', 'mossy pathway stones lush green garden']
  },
  {
    book: 'Hebrews',
    title: 'Anchor on a Sandy Beach',
    terms: ['old iron anchor sandy beach seashore', 'boat anchor on sand seashore beach', 'vintage anchor resting on sandy beach']
  },
  {
    book: 'James',
    title: 'Wildflower Beside a Mountain Stream',
    terms: ['wildflower blooming beside mountain stream water', 'wildflowers stream bank clear mountain water', 'wildflower creek mountain stream rocks']
  },
  {
    book: '1 Peter',
    title: 'Rocks Along a Seashore',
    terms: ['pebbles rocks stones along seashore beach shoreline', 'smooth stones rocks seashore beach tide', 'sea rocks pebbles shoreline water wave']
  },
  {
    book: '2 Peter',
    title: 'Morning Star Fading Over Hills',
    terms: ['venus morning star dawn over hills horizon', 'bright morning star dawn horizon hills silhouette', 'morning star twilight dawn over hills']
  },
  {
    book: '1 John',
    title: 'Waterfall in a Sunlit Forest',
    terms: ['waterfall sunlit sunny forest green trees', 'sunlit waterfall forest stream sunlight', 'scenic waterfall sunlit lush forest trees']
  },
  {
    book: '2 John',
    title: 'Narrow Trail Through the Woods',
    terms: ['narrow trail walking path woods trees forest', 'narrow forest trail path lush green woods', 'narrow path footpath winding woods']
  },
  {
    book: '3 John',
    title: 'Open Gate to a Green Field',
    terms: ['open wooden gate green field pasture countryside', 'rustic open gate green meadow field farm', 'open gate meadow green pasture landscape']
  },
  {
    book: 'Jude',
    title: 'Waves Crashing Against Sea Cliffs',
    terms: ['waves crashing sea cliffs ocean spray rocks', 'ocean waves crashing high sea cliffs dramatic', 'powerful waves crashing against sea cliffs spray']
  },
  {
    book: 'Revelation',
    title: 'River Through a Golden Valley at Sunset',
    terms: ['river flowing golden valley sunset mountain landscape', 'river sunset valley golden hour mountains light', 'golden sunset river valley panoramic landscape']
  }
];

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '-');
}

async function findWikiPhoto(item) {
  for (const term of item.terms) {
    const url = 'https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=' + 
      encodeURIComponent(term + ' filetype:bitmap -pdf -djvu -book -IA -catalogue -report -manual -bulletin -index') + 
      '&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url|thumburl|mime|size&iiurlwidth=1200&format=json';

    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'COG-BibleApp/1.0 (bible-app@tjr.org)' } });
      if (!res.ok) continue;
      const data = await res.json();
      if (!data.query || !data.query.pages) continue;

      for (const p of Object.values(data.query.pages)) {
        const title = p.title || '';
        const titleLower = title.toLowerCase();
        
        // Filter out non-images and Internet Archive book scans
        if (titleLower.endsWith('.pdf') || titleLower.endsWith('.djvu') || titleLower.endsWith('.tif') || titleLower.endsWith('.svg')) continue;
        if (titleLower.includes('(ia ') || titleLower.includes('catalogue') || titleLower.includes('bulletin') || titleLower.includes('pamphlet')) continue;
        if (titleLower.includes('report') || titleLower.includes('manual') || titleLower.includes('handbook')) continue;

        const info = p.imageinfo?.[0];
        if (!info) continue;
        if (info.mime !== 'image/jpeg' && info.mime !== 'image/png') continue;
        
        // Ensure photographic resolution
        if (info.width && info.width < 500) continue;
        if (info.height && info.height < 350) continue;

        const downloadUrl = info.thumburl || info.url;
        if (!downloadUrl) continue;

        return {
          book: item.book,
          title: item.title,
          fileTitle: title,
          downloadUrl
        };
      }
    } catch (e) {
      // try next term
    }
  }

  return null;
}

async function downloadPhoto(url) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'COG-BibleApp/1.0 (bible-app@tjr.org)' } });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length > 15000) {
      return buf;
    }
  } catch (err) {
    console.error('Download error:', err.message);
  }
  return null;
}

async function run() {
  console.log(`Starting verified photo retrieval for all ${BOOKS_SPECS.length} Bible books...`);

  const publicDir = path.join(__dirname, '../public/images/nature');
  const docsDir = path.join(__dirname, '../docs/images/nature');
  const androidDir = path.join(__dirname, '../android/app/src/main/assets/public/images/nature');

  [publicDir, docsDir, androidDir].forEach(d => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });

  const verifiedList = [];
  const failures = [];

  for (let i = 0; i < BOOKS_SPECS.length; i++) {
    const spec = BOOKS_SPECS[i];
    const slug = slugify(spec.book);
    const targetFile = `${slug}.jpg`;

    console.log(`[${i + 1}/${BOOKS_SPECS.length}] Finding photo for ${spec.book}: "${spec.title}"...`);
    const found = await findWikiPhoto(spec);

    if (found && found.downloadUrl) {
      console.log(`  Downloading: ${found.fileTitle}`);
      const buf = await downloadPhoto(found.downloadUrl);
      if (buf) {
        fs.writeFileSync(path.join(publicDir, targetFile), buf);
        fs.writeFileSync(path.join(docsDir, targetFile), buf);
        fs.writeFileSync(path.join(androidDir, targetFile), buf);
        console.log(`  -> Saved ${targetFile} (${Math.round(buf.length / 1024)} KB)`);
        verifiedList.push({ book: spec.book, title: spec.title, fileTitle: found.fileTitle, sizeKB: Math.round(buf.length / 1024) });
      } else {
        console.warn(`  Failed buffer for ${spec.book}`);
        failures.push(spec.book);
      }
    } else {
      console.warn(`  No photo candidate found for ${spec.book}`);
      failures.push(spec.book);
    }

    // Brief delay to be polite to Wikimedia
    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`\nCOMPLETED: ${verifiedList.length} downloaded successfully. Failures: ${failures.length}`);
  if (failures.length > 0) {
    console.log('Failed books:', failures.join(', '));
  }

  fs.writeFileSync(path.join(__dirname, '../verified-photos-log.json'), JSON.stringify({ verifiedList, failures }, null, 2));
}

run().catch(console.error);
