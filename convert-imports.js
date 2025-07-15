// Script Node.js pour remplacer les imports .ts par .js
const fs = require('fs');
const path = require('path');

// Fonction pour parcourir récursivement les dossiers
function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat && stat.isDirectory() && !filePath.includes('node_modules')) {
            // Récursion dans les sous-dossiers (sauf node_modules)
            results = results.concat(walkDir(filePath));
        } else if (stat && stat.isFile() && filePath.endsWith('.ts')) {
            // Ajouter les fichiers .ts à la liste
            results.push(filePath);
        }
    });
    
    return results;
}

// Fonction pour remplacer les imports .ts par .js dans un fichier
function convertTsImports(filePath) {
    console.log(`Processing: ${filePath}`);
    
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Remplacer les imports avec extension .ts explicite
        let newContent = content;
        
        // Pattern 1: import ... from "./path/file.ts"
        newContent = newContent.replace(/(import\s+.*from\s+['"])([^'"]+)\.ts(['"])/g, '$1$2.js$3');
        
        // Pattern 2: autres références à .ts (comme dans les imports dynamiques)
        newContent = newContent.replace(/(['"])([^'"]+)\.ts(['"])/g, '$1$2.js$3');
        
        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`✓ Updated imports in ${filePath}`);
            return true;
        }
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error.message);
    }
    
    return false;
}

// Chemin du projet
const projectRoot = 'c:/Users/mathi/Documents/ProjetKempo';

console.log(`Scanning project: ${projectRoot}`);

// Trouver tous les fichiers .ts
const tsFiles = walkDir(projectRoot);
console.log(`Found ${tsFiles.length} TypeScript files`);

// Traiter chaque fichier
let modifiedCount = 0;
for (const filePath of tsFiles) {
    if (convertTsImports(filePath)) {
        modifiedCount++;
    }
}

console.log(`\nModification complete! Updated imports in ${modifiedCount} out of ${tsFiles.length} files.`);
