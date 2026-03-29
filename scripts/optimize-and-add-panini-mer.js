const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

console.log('\n🚀 Optimisation de toutes les images + ajout Panini Fruit de Mer\n');

// 1. Optimiser toutes les images existantes (2-28)
const imagesDir = 'images';
const tempDir = 'images-temp';
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

const jpegFiles = fs.readdirSync(imagesDir).filter(f => /\.jpe?g$/i.test(f));
console.log(`📷 ${jpegFiles.length} images à optimiser`);

async function optimizeAll() {
  for (const file of jpegFiles) {
    const src = path.join(imagesDir, file);
    const dest = path.join(tempDir, file);
    try {
      const metadata = await sharp(src).metadata();
      let width = metadata.width, height = metadata.height;
      const maxWidth = 800;
      if (width > maxWidth) {
        const ratio = maxWidth / width;
        width = maxWidth;
        height = Math.round(height * ratio);
      }
      await sharp(src)
        .resize(width, height, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 75, progressive: true, mozjpeg: true, strip: true })
        .toFile(dest);
      const origSize = fs.statSync(src).size, optSize = fs.statSync(dest).size;
      console.log(`  ${file}: ${(origSize/1024).toFixed(0)}KB → ${(optSize/1024).toFixed(0)}KB`);
    } catch (e) {
      fs.copyFileSync(src, dest);
      console.log(`  ${file}:erreur, copié tel quel`);
    }
  }

  // 2. Ajouter Panini Fruit de Mer (29.jpeg)
  const paniniMerSrc = 'images/panini fruit de mer.png';
  if (fs.existsSync(paniniMerSrc)) {
    const paniniMerDest = path.join(tempDir, '29.jpeg');
    await sharp(paniniMerSrc)
      .jpeg({ quality: 75, progressive: true, mozjpeg: true, strip: true })
      .toFile(paniniMerDest);
    console.log(`  panini fruit de mer.png → 29.jpeg`);
  } else {
    console.log('  ⚠️  images/panini fruit de mer.png non trouvé');
  }

  // 3. Remplacer le dossier images par la version optimisée
  fs.rmSync(imagesDir, { recursive: true });
  fs.renameSync(tempDir, imagesDir);
  console.log('\n✅ Images optimisées et Panini Fruit de Mer ajouté!\n');
}

optimizeAll().then(() => {
  // 4. Mettre à jour menu.json et script
  const menu = JSON.parse(fs.readFileSync('menu.json', 'utf8'));

  // Ajouter image à pan-mer
  let panMerFound = false;
  Object.values(menu).forEach(cat => {
    if (cat.items && Array.isArray(cat.items)) {
      cat.items.forEach(item => {
        if (item.id === 'pan-mer') {
          item.image = 'images/29.jpeg';
          panMerFound = true;
        }
      });
    }
  });

  if (!panMerFound) {
    console.error('❌ pan-mer non trouvé dans menu.json');
    process.exit(1);
  }

  fs.writeFileSync('menu.json', JSON.stringify(menu, null, 2));
  console.log('✅ menu.json mis à jour (pan-mer → images/29.jpeg)');

  // 5. Mettre à jour script.96986dcf.js
  let script = fs.readFileSync('script.96986dcf.js', 'utf8');
  const pattern = new RegExp(`(\\{\\s*id:\\s*"pan-mer"[^}]*?)(\\})`, 'g');
  script = script.replace(pattern, (match, before, close) => {
    let cleaned = before.replace(/,\s*image:\s*"[^"]*"/, '');
    const trimmed = cleaned.trimEnd();
    const needsComma = !trimmed.endsWith(',') && !trimmed.endsWith('{');
    const comma = needsComma ? ',' : '';
    return cleaned + comma + ` image: "images/29.jpeg"` + close;
  });
  fs.writeFileSync('script.96986dcf.js', script);
  console.log('✅ script.96986dcf.js mis à jour (pan-mer → images/29.jpeg)');

  console.log('\n💾 Prêt à commiter !');
  console.log('   git add images/ menu.json script.96986dcf.js');
  console.log('   git commit -m "feat: optimize images + add Panini Fruit de Mer"');
  console.log('   git push origin main\n');
});
