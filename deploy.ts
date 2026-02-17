import "dotenv/config";
import path from 'path';
import fs from 'fs';
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
        const functionUrl = await uploadToLambda(zipFilePath, LAMBDA_FUNCTION_NAME, ACCOUNT_ID, LAMBDA_ROLE, envFilePath, S3BUCKET, S3KEY);
        
        // Strip https:// and trailing slash from Function URL for CF Origin
        const originDomain = functionUrl.replace("https://", "").replace("/", "");
        console.log(`Successfully deployed Lambda. Function URL: ${functionUrl}`);
        console.log(`Setting CF_ORIGIN_DOMAIN_NAME to: ${originDomain}`);

        // Update local .env
        const envPath = path.join(__dirname, '.env');
        if (fs.existsSync(envPath)) {
            let envContent = fs.readFileSync(envPath, 'utf8');
            if (envContent.includes('CF_ORIGIN_DOMAIN_NAME=')) {
                envContent = envContent.replace(/CF_ORIGIN_DOMAIN_NAME=.*/, `CF_ORIGIN_DOMAIN_NAME=${originDomain}`);
            } else {
                envContent += `\nCF_ORIGIN_DOMAIN_NAME=${originDomain}\n`;
            }
            fs.writeFileSync(envPath, envContent);
        }

        // await connectToApiGateway(LAMBDA_FUNCTION_NAME, API_GATEWAY_NAME, API_GATEWAY_DOMAIN, ACCOUNT_ID, LAMBDA_FUNCTION_NAME, API_GATEWAY_DOMAIN_CERT_ARN);
    } catch (error:any) {
        console.error(`Deployment failed: ${error.message}`);
        process.exit(1);
    }
}

main();