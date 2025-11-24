import { commonCaching } from "./src/common/caching";
import { storeCaching } from "./src/store/caching";
import { brokerageCaching } from "./src/brokered-products-plugin/caching";
import { comicCaching } from "./src/comic/caching";

export const caching = [
    ...storeCaching,
    ...comicCaching,
    ...commonCaching,
    ...brokerageCaching,
]
