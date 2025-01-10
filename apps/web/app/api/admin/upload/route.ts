import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { r2 } from '@/config/r2';
import { prisma } from '@/libs/db';
import { v4 as uuidv4 } from 'uuid';
import { randomBytes } from 'crypto';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];

const s3Client = new S3Client({
  region: 'auto',
  endpoint: r2.endpoint,
  credentials: {
    accessKeyId: r2.accessKeyId,
    secretAccessKey: r2.secretAccessKey,
  },
});

// Generate random folder path with 2 levels
function generateFolderPath(levels = 2) {
  const paths = [];
  for (let i = 0; i < levels; i++) {
    paths.push(randomBytes(2).toString('hex')); // 4 chars each
  }
  return paths.join('/');
}

export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'File is required' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit` },
        { status: 400 }
      );
    }

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'File type not allowed' },
        { status: 400 }
      );
    }

    // Generate unique filename with random folder structure
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const folderPath = generateFolderPath(4);
    const filePath = `uploads/${folderPath}/${fileName}`;

    // Upload to S3/R2
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await s3Client.send(
      new PutObjectCommand({
        Bucket: r2.bucketName,
        Key: filePath,
        Body: buffer,
        ContentType: file.type,
        ContentLength: file.size,
      })
    );

    const uploadRecord = await prisma.uploadFile.create({
      data: {
        filename: file.name,
        path: filePath,
        size: file.size,
        mimeType: file.type,
      },
    });
    const publicUrl = `${r2.publicUrl}/${filePath}`;

    return NextResponse.json({
      id: uploadRecord.id,
      filename: uploadRecord.filename,
      url: publicUrl,
      size: uploadRecord.size,
      mimeType: uploadRecord.mimeType,
      createdAt: uploadRecord.createdAt,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
};