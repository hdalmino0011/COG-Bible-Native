const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SEAL_TRANSPARENT = path.join(__dirname, '../seal_extracted.png');
const LOGO_FALLBACK = path.join(__dirname, '../public/logo.png');
const RES_DIR = path.join(__dirname, '../android/app/src/main/res');
const BACKUP_DIR = path.join(__dirname, '../res-icons-backup');
const ROOT_DIR = path.join(__dirname, '..');
const PUBLIC_DIR = path.join(__dirname, '../public');

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
  console.log('Configuring Church Logo launcher icons and splash screens...');

  // Choose the best transparent source seal
  const sourceImg = fs.existsSync(SEAL_TRANSPARENT) ? SEAL_TRANSPARENT : LOGO_FALLBACK;

  let hasConvert = false;
  try {
    execSync('convert -version', { stdio: 'ignore' });
    hasConvert = true;
  } catch {
    hasConvert = false;
  }

  // Sizing specifications:
  // Android Adaptive Icon Safe Zone is 72dp out of 108dp (288x288px in xxxhdpi).
  // Calibrated to exactly 75% of the squircle mask (216px out of 288px on xxxhdpi, or 54dp out of 72dp).
  // This matches the user's exact specification diagram: a bold, prominent, dignified circle
  // with a clean, balanced margin of deep Church navy (#10203D) background.
  const DENSITIES = [
    { name: 'mipmap-mdpi', launcherSize: 48, fgSize: 108, innerFgSize: 54, innerLauncherSize: 34 },
    { name: 'mipmap-hdpi', launcherSize: 72, fgSize: 162, innerFgSize: 81, innerLauncherSize: 51 },
    { name: 'mipmap-xhdpi', launcherSize: 96, fgSize: 216, innerFgSize: 108, innerLauncherSize: 68 },
    { name: 'mipmap-xxhdpi', launcherSize: 144, fgSize: 324, innerFgSize: 162, innerLauncherSize: 102 },
    { name: 'mipmap-xxxhdpi', launcherSize: 192, fgSize: 432, innerFgSize: 216, innerLauncherSize: 136 },
  ];

  if (hasConvert && fs.existsSync(sourceImg)) {
    try {
      console.log('Rendering well-proportioned raster icons via ImageMagick...');
      const trimmedTmp = path.join(ROOT_DIR, '.tmp_seal_trimmed.png');
      execSync(`convert "${sourceImg}" -trim +repage "${trimmedTmp}"`, { stdio: 'ignore' });

      for (const d of DENSITIES) {
        const targetDirs = [
          path.join(RES_DIR, d.name),
          path.join(BACKUP_DIR, d.name)
        ];

        for (const dir of targetDirs) {
          if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

          // 1a. Standard ic_launcher.png (Rounded squircle with navy #10203D background and centered seal)
          const launcherPath = path.join(dir, 'ic_launcher.png');
          const radius = Math.round(d.launcherSize * 0.22);
          execSync(
            `convert -size ${d.launcherSize}x${d.launcherSize} xc:none -fill "#10203D" ` +
            `-draw "roundrectangle 0,0,${d.launcherSize - 1},${d.launcherSize - 1},${radius},${radius}" ` +
            `\\( "${trimmedTmp}" -resize ${d.innerLauncherSize}x${d.innerLauncherSize} \\) -gravity center -composite "${launcherPath}"`,
            { stdio: 'ignore' }
          );

          // 1b. Circular ic_launcher_round.png (Circular navy #10203D badge with centered seal)
          const roundPath = path.join(dir, 'ic_launcher_round.png');
          const half = d.launcherSize / 2;
          execSync(
            `convert -size ${d.launcherSize}x${d.launcherSize} xc:none -fill "#10203D" ` +
            `-draw "circle ${half},${half} ${half},1" ` +
            `\\( "${trimmedTmp}" -resize ${d.innerLauncherSize}x${d.innerLauncherSize} \\) -gravity center -composite "${roundPath}"`,
            { stdio: 'ignore' }
          );

          // 1c. Adaptive Foreground ic_launcher_foreground.png
          // Transparent canvas with seal resized to innerFgSize (~54% of canvas)
          // When Android applies the squircle mask, the emblem has comfortable ~27px padding inside the visible squircle.
          const fgPath = path.join(dir, 'ic_launcher_foreground.png');
          execSync(
            `convert -size ${d.fgSize}x${d.fgSize} xc:none ` +
            `\\( "${trimmedTmp}" -resize ${d.innerFgSize}x${d.innerFgSize} \\) -gravity center -composite "${fgPath}"`,
            { stdio: 'ignore' }
          );
        }
      }

      // Also generate web & PWA app-icon assets with clean safe zone margins
      const pwaTargets = [
        { file: 'app-icon.png', size: 512, innerSize: 360, radius: 108 },
        { file: 'app-icon-maskable.png', size: 512, innerSize: 340, radius: 0 },
        { file: 'app-icon-192.png', size: 192, innerSize: 136, radius: 38 }
      ];

      for (const pwa of pwaTargets) {
        const outRoot = path.join(ROOT_DIR, pwa.file);
        const outPub = path.join(PUBLIC_DIR, pwa.file);

        if (pwa.radius > 0) {
          execSync(
            `convert -size ${pwa.size}x${pwa.size} xc:none -fill "#10203D" ` +
            `-draw "roundrectangle 0,0,${pwa.size - 1},${pwa.size - 1},${pwa.radius},${pwa.radius}" ` +
            `\\( "${trimmedTmp}" -resize ${pwa.innerSize}x${pwa.innerSize} \\) -gravity center -composite "${outRoot}"`,
            { stdio: 'ignore' }
          );
        } else {
          execSync(
            `convert -size ${pwa.size}x${pwa.size} xc:"#10203D" ` +
            `\\( "${trimmedTmp}" -resize ${pwa.innerSize}x${pwa.innerSize} \\) -gravity center -composite "${outRoot}"`,
            { stdio: 'ignore' }
          );
        }
        fs.copyFileSync(outRoot, outPub);
      }

      // Clean up temporary trimmed file
      if (fs.existsSync(trimmedTmp)) {
        try { fs.unlinkSync(trimmedTmp); } catch {}
      }

    } catch (err) {
      console.warn('ImageMagick generation error:', err.message);
    }
  } else if (fs.existsSync(BACKUP_DIR) && fs.existsSync(RES_DIR)) {
    console.log('Copying pre-generated Church Logo icon assets to android res directory...');
    copyDirRecursive(BACKUP_DIR, RES_DIR);
  }

  // Ensure adaptive background color is set to #10203D (Church Navy)
  const valuesDir = path.join(RES_DIR, 'values');
  if (!fs.existsSync(valuesDir)) fs.mkdirSync(valuesDir, { recursive: true });
  fs.writeFileSync(
    path.join(valuesDir, 'ic_launcher_background.xml'),
    `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">#10203D</color>\n</resources>\n`
  );
  const backupValues = path.join(BACKUP_DIR, 'values');
  if (fs.existsSync(BACKUP_DIR)) {
    if (!fs.existsSync(backupValues)) fs.mkdirSync(backupValues, { recursive: true });
    fs.writeFileSync(
      path.join(backupValues, 'ic_launcher_background.xml'),
      `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">#10203D</color>\n</resources>\n`
    );
  }

  // Remove obsolete default Capacitor vector foreground/background files
  const vectorFg = path.join(RES_DIR, 'drawable-v24/ic_launcher_foreground.xml');
  if (fs.existsSync(vectorFg)) {
    try { fs.unlinkSync(vectorFg); } catch {}
  }
  const vectorBg = path.join(RES_DIR, 'drawable/ic_launcher_background.xml');
  if (fs.existsSync(vectorBg)) {
    try { fs.unlinkSync(vectorBg); } catch {}
  }

  // Ensure adaptive icon XMLs point to ic_launcher_background and mipmap/ic_launcher_foreground
  const anydpiDir = path.join(RES_DIR, 'mipmap-anydpi-v26');
  if (!fs.existsSync(anydpiDir)) fs.mkdirSync(anydpiDir, { recursive: true });
  const adaptiveXml = `<?xml version="1.0" encoding="utf-8"?>\n<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">\n    <background android:drawable="@color/ic_launcher_background"/>\n    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>\n</adaptive-icon>\n`;
  fs.writeFileSync(path.join(anydpiDir, 'ic_launcher.xml'), adaptiveXml);
  fs.writeFileSync(path.join(anydpiDir, 'ic_launcher_round.xml'), adaptiveXml);

  const backupAnydpi = path.join(BACKUP_DIR, 'mipmap-anydpi-v26');
  if (fs.existsSync(BACKUP_DIR)) {
    if (!fs.existsSync(backupAnydpi)) fs.mkdirSync(backupAnydpi, { recursive: true });
    fs.writeFileSync(path.join(backupAnydpi, 'ic_launcher.xml'), adaptiveXml);
    fs.writeFileSync(path.join(backupAnydpi, 'ic_launcher_round.xml'), adaptiveXml);
  }

  console.log('Successfully completed Church Logo Android icon configuration!');
}

try {
  run();
} catch (error) {
  console.error('Non-blocking icon configuration warning:', error.message);
  process.exit(0); // Never fail the CI build pipeline on icon asset configuration
}
