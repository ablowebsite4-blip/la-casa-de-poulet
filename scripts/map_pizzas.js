const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../pizza');
const destDir = path.join(__dirname, '../images');
const menuPath = path.join(__dirname, '../menu.json');
const jsFilePath = path.join(__dirname, '../script.96986dcf.js');

if (!fs.existsSync(srcDir)) {
    console.log("No pizza directory found.");
    process.exit(1);
}

let menu = JSON.parse(fs.readFileSync(menuPath, 'utf8'));

const files = fs.readdirSync(srcDir);

files.forEach(file => {
    if(file.match(/\.(png|jpg|jpeg)$/i)){
        let itemName = file.replace(/\.(png|jpg|jpeg|jpg\.jpeg)$/i, "").toLowerCase();
        
        // Custom cleaners for pizzas
        itemName = itemName.replace('mixte', 'mixt');
        itemName = itemName.replace(/\s*2$/, ''); // Remove trailing " 2" like in "Pizza Pepperoni  2"
        itemName = itemName.replace(/\s\s+/g, ' '); // remove double spaces
        itemName = itemName.trim();
        
        // Generate clean file name for the static assets
        const extMatch = file.match(/\.(png|jpg|jpeg)$/i);
        const ext = extMatch ? extMatch[1] : 'jpg';
        let cleanName = itemName.replace(/ /g, '-') + '.' + ext.toLowerCase();
        
        fs.renameSync(path.join(srcDir, file), path.join(destDir, cleanName));
        
        let found = false;
        if(menu.pizza && menu.pizza.items){
            const item = menu.pizza.items.find(i => i.name.toLowerCase() === itemName.toLowerCase());
            if(item){
                item.image = `images/${cleanName}`;
                console.log(`Mapped ${itemName} -> images/${cleanName}`);
                found = true;
            }
        }
        
        if (!found) {
            console.warn(`Warning: Could not find menu item for ${itemName} (original: ${file})`);
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

console.log('Done mapping pizzas!');
