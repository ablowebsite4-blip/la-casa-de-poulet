const fs = require('fs');
const path = require('path');
const axios = require('axios');

const menuPath = path.join(__dirname, '../menu.json');
const imagesDir = path.join(__dirname, '../images');
const jsFilePath = path.join(__dirname, '../script.96986dcf.js');

let menu = JSON.parse(fs.readFileSync(menuPath, 'utf8'));
let updated = false;

// Helpers
function sanitizeFilename(name) {
    return name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
}

async function downloadImage(url, filepath) {
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream',
        timeout: 10000,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
        }
    });

    return new Promise((resolve, reject) => {
        const writer = fs.createWriteStream(filepath);
        response.data.pipe(writer);
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}

function updateJSFile(newMenuObj) {
    const code = fs.readFileSync(jsFilePath, 'utf8');
    
    // We replace the DEFAULT_MENU block
    // It starts with 'const DEFAULT_MENU = {' and ends right before 'let MENU = {};'
    
    const startStr = 'const DEFAULT_MENU = {';
    const endStr = '\n};\n\nlet MENU = {};';
    
    const startIndex = code.indexOf(startStr);
    const endIndex = code.indexOf(endStr);
    
    if (startIndex !== -1 && endIndex !== -1) {
        // Strip the outer {} from JSON.stringify(newMenuObj) to fit `const DEFAULT_MENU = { ... };` structure
        let menuJsonStr = JSON.stringify(newMenuObj, null, 4);
        
        const newCode = code.substring(0, startIndex) + 
                       'const DEFAULT_MENU = ' + menuJsonStr + 
                       code.substring(endIndex + 2); // +2 to skip '\n}'
                       
        fs.writeFileSync(jsFilePath, newCode);
        console.log('✓ script.96986dcf.js DEFAULT_MENU updated successfully.');
    } else {
        console.log('✗ Could not find DEFAULT_MENU block in script.96986dcf.js.');
    }
}

async function processMenu() {
    console.log('Starting image fetch process...');
    
    // Create images dir if doesn't exist
    if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir, { recursive: true });
    }

    let itemsProcessed = 0;

    for (const categoryKey of Object.keys(menu)) {
        const category = menu[categoryKey];
        if (!category.items) continue;
        
        for (const item of category.items) {
            if (!item.image) {
                // Determine best keyword for loremflickr
                let keyword = item.name.split(' ')[0].toLowerCase() + ',food';
                if (categoryKey === 'tacos') keyword = 'tacos,frenchfries,cheese';
                else if (categoryKey === 'burger') keyword = 'burger,food';
                else if (categoryKey === 'pizza') keyword = 'pizza,food';
                else if (categoryKey === 'pasticcio') keyword = 'pasta,cheese,bake';
                else if (categoryKey === 'baguetto' || categoryKey === 'sandwich') keyword = 'baguette,sandwich';
                else if (categoryKey === 'salades') keyword = 'salad,food';
                else if (categoryKey === 'boissons') keyword = 'drink,juice';
                else if (categoryKey === 'poulet') keyword = 'chicken,food';
                else if (categoryKey === 'chawarma') keyword = 'wrap,food';
                else if (categoryKey === 'crispy') keyword = 'crispy,chicken';
                
                // Add a random lock to get unique images for each item
                const lockId = Math.floor(Math.random() * 10000);
                const imgUrl = `https://loremflickr.com/500/500/${keyword}/all?lock=${lockId}`;
                
                console.log(`[${++itemsProcessed}] Downloading image for: ${item.name} (Keyword: ${keyword})...`);
                
                const filename = `img_${item.id}_${Date.now()}.jpg`;
                const filepath = path.join(imagesDir, filename);

                try {
                    await downloadImage(imgUrl, filepath);
                    
                    // Check if file isn't empty
                    const stats = fs.statSync(filepath);
                    if (stats.size < 1000) {
                        throw new Error('File too small (likely a block page)');
                    }
                    
                    item.image = `images/${filename}`;
                    updated = true;
                    console.log(`   ✓ Success: Downloaded ${item.name}`);
                } catch (err) {
                    console.error(`   ✗ Error for ${item.name}: ${err.message}`);
                    if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
                }
                
                // Sleep to avoid ratelimits
                await new Promise(r => setTimeout(r, 800));
            }
        }
    }
    
    if (updated) {
        fs.writeFileSync(menuPath, JSON.stringify(menu, null, 2));
        console.log('✓ menu.json updated with new images.');
        
        // Update JS Fallback
        updateJSFile(menu);
    } else {
        console.log('No new images were added.');
    }
    
    console.log('Done!');
}

processMenu().catch(console.error);
