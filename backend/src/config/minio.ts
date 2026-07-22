import { Client } from 'minio';
import { env } from './env.js';
import { logger } from '../lib/logger.js';

export const minioClient = new Client({
  endPoint: env.MINIO_ENDPOINT,
  port: env.MINIO_PORT,
  useSSL: env.MINIO_USE_SSL,
  accessKey: env.MINIO_ACCESS_KEY,
  secretKey: env.MINIO_SECRET_KEY,
});

export const ensureBucket = async () => {
  try {
    const exists = await minioClient.bucketExists(env.MINIO_BUCKET);
    if (!exists) {
      await minioClient.makeBucket(env.MINIO_BUCKET);
      logger.info(`Created MinIO bucket: ${env.MINIO_BUCKET}`);

      const policy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: '*',
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${env.MINIO_BUCKET}/*`],
          },
        ],
      };

      await minioClient.setBucketPolicy(env.MINIO_BUCKET, JSON.stringify(policy));
      logger.info(`Set public read policy on bucket: ${env.MINIO_BUCKET}`);
    }
  } catch (error) {
    logger.error({ err: error }, 'Error ensuring MinIO bucket exists');
  }
};
