import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
  createProductStart,
  createProductSuccess,
  createProductFailure,
  updateProductStart,
  updateProductSuccess,
  updateProductFailure,
  deleteProductStart,
  deleteProductSuccess,
  deleteProductFailure,
  updateFilters
} from '../features/marketplace/productSlice';

const useProducts = () => {
  const dispatch = useDispatch();
  const { currentUser, accessToken } = useSelector(state => state.user);
  const { products, loading, error, filters, stats } = useSelector(state => state.products);
  const [selectedCategory, setSelectedCategory] = useState('');

  // Fetch products based on current filters
  const fetchProducts = async (additionalFilters = {}) => {
    try {
      dispatch(fetchProductsStart());
      const queryParams = new URLSearchParams({
        ...filters,
        ...additionalFilters
      });
      
      const response = await fetch(
        `http://localhost:8080/api/products?${queryParams}`,
        {
          headers: currentUser ? {
            Authorization: `Bearer ${accessToken}`
          } : {}
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      dispatch(fetchProductsSuccess({ 
        products: data.products,
        stats: data.stats
      }));
      return data.products;
    } catch (error) {
      dispatch(fetchProductsFailure(error.message));
      throw error;
    }
  };

  // Create new product
  const createProduct = async (productData) => {
    try {
      dispatch(createProductStart());
      const formData = new FormData();
      
      // Append all product data
      Object.keys(productData).forEach(key => {
        if (key === 'images') {
          productData.images.forEach(image => {
            formData.append('images', image);
          });
        } else {
          formData.append(key, productData[key]);
        }
      });

      const response = await fetch(
        "http://localhost:8080/api/products",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          body: formData
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      dispatch(createProductSuccess(data.product));
      return data.product;
    } catch (error) {
      dispatch(createProductFailure(error.message));
      throw error;
    }
  };

  // Update existing product
  const updateProduct = async (productId, updates) => {
    try {
      dispatch(updateProductStart());
      const formData = new FormData();
      
      Object.keys(updates).forEach(key => {
        if (key === 'images') {
          updates.images.forEach(image => {
            if (image instanceof File) {
              formData.append('images', image);
            }
          });
        } else {
          formData.append(key, updates[key]);
        }
      });

      const response = await fetch(
        `http://localhost:8080/api/products/${productId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          body: formData
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      dispatch(updateProductSuccess(data.product));
      return data.product;
    } catch (error) {
      dispatch(updateProductFailure(error.message));
      throw error;
    }
  };

  // Delete product
  const deleteProduct = async (productId) => {
    try {
      dispatch(deleteProductStart());
      const response = await fetch(
        `http://localhost:8080/api/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }

      dispatch(deleteProductSuccess(productId));
      return true;
    } catch (error) {
      dispatch(deleteProductFailure(error.message));
      throw error;
    }
  };

  // Filter products
  const filterProducts = (newFilters) => {
    dispatch(updateFilters(newFilters));
  };

  // Get seller's products
  const getSellerProducts = async () => {
    if (!currentUser || currentUser.role !== 'seller') return [];
    return await fetchProducts({ seller: currentUser._id });
  };

  // Get product categories
  const getCategories = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/products/categories"
      );
      const data = await response.json();
      return data.categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  };

  // Effect to fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [filters]);

  return {
    products,
    loading,
    error,
    stats,
    filters,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    filterProducts,
    getSellerProducts,
    getCategories,
    selectedCategory,
    setSelectedCategory
  };
};

export default useProducts;