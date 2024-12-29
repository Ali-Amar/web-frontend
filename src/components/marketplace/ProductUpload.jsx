import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { 
  Button, 
  Label, 
  TextInput, 
  Textarea, 
  Select,
  FileInput,
  Alert,
  Progress 
} from 'flowbite-react';
import { HiUpload, HiX, HiPhotograph } from 'react-icons/hi';
import { useDropzone } from 'react-dropzone';

const ProductUpload = ({ onSubmit, categories, isLoading }) => {
  const { currentUser } = useSelector(state => state.user);
  const {language} = useSelector(state => state.language) || 'en';

  const [formData, setFormData] = useState({
    name: '',
    nameUrdu: '',
    description: '',
    descriptionUrdu: '',
    price: '',
    discountedPrice: '',
    category: '',
    subcategory: '',
    stock: '',
    tags: [],
    specifications: {},
    shippingInfo: {
      weight: '',
      dimensions: '',
      shippingTime: ''
    }
  });

  const [images, setImages] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  // Image upload handling with preview
  const onDrop = useCallback(acceptedFiles => {
    const newImages = acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    }));
    setImages(prev => [...prev, ...newImages].slice(0, 5)); // Maximum 5 images
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 5,
    maxSize: 5242880 // 5MB
  });

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Form handling
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim());
    setFormData(prev => ({
      ...prev,
      tags
    }));
  };

  const handleSpecificationChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [key]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (images.length === 0) {
      setError(language === 'ur' ? 'کم از کم ایک تصویر درکار ہے' : 'At least one image is required');
      return;
    }

    try {
      // Simulated upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 500);

      await onSubmit({ ...formData, images });
    } catch (err) {
      setError(err.message);
      setUploadProgress(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {language === 'ur' ? 'نیا پروڈکٹ شامل کریں' : 'Add New Product'}
      </h2>

      {error && (
        <Alert color="failure" className="mb-4">
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload Section */}
        <div>
          <Label className="mb-2 block">
            {language === 'ur' ? 'پروڈکٹ کی تصاویر' : 'Product Images'}
            <span className="text-red-500">*</span>
          </Label>
          <div {...getRootProps()} className={`
            border-2 border-dashed rounded-lg p-6 cursor-pointer
            ${isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'}
          `}>
            <input {...getInputProps()} />
            <div className="text-center">
              <HiPhotograph className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {language === 'ur' 
                  ? 'تصاویر یہاں ڈراپ کریں یا براؤز کریں' 
                  : 'Drop images here or click to browse'}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {language === 'ur'
                  ? 'زیادہ سے زیادہ 5 تصاویر، فی تصویر 5MB'
                  : 'Maximum 5 images, 5MB each'}
              </p>
            </div>
          </div>

          {/* Image Previews */}
          {images.length > 0 && (
            <div className="grid grid-cols-5 gap-4 mt-4">
              {images.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={file.preview}
                    alt={`Preview ${index}`}
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

        {/* Basic Information */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="name">
              {language === 'ur' ? 'پروڈکٹ کا نام (انگریزی)' : 'Product Name (English)'}
              <span className="text-red-500">*</span>
            </Label>
            <TextInput
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="nameUrdu">
              {language === 'ur' ? 'پروڈکٹ کا نام (اردو)' : 'Product Name (Urdu)'}
              <span className="text-red-500">*</span>
            </Label>
            <TextInput
              id="nameUrdu"
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
            <Label htmlFor="description">
              {language === 'ur' ? 'تفصیل (انگریزی)' : 'Description (English)'}
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor="descriptionUrdu">
              {language === 'ur' ? 'تفصیل (اردو)' : 'Description (Urdu)'}
            </Label>
            <Textarea
              id="descriptionUrdu"
              name="descriptionUrdu"
              value={formData.descriptionUrdu}
              onChange={handleChange}
              rows={4}
              dir="rtl"
            />
          </div>
        </div>

        {/* Price and Stock */}
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <Label htmlFor="price">
              {language === 'ur' ? 'قیمت' : 'Price'}
              <span className="text-red-500">*</span>
            </Label>
            <TextInput
              id="price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
            />
          </div>
          <div>
            <Label htmlFor="discountedPrice">
              {language === 'ur' ? 'رعایتی قیمت' : 'Discounted Price'}
            </Label>
            <TextInput
              id="discountedPrice"
              name="discountedPrice"
              type="number"
              value={formData.discountedPrice}
              onChange={handleChange}
              min="0"
            />
          </div>
          <div>
            <Label htmlFor="stock">
              {language === 'ur' ? 'اسٹاک' : 'Stock'}
              <span className="text-red-500">*</span>
            </Label>
            <TextInput
              id="stock"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              required
              min="0"
            />
          </div>
        </div>

        {/* Category and Subcategory */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="category">
              {language === 'ur' ? 'کیٹیگری' : 'Category'}
              <span className="text-red-500">*</span>
            </Label>
            <Select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">
                {language === 'ur' ? 'کیٹیگری منتخب کریں' : 'Select Category'}
              </option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>
                  {language === 'ur' ? cat.nameUrdu : cat.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="tags">
              {language === 'ur' ? 'ٹیگز' : 'Tags'}
            </Label>
            <TextInput
              id="tags"
              name="tags"
              value={formData.tags.join(', ')}
              onChange={handleTagsChange}
              placeholder={language === 'ur' ? 'کاما سے علیحدہ ٹیگز' : 'Comma separated tags'}
            />
          </div>
        </div>

        {/* Shipping Information */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            {language === 'ur' ? 'شپنگ کی معلومات' : 'Shipping Information'}
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="weight">
                {language === 'ur' ? 'وزن (کلوگرام)' : 'Weight (kg)'}
              </Label>
              <TextInput
                id="weight"
                name="shippingInfo.weight"
                type="number"
                value={formData.shippingInfo.weight}
                onChange={handleChange}
                step="0.1"
              />
            </div>
            <div>
              <Label htmlFor="dimensions">
                {language === 'ur' ? 'ابعاد (LxWxH)' : 'Dimensions (LxWxH)'}
              </Label>
              <TextInput
                id="dimensions"
                name="shippingInfo.dimensions"
                value={formData.shippingInfo.dimensions}
                onChange={handleChange}
                placeholder="30x20x10 cm"
              />
            </div>
            <div>
              <Label htmlFor="shippingTime">
                {language === 'ur' ? 'شپنگ کا وقت' : 'Shipping Time'}
              </Label>
              <TextInput
                id="shippingTime"
                name="shippingInfo.shippingTime"
                value={formData.shippingInfo.shippingTime}
                onChange={handleChange}
                placeholder="2-3 days"
              />
            </div>
          </div>
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
            disabled={isLoading}
            className="w-full md:w-auto"
          >
            {isLoading ? (
              language === 'ur' ? 'اپلوڈ ہو رہا ہے...' : 'Uploading...'
            ) : (
              <>
                <HiUpload className="w-5 h-5 mr-2" />
                {language === 'ur' ? 'پروڈکٹ شائع کریں' : 'Publish Product'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductUpload;