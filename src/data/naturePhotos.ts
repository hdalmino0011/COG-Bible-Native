import { normalizeBookName } from './books';

// Direct ES module asset imports for the 26 updated books.
// Using direct imports causes Vite to emit cache-busting hashed asset URLs (e.g. /assets/judges_thunderstorm-[hash].jpg),
// completely bypassing any stale browser or service worker HTTP caches.
import judgesImg from '../assets/images/judges_thunderstorm_1790635486461.jpg';
import samuel2Img from '../assets/images/samuel_cedar_forest_1790635498999.jpg';
import chronicles1Img from '../assets/images/chronicles_oak_tree_1790635510205.jpg';
import chronicles2Img from '../assets/images/chronicles_campfire_1790635522116.jpg';
import solomonImg from '../assets/images/solomon_rose_bushes_1790635537213.jpg';
import jeremiahImg from '../assets/images/jeremiah_weeping_willow_1790635547584.jpg';
import hoseaImg from '../assets/images/hosea_climbing_vines_1790635559019.jpg';
import joelImg from '../assets/images/joel_golden_grasshopper_1790635569980.jpg';
import obadiahImg from '../assets/images/obadiah_soaring_eagle_1790635581563.jpg';
import jonahImg from '../assets/images/jonah_stormy_waves_1790635592089.jpg';
import micahImg from '../assets/images/micah_starry_hills_1790635604019.jpg';
import nahumImg from '../assets/images/nahum_desert_ruins_1790635615531.jpg';
import malachiImg from '../assets/images/malachi_bonfire_embers_1790635628194.jpg';
import matthewImg from '../assets/images/matthew_bright_star_1790635638033.jpg';
import romansImg from '../assets/images/romans_cobblestone_path_1790635647618.jpg';
import corinthians1Img from '../assets/images/corinthians_vineyard_rows_1790635658149.jpg';
import corinthians2Img from '../assets/images/corinthians_clay_pots_1790635669401.jpg';
import philippiansImg from '../assets/images/philippians_green_meadow_1790635681858.jpg';
import thessalonians1Img from '../assets/images/thessalonians_silver_clouds_1790635695513.jpg';
import thessalonians2Img from '../assets/images/thessalonians_sturdy_oak_1790635707144.jpg';
import timothy1Img from '../assets/images/timothy_grazing_sheep_1790635719929.jpg';
import timothy2Img from '../assets/images/timothy_sunrise_campground_1790635730568.jpg';
import titusImg from '../assets/images/titus_rugged_coastline_1790635743161.jpg';
import hebrewsImg from '../assets/images/hebrews_beach_anchor_1790635754773.jpg';
import john3Img from '../assets/images/john_open_gate_1790635767900.jpg';
import revelationImg from '../assets/images/revelation_golden_valley_1790635780072.jpg';

export interface BookNaturePhoto {
  book: string;
  title: string;
  url: string;
}

