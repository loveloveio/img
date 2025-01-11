

export const s3 = {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
    region: process.env.S3_REGION || '',
    bucketName: process.env.S3_BUCKET_NAME || '',
    endpoint: process.env.S3_ENDPOINT || '',
    publicUrl: process.env.S3_PUBLIC_URL || '',
}