const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Choix de l'image source (première image)
const inputImage = 'Images/WhatsApp Image 2026-03-26 at 10.17.23.jpeg';

// Output pour différentes utilisations
const outputs = {
  // Grande image pour modal/featured
  'public/images/plat-poulet-large.jpg': { width: 800, height: 600, fit: 'cover' },
  // Image moyenne pour carte
  'public/images/plat-poulet-medium.jpg': { width: 400, height: 300, fit: 'cover' },
  // Image small pour miniatures
  'public/images/plat-poulet-small.jpg': { width: 200, height: 150, fit: 'cover' },
  // Version carrée pour avatar/icône
  'public/images/plat-poulet-square.jpg': { width: 300, height: 300, fit: 'cover' }
};

async function processImage() {
  try {
    // Vérifier que l'image source existe
    if (!fs.existsSync(inputImage)) {
      console.error('❌ Image source non trouvée:', inputImage);
      process.exit(1);
    }

    // Créer le dossier public/images s'il n'existe pas
    Object.keys(outputs).forEach(outputPath => {
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    console.log('🎨 Traitement de l\'image en cours...');

    // Charger l'image et appliquer les améliorations
    const pipeline = sharp(inputImage);

    // Améliorations esthétiques
    let image = pipeline
      // Ajuster la luminosité et le contraste
      .modulate({
        brightness: 1.05,  // légèrement plus lumineux
        saturation: 1.15,   // plus saturé pour des couleurs vives
        hue: 0
      })
      // Augmenter la netteté
      .sharpen()
      // Légère augmentation du contraste
      .linear(1.05, -10);

    // Générer toutes les tailles
    const promises = Object.entries(outputs).map(([outputPath, { width, height, fit }]) => {
      return image
        .clone()
        .resize(width, height, {
          fit: fit,
          position: 'centre',
          background: { r: 0, g: 0, b: 0 }  // noir si besoin de remplir
        })
        .jpeg({
          quality: 85,
          progressive: true,
          optimiseScans: true
        })
        .toFile(outputPath)
        .then(() => console.log(`✅ Généré: ${outputPath}`));
    });

    await Promise.all(promises);

    console.log('\n✨ Toutes les images ont été générées avec succès !');
    console.log('📂 Images disponibles dans public/images/');

  } catch (error) {
    console.error('❌ Erreur lors du traitement:', error);
    process.exit(1);
  }
}

processImage();
