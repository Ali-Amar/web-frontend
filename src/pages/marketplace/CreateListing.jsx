import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Alert, Card } from 'flowbite-react';
import { HiInformationCircle } from 'react-icons/hi';
import ProductUpload from '../../components/marketplace/ProductUpload';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import useProducts from '../../hooks/useProducts';

const CreateListing = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const { language } = useSelector((state) => state.language) || 'en';
  const { createProduct } = useProducts();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch categories on component mount
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/products/categories');
      const data = await response.json();
      setCategories(data.categories);
    } catch (err) {
      setError(language === 'ur' 
        ? 'زمرہ جات لوڈ کرنے میں مسئلہ'
        : 'Failed to load categories'
      );
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Add seller information to the product data
      const productData = {
        ...formData,
        seller: currentUser._id,
        sellerName: currentUser.businessName || currentUser.fullName,
        sellerAvatar: currentUser.avatar
      };

      await createProduct(productData);
      
      // Redirect to seller's products page
      navigate('/seller/products');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser || currentUser.role !== 'seller') {
    return (
      <Alert color="failure" icon={HiInformationCircle}>
        {language === 'ur'
          ? 'آپ کو مصنوعات فروخت کرنے کی اجازت نہیں ہے'
          : 'You are not authorized to sell products'}
      </Alert>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {language === 'ur' ? 'نئی مصنوعات شائع کریں' : 'Create New Listing'}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {language === 'ur' 
              ? 'اپنی دستکاری مصنوعات کو مارکیٹ پلیس پر شائع کریں'
              : 'List your artisanal products on the marketplace'}
          </p>
        </div>

        {error && (
          <Alert color="failure" className="mb-6">
            {error}
          </Alert>
        )}

        {loading ? (
          <LoadingSpinner />
        ) : (
          <Card className="mb-8">
            <ProductUpload
              onSubmit={handleSubmit}
              categories={categories}
              isLoading={loading}
            />
          </Card>
        )}

        {/* Guidelines Section */}
        <Card className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {language === 'ur' ? 'لسٹنگ کی ہدایات' : 'Listing Guidelines'}
          </h2>
          <ul className="space-y-3 text-gray-600 dark:text-gray-400">
            <li>
              {language === 'ur'
                ? '• واضح اور معیاری تصاویر استعمال کریں'
                : '• Use clear, high-quality images'}
            </li>
            <li>
              {language === 'ur'
                ? '• مکمل اور درست پروڈکٹ تفصیلات فراہم کریں'
                : '• Provide complete and accurate product details'}
            </li>
            <li>
              {language === 'ur'
                ? '• مناسب قیمتیں طے کریں'
                : '• Set fair and competitive prices'}
            </li>
            <li>
              {language === 'ur'
                ? '• شپنگ کی درست معلومات شامل کریں'
                : '• Include accurate shipping information'}
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default CreateListing;