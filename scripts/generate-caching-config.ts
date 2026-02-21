import fs from 'fs';
import path from 'path';

const srcDir = path.join(__dirname, '../src');
const outputFile = path.join(__dirname, '../caching.config.js');

const generateCachingConfig = () => {
    if (!fs.existsSync(srcDir)) {
        console.error(`Source directory not found: ${srcDir}`);
        process.exit(1);
    }

    const modules = fs.readdirSync(srcDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    const imports: string[] = [];
    const cacheArrays: string[] = [];

    modules.forEach(moduleName => {
        const modulePath = path.join(srcDir, moduleName);
        const cachingFile = path.join(modulePath, 'caching.js');

        if (fs.existsSync(cachingFile)) {
            const content = fs.readFileSync(cachingFile, 'utf-8');
            // Find "export const <name>"
            const match = content.match(/export\s+const\s+(\w+)/);
            if (match && match[1]) {
                const exportName = match[1];
                imports.push(`import { ${exportName} } from "./src/${moduleName}/caching.js";`);
                cacheArrays.push(`...${exportName}`);
            }
        }
    });

    const outputContent = `${imports.join('\n')}

export const caching = [
    ${cacheArrays.join(',\n    ')},
]
`;

    fs.writeFileSync(outputFile, outputContent);
    console.log(`Generated ${outputFile}`);
};

generateCachingConfig();
