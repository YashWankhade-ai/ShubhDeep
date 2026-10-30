import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { formatINR } from "../config/site";
import { useCart } from "../context/CartContext";

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const onAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const size = product.sizes && product.sizes.length > 0 ? product.sizes[0] : null;
    const color = product.colors && product.colors.length > 0 ? product.colors[0] : null;
    addToCart(product, 1, size, color);
  };

  const badgeText = product.badge || (product.isNew || product.is_new ? "New Arrival" : null);
  const imageSrc = Array.isArray(product.images) && product.images.length > 0
    ? (typeof product.images[0] === "string" ? product.images[0] : product.images[0].image_url)
    : (product.image || "/images/3be7aa21a985f477_diya1.jpeg");

  const isLimited = product.availability === "limited" || (product.stock_quantity > 0 && product.stock_quantity <= 10);
  const isOutOfStock = product.stock_quantity === 0 || product.is_available === false;

  return (
    <Link
      to={`/product/${product.slug || product.id}`}
      className="group relative block bg-white"
      data-testid={`product-card-${product.slug || product.id}`}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-[#FFF8EC]">
        <img
          src={imageSrc}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-2 border border-[#C5A15B]/40" />

        {badgeText && !isOutOfStock && (
          <span className="absolute top-4 left-4 bg-[#42121B] px-3 py-1 text-[0.62rem] font-semibold tracking-[0.2em] uppercase text-[#D99A35]">
            {badgeText}
          </span>
        )}

        {isOutOfStock ? (
          <span className="absolute top-4 right-4 bg-[#42121B]/90 px-3 py-1 text-[0.62rem] font-semibold tracking-[0.2em] uppercase text-[#FFF8EC]">
            Out of Stock
          </span>
        ) : isLimited ? (
          <span className="absolute top-4 right-4 bg-[#B85C38] px-3 py-1 text-[0.62rem] font-semibold tracking-[0.2em] uppercase text-[#FFF8EC]">
            Limited
          </span>
        ) : null}

        {!isOutOfStock && (
          <button
            onClick={onAdd}
            data-testid={`add-to-cart-button-${product.id || product.slug}`}
            className="absolute right-4 bottom-4 grid h-11 w-11 translate-y-3 place-items-center rounded-full bg-[#641B25] text-[#C5A15B] opacity-0 shadow-lg transition-all duration-300 hover:bg-[#42121B] hover:text-[#D99A35] group-hover:translate-y-0 group-hover:opacity-100"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingBag className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="px-1 py-5">
        <h3 className="font-serif-display text-xl leading-snug text-[#42121B] transition-colors group-hover:text-[#641B25]">
          {product.name}
        </h3>
        <div className="mt-2 flex items-baseline gap-3">
          <span className="text-base font-semibold text-[#641B25]">
            {formatINR(product.price)}
          </span>
          {(product.oldPrice || product.old_price) && (
            <span className="text-xs text-[#8A5A44] line-through">
              {formatINR(product.oldPrice || product.old_price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};
