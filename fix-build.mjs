
import fs from 'fs';
import path from 'path';

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function (file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('src');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    if (content.includes('toSorted')) {
        content = content.replace(/toSorted/g, 'slice().sort');
        changed = true;
    }

    if (content.includes('toReversed')) {
        content = content.replace(/toReversed/g, 'slice().reverse');
        changed = true;
    }

    if (changed) {
        console.log(`Fixing ${file}`);
        fs.writeFileSync(file, content, 'utf8');
    }
});
