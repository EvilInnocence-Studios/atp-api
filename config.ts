
export const salt = "AJKLU$*(#&U$(*HQ#U%HILUN @*(NV#@P*(%&MP";
export const secret = "STJE$^#46j3^J563$J^346gg36$%7654JG#%^4G4564%";

export const dbConfig = {
    local: {
        client: "cockroachdb",
        connection: {
            host: process.env.DB_LOCAL_HOST || "",
            user: process.env.DB_LOCAL_USER || "",
            password: process.env.DB_LOCAL_PASSWORD || "",
            database: process.env.DB_LOCAL_DATABASE || "",
            port: process.env.DB_LOCAL_PORT || "",
            ssl: false,
        },
        pool: {min: 0, max: 1, idleTimeoutMillis: 100, reapIntervalMillis: 100},
    },
    prod: {
        client: "cockroachdb",
        connection: {
            host: process.env.DB_PROD_HOST || "",
            user: process.env.DB_PROD_USER || "",
            password: process.env.DB_PROD_PASSWORD || "",
            database: process.env.DB_PROD_DATABASE || "",
            port: process.env.DB_PROD_PORT || "",
            ssl: true,
        },
        pool: {min: 0, max: 1, idleTimeoutMillis: 100, reapIntervalMillis: 100},
    },
}
