# OPENLOBBY MASTER AI SPECIFICATION

## Part 7 — Media System

Version: V2.0

### 1. STORAGE ARCHITECTURE

All user-uploaded media is stored in **MinIO**, an S3-compatible object storage service.
Images are served directly from MinIO, or proxied through the frontend for optimization.

### 2. IMAGE PROCESSING

Before uploading to MinIO, images are processed in-memory using **Sharp**:

- Resized to maximum dimensions.
- Converted to WebP format.
- EXIF metadata is completely stripped for privacy.
- Thumbnails are generated for post images.

### 3. FILE LIMITS

- **Avatars**: 400x400 max, 5MB limit.
- **Banners**: 1500x500 max, 10MB limit.
- **Post Images**: 2000px max width/height, 10MB limit.
