import { apiConfig as subscriptionProductConfig } from "./src/subscription-products-plugin";
import { apiConfig as brokerageConfig } from "./src/brokered-products-plugin";
import { apiConfig as commonConfig } from "./src/common";
import { apiConfig as storeConfig } from "./src/store";
import { apiConfig as subscriptionConfig } from "./src/subscription";
import { apiConfig as uacConfig } from "./src/uac";

export const apiConfigs = [
    commonConfig,
    storeConfig,
    uacConfig,
    subscriptionConfig,
    brokerageConfig,
    subscriptionProductConfig,
];
