import fs from 'fs';
import path from 'path';

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('./src');
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    // Replace hardcoded white opacities with foreground to support light mode
    content = content.replace(/bg-white\/(5|10|20)/g, 'bg-foreground/$1');
    content = content.replace(/border-white\/(5|10|20)/g, 'border-foreground/$1');
    content = content.replace(/hover:bg-white\/(5|10|20)/g, 'hover:bg-foreground/$1');
    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Fixed', file);
    }
});
