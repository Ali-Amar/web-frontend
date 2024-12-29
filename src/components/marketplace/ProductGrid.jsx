import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import ProductCard from './ProductCard';
import { Button, Spinner } from 'flowbite-react';
import { HiFilter } from 'react-icons/hi';

const ProductGrid = ({ 
  products, 
  isLoading, 
  onLoadMore, 
  hasMore, 
  onAddToCart, 
  onAddToWishlist,
  onFilterOpen 
}) => {
  const {language} = useSelector(state => state.language) || 'en';
  const [layout, setLayout] = useState('grid'); // 'grid' or 'list'

  if (isLoading && (!products || !products.length)) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="xl" />
      </div>
    );
  }

  if (!products || !products.length) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {language === 'ur' ? 'کوئی پروڈکٹ نہیں ملا' : 'No Products Found'}
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          {language === 'ur' 
            ? 'برائے مہربانی اپنی تلاش کو وسیع کریں یا فلٹرز کو ایڈجسٹ کریں' 
            : 'Try broadening your search or adjusting the filters'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Grid Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Button
            color="gray"
            size="sm"
            onClick={onFilterOpen}
          >
            <HiFilter className="w-5 h-5 mr-2" />
            {language === 'ur' ? 'فلٹرز' : 'Filters'}
          </Button>
          
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {products.length} {language === 'ur' ? 'پروڈکٹس' : 'products'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {language === 'ur' ? 'ترتیب دیں:' : 'View:'}
          </span>
          <div className="flex gap-1">
            <Button
              size="sm"
              color={layout === 'grid' ? 'blue' : 'gray'}
              onClick={() => setLayout('grid')}
            >
              <i className="fas fa-grid-2" />
            </Button>
            <Button
              size="sm"
              color={layout === 'list' ? 'blue' : 'gray'}
              onClick={() => setLayout('list')}
            >
              <i className="fas fa-list" />
            </Button>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className={`
        grid gap-6
        ${layout === 'grid' 
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2' 
          : 'grid-cols-1'
        }
      `}>
        {products.map(product => (
          <ProductCard
            key={product._id}
            product={product}
            onAddToCart={onAddToCart}
            onAddToWishlist={onAddToWishlist}
            layout={layout}
          />
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center mt-8">
          <Button
            gradientDuoTone="purpleToBlue"
            size="lg"
            onClick={onLoadMore}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner size="sm" className="mr-3" />
                {language === 'ur' ? 'لوڈ ہو رہا ہے...' : 'Loading...'}
              </>
            ) : (
              language === 'ur' ? 'مزید دکھائیں' : 'Load More'
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;