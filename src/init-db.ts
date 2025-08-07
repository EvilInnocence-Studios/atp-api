import 'dotenv/config';
import { switchOn } from 'ts-functional';

// 00 - Initialize empty database
import { init as commonInit } from './common/migrations/00-init';
import { init as storeInit } from './store/migrations/00-init';
import { init as uacInit } from './uac/migrations/00-init';
import { init as subscriptionInit } from './subscription/migrations/00-init';
import { init as brokerageInit } from './brokered-products-plugin/migrations/00-init';

// 01 - Initialize discounts
import { discounts } from './store/migrations/01-discounts';
import { foreignKeys } from './store/migrations/02-fix-foreign-keys';
import { preRelease } from './store/migrations/03-prerelease';

const init = {
    down: async () => {
        await storeInit.down();
        await commonInit.down();
        await uacInit.down();
        await subscriptionInit.down();
        await brokerageInit.down();
    },
    up: async () => {
        await uacInit.up();
        await commonInit.up();
        await storeInit.up();
        await subscriptionInit.up();
        await brokerageInit.up();
        
        await uacInit.initData();
        await commonInit.initData();
        await storeInit.initData();
        await subscriptionInit.initData();
        await brokerageInit.initData();
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

const preReleaseMigration = {
    down: async () => {
        await preRelease.down();
    },
    up: async () => {
        await preRelease.up();
        await preRelease.initData();
    }
}

const subscriptionMigration = {
    down: async () => {
        await subscriptionInit.down();
    },
    up: async () => {
        await subscriptionInit.up();
        await subscriptionInit.initData();
    }
}

const brokerageMigration = {
    down: async () => {
        await brokerageInit.down();
    },
    up: async () => {
        await brokerageInit.up();
        await brokerageInit.initData();
    }
}

const migrationName = process.argv[2];
const migration = switchOn(migrationName, {
    init:         () => init,
    discounts:    () => discountMigration,
    foreignKeys:  () => foreignKeyMigration,
    preRelease:   () => preReleaseMigration,
    subscription: () => subscriptionMigration,
    brokerage:    () => brokerageMigration,
    default:      () => null,
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
