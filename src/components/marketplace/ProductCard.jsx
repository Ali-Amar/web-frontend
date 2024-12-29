import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { HiHeart, HiShoppingCart, HiStar } from 'react-icons/hi';
import { Badge, Button, Tooltip } from 'flowbite-react';

const ProductCard = ({ product, onAddToCart, onAddToWishlist }) => {
  const { currentUser } = useSelector(state => state.user);
  const {language} = useSelector(state => state.language) || 'en';

  const {
    _id,
    name,
    description,
    price,
    discountedPrice,
    category,
    images,
    rating,
    reviews,
    seller,
    stock,
  } = product;

  console.log(product);

  const discountPercentage = discountedPrice
    ? Math.round(((price - discountedPrice) / price) * 100)
    : 0;

  const getStockStatus = () => {
    if (stock === 0) return { color: 'failure', text: language === 'ur' ? 'ناموجود' : 'Out of Stock' };
    if (stock < 5) return { color: 'warning', text: language === 'ur' ? 'کم اسٹاک' : 'Low Stock' };
    return { color: 'success', text: language === 'ur' ? 'دستیاب' : 'In Stock' };
  };

  const stockStatus = getStockStatus();

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Discount Badge */}
      {discountPercentage > 0 && (
        <div className="absolute top-2 left-2 z-10">
          <Badge color="failure" size="sm">
            {discountPercentage}% {language === 'ur' ? 'رعایت' : 'OFF'}
          </Badge>
        </div>
      )}
      
      {/* Wishlist Button */}
      <button 
        onClick={() => onAddToWishlist(product)}
        className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 transition-colors"
      >
        <HiHeart className="w-5 h-5 text-gray-400 hover:text-red-500" />
      </button>

      {/* Product Image */}
      <Link to={`/product/${_id}`} className="block aspect-square overflow-hidden rounded-t-lg">
        <img
          src={'https://www.mountaingoatsoftware.com/uploads/blog/2016-09-06-what-is-a-product.png'}
          alt={name}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* Product Details */}
      <div className="p-4">
        {/* Category & Tags */}
        <div className="flex items-center gap-2 mb-2">
          <Badge color="gray" size="sm">
            {category.name}
          </Badge>
          {/* {tags?.slice(0, 2).map((tag, index) => (
            <Badge key={index} color="info" size="sm">
              {tag}
            </Badge>
          ))} */}
        </div>

        {/* Title & Price */}
        <Link to={`/product/${_id}`}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 hover:text-blue-600 dark:hover:text-blue-400">
            {name}
          </h3>
        </Link>

        <div className="flex items-end gap-2 mb-2">
          <div className="flex items-baseline gap-2">
            {discountedPrice ? (
              <>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  Rs. {discountedPrice}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  Rs. {price}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                Rs. {price}
              </span>
            )}
          </div>
        </div>

        {/* Rating & Reviews
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            <HiStar className="w-5 h-5 text-yellow-400" />
            <span className="ml-1 text-sm font-medium text-gray-900 dark:text-white">
              {rating}
            </span>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            ({reviews?.length} {language === 'ur' ? 'جائزے' : 'reviews'})
          </span>
        </div> */}

        {/* Seller Info */}
        <Link to={`/seller/${seller._id}`} className="flex items-center gap-2 mb-4">
          <img
            src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNczU0YtXNFkne_nB0ttJ37TpL-zZ3Nu0YGQ&s'}
            alt={seller.businessName}
            className="w-6 h-6 rounded-full"
          />
          <span className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
            {seller.businessName}
          </span>
        </Link>

        {/* Stock Status & Add to Cart */}
        <div className="flex items-center justify-between">
          <Badge color={stockStatus.color}>
            {stockStatus.text}
          </Badge>
          <Button
            size="sm"
            gradientDuoTone="purpleToBlue"
            disabled={stock === 0}
            onClick={() => onAddToCart(product)}
          >
            <HiShoppingCart className="w-5 h-5 mr-2" />
            {language === 'ur' ? 'کارٹ میں شامل کریں' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;