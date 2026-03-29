const fs = require('fs');
const path = require('path');

const menuPath = path.join(__dirname, '../menu.json');
const jsFilePath = path.join(__dirname, '../script.96986dcf.js');

let menu = JSON.parse(fs.readFileSync(menuPath, 'utf8'));

for (const catKey of Object.keys(menu)) {
    if (menu[catKey].items) {
        for (const item of menu[catKey].items) {
            // Remove newly generated images
            if (item.image && item.image.includes('img_')) {
                delete item.image;
            }
        }
    }
}

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
console.log('✅ Menu images reverted successfully!');
