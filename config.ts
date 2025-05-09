
export const salt:string = process.env.SALT  || "";
export const secret:string = process.env.SECRET || "";

export const dbConfig = {
    client: process.env.DB_CLIENT,
    connection: {
        host: process.env.DB_HOST || "",
        user: process.env.DB_USER || "",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_DATABASE || "",
        port: process.env.DB_PORT || "",
        ssl: process.env.DB_SSL === "on",
    },
    pool: {min: 0, max: 1, idleTimeoutMillis: 100, reapIntervalMillis: 100},
}

const appConfig = {
    publicHost: process.env.HOST_PUBLIC,
    adminHost: process.env.HOST_ADMIN,
    apiHost: process.env.HOST_API,

    siteName: "EvilInnocence Studios",
    defaultUserRoleId: "3",
    subscriptionRoleId: "4",
    awsRegion: "us-east-1",
    mediaBucket: "evilinnocence",
    supportEmail: "support@evilinnocence.com",
    emailTemplates: {
        forgotLogin: {
            subject: "EvilInnocence Sudios - Forgot Login Info",
        },
        orderConfirmation: {
            subject: "EvilInnocence Studios - Order Confirmation",
        },
        roleChange: {
            subject: "EvilInnocence Studios - Role Change",
        },
        newAccount: {
            subject: "EvilInnocence Studios - New Account",
        },
    }
}

export const getAppConfig = () => appConfig;
