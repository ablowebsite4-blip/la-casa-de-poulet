const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../chawarma');
const destDir = path.join(__dirname, '../images');
const menuPath = path.join(__dirname, '../menu.json');
const jsFilePath = path.join(__dirname, '../script.96986dcf.js');

if (!fs.existsSync(srcDir)) {
    console.log("No chawarma directory found.");
    process.exit(1);
}

let menu = JSON.parse(fs.readFileSync(menuPath, 'utf8'));

const files = fs.readdirSync(srcDir);

files.forEach(file => {
    if(file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')){
        // e.g. "Plat Chawarma (2).png" -> "plat-chawarma-2.png"
        let cleanName = file.toLowerCase()
            .replace(/\(/g, '')
            .replace(/\)/g, '')
            .replace(/ /g, '-');
        
        fs.renameSync(path.join(srcDir, file), path.join(destDir, cleanName));
        
        // Match the item name, "Plat Chawarma (2).png" -> "Plat Chawarma"
        let itemName = file.replace(/\.[^/.]+$/, ""); // removes extension
        itemName = itemName.replace(/\s*\(\d+\)\s*$/, ""); // removes " (2)"
        
        // Find in menu.json
        // Chawarma images can be in "chawarma" category or "plats" category (for Plat Chawarma)
        let found = false;
        ['chawarma', 'plats'].forEach(cat => {
            if(menu[cat] && menu[cat].items){
                const item = menu[cat].items.find(i => i.name.toLowerCase() === itemName.toLowerCase());
                if(item){
                    item.image = `images/${cleanName}`;
                    console.log(`Mapped ${itemName} -> images/${cleanName}`);
                    found = true;
                }
            }
        });
        
        if (!found) {
            console.warn(`Warning: Could not find menu item for ${itemName}`);
        }
    }
});

fs.writeFileSync(menuPath, JSON.stringify(menu, null, 2));

function updateJSFile(newMenuObj) {
    const code = fs.readFileSync(jsFilePath, 'utf8');
    const startStr = 'const DEFAULT_MENU = {';
    const endStr = '\n};\n\nlet MENU = {};';
    
    const startIndex = code.indexOf(startStr);
    const endIndex = code.indexOf(endStr);
    
    if (startIndex !== -1 && endIndex !== -1) {
        let menuJsonStr = JSON.stringify(newMenuObj, null, 4);
        const newCode = code.substring(0, startIndex) + 
                       'const DEFAULT_MENU = ' + menuJsonStr + 
                       code.substring(endIndex + 2);
        fs.writeFileSync(jsFilePath, newCode);
    }
}
updateJSFile(menu);

// Cleanup empty dir
if (fs.readdirSync(srcDir).length === 0) {
    fs.rmdirSync(srcDir);
}

console.log('Done mapping chawarmas!');
