import 'dotenv/config';
import {init as uacInit} from './uac/migrations/init';
import {init as storeInit} from './store/migrations/init';
import {init as commonInit} from './common/migrations/init';

const down = async () => {
    await storeInit.down();
    await commonInit.down();
    await uacInit.down();
}

const up = async () => {
    await uacInit.up();
    await commonInit.up();
    await storeInit.up();
}

down().then(up).then(() => console.log("Done!"));