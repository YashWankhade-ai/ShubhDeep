import os
import uuid
from typing import Optional
from fastapi import UploadFile, HTTPException, status
import httpx
from app.core.config import settings

ALLOWED_MIME_TYPES = {
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB

class StorageService:
    @staticmethod
    async def upload_image(file: UploadFile) -> str:
        content_type = file.content_type
        if content_type not in ALLOWED_MIME_TYPES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid image type '{content_type}'. Allowed types: JPG, PNG, WEBP."
            )
        
        contents = await file.read()
        if len(contents) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File size exceeds the 5MB limit."
            )
        
        ext = ALLOWED_MIME_TYPES[content_type]
        unique_name = f"{uuid.uuid4().hex}{ext}"

        # If Supabase credentials are configured, upload to Supabase Storage
        if settings.SUPABASE_URL and settings.SUPABASE_SERVICE_ROLE_KEY:
            try:
                supabase_url = settings.SUPABASE_URL.rstrip("/")
                upload_url = f"{supabase_url}/storage/v1/object/{settings.SUPABASE_BUCKET}/{unique_name}"
                headers = {
                    "Authorization": f"Bearer {settings.SUPABASE_SERVICE_ROLE_KEY}",
                    "Content-Type": content_type,
                    "x-upsert": "true",
                }
                async with httpx.AsyncClient() as client:
                    resp = await client.post(upload_url, content=contents, headers=headers)
                    if resp.status_code in (200, 201):
                        public_url = f"{supabase_url}/storage/v1/object/public/{settings.SUPABASE_BUCKET}/{unique_name}"
                        return public_url
                    else:
                        raise HTTPException(
                            status_code=status.HTTP_502_BAD_GATEWAY,
                            detail=f"Supabase upload failed: {resp.text}"
                        )
            except Exception as e:
                # If Supabase upload fails, fall back to local disk storage
                pass

        # Local storage fallback
        os.makedirs(settings.LOCAL_UPLOAD_DIR, exist_ok=True)
        file_path = os.path.join(settings.LOCAL_UPLOAD_DIR, unique_name)
        with open(file_path, "wb") as f:
            f.write(contents)
        
        return f"/uploads/{unique_name}"

storage_service = StorageService()
