from typing import Optional, List, Tuple
from decimal import Decimal
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_, desc, asc
from fastapi import HTTPException, status
from app.models.product import Product
from app.models.product_image import ProductImage
from app.models.category import Category
from app.schemas.product import ProductCreate, ProductUpdate

class ProductService:
    @staticmethod
    def list_products(
        db: Session,
        category_slug: Optional[str] = None,
        search: Optional[str] = None,
        is_available: Optional[bool] = None,
        min_price: Optional[Decimal] = None,
        max_price: Optional[Decimal] = None,
        in_stock_only: Optional[bool] = None,
        is_deal: Optional[bool] = None,
        sort_by: Optional[str] = "featured", # featured, price_asc, price_desc, newest
        page: int = 1,
        page_size: int = 20,
    ) -> Tuple[List[Product], int]:
        query = db.query(Product).options(
            joinedload(Product.category),
            joinedload(Product.images)
        )

        if category_slug:
            query = query.join(Product.category).filter(Category.slug == category_slug)

        if is_available is not None:
            query = query.filter(Product.is_available == is_available)

        if min_price is not None:
            query = query.filter(Product.price >= min_price)

        if max_price is not None:
            query = query.filter(Product.price <= max_price)

        if in_stock_only:
            query = query.filter(Product.stock_quantity > 0, Product.is_available == True)

        if is_deal is not None:
            query = query.filter(Product.is_deal == is_deal)

        if search:
            search_term = f"%{search.strip()}%"
            query = query.filter(
                or_(
                    Product.name.ilike(search_term),
                    Product.description.ilike(search_term),
                    Product.slug.ilike(search_term)
                )
            )

        # Sorting
        if sort_by == "price_asc":
            query = query.order_by(asc(Product.price))
        elif sort_by == "price_desc":
            query = query.order_by(desc(Product.price))
        elif sort_by == "newest":
            query = query.order_by(desc(Product.created_at))
        else: # default: featured first, then newest
            query = query.order_by(desc(Product.featured), desc(Product.created_at))

        total = query.count()
        offset = (page - 1) * page_size
        items = query.offset(offset).limit(page_size).all()
        return items, total

    @staticmethod
    def get_product(db: Session, product_id_or_slug: str) -> Optional[Product]:
        query = db.query(Product).options(
            joinedload(Product.category),
            joinedload(Product.images)
        )
        if product_id_or_slug.isdigit():
            prod = query.filter(Product.id == int(product_id_or_slug)).first()
            if prod:
                return prod
        return query.filter(Product.slug == product_id_or_slug).first()

    @staticmethod
    def create_product(db: Session, data: ProductCreate) -> Product:
        # Check slug uniqueness
        existing = db.query(Product).filter(Product.slug == data.slug).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Product with slug '{data.slug}' already exists."
            )

        if data.category_id:
            cat = db.query(Category).filter(Category.id == data.category_id).first()
            if not cat:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Category with ID {data.category_id} does not exist."
                )

        prod_data = data.model_dump(exclude={"image_urls"})
        product = Product(**prod_data)
        db.add(product)
        db.flush()

        # Add images
        if data.image_urls:
            for idx, url in enumerate(data.image_urls):
                img = ProductImage(
                    product_id=product.id,
                    image_url=url,
                    display_order=idx,
                    alt_text=f"{product.name} image {idx + 1}"
                )
                db.add(img)

        db.commit()
        db.refresh(product)
        return product

    @staticmethod
    def update_product(db: Session, product_id: int, data: ProductUpdate) -> Product:
        product = db.query(Product).filter(Product.id == product_id).first()
        if not product:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

        update_data = data.model_dump(exclude_unset=True)

        if "slug" in update_data and update_data["slug"] != product.slug:
            existing = db.query(Product).filter(Product.slug == update_data["slug"]).first()
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Product with slug '{update_data['slug']}' already exists."
                )

        if "category_id" in update_data and update_data["category_id"] is not None:
            cat = db.query(Category).filter(Category.id == update_data["category_id"]).first()
            if not cat:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Category with ID {update_data['category_id']} does not exist."
                )

        image_urls = update_data.pop("image_urls", None)
        if image_urls is not None:
            # Replace images
            db.query(ProductImage).filter(ProductImage.product_id == product.id).delete()
            for idx, url in enumerate(image_urls):
                img = ProductImage(
                    product_id=product.id,
                    image_url=url,
                    display_order=idx,
                    alt_text=f"{product.name} image {idx + 1}"
                )
                db.add(img)

        for key, val in update_data.items():
            setattr(product, key, val)

        db.commit()
        db.refresh(product)
        return product

    @staticmethod
    def delete_product(db: Session, product_id: int) -> bool:
        product = db.query(Product).filter(Product.id == product_id).first()
        if not product:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

        db.delete(product)
        db.commit()
        return True

product_service = ProductService()
