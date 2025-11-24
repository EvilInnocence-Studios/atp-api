import { migrations as brokeredProductsPluginMigrations } from "./src/brokered-products-plugin/migrations";
import { migrations as comicMigrations } from "./src/comic/migrations";
import { migrations as coreMigrations } from "./src/core/migrations";
import { migrations as storeMigrations } from "./src/store/migrations";
import { migrations as subscriptionMigrations } from "./src/subscription/migrations";
import { migrations as subscriptionProductsPluginMigrations } from "./src/subscription-products-plugin/migrations";
import { IMigration } from "./src/core/dbMigrations";

export const migrations: IMigration[] = [
    ...coreMigrations,
    ...comicMigrations,
    ...storeMigrations,
    ...subscriptionMigrations,
    ...brokeredProductsPluginMigrations,
    ...subscriptionProductsPluginMigrations,
];