export const BOOK_NATURE_PHOTOS: Record<string, BookNaturePhoto> = {
  "Genesis": {
    book: "Genesis",
    title: "Misty Meadow at First Light",
    url: "./images/nature/genesis.jpg"
  },
  "Exodus": {
    book: "Exodus",
    title: "Waves Crashing on Rocky Shore",
    url: "./images/nature/exodus.jpg"
  },
  "Leviticus": {
    book: "Leviticus",
    title: "Wildflowers in a Quiet Field",
    url: "./images/nature/leviticus.jpg"
  },
  "Numbers": {
    book: "Numbers",
    title: "Starry Sky Over Desert Dunes",
    url: "./images/nature/numbers.jpg"
  },
  "Deuteronomy": {
    book: "Deuteronomy",
    title: "Rolling Hills Under Golden Clouds",
    url: "./images/nature/deuteronomy.jpg"
  },
  "Joshua": {
    book: "Joshua",
    title: "River Bend Through Green Forest",
    url: "./images/nature/joshua.jpg"
  },
  "Judges": {
    book: "Judges",
    title: "Thunderstorm Over Open Plains",
    url: judgesImg
  },
  "Ruth": {
    book: "Ruth",
    title: "Wheat Field Swaying in the Wind",
    url: "./images/nature/ruth.jpg"
  },
  "1 Samuel": {
    book: "1 Samuel",
    title: "Sunlight Through Tall Trees",
    url: "./images/nature/1-samuel.jpg"
  },
  "2 Samuel": {
    book: "2 Samuel",
    title: "Ancient Cedar Forest in Fog",
    url: samuel2Img
  },
  "1 Kings": {
    book: "1 Kings",
    title: "Rocky Cliff Above the Sea",
    url: "./images/nature/1-kings.jpg"
  },
  "2 Kings": {
    book: "2 Kings",
    title: "Fiery Sunset Over Mountain Ridge",
    url: "./images/nature/2-kings.jpg"
  },
  "1 Chronicles": {
    book: "1 Chronicles",
    title: "Old Oak Tree in a Meadow",
    url: chronicles1Img
  },
  "2 Chronicles": {
    book: "2 Chronicles",
    title: "Glowing Campfire in the Woods",
    url: chronicles2Img
  },
  "Ezra": {
    book: "Ezra",
    title: "Stone Bridge Over a Creek",
    url: "./images/nature/ezra.jpg"
  },
  "Nehemiah": {
    book: "Nehemiah",
    title: "Morning Fog on a Lake",
    url: "./images/nature/nehemiah.jpg"
  },
  "Esther": {
    book: "Esther",
    title: "Purple Wildflowers in Bloom",
    url: "./images/nature/esther.jpg"
  },
  "Job": {
    book: "Job",
    title: "Dust Storm on the Horizon",
    url: "./images/nature/job.jpg"
  },
  "Psalms": {
    book: "Psalms",
    title: "Calm Lake Reflecting Mountains",
    url: "./images/nature/psalms.jpg"
  },
  "Proverbs": {
    book: "Proverbs",
    title: "Winding Trail Through Pine Forest",
    url: "./images/nature/proverbs.jpg"
  },
  "Ecclesiastes": {
    book: "Ecclesiastes",
    title: "Autumn Leaves on a Riverbank",
    url: "./images/nature/ecclesiastes.jpg"
  },
  "Song of Solomon": {
    book: "Song of Solomon",
    title: "Rose Bushes in Full Bloom",
    url: solomonImg
  },
  "Isaiah": {
    book: "Isaiah",
    title: "Snowy Mountain Peak at Dawn",
    url: "./images/nature/isaiah.jpg"
  },
  "Jeremiah": {
    book: "Jeremiah",
    title: "Weeping Willow by a Pond",
    url: jeremiahImg
  },
  "Lamentations": {
    book: "Lamentations",
    title: "Raindrops on a Quiet Window",
    url: "./images/nature/lamentations.jpg"
  },
  "Ezekiel": {
    book: "Ezekiel",
    title: "Dry Desert Valley at Noon",
    url: "./images/nature/ezekiel.jpg"
  },
  "Daniel": {
    book: "Daniel",
    title: "Moonlit Cave Entrance",
    url: "./images/nature/daniel.jpg"
  },
  "Hosea": {
    book: "Hosea",
    title: "Vines Climbing a Broken Fence",
    url: hoseaImg
  },
  "Joel": {
    book: "Joel",
    title: "Golden Grasshopper on a Leaf",
    url: joelImg
  },
  "Amos": {
    book: "Amos",
    title: "Crooked River Through Flatlands",
    url: "./images/nature/amos.jpg"
  },
  "Obadiah": {
    book: "Obadiah",
    title: "Eagle Soaring Over Cliffs",
    url: obadiahImg
  },
  "Jonah": {
    book: "Jonah",
    title: "Stormy Ocean Waves at Dusk",
    url: jonahImg
  },
  "Micah": {
    book: "Micah",
    title: "Rolling Hills Under Starry Sky",
    url: micahImg
  },
  "Nahum": {
    book: "Nahum",
    title: "Crumbling Ruins in the Desert",
    url: nahumImg
  },
  "Habakkuk": {
    book: "Habakkuk",
    title: "Lone Tree on a Hilltop",
    url: "./images/nature/habakkuk.jpg"
  },
  "Zephaniah": {
    book: "Zephaniah",
    title: "Sunset Behind City Skyline",
    url: "./images/nature/zephaniah.jpg"
  },
  "Haggai": {
    book: "Haggai",
    title: "Fresh Soil in a Garden Bed",
    url: "./images/nature/haggai.jpg"
  },
  "Zechariah": {
    book: "Zechariah",
    title: "Lantern Glow in the Night",
    url: "./images/nature/zechariah.jpg"
  },
  "Malachi": {
    book: "Malachi",
    title: "Bonfire Embers at Twilight",
    url: malachiImg
  },
  "Matthew": {
    book: "Matthew",
    title: "Bright Star Over Quiet Fields",
    url: matthewImg
  },
  "Mark": {
    book: "Mark",
    title: "Wild River Through the Wilderness",
    url: "./images/nature/mark.jpg"
  },
  "Luke": {
    book: "Luke",
    title: "Wooden Barn Under Cloudy Sky",
    url: "./images/nature/luke.jpg"
  },
  "John": {
    book: "John",
    title: "Sunbeam Breaking Through Dark Clouds",
    url: "./images/nature/john.jpg"
  },
  "Acts": {
    book: "Acts",
    title: "Wildfire Glow on the Horizon",
    url: "./images/nature/acts.jpg"
  },
  "Romans": {
    book: "Romans",
    title: "Cobblestone Path Through Autumn Woods",
    url: romansImg
  },
  "1 Corinthians": {
    book: "1 Corinthians",
    title: "Vineyard Rows on a Hillside",
    url: corinthians1Img
  },
  "2 Corinthians": {
    book: "2 Corinthians",
    title: "Clay Pots in a Sunny Field",
    url: corinthians2Img
  },
  "Galatians": {
    book: "Galatians",
    title: "Apple Orchard in Bloom",
    url: "./images/nature/galatians.jpg"
  },
  "Ephesians": {
    book: "Ephesians",
    title: "Rocky Coastline at Sunrise",
    url: "./images/nature/ephesians.jpg"
  },
  "Philippians": {
    book: "Philippians",
    title: "Green Meadow After Rain",
    url: philippiansImg
  },
  "Colossians": {
    book: "Colossians",
    title: "Milky Way Over Quiet Lake",
    url: "./images/nature/colossians.jpg"
  },
  "1 Thessalonians": {
    book: "1 Thessalonians",
    title: "Silver Clouds at Daybreak",
    url: thessalonians1Img
  },
  "2 Thessalonians": {
    book: "2 Thessalonians",
    title: "Sturdy Oak in a Windstorm",
    url: thessalonians2Img
  },
  "1 Timothy": {
    book: "1 Timothy",
    title: "Sheep Grazing in a Valley",
    url: timothy1Img
  },
  "2 Timothy": {
    book: "2 Timothy",
    title: "Sunrise Over a Campground",
    url: timothy2Img
  },
  "Titus": {
    book: "Titus",
    title: "Rugged Coastline with Blue Water",
    url: titusImg
  },
  "Philemon": {
    book: "Philemon",
    title: "Mossy Garden Path",
    url: "./images/nature/philemon.jpg"
  },
  "Hebrews": {
    book: "Hebrews",
    title: "Anchor on a Sandy Beach",
    url: hebrewsImg
  },
  "James": {
    book: "James",
    title: "Wildflower Beside a Mountain Stream",
    url: "./images/nature/james.jpg"
  },
  "1 Peter": {
    book: "1 Peter",
    title: "Rocks Along a Seashore",
    url: "./images/nature/1-peter.jpg"
  },
  "2 Peter": {
    book: "2 Peter",
    title: "Morning Star Fading Over Hills",
    url: "./images/nature/2-peter.jpg"
  },
  "1 John": {
    book: "1 John",
    title: "Waterfall in a Sunlit Forest",
    url: "./images/nature/1-john.jpg"
  },
  "2 John": {
    book: "2 John",
    title: "Narrow Trail Through the Woods",
    url: "./images/nature/2-john.jpg"
  },
  "3 John": {
    book: "3 John",
    title: "Open Gate to a Green Field",
    url: john3Img
  },
  "Jude": {
    book: "Jude",
    title: "Waves Crashing Against Sea Cliffs",
    url: "./images/nature/jude.jpg"
  },
  "Revelation": {
    book: "Revelation",
    title: "River Through a Golden Valley at Sunset",
    url: revelationImg
  },
  "Songs of Solomon": {
    book: "Song of Solomon",
    title: "Rose Bushes in Full Bloom",
    url: solomonImg
  },
  "Revelations": {
    book: "Revelation",
    title: "River Through a Golden Valley at Sunset",
    url: revelationImg
  }
};

export function getBookNaturePhoto(bookName: string): BookNaturePhoto {
  if (BOOK_NATURE_PHOTOS[bookName]) {
    return BOOK_NATURE_PHOTOS[bookName];
  }
  const norm = normalizeBookName(bookName);
  if (norm && BOOK_NATURE_PHOTOS[norm]) {
    return BOOK_NATURE_PHOTOS[norm];
  }
  return {
    book: bookName,
    title: "God's Creation",
    url: "./images/nature/genesis.jpg"
  };
}
