import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Card,
  TextInput,
  Textarea,
  Select,
  FileInput,
  Button,
  Alert,
  Progress
} from 'flowbite-react';
import { 
  HiUpload,
  HiPhotograph,
  HiX,
  HiCheck,
  HiExclamation 
} from 'react-icons/hi';

const DashAddProduct = () => {
  const { language } = useSelector((state) => state.language) || 'en';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [formData, setFormData] = useState({
    name: '',
    nameUrdu: '',
    description: '',
    descriptionUrdu: '',
    category: '',
    price: '',
    stock: '',
    images: [],
    craftType: '',
    region: '',
    materials: '',
    specifications: {},
    shippingInfo: {
      weight: '',
      dimensions: '',
      deliveryTime: ''
    }
  });

  const categories = [
    { id: 'handicrafts', name: 'Handicrafts', nameUrdu: 'دستکاری' },
    { id: 'textiles', name: 'Textiles', nameUrdu: 'کپڑے' },
    { id: 'jewelry', name: 'Jewelry', nameUrdu: 'زیورات' },
    { id: 'pottery', name: 'Pottery', nameUrdu: 'مٹی کے برتن' }
  ];

  const craftTypes = [
    { id: 'traditional', name: 'Traditional', nameUrdu: 'روایتی' },
    { id: 'modern', name: 'Modern', nameUrdu: 'جدید' },
    { id: 'fusion', name: 'Fusion', nameUrdu: 'فیوژن' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setError(language === 'ur' 
        ? 'زیادہ سے زیادہ 5 تصاویر' 
        : 'Maximum 5 images allowed');
      return;
    }

    setFormData(prev => ({
      ...prev,
      images: files
    }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 500);

      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 2000));

      setSuccess(true);
      setFormData({
        name: '',
        nameUrdu: '',
        description: '',
        descriptionUrdu: '',
        category: '',
        price: '',
        stock: '',
        images: [],
        craftType: '',
        region: '',
        materials: '',
        specifications: {},
        shippingInfo: {
          weight: '',
          dimensions: '',
          deliveryTime: ''
        }
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="p-4">
      <Card>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {language === 'ur' ? 'نئی مصنوعات شامل کریں' : 'Add New Product'}
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {language === 'ur' 
              ? 'مصنوعات کی تفصیلات درج کریں' 
              : 'Enter product details below'}
          </p>
        </div>

        {error && (
          <Alert color="failure" icon={HiExclamation} className="mb-4">
            {error}
          </Alert>
        )}

        {success && (
          <Alert color="success" icon={HiCheck} className="mb-4">
            {language === 'ur'
              ? 'مصنوعات کامیابی سے شامل کر دی گئی'
              : 'Product added successfully'}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {language === 'ur' ? 'نام (انگریزی)' : 'Name (English)'}
              </label>
              <TextInput
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {language === 'ur' ? 'نام (اردو)' : 'Name (Urdu)'}
              </label>
              <TextInput
                name="nameUrdu"
                value={formData.nameUrdu}
                onChange={handleChange}
                required
                dir="rtl"
              />
            </div>
          </div>

          {/* Description */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {language === 'ur' ? 'تفصیل (انگریزی)' : 'Description (English)'}
              </label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {language === 'ur' ? 'تفصیل (اردو)' : 'Description (Urdu)'}
              </label>
              <Textarea
                name="descriptionUrdu"
                value={formData.descriptionUrdu}
                onChange={handleChange}
                required
                rows={4}
                dir="rtl"
              />
            </div>
          </div>

          {/* Category and Type */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {language === 'ur' ? 'زمرہ' : 'Category'}
              </label>
              <Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">
                  {language === 'ur' ? 'زمرہ منتخب کریں' : 'Select Category'}
                </option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {language === 'ur' ? category.nameUrdu : category.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {language === 'ur' ? 'دستکاری کی قسم' : 'Craft Type'}
              </label>
              <Select
                name="craftType"
                value={formData.craftType}
                onChange={handleChange}
                required
              >
                <option value="">
                  {language === 'ur' ? 'قسم منتخب کریں' : 'Select Type'}
                </option>
                {craftTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {language === 'ur' ? type.nameUrdu : type.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {/* Price and Stock */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {language === 'ur' ? 'قیمت' : 'Price'}
              </label>
              <TextInput
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {language === 'ur' ? 'اسٹاک' : 'Stock'}
              </label>
              <TextInput
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                min="0"
              />
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              {language === 'ur' ? 'تصاویر' : 'Images'}
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <HiPhotograph className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    {language === 'ur' 
                      ? 'تصاویر اپلوڈ کرنے کے لیے کلک کریں'
                      : 'Click to upload images'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG or WEBP (MAX. 5)
                  </p>
                </div>
                <FileInput
                  className="hidden"
                  onChange={handleImageUpload}
                  multiple
                  accept="image/*"
                />
              </label>
            </div>

            {/* Image Previews */}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-5 gap-4 mt-4">
                {formData.images.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <HiX className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex flex-col items-center gap-4">
            {uploadProgress > 0 && (
              <Progress
                progress={uploadProgress}
                size="lg"
                color="blue"
                className="w-full"
              />
            )}
            <Button
              type="submit"
              gradientDuoTone="purpleToBlue"
              size="lg"
              disabled={loading}
              className="w-full md:w-auto"
            >
              {loading ? (
                <>
                  <div className="animate-spin mr-2">
                    <HiUpload className="w-5 h-5" />
                  </div>
                  {language === 'ur' ? 'اپلوڈ ہو رہا ہے...' : 'Uploading...'}
                </>
              ) : (
                <>
                  <HiUpload className="w-5 h-5 mr-2" />
                  {language === 'ur' ? 'مصنوعات شامل کریں' : 'Add Product'}
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default DashAddProduct;