const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../Burger');
const destDir = path.join(__dirname, '../images');
const menuPath = path.join(__dirname, '../menu.json');
const jsFilePath = path.join(__dirname, '../script.96986dcf.js');

if (!fs.existsSync(srcDir)) {
    console.log("No Burger directory found.");
    process.exit(1);
}

let menu = JSON.parse(fs.readFileSync(menuPath, 'utf8'));

const files = fs.readdirSync(srcDir);

files.forEach(file => {
    if(file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')){
        // e.g. "Beeg Burger.png" -> "beeg-burger.png"
        const cleanName = file.toLowerCase().replace(/ /g, '-');
        
        fs.renameSync(path.join(srcDir, file), path.join(destDir, cleanName));
        
        const itemName = file.replace(/\.[^/.]+$/, ""); // removes extension
        
        // Find in menu.json
        if(menu.burger && menu.burger.items){
            const item = menu.burger.items.find(i => i.name.toLowerCase() === itemName.toLowerCase());
            if(item){
                item.image = `images/${cleanName}`;
                console.log(`Mapped ${itemName} -> images/${cleanName}`);
            }
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

console.log('Done mapping burgers!');
