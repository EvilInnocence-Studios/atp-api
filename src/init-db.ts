import 'dotenv/config';
import { switchOn } from 'ts-functional';

// 00 - Initialize empty database
import { init as commonInit } from './common/migrations/00-init';
import { init as storeInit } from './store/migrations/00-init';
import { init as uacInit } from './uac/migrations/00-init';

// 01 - Initialize discounts
import { discounts } from './store/migrations/01-discounts';
import { foreignKeys } from './store/migrations/02-fix-foreign-keys';

const init = {
    down: async () => {
        await storeInit.down();
        await commonInit.down();
        await uacInit.down();
    },
    up: async () => {
        await uacInit.up();
        await commonInit.up();
        await storeInit.up();
        
        await uacInit.initData();
        await commonInit.initData();
        await storeInit.initData();
    }
}

const discountMigration = {
    down: async () => {
        await discounts.down();
    },
    up: async () => {
        await discounts.up();
        await discounts.initData();
    }
}

const foreignKeyMigration = {
    down: async () => {
        await foreignKeys.down();
    },
    up: async () => {
        await foreignKeys.up();
    }
}

const migrationName = process.argv[2];
const migration = switchOn(migrationName, {
    'init':        () => init,
    'discounts':   () => discountMigration,
    'foreignKeys': () => foreignKeyMigration,
    'default':     () => null
});

if(!migration) {
    console.error(`Migration ${migrationName} not found`);
    process.exit(1);
}

const direction = process.argv[3];
if(!direction) {
    console.error('Direction not specified');
    process.exit(1);
}

if(direction === 'up') {
    migration.up().then(() => console.log('Migration complete'));
}
else if(direction === 'down') {
    migration.down().then(() => console.log('Migration complete'));
}
else if(direction === 'refresh') {
    migration.down().then(migration.up).then(() => console.log('Migration complete'));
} else {
    console.error(`Invalid direction ${direction}`);
    process.exit(1);
}
