import sharp from 'sharp';
import { minioClient } from '../config/minio.js';
import { env } from '../config/env.js';

export const uploadBuffer = async (
  buffer: Buffer,
  objectName: string,
  contentType: string,
): Promise<string> => {
  await minioClient.putObject(env.MINIO_BUCKET, objectName, buffer, buffer.length, {
    'Content-Type': contentType,
  });
  return getPublicUrl(objectName);
};

export const uploadAvatar = async (
  userId: string,
  buffer: Buffer,
  mimetype: string,
): Promise<{ url: string }> => {
  const processedBuffer = await sharp(buffer)
    .resize(400, 400, { fit: 'cover' })
    .webp({ quality: 80 })
    .toBuffer();

  const timestamp = Date.now();
  const objectName = `avatars/${userId}/${timestamp}.webp`;
  const url = await uploadBuffer(processedBuffer, objectName, 'image/webp');

  return { url };
};

export const uploadBanner = async (
  userId: string,
  buffer: Buffer,
  mimetype: string,
): Promise<{ url: string }> => {
  const processedBuffer = await sharp(buffer)
    .resize(1500, 500, { fit: 'cover' })
    .webp({ quality: 80 })
    .toBuffer();

  const timestamp = Date.now();
  const objectName = `banners/${userId}/${timestamp}.webp`;
  const url = await uploadBuffer(processedBuffer, objectName, 'image/webp');

  return { url };
};

export const uploadPostImage = async (
  postId: string,
  buffer: Buffer,
  mimetype: string,
  index: number,
): Promise<{ url: string; thumbnailUrl: string; width: number; height: number }> => {
  const image = sharp(buffer);
  const metadata = await image.metadata();

  let width = metadata.width || 0;
  let height = metadata.height || 0;

  if (width > 2000) {
    const ratio = 2000 / width;
    width = 2000;
    height = Math.round(height * ratio);
  }

  const processedBuffer = await sharp(buffer)
    .resize(width, height, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer();

  const thumbBuffer = await sharp(buffer)
    .resize(400, null, { withoutEnlargement: true })
    .webp({ quality: 70 })
    .toBuffer();

  const objectName = `posts/${postId}/${index}.webp`;
  const thumbObjectName = `posts/${postId}/${index}_thumb.webp`;

  const url = await uploadBuffer(processedBuffer, objectName, 'image/webp');
  const thumbnailUrl = await uploadBuffer(thumbBuffer, thumbObjectName, 'image/webp');

  return { url, thumbnailUrl, width, height };
};

export const deleteObject = async (objectName: string): Promise<void> => {
  await minioClient.removeObject(env.MINIO_BUCKET, objectName);
};

export const getPublicUrl = (objectName: string): string => {
  const protocol = env.MINIO_USE_SSL ? 'https' : 'http';
  return `${protocol}://${env.MINIO_ENDPOINT}:${env.MINIO_PORT}/${env.MINIO_BUCKET}/${objectName}`;
};
