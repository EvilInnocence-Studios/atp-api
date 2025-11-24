import { apiConfig as brokeredProductsPluginConfig } from "./src/brokered-products-plugin";
import { apiConfig as comicConfig } from "./src/comic";
import { apiConfig as commonConfig } from "./src/common";
import { apiConfig as storeConfig } from "./src/store";
import { apiConfig as subscriptionConfig } from "./src/subscription";
import { apiConfig as subscriptionProductsPluginConfig } from "./src/subscription-products-plugin";
import { apiConfig as uacConfig } from "./src/uac";

export const apiConfigs = [
    brokeredProductsPluginConfig,
    comicConfig,
    commonConfig,
    storeConfig,
    subscriptionConfig,
    subscriptionProductsPluginConfig,
    uacConfig,
];
