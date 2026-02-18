import fs from 'fs';
import path from 'path';

const srcDir = path.join(__dirname, '../src');
const outputFile = path.join(__dirname, '../migrations.ts');

const kebabToCamel = (str: string) => {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
};

const generateMigrations = () => {
    if (!fs.existsSync(srcDir)) {
        console.error(`Source directory not found: ${srcDir}`);
        process.exit(1);
    }

    const modules = fs.readdirSync(srcDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    const imports: string[] = [];
    const migrationArrays: string[] = [];

    modules.forEach((moduleName:string) => {
        const modulePath = path.join(srcDir, moduleName);
        const migrationsIndex = path.join(modulePath, 'index.ts');
        const indexContents = fs.existsSync(migrationsIndex) ? fs.readFileSync(migrationsIndex, 'utf-8') : "";

        if (indexContents.includes("export const migrations")) {
            // Assume it exports "migrations" as per convention
            const camelName = kebabToCamel(moduleName);
            const migrationName = `${camelName}Migrations`;
            imports.push(`import { migrations as ${migrationName} } from "./src/${moduleName}";`);
            migrationArrays.push(`...${migrationName}`);
        }
    });

    const outputContent = `${imports.join('\n')}

export const migrations = [
    ${migrationArrays.join(',\n    ')},
];
`;

    fs.writeFileSync(outputFile, outputContent);
    console.log(`Generated ${outputFile}`);
};

generateMigrations();
