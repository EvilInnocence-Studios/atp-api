import fs from 'fs';
import path from 'path';

const srcDir = path.join(__dirname, '../src');
const outputFile = path.join(__dirname, '../api.config.ts');

const kebabToCamel = (str: string) => {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
};

const generateApiConfig = () => {
    if (!fs.existsSync(srcDir)) {
        console.error(`Source directory not found: ${srcDir}`);
        process.exit(1);
    }

    const modules = fs.readdirSync(srcDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    const imports: string[] = [];
    const configs: string[] = [];
    const setupMigrations: string[] = [];

    modules.forEach(moduleName => {
        const modulePath = path.join(srcDir, moduleName);
        const indexFile = path.join(modulePath, 'index.ts');

        if (fs.existsSync(indexFile)) {
            const content = fs.readFileSync(indexFile, 'utf-8');
            const camelName = kebabToCamel(moduleName);
            const importedItems: string[] = [];

            // Check for "apiConfig" export using regex to avoid false positives (e.g., apiConfigs)
            if (/\bexport\s+.*?\bapiConfig\b/.test(content)) {
                const configAlias = `${camelName}Config`;
                importedItems.push(`apiConfig as ${configAlias}`);
                configs.push(configAlias);
            }

            // Check for "setupMigrations" export using regex
            if (/\bexport\s+.*?\bsetupMigrations\b/.test(content)) {
                const setupAlias = `${camelName}Setup`;
                importedItems.push(`setupMigrations as ${setupAlias}`);
                setupMigrations.push(`...${setupAlias}`);
            }

            if (importedItems.length > 0) {
                imports.push(`import { ${importedItems.join(', ')} } from "./src/${moduleName}";`);
            }
        }
    });

    const outputContent = `${imports.join('\n')}

export const apiConfigs = [
    ${configs.join(',\n    ')},
];

export const setupMigrations = [
    ${setupMigrations.join(',\n    ')},
];
`;

    fs.writeFileSync(outputFile, outputContent);
    console.log(`Generated ${outputFile}`);
};

generateApiConfig();
