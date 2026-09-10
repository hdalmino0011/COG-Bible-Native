const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SOURCE_ICON = path.join(__dirname, '../public/logo.png');
const RES_DIR = path.join(__dirname, '../android/app/src/main/res');

if (!fs.existsSync(SOURCE_ICON)) {
  console.error('Source icon not found:', SOURCE_ICON);
  process.exit(1);
}

if (!fs.existsSync(RES_DIR)) {
  console.log('Android res directory not found, skipping icon generation');
  process.exit(0);
}

console.log('Generating Android Church Logo launcher icons and splash screens from:', SOURCE_ICON);

// 1. Density configurations for Launcher Icons
const DENSITIES = [
  { name: 'mipmap-mdpi', launcherSize: 48, fgSize: 108, innerFgSize: 76 },
  { name: 'mipmap-hdpi', launcherSize: 72, fgSize: 162, innerFgSize: 116 },
  { name: 'mipmap-xhdpi', launcherSize: 96, fgSize: 216, innerFgSize: 154 },
  { name: 'mipmap-xxhdpi', launcherSize: 144, fgSize: 324, innerFgSize: 232 },
  { name: 'mipmap-xxxhdpi', launcherSize: 192, fgSize: 432, innerFgSize: 310 },
];

for (const d of DENSITIES) {
  const targetDir = path.join(RES_DIR, d.name);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // 1a. Standard ic_launcher.png
  const launcherPath = path.join(targetDir, 'ic_launcher.png');
  execSync(`convert "${SOURCE_ICON}" -resize ${d.launcherSize}x${d.launcherSize} "${launcherPath}"`);

  // 1b. Circular ic_launcher_round.png
  const roundPath = path.join(targetDir, 'ic_launcher_round.png');
  execSync(`convert "${SOURCE_ICON}" -resize ${d.launcherSize}x${d.launcherSize} \\( +clone -alpha extract -draw "fill black polygon 0,0 0,${d.launcherSize} ${d.launcherSize},${d.launcherSize} ${d.launcherSize},0 fill white circle ${d.launcherSize/2},${d.launcherSize/2} ${d.launcherSize/2},1" \\) -alpha off -compose CopyOpacity -composite "${roundPath}"`);

  // 1c. Adaptive Foreground ic_launcher_foreground.png (safe zone centered)
  const fgPath = path.join(targetDir, 'ic_launcher_foreground.png');
  execSync(`convert -size ${d.fgSize}x${d.fgSize} xc:none \\( "${SOURCE_ICON}" -resize ${d.innerFgSize}x${d.innerFgSize} \\) -gravity center -composite "${fgPath}"`);
}

// 2. Background color for Adaptive Icons (#10203D - Church Navy)
const valuesDir = path.join(RES_DIR, 'values');
if (!fs.existsSync(valuesDir)) {
  fs.mkdirSync(valuesDir, { recursive: true });
}
const bgXmlPath = path.join(valuesDir, 'ic_launcher_background.xml');
fs.writeFileSync(
  bgXmlPath,
  `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#10203D</color>
</resources>
`
);

// 3. Remove obsolete Capacitor vector assets that override raster icons
const vectorFg = path.join(RES_DIR, 'drawable-v24/ic_launcher_foreground.xml');
if (fs.existsSync(vectorFg)) {
  fs.unlinkSync(vectorFg);
  console.log('Removed obsolete Capacitor vector ic_launcher_foreground.xml');
}

const vectorBg = path.join(RES_DIR, 'drawable/ic_launcher_background.xml');
if (fs.existsSync(vectorBg)) {
  fs.unlinkSync(vectorBg);
  console.log('Removed obsolete Capacitor vector ic_launcher_background.xml');
}

// 4. Ensure adaptive icon XML files reference background color and mipmap foreground
const anydpiDir = path.join(RES_DIR, 'mipmap-anydpi-v26');
if (!fs.existsSync(anydpiDir)) {
  fs.mkdirSync(anydpiDir, { recursive: true });
}

fs.writeFileSync(
  path.join(anydpiDir, 'ic_launcher.xml'),
  `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>
`
);

fs.writeFileSync(
  path.join(anydpiDir, 'ic_launcher_round.xml'),
  `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>
`
);

// 5. Generate matching Church Logo Splash Screens on #10203D Navy canvas
const SPLASH_SIZES = [
  { folder: 'drawable', w: 480, h: 800, logo: 220 },
  { folder: 'drawable-port-mdpi', w: 320, h: 480, logo: 150 },
  { folder: 'drawable-port-hdpi', w: 480, h: 800, logo: 220 },
  { folder: 'drawable-port-xhdpi', w: 720, h: 1280, logo: 330 },
  { folder: 'drawable-port-xxhdpi', w: 960, h: 1600, logo: 440 },
  { folder: 'drawable-port-xxxhdpi', w: 1280, h: 1920, logo: 580 },
  { folder: 'drawable-land-mdpi', w: 480, h: 320, logo: 150 },
  { folder: 'drawable-land-hdpi', w: 800, h: 480, logo: 220 },
  { folder: 'drawable-land-xhdpi', w: 1280, h: 720, logo: 330 },
  { folder: 'drawable-land-xxhdpi', w: 1600, h: 960, logo: 440 },
  { folder: 'drawable-land-xxxhdpi', w: 1920, h: 1280, logo: 580 },
];

for (const s of SPLASH_SIZES) {
  const splashDir = path.join(RES_DIR, s.folder);
  if (!fs.existsSync(splashDir)) {
    fs.mkdirSync(splashDir, { recursive: true });
  }
  const splashFile = path.join(splashDir, 'splash.png');
  try {
    execSync(
      `convert -size ${s.w}x${s.h} xc:"#10203D" \\( "${SOURCE_ICON}" -resize ${s.logo}x${s.logo} \\) -gravity center -composite "${splashFile}"`
    );
  } catch (err) {
    console.warn(`Failed to create splash for ${s.folder}:`, err.message);
  }
}

console.log('Successfully generated all Church Logo Android icons & splash screens!');
