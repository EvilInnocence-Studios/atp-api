import { migrations as coreMigrations} from "./src/core/migrations";
import { migrations as brokeredProductsMigrations } from "./src/brokered-products-plugin/migrations";
import { migrations as subscriptionMigrations } from "./src/subscription/migrations";
import { migrations as subscriptionProductsMigrations } from "./src/subscription-products-plugin/migrations";
import { migrations as storeMigrations } from "./src/store/migrations";
import { migrations as comicMigrations } from "./src/comic/migrations";

export const migrations = [
    ...coreMigrations,
    ...storeMigrations,
    ...subscriptionMigrations,
    ...brokeredProductsMigrations,
    ...subscriptionProductsMigrations,
    ...comicMigrations,
];
