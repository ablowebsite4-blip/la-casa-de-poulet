const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const imagesDir = path.join(__dirname, '../images');

async function optimizeImages() {
    console.log('🚀 Démarrage de l\'optimisation des images...');
    
    if (!fs.existsSync(imagesDir)) {
        console.error('Le dossier images/ est introuvable.');
        return;
    }

    const files = fs.readdirSync(imagesDir);
    let optimizedCount = 0;
    let originalTotalSize = 0;
    let finalTotalSize = 0;

    for (const file of files) {
        if (file.match(/\.(png|jpg|jpeg)$/i)) {
            const filePath = path.join(imagesDir, file);
            // On écrit dans un fichier temporaire pour ne pas lire et écrire en même temps
            const tempPath = path.join(imagesDir, `temp_${file}`);
            
            try {
                const stat = fs.statSync(filePath);
                originalTotalSize += stat.size;

                let pipeline = sharp(filePath).resize({
                    width: 800,
                    withoutEnlargement: true // Ne pas agrandir si l'image est petite
                });

                if (file.match(/\.(jpg|jpeg)$/i)) {
                    pipeline = pipeline.jpeg({ quality: 80, mozjpeg: true });
                } else if (file.match(/\.png$/i)) {
                    pipeline = pipeline.png({ quality: 80, compressionLevel: 9 });
                }

                await pipeline.toFile(tempPath);
                
                // Remplacer l'original
                fs.renameSync(tempPath, filePath);
                
                const newStat = fs.statSync(filePath);
                finalTotalSize += newStat.size;
                optimizedCount++;
                
                console.log(`✅ [${file}]: ${(stat.size / 1024 / 1024).toFixed(2)} MB -> ${(newStat.size / 1024).toFixed(0)} KB`);
                
            } catch (err) {
                console.error(`❌ Erreur sur ${file}:`, err.message);
                if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
            }
        }
    }

    console.log('\n--- RAPPORT FINAL ---');
    console.log(`📸 Images traitées: ${optimizedCount}`);
    console.log(`📉 Poids total avant: ${(originalTotalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`🚀 Poids total après: ${(finalTotalSize / 1024 / 1024).toFixed(2)} MB`);
}

optimizeImages();
