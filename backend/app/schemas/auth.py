from datetime import datetime
from pydantic import BaseModel, EmailStr, ConfigDict

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class AdminUserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: str
    role: str
    is_active: bool
    created_at: datetime

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: AdminUserResponse
