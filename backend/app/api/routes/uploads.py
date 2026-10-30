from fastapi import APIRouter, Depends, UploadFile, File, status
from app.api.deps import get_current_admin
from app.services.storage_service import storage_service
from app.models.admin_user import AdminUser

router = APIRouter(prefix="/admin", tags=["Admin Uploads"], dependencies=[Depends(get_current_admin)])

@router.post("/upload", status_code=status.HTTP_201_CREATED)
async def upload_product_image(
    file: UploadFile = File(...),
    current_admin: AdminUser = Depends(get_current_admin)
):
    url = await storage_service.upload_image(file)
    return {
        "url": url,
        "filename": file.filename,
        "content_type": file.content_type
    }
