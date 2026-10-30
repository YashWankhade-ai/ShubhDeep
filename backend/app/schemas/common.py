from typing import Generic, TypeVar, List
from pydantic import BaseModel

T = TypeVar("T")

class MessageResponse(BaseModel):
    message: str
    detail: str = ""

class PaginatedResponse(BaseModel, Generic[T]):
    items: List[T]
    total: int
    page: int
    page_size: int
    total_pages: int
