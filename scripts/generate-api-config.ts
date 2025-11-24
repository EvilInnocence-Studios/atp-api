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

    modules.forEach(moduleName => {
        const modulePath = path.join(srcDir, moduleName);
        const indexFile = path.join(modulePath, 'index.ts');

        if (fs.existsSync(indexFile)) {
            const content = fs.readFileSync(indexFile, 'utf-8');
            // Check for "export {apiConfig}" or "export const apiConfig"
            if (content.includes('export {apiConfig}') || content.includes('export { apiConfig }') || content.includes('export const apiConfig')) {
                const camelName = kebabToCamel(moduleName);
                const configName = `${camelName}Config`;
                imports.push(`import { apiConfig as ${configName} } from "./src/${moduleName}";`);
                configs.push(configName);
            }
        }
    });

    const outputContent = `${imports.join('\n')}

export const apiConfigs = [
    ${configs.join(',\n    ')},
];
`;

    fs.writeFileSync(outputFile, outputContent);
    console.log(`Generated ${outputFile}`);
};

generateApiConfig();
