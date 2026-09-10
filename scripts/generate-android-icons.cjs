const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SOURCE_ICON = path.join(__dirname, '../public/logo.png');
const RES_DIR = path.join(__dirname, '../android/app/src/main/res');
const BACKUP_DIR = path.join(__dirname, '../res-icons-backup');

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function run() {
  if (!fs.existsSync(RES_DIR)) {
    console.log('Android res directory not found, skipping icon configuration.');
    return;
  }

  console.log('Configuring Church Logo launcher icons and splash screens...');

  // Step 1: Copy pre-generated high-fidelity Church Logo assets from res-icons-backup if available
  if (fs.existsSync(BACKUP_DIR)) {
    console.log('Copying pre-generated Church Logo icon assets to android res directory...');
    copyDirRecursive(BACKUP_DIR, RES_DIR);
  }

  // Step 2: Test if ImageMagick 'convert' CLI is available
  let hasConvert = false;
  try {
    execSync('convert -version', { stdio: 'ignore' });
    hasConvert = true;
  } catch {
    hasConvert = false;
  }

  const DENSITIES = [
    { name: 'mipmap-mdpi', launcherSize: 48, fgSize: 108, innerFgSize: 76 },
    { name: 'mipmap-hdpi', launcherSize: 72, fgSize: 162, innerFgSize: 116 },
    { name: 'mipmap-xhdpi', launcherSize: 96, fgSize: 216, innerFgSize: 154 },
    { name: 'mipmap-xxhdpi', launcherSize: 144, fgSize: 324, innerFgSize: 232 },
    { name: 'mipmap-xxxhdpi', launcherSize: 192, fgSize: 432, innerFgSize: 310 },
  ];

  // If convert is available and source icon exists, render fresh raster assets
  if (hasConvert && fs.existsSync(SOURCE_ICON)) {
    try {
      console.log('Rendering fresh raster icons via ImageMagick...');
      for (const d of DENSITIES) {
        const targetDir = path.join(RES_DIR, d.name);
        if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

        // 1a. Standard ic_launcher.png
        const launcherPath = path.join(targetDir, 'ic_launcher.png');
        execSync(`convert "${SOURCE_ICON}" -resize ${d.launcherSize}x${d.launcherSize} "${launcherPath}"`, { stdio: 'ignore' });

        // 1b. Circular ic_launcher_round.png
        const roundPath = path.join(targetDir, 'ic_launcher_round.png');
        execSync(`convert "${SOURCE_ICON}" -resize ${d.launcherSize}x${d.launcherSize} \\( +clone -alpha extract -draw "fill black polygon 0,0 0,${d.launcherSize} ${d.launcherSize},${d.launcherSize} ${d.launcherSize},0 fill white circle ${d.launcherSize/2},${d.launcherSize/2} ${d.launcherSize/2},1" \\) -alpha off -compose CopyOpacity -composite "${roundPath}"`, { stdio: 'ignore' });

        // 1c. Adaptive Foreground ic_launcher_foreground.png
        const fgPath = path.join(targetDir, 'ic_launcher_foreground.png');
        execSync(`convert -size ${d.fgSize}x${d.fgSize} xc:none \\( "${SOURCE_ICON}" -resize ${d.innerFgSize}x${d.innerFgSize} \\) -gravity center -composite "${fgPath}"`, { stdio: 'ignore' });
      }
    } catch (err) {
      console.warn('ImageMagick generation error, falling back to bundled assets:', err.message);
    }
  } else if (!hasConvert) {
    console.log('ImageMagick CLI "convert" not present on environment; using bundled high-resolution Church Logo assets.');
    // If icons are still missing (e.g. fresh cap add without backup), copy SOURCE_ICON directly
    const testIcon = path.join(RES_DIR, 'mipmap-xxxhdpi/ic_launcher.png');
    if (!fs.existsSync(testIcon) && fs.existsSync(SOURCE_ICON)) {
      console.log('Populating missing mipmaps directly from logo...');
      for (const d of DENSITIES) {
        const targetDir = path.join(RES_DIR, d.name);
        if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
        fs.copyFileSync(SOURCE_ICON, path.join(targetDir, 'ic_launcher.png'));
        fs.copyFileSync(SOURCE_ICON, path.join(targetDir, 'ic_launcher_round.png'));
        fs.copyFileSync(SOURCE_ICON, path.join(targetDir, 'ic_launcher_foreground.png'));
      }
    }
  }

  // Step 3: Always ensure adaptive background color is set to #10203D (Church Navy)
  const valuesDir = path.join(RES_DIR, 'values');
  if (!fs.existsSync(valuesDir)) fs.mkdirSync(valuesDir, { recursive: true });
  fs.writeFileSync(
    path.join(valuesDir, 'ic_launcher_background.xml'),
    `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">#10203D</color>\n</resources>\n`
  );

  // Step 4: Remove obsolete default Capacitor vector foreground/background files
  const vectorFg = path.join(RES_DIR, 'drawable-v24/ic_launcher_foreground.xml');
  if (fs.existsSync(vectorFg)) {
    try { fs.unlinkSync(vectorFg); } catch {}
  }
  const vectorBg = path.join(RES_DIR, 'drawable/ic_launcher_background.xml');
  if (fs.existsSync(vectorBg)) {
    try { fs.unlinkSync(vectorBg); } catch {}
  }

  // Step 5: Ensure adaptive icon XMLs point to ic_launcher_background and mipmap/ic_launcher_foreground
  const anydpiDir = path.join(RES_DIR, 'mipmap-anydpi-v26');
  if (!fs.existsSync(anydpiDir)) fs.mkdirSync(anydpiDir, { recursive: true });
  const adaptiveXml = `<?xml version="1.0" encoding="utf-8"?>\n<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">\n    <background android:drawable="@color/ic_launcher_background"/>\n    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>\n</adaptive-icon>\n`;
  fs.writeFileSync(path.join(anydpiDir, 'ic_launcher.xml'), adaptiveXml);
  fs.writeFileSync(path.join(anydpiDir, 'ic_launcher_round.xml'), adaptiveXml);

  console.log('Successfully completed Church Logo Android icon configuration!');
}

try {
  run();
} catch (error) {
  console.error('Non-blocking icon configuration warning:', error.message);
  process.exit(0); // Never fail the CI build pipeline on icon asset configuration
}
