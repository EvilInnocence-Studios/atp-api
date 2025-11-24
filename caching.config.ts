import { brokerageCaching } from "./src/brokered-products-plugin/caching";
import { comicCaching } from "./src/comic/caching";
import { commonCaching } from "./src/common/caching";
import { storeCaching } from "./src/store/caching";

export const caching = [
    ...brokerageCaching,
    ...comicCaching,
    ...commonCaching,
    ...storeCaching,
]
