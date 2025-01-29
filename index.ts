import serverless from 'serverless-http';
import app from './src/core/index';

// Start the server
console.log("Environment: ", process.env.ENV);
if(process.env.ENV === 'prod') {
    console.log("Starting serverless app");
} else {
    console.log("Starting local app");
    const PORT = process.env.PORT || 3002;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

const serverlessApp = serverless(app, { provider: 'aws' });
export const handler = async (event:any, context:any) => {
    try {
        return await serverlessApp(event, context);
    } catch(e:any) {
        console.log("Error: ", e);
        return {
            statusCode: 500,
            body: JSON.stringify({error: e.message}),
        }
    }
}