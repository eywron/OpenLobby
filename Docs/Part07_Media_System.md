OPENLOBBY MASTER AI SPECIFICATION

Part 7 — Image Upload Pipeline, Azure Blob Storage, Media Processing & Storage Architecture

Version: V1.0

> Instruction for GitHub Copilot Agent: This document defines the complete media architecture for OpenLobby. Every uploaded image must follow this pipeline. Never bypass validation or optimization. Optimize for security, storage efficiency, bandwidth, and future scalability.




---

1. MEDIA PHILOSOPHY

Images are the largest storage and bandwidth consumer in OpenLobby.

Every uploaded image must be:

Secure

Optimized

Compressed

Validated

Easy to retrieve

Easy to delete

Easy to migrate


The system should minimize storage costs while maintaining good visual quality.


---

2. SUPPORTED FILE TYPES

Accept only:

JPEG (.jpg, .jpeg)

PNG (.png)

WebP (.webp)


Reject:

GIF (V1)

SVG

BMP

TIFF

HEIC (V1)

AVIF (V1)

Executables

Archives

Unknown formats


Future versions may add additional image formats.


---

3. MAXIMUM FILE SIZE

Before processing:

Maximum upload size:

10 MB per image

After processing:

Target size:

Prefer ≤ 2 MB when possible

Maintain visually acceptable quality


The limit should be configurable through environment variables.


---

4. MULTIPLE IMAGE SUPPORT

V1 supports multiple images per post.

Limits:

Maximum 10 images per post

Minimum 1 image if uploading media


Users may also create text-only posts.


---

5. IMAGE VALIDATION PIPELINE

Every upload follows this sequence:

1. Validate request.


2. Validate authentication.


3. Validate file count.


4. Validate extension.


5. Validate MIME type.


6. Validate actual file signature (magic bytes).


7. Validate size.


8. Reject unsupported files.


9. Begin processing.



Never trust the client-provided extension or MIME type alone.


---

6. IMAGE PROCESSING PIPELINE

After validation:

1. Decode image safely.


2. Strip EXIF metadata.


3. Correct orientation.


4. Resize if necessary.


5. Compress.


6. Generate thumbnail.


7. Convert to WebP when beneficial.


8. Save optimized versions.


9. Upload to Azure Blob Storage.


10. Save metadata to PostgreSQL.



Never expose raw uploads directly.


---

7. RESIZING RULES

Do not upscale images.

If an image exceeds the configured maximum dimensions:

Resize while preserving aspect ratio.


Small images should remain unchanged.

Prevent distortion at all costs.


---

8. COMPRESSION

Use Sharp.

Target:

High visual quality

Reduced file size


Compression settings should be configurable.

Avoid aggressive compression that noticeably degrades image quality.


---

9. THUMBNAILS

Generate thumbnails automatically.

Purpose:

Feed previews

Profile galleries

Search results

Messages


Store thumbnails separately from originals.


---

10. METADATA REMOVAL

Remove:

GPS location

Camera model

Device information

Software information

Timestamps embedded in EXIF


This improves privacy and reduces file size.


---

11. FILE NAMING

Never use user-provided filenames.

Generate secure, unique names.

Requirements:

Globally unique

Difficult to guess

No personally identifiable information


Do not expose internal storage structure.


---

12. STORAGE STRUCTURE

Recommended organization:

avatars/
banners/
posts/
thumbnails/
messages/
temporary/

Avoid storing unrelated media together.


---

13. AZURE BLOB STORAGE

Store:

Avatars

Banners

Post images

Message attachments

Thumbnails


The database stores only metadata and storage paths.

Never store image binaries in PostgreSQL.


---

14. DATABASE METADATA

Each media record should include:

ID

Owner

Storage path

Public URL (if applicable)

MIME type

Width

Height

File size

Thumbnail URL

Created timestamp


This enables efficient media management.


---

15. IMAGE DELIVERY

Serve optimized images.

Requirements:

Correct content type

Cache headers

Responsive image sizes where appropriate


Future CDN integration should be possible without changing application logic.


---

16. PROFILE IMAGES

Users may upload:

Avatar

Banner


When replaced:

Upload the new image.

Update the database.

Remove the old image after successful replacement.


Prevent orphaned files.


---

17. POST IMAGE MANAGEMENT

Users may:

Upload images

Delete posts

Edit post text


V1 does not support editing individual images within a post.

Deleting a post should schedule associated media for deletion.


---

18. MESSAGE ATTACHMENTS

Private message image uploads follow the same validation and processing pipeline as post images.

Access should be restricted to conversation participants.


---

19. TEMPORARY FILES

Temporary uploads should:

Exist only during processing.

Be deleted immediately after upload or failure.


Never accumulate temporary files on the server.


---

20. STORAGE CLEANUP

Implement cleanup jobs for:

Failed uploads

Orphaned files

Deleted accounts

Deleted posts

Expired temporary files


Background cleanup should be idempotent.


---

21. RATE LIMITING

Protect upload endpoints.

Limit:

Upload frequency

Concurrent uploads

Daily upload quotas (future)


Prevent abuse without harming normal users.


---

22. IMAGE SECURITY

Never allow uploaded images to execute code.

Validate:

File signature

MIME type

Extension


Reject suspicious files immediately.

Do not rely solely on frontend validation.


---

23. STORAGE MIGRATION

Abstract storage access behind a service layer.

Do not couple business logic directly to Azure Blob Storage APIs.

Future migration to another provider (e.g., AWS S3, Cloudflare R2, local storage) should require minimal code changes.


---

24. BACKGROUND PROCESSING

Prepare for asynchronous processing.

Future tasks include:

Image optimization

Thumbnail generation

Virus scanning

AI moderation

CDN cache invalidation


V1 may perform some tasks synchronously, but the architecture should support moving them to background jobs later.


---

25. MEDIA LIFECYCLE

Media progresses through these stages:

1. Upload requested


2. Validation


3. Processing


4. Storage


5. Metadata saved


6. Delivered to users


7. Updated or replaced (optional)


8. Deleted or archived



Every stage should be recoverable from failures where practical.


---

26. ERROR HANDLING

Gracefully handle:

Corrupted images

Oversized files

Unsupported formats

Storage failures

Network interruptions


Provide user-friendly error messages.

Log detailed technical information internally.


---

27. MONITORING

Track:

Upload success rate

Upload failures

Average processing time

Storage usage

Thumbnail generation failures


These metrics help identify operational issues.


---

28. GITHUB COPILOT AGENT MEDIA WORKFLOW

When implementing media features:

1. Review existing upload services.


2. Reuse processing utilities.


3. Validate all uploads.


4. Optimize images before storage.


5. Store only metadata in PostgreSQL.


6. Clean up temporary files.


7. Verify storage consistency.


8. Review security.


9. Review performance.


10. Update documentation if the media architecture changes.


11. Wait for approval before implementing unrelated media features.




---

29. MEDIA SUCCESS CRITERIA

The media system is complete when it:

Validates every upload.

Optimizes images.

Protects user privacy by stripping metadata.

Stores files efficiently.

Prevents orphaned files.

Supports multiple image uploads.

Is portable across storage providers.

Is secure, performant, and maintainable.



---

⭐ Additional Instruction for GitHub Copilot Agent

Before implementing any media-related feature, internally evaluate:

1. Is every uploaded file fully validated?


2. Can storage usage be reduced without harming quality?


3. Are metadata and privacy concerns addressed?


4. Will old files be cleaned up correctly?


5. Is storage provider access abstracted?


6. Does this support future CDN integration?


7. Will this scale to millions of images?


8. Does this follow the OpenLobby architecture?



Only begin implementation after these questions have been considered.


---

End of Part 7

Next: Part 8 — Social Features, Feed System, Search, Direct Messages, Notifications & User Interaction Architecture, where we'll define how users interact with content, each other, and the platform, along with the architecture for scalable social features.