import fs from 'fs';
import path from 'path';

// Update the tsconfig.json file to include aliases for the directories in the src directory
const updateTsConfigAliases = (file) => {
    const baseFile = file.replace('.json', '.base.json');
    const baseConfigPath = path.resolve(".", baseFile);
    const tsConfigPath = path.resolve(".", file);

    if (!fs.existsSync(baseConfigPath)) {
        console.warn(`Base file not found: ${baseFile}. Skipping...`);
        return;
    }

    let tsConfig;
    try {
        tsConfig = JSON.parse(fs.readFileSync(baseConfigPath, 'utf-8'));    
    } catch (error) {
        console.error(`Failed to parse base file: ${baseConfigPath}`, error);
        return;
    }
    
    // Dynamically generate the alias paths based on the directories in the src folder
    const srcDir = path.resolve(".", 'src');
    const directories = fs.readdirSync(srcDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
    
    // Create aliases for each directory
    const aliases = tsConfig.compilerOptions.paths || {};
    directories.forEach(dir => {
        aliases[`@${dir}`] = [`src/${dir}`];
        aliases[`@${dir}/*`] = [`src/${dir}/*`];
    });
    
    // Update the tsconfig.json file with the new paths
    tsConfig.compilerOptions.paths = aliases;
    
    fs.writeFileSync(tsConfigPath, JSON.stringify(tsConfig, null, 2));
}

const files = [
    'tsconfig.json',
];
console.log(`Updating tsconfig aliases`);
files.forEach(file => {
    try {
        updateTsConfigAliases(file);
        console.log(`Updated aliases in ${file}`);
    } catch (error) {
        console.error(`Failed to update aliases in ${file}:`, error);
    }
});
