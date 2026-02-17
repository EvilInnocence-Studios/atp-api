import "dotenv/config";
import path from 'path';
import { zipDirectory } from './src/core/zip';
import {uploadToLambda} from './src/core/lambda';
import {connectToApiGateway} from './src/core/apiGateway';

const LAMBDA_FUNCTION_NAME = process.env.LAMBDA_FUNCTION_NAME || 'myLambdaFunction';
const API_GATEWAY_NAME = process.env.API_GATEWAY_NAME || 'myApiGatewayHost';
const API_GATEWAY_DOMAIN = process.env.API_GATEWAY_DOMAIN || "";
const LAMBDA_ROLE = process.env.LAMBDA_ROLE || 'myLambdaRole';
const ACCOUNT_ID = process.env.ACCOUNT || "";
const API_GATEWAY_DOMAIN_CERT_ARN = process.env.API_GATEWAY_DOMAIN_CERT_ARN || '';
const S3BUCKET = process.env.S3BUCKET || '';
const S3KEY = process.env.S3KEY || '';

async function main() {
    const deployDir   = path.join(__dirname, 'dist'      );
    const zipFilePath = path.join(__dirname, 'server.zip');
    const envFilePath = path.join(__dirname, '.env.prod' );

    try {
        await zipDirectory(deployDir, zipFilePath);
        await uploadToLambda(zipFilePath, LAMBDA_FUNCTION_NAME, ACCOUNT_ID, LAMBDA_ROLE, envFilePath, S3BUCKET, S3KEY);
        // await connectToApiGateway(LAMBDA_FUNCTION_NAME, API_GATEWAY_NAME, API_GATEWAY_DOMAIN, ACCOUNT_ID, LAMBDA_FUNCTION_NAME, API_GATEWAY_DOMAIN_CERT_ARN);
    } catch (error:any) {
        console.error(`Deployment failed: ${error.message}`);
        process.exit(1);
    }
}

main();