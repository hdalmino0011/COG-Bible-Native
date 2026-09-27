// Verified nature photos matching the user's exact specification
export interface BookNaturePhoto {
  book: string;
  title: string;
  url: string;
  caption?: string;
  location?: string;
}

export type NaturePhoto = BookNaturePhoto;

export const BOOK_NATURE_PHOTOS: Record<string, BookNaturePhoto> = {
  "Genesis": {
    book: "Genesis",
    title: "Misty Meadow at First Light",
    url: "./images/nature/genesis.jpg",
    caption: "Misty Meadow at First Light",
    location: "Genesis"
  },
  "Exodus": {
    book: "Exodus",
    title: "Waves Crashing on Rocky Shore",
    url: "./images/nature/exodus.jpg",
    caption: "Waves Crashing on Rocky Shore",
    location: "Exodus"
  },
  "Leviticus": {
    book: "Leviticus",
    title: "Wildflowers in a Quiet Field",
    url: "./images/nature/leviticus.jpg",
    caption: "Wildflowers in a Quiet Field",
    location: "Leviticus"
  },
  "Numbers": {
    book: "Numbers",
    title: "Starry Sky Over Desert Dunes",
    url: "./images/nature/numbers.jpg",
    caption: "Starry Sky Over Desert Dunes",
    location: "Numbers"
  },
  "Deuteronomy": {
    book: "Deuteronomy",
    title: "Rolling Hills Under Golden Clouds",
    url: "./images/nature/deuteronomy.jpg",
    caption: "Rolling Hills Under Golden Clouds",
    location: "Deuteronomy"
  },
  "Joshua": {
    book: "Joshua",
    title: "River Bend Through Green Forest",
    url: "./images/nature/joshua.jpg",
    caption: "River Bend Through Green Forest",
    location: "Joshua"
  },
  "Judges": {
    book: "Judges",
    title: "Thunderstorm Over Open Plains",
    url: "./images/nature/judges.jpg",
    caption: "Thunderstorm Over Open Plains",
    location: "Judges"
  },
  "Ruth": {
    book: "Ruth",
    title: "Wheat Field Swaying in the Wind",
    url: "./images/nature/ruth.jpg",
    caption: "Wheat Field Swaying in the Wind",
    location: "Ruth"
  },
  "1 Samuel": {
    book: "1 Samuel",
    title: "Sunlight Through Tall Trees",
    url: "./images/nature/1-samuel.jpg",
    caption: "Sunlight Through Tall Trees",
    location: "1 Samuel"
  },
  "2 Samuel": {
    book: "2 Samuel",
    title: "Ancient Cedar Forest in Fog",
    url: "./images/nature/2-samuel.jpg",
    caption: "Ancient Cedar Forest in Fog",
    location: "2 Samuel"
  },
  "1 Kings": {
    book: "1 Kings",
    title: "Rocky Cliff Above the Sea",
    url: "./images/nature/1-kings.jpg",
    caption: "Rocky Cliff Above the Sea",
    location: "1 Kings"
  },
  "2 Kings": {
    book: "2 Kings",
    title: "Fiery Sunset Over Mountain Ridge",
    url: "./images/nature/2-kings.jpg",
    caption: "Fiery Sunset Over Mountain Ridge",
    location: "2 Kings"
  },
  "1 Chronicles": {
    book: "1 Chronicles",
    title: "Old Oak Tree in a Meadow",
    url: "./images/nature/1-chronicles.jpg",
    caption: "Old Oak Tree in a Meadow",
    location: "1 Chronicles"
  },
  "2 Chronicles": {
    book: "2 Chronicles",
    title: "Glowing Campfire in the Woods",
    url: "./images/nature/2-chronicles.jpg",
    caption: "Glowing Campfire in the Woods",
    location: "2 Chronicles"
  },
  "Ezra": {
    book: "Ezra",
    title: "Stone Bridge Over a Creek",
    url: "./images/nature/ezra.jpg",
    caption: "Stone Bridge Over a Creek",
    location: "Ezra"
  },
  "Nehemiah": {
    book: "Nehemiah",
    title: "Morning Fog on a Lake",
    url: "./images/nature/nehemiah.jpg",
    caption: "Morning Fog on a Lake",
    location: "Nehemiah"
  },
  "Esther": {
    book: "Esther",
    title: "Purple Wildflowers in Bloom",
    url: "./images/nature/esther.jpg",
    caption: "Purple Wildflowers in Bloom",
    location: "Esther"
  },
  "Job": {
    book: "Job",
    title: "Dust Storm on the Horizon",
    url: "./images/nature/job.jpg",
    caption: "Dust Storm on the Horizon",
    location: "Job"
  },
  "Psalms": {
    book: "Psalms",
    title: "Calm Lake Reflecting Mountains",
    url: "./images/nature/psalms.jpg",
    caption: "Calm Lake Reflecting Mountains",
    location: "Psalms"
  },
  "Proverbs": {
    book: "Proverbs",
    title: "Winding Trail Through Pine Forest",
    url: "./images/nature/proverbs.jpg",
    caption: "Winding Trail Through Pine Forest",
    location: "Proverbs"
  },
  "Ecclesiastes": {
    book: "Ecclesiastes",
    title: "Autumn Leaves on a Riverbank",
    url: "./images/nature/ecclesiastes.jpg",
    caption: "Autumn Leaves on a Riverbank",
    location: "Ecclesiastes"
  },
  "Song of Solomon": {
    book: "Song of Solomon",
    title: "Rose Bushes in Full Bloom",
    url: "./images/nature/song-of-solomon.jpg",
    caption: "Rose Bushes in Full Bloom",
    location: "Song of Solomon"
  },
  "Isaiah": {
    book: "Isaiah",
    title: "Snowy Mountain Peak at Dawn",
    url: "./images/nature/isaiah.jpg",
    caption: "Snowy Mountain Peak at Dawn",
    location: "Isaiah"
  },
  "Jeremiah": {
    book: "Jeremiah",
    title: "Weeping Willow by a Pond",
    url: "./images/nature/jeremiah.jpg",
    caption: "Weeping Willow by a Pond",
    location: "Jeremiah"
  },
  "Lamentations": {
    book: "Lamentations",
    title: "Raindrops on a Quiet Window",
    url: "./images/nature/lamentations.jpg",
    caption: "Raindrops on a Quiet Window",
    location: "Lamentations"
  },
  "Ezekiel": {
    book: "Ezekiel",
    title: "Dry Desert Valley at Noon",
    url: "./images/nature/ezekiel.jpg",
    caption: "Dry Desert Valley at Noon",
    location: "Ezekiel"
  },
  "Daniel": {
    book: "Daniel",
    title: "Moonlit Cave Entrance",
    url: "./images/nature/daniel.jpg",
    caption: "Moonlit Cave Entrance",
    location: "Daniel"
  },
  "Hosea": {
    book: "Hosea",
    title: "Vines Climbing a Broken Fence",
    url: "./images/nature/hosea.jpg",
    caption: "Vines Climbing a Broken Fence",
    location: "Hosea"
  },
  "Joel": {
    book: "Joel",
    title: "Golden Grasshopper on a Leaf",
    url: "./images/nature/joel.jpg",
    caption: "Golden Grasshopper on a Leaf",
    location: "Joel"
  },
  "Amos": {
    book: "Amos",
    title: "Crooked River Through Flatlands",
    url: "./images/nature/amos.jpg",
    caption: "Crooked River Through Flatlands",
    location: "Amos"
  },
  "Obadiah": {
    book: "Obadiah",
    title: "Eagle Soaring Over Cliffs",
    url: "./images/nature/obadiah.jpg",
    caption: "Eagle Soaring Over Cliffs",
    location: "Obadiah"
  },
  "Jonah": {
    book: "Jonah",
    title: "Stormy Ocean Waves at Dusk",
    url: "./images/nature/jonah.jpg",
    caption: "Stormy Ocean Waves at Dusk",
    location: "Jonah"
  },
  "Micah": {
    book: "Micah",
    title: "Rolling Hills Under Starry Sky",
    url: "./images/nature/micah.jpg",
    caption: "Rolling Hills Under Starry Sky",
    location: "Micah"
  },
  "Nahum": {
    book: "Nahum",
    title: "Crumbling Ruins in the Desert",
    url: "./images/nature/nahum.jpg",
    caption: "Crumbling Ruins in the Desert",
    location: "Nahum"
  },
  "Habakkuk": {
    book: "Habakkuk",
    title: "Lone Tree on a Hilltop",
    url: "./images/nature/habakkuk.jpg",
    caption: "Lone Tree on a Hilltop",
    location: "Habakkuk"
  },
  "Zephaniah": {
    book: "Zephaniah",
    title: "Sunset Behind City Skyline",
    url: "./images/nature/zephaniah.jpg",
    caption: "Sunset Behind City Skyline",
    location: "Zephaniah"
  },
  "Haggai": {
    book: "Haggai",
    title: "Fresh Soil in a Garden Bed",
    url: "./images/nature/haggai.jpg",
    caption: "Fresh Soil in a Garden Bed",
    location: "Haggai"
  },
  "Zechariah": {
    book: "Zechariah",
    title: "Lantern Glow in the Night",
    url: "./images/nature/zechariah.jpg",
    caption: "Lantern Glow in the Night",
    location: "Zechariah"
  },
  "Malachi": {
    book: "Malachi",
    title: "Bonfire Embers at Twilight",
    url: "./images/nature/malachi.jpg",
    caption: "Bonfire Embers at Twilight",
    location: "Malachi"
  },
  "Matthew": {
    book: "Matthew",
    title: "Bright Star Over Quiet Fields",
    url: "./images/nature/matthew.jpg",
    caption: "Bright Star Over Quiet Fields",
    location: "Matthew"
  },
  "Mark": {
    book: "Mark",
    title: "Wild River Through the Wilderness",
    url: "./images/nature/mark.jpg",
    caption: "Wild River Through the Wilderness",
    location: "Mark"
  },
  "Luke": {
    book: "Luke",
    title: "Wooden Barn Under Cloudy Sky",
    url: "./images/nature/luke.jpg",
    caption: "Wooden Barn Under Cloudy Sky",
    location: "Luke"
  },
  "John": {
    book: "John",
    title: "Sunbeam Breaking Through Dark Clouds",
    url: "./images/nature/john.jpg",
    caption: "Sunbeam Breaking Through Dark Clouds",
    location: "John"
  },
  "Acts": {
    book: "Acts",
    title: "Wildfire Glow on the Horizon",
    url: "./images/nature/acts.jpg",
    caption: "Wildfire Glow on the Horizon",
    location: "Acts"
  },
  "Romans": {
    book: "Romans",
    title: "Cobblestone Path Through Autumn Woods",
    url: "./images/nature/romans.jpg",
    caption: "Cobblestone Path Through Autumn Woods",
    location: "Romans"
  },
  "1 Corinthians": {
    book: "1 Corinthians",
    title: "Vineyard Rows on a Hillside",
    url: "./images/nature/1-corinthians.jpg",
    caption: "Vineyard Rows on a Hillside",
    location: "1 Corinthians"
  },
  "2 Corinthians": {
    book: "2 Corinthians",
    title: "Clay Pots in a Sunny Field",
    url: "./images/nature/2-corinthians.jpg",
    caption: "Clay Pots in a Sunny Field",
    location: "2 Corinthians"
  },
  "Galatians": {
    book: "Galatians",
    title: "Apple Orchard in Bloom",
    url: "./images/nature/galatians.jpg",
    caption: "Apple Orchard in Bloom",
    location: "Galatians"
  },
  "Ephesians": {
    book: "Ephesians",
    title: "Rocky Coastline at Sunrise",
    url: "./images/nature/ephesians.jpg",
    caption: "Rocky Coastline at Sunrise",
    location: "Ephesians"
  },
  "Philippians": {
    book: "Philippians",
    title: "Green Meadow After Rain",
    url: "./images/nature/philippians.jpg",
    caption: "Green Meadow After Rain",
    location: "Philippians"
  },
  "Colossians": {
    book: "Colossians",
    title: "Milky Way Over Quiet Lake",
    url: "./images/nature/colossians.jpg",
    caption: "Milky Way Over Quiet Lake",
    location: "Colossians"
  },
  "1 Thessalonians": {
    book: "1 Thessalonians",
    title: "Silver Clouds at Daybreak",
    url: "./images/nature/1-thessalonians.jpg",
    caption: "Silver Clouds at Daybreak",
    location: "1 Thessalonians"
  },
  "2 Thessalonians": {
    book: "2 Thessalonians",
    title: "Sturdy Oak in a Windstorm",
    url: "./images/nature/2-thessalonians.jpg",
    caption: "Sturdy Oak in a Windstorm",
    location: "2 Thessalonians"
  },
  "1 Timothy": {
    book: "1 Timothy",
    title: "Sheep Grazing in a Valley",
    url: "./images/nature/1-timothy.jpg",
    caption: "Sheep Grazing in a Valley",
    location: "1 Timothy"
  },
  "2 Timothy": {
    book: "2 Timothy",
    title: "Sunrise Over a Campground",
    url: "./images/nature/2-timothy.jpg",
    caption: "Sunrise Over a Campground",
    location: "2 Timothy"
  },
  "Titus": {
    book: "Titus",
    title: "Rugged Coastline with Blue Water",
    url: "./images/nature/titus.jpg",
    caption: "Rugged Coastline with Blue Water",
    location: "Titus"
  },
  "Philemon": {
    book: "Philemon",
    title: "Mossy Garden Path",
    url: "./images/nature/philemon.jpg",
    caption: "Mossy Garden Path",
    location: "Philemon"
  },
  "Hebrews": {
    book: "Hebrews",
    title: "Anchor on a Sandy Beach",
    url: "./images/nature/hebrews.jpg",
    caption: "Anchor on a Sandy Beach",
    location: "Hebrews"
  },
  "James": {
    book: "James",
    title: "Wildflower Beside a Mountain Stream",
    url: "./images/nature/james.jpg",
    caption: "Wildflower Beside a Mountain Stream",
    location: "James"
  },
  "1 Peter": {
    book: "1 Peter",
    title: "Rocks Along a Seashore",
    url: "./images/nature/1-peter.jpg",
    caption: "Rocks Along a Seashore",
    location: "1 Peter"
  },
  "2 Peter": {
    book: "2 Peter",
    title: "Morning Star Fading Over Hills",
    url: "./images/nature/2-peter.jpg",
    caption: "Morning Star Fading Over Hills",
    location: "2 Peter"
  },
  "1 John": {
    book: "1 John",
    title: "Waterfall in a Sunlit Forest",
    url: "./images/nature/1-john.jpg",
    caption: "Waterfall in a Sunlit Forest",
    location: "1 John"
  },
  "2 John": {
    book: "2 John",
    title: "Narrow Trail Through the Woods",
    url: "./images/nature/2-john.jpg",
    caption: "Narrow Trail Through the Woods",
    location: "2 John"
  },
  "3 John": {
    book: "3 John",
    title: "Open Gate to a Green Field",
    url: "./images/nature/3-john.jpg",
    caption: "Open Gate to a Green Field",
    location: "3 John"
  },
  "Jude": {
    book: "Jude",
    title: "Waves Crashing Against Sea Cliffs",
    url: "./images/nature/jude.jpg",
    caption: "Waves Crashing Against Sea Cliffs",
    location: "Jude"
  },
  "Revelation": {
    book: "Revelation",
    title: "River Through a Golden Valley at Sunset",
    url: "./images/nature/revelation.jpg",
    caption: "River Through a Golden Valley at Sunset",
    location: "Revelation"
  }
};

export const NATURE_PHOTOS: BookNaturePhoto[] = Object.values(BOOK_NATURE_PHOTOS);

export function getBookNaturePhoto(bookName: string): BookNaturePhoto {
  return BOOK_NATURE_PHOTOS[bookName] || {
    book: bookName,
    title: "God's Creation",
    url: "./images/nature/genesis.jpg",
    caption: "God's Creation",
    location: bookName
  };
}

export function getRandomNaturePhoto(bookName?: string): BookNaturePhoto {
  if (bookName && BOOK_NATURE_PHOTOS[bookName]) {
    return BOOK_NATURE_PHOTOS[bookName];
  }
  return BOOK_NATURE_PHOTOS["Genesis"];
}
