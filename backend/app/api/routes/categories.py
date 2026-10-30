from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.session import get_db
from app.models.category import Category
from app.models.product import Product
from app.schemas.category import CategoryResponse

router = APIRouter(prefix="/categories", tags=["Public Categories"])

@router.get("", response_model=List[CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(Category).filter(Category.is_active == True).order_by(Category.name).all()
    results = []
    for c in categories:
        count = db.query(func.count(Product.id)).filter(
            Product.category_id == c.id,
            Product.is_available == True
        ).scalar()
        res = CategoryResponse.model_validate(c)
        res.product_count = count or 0
        results.append(res)
    return results
