from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict, Field

class CustomerRegisterRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    phone: str = Field(..., min_length=10, max_length=15)
    password: str = Field(..., min_length=6)
    delivery_address: Optional[str] = None

class CustomerLoginRequest(BaseModel):
    email_or_phone: str = Field(..., min_length=3)
    password: str = Field(..., min_length=1)

class CustomerProfileUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=120)
    phone: Optional[str] = Field(None, min_length=10, max_length=15)
    delivery_address: Optional[str] = None

class CustomerUserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: str
    phone: str
    delivery_address: Optional[str] = None
    created_at: datetime

class CustomerTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: CustomerUserResponse
