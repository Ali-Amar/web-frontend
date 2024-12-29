import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Table,
  Button,
  TextInput,
  Select,
  Card,
  Alert,
  Modal,
  Badge,
  Spinner,
  Pagination,
  FileInput
} from 'flowbite-react';
import {
  HiSearch,
  HiFilter,
  HiPhotograph,
  HiPencil,
  HiTrash,
  HiPlus,
  HiX,
  HiEye
} from 'react-icons/hi';

const ProductManager = () => {
  const { currentUser, accessToken } = useSelector(state => state.user);
  const {language} = useSelector(state => state.language) || 'en';

  // State management
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Form and filter state
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: 'all'
  });

  const [productForm, setProductForm] = useState({
    name: '',
    nameUrdu: '',
    description: '',
    descriptionUrdu: '',
    price: '',
    category: '',
    stock: '',
    images: [],
    status: 'active',
    seller: ''
  });

  // Product categories
  const categories = [
    { value: 'handicrafts', label: 'Handicrafts', labelUrdu: 'دستکاری' },
    { value: 'textiles', label: 'Textiles', labelUrdu: 'کپڑے' },
    { value: 'food', label: 'Food Products', labelUrdu: 'کھانے کی اشیاء' },
    { value: 'agriculture', label: 'Agriculture', labelUrdu: 'زراعت' }
  ];

  // Fetch products on mount and filter/page change
  useEffect(() => {
    fetchProducts();
  }, [currentPage, filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage,
        ...filters
      });

      const response = await fetch(
        `http://localhost:8080/api/my-products?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }, 
          credentials: 'include'
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle image uploads
  const handleImageUpload = (files) => {
    const newImages = Array.from(files).map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setProductForm(prev => ({
      ...prev,
      images: [...prev.images, ...newImages].slice(0, 5) // Max 5 images
    }));
  };

  const removeImage = (index) => {
    setProductForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const formData = new FormData();
      Object.keys(productForm).forEach(key => {
        if (key !== 'images') {
          formData.append(key, productForm[key]);
        }
      });

      productForm.images.forEach(img => {
        if (img.file) {
          formData.append('images', img.file);
        }
      });

      productForm.seller = currentUser._id;

      const url = editMode
        ? `http://localhost:8080/api/products/${selectedProduct._id}`
        : 'http://localhost:8080/api/products';

      const response = await fetch(url, {
        method: editMode ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify(productForm),
        credentials: 'include'
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      // Reset form and refresh products
      setShowProductModal(false);
      resetForm();
      fetchProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete product handler
  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8080/api/products/${selectedProduct._id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`
          }, 
          credentials: 'include'
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }

      // Reset state and refresh products
      setShowDeleteConfirm(false);
      setSelectedProduct(null);
      fetchProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setProductForm({
      name: '',
      nameUrdu: '',
      description: '',
      descriptionUrdu: '',
      price: '',
      category: '',
      stock: '',
      images: [],
      status: 'active'
    });
    setEditMode(false);
    setSelectedProduct(null);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <TextInput
              icon={HiSearch}
              placeholder={language === 'ur' ? 'مصنوعات تلاش کریں...' : 'Search products...'}
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
          </div>
          <Select
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
          >
            <option value="">
              {language === 'ur' ? 'تمام زمرے' : 'All Categories'}
            </option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {language === 'ur' ? cat.labelUrdu : cat.label}
              </option>
            ))}
          </Select>
          <Select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          >
            <option value="all">{language === 'ur' ? 'تمام' : 'All Status'}</option>
            <option value="active">{language === 'ur' ? 'فعال' : 'Active'}</option>
            <option value="inactive">{language === 'ur' ? 'غیر فعال' : 'Inactive'}</option>
          </Select>
          <Button
            gradientDuoTone="purpleToBlue"
            onClick={() => {
              resetForm();
              setShowProductModal(true);
            }}
          >
            <HiPlus className="w-4 h-4 mr-2" />
            {language === 'ur' ? 'نئی مصنوعات' : 'New Product'}
          </Button>
        </div>
      </Card>

      {error && (
        <Alert color="failure">
          {error}
        </Alert>
      )}

      {/* Products Table */}
      <Card>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="xl" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {language === 'ur' ? 'کوئی مصنوعات نہیں ملیں' : 'No Products Found'}
            </h3>
            <p className="text-gray-500">
              {language === 'ur'
                ? 'نئی مصنوعات شامل کرنے کے لیے بٹن پر کلک کریں'
                : 'Click the button above to add new products'}
            </p>
          </div>
        ) : (
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>{language === 'ur' ? 'تصویر' : 'Image'}</Table.HeadCell>
              <Table.HeadCell>{language === 'ur' ? 'نام' : 'Name'}</Table.HeadCell>
              <Table.HeadCell>{language === 'ur' ? 'زمرہ' : 'Category'}</Table.HeadCell>
              <Table.HeadCell>{language === 'ur' ? 'قیمت' : 'Price'}</Table.HeadCell>
              <Table.HeadCell>{language === 'ur' ? 'اسٹاک' : 'Stock'}</Table.HeadCell>
              <Table.HeadCell>{language === 'ur' ? 'حالت' : 'Status'}</Table.HeadCell>
              <Table.HeadCell>{language === 'ur' ? 'ایکشن' : 'Actions'}</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {products.map((product) => (
                <Table.Row key={product._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500" dir="rtl">{product.nameUrdu}</p>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    {language === 'ur'
                      ? categories.find(cat => cat.value === product.category)?.labelUrdu
                      : categories.find(cat => cat.value === product.category)?.label}
                  </Table.Cell>
                  <Table.Cell>
                    Rs. {product.price.toLocaleString()}
                  </Table.Cell>
                  <Table.Cell>
                    {product.stock}
                  </Table.Cell>
                  <Table.Cell>
                    <Badge
                      color={product.status === 'active' ? 'success' : 'gray'}
                    >
                      {product.status === 'active'
                        ? (language === 'ur' ? 'فعال' : 'Active')
                        : (language === 'ur' ? 'غیر فعال' : 'Inactive')}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        color="gray"
                        onClick={() => {
                          setSelectedProduct(product);
                          setEditMode(true);
                          setProductForm({
                            ...product,
                            images: product.images.map(url => ({ preview: url }))
                          });
                          setShowProductModal(true);
                        }}
                      >
                        <HiPencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        color="failure"
                        onClick={() => {
                          setSelectedProduct(product);
                          setShowDeleteConfirm(true);
                        }}
                      >
                        <HiTrash className="w-4 h-4" />
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </Card>

      {/* Product Form Modal */}
      <Modal
        show={showProductModal}
        onClose={() => {
          setShowProductModal(false);
          resetForm();
        }}
        size="xl"
      >
        <Modal.Header>
          {editMode
            ? (language === 'ur' ? 'مصنوعات میں ترمیم' : 'Edit Product')
            : (language === 'ur' ? 'نئی مصنوعات شامل کریں' : 'Add New Product')}
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  {language === 'ur' ? 'نام (انگریزی)' : 'Name (English)'}
                </label>
                <TextInput
                  name="name"
                  value={productForm.name}
                  onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  {language === 'ur' ? 'نام (اردو)' : 'Name (Urdu)'}
                </label>
                <TextInput
                  name="nameUrdu"
                  value={productForm.nameUrdu}
                  onChange={(e) => setProductForm(prev => ({ ...prev, nameUrdu: e.target.value }))}
                  required
                  dir="rtl"
                />
              </div>
            </div>

            {/* Price and Stock */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  {language === 'ur' ? 'قیمت' : 'Price'}
                </label>
                <TextInput
                  type="number"
                  name="price"
                  value={productForm.price}
                  onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
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
                  value={productForm.stock}
                  onChange={(e) => setProductForm(prev => ({ ...prev, stock: e.target.value }))}
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  {language === 'ur' ? 'زمرہ' : 'Category'}
                </label>
                <Select
                  value={productForm.category}
                  onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                  required
                >
                  <option value="">
                    {language === 'ur' ? 'زمرہ منتخب کریں' : 'Select Category'}
                  </option>
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {language === 'ur' ? cat.labelUrdu : cat.label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            {/* Description */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  {language === 'ur' ? 'تفصیل (انگریزی)' : 'Description (English)'}
                </label>
                <textarea
                  className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 p-2.5"
                  rows="4"
                  value={productForm.description}
                  onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  {language === 'ur' ? 'تفصیل (اردو)' : 'Description (Urdu)'}
                </label>
                <textarea
                  className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 p-2.5"
                  rows="4"
                  value={productForm.descriptionUrdu}
                  onChange={(e) => setProductForm(prev => ({ ...prev, descriptionUrdu: e.target.value }))}
                  required
                  dir="rtl"
                />
              </div>
            </div>

            {/* Product Images */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {language === 'ur' ? 'تصاویر' : 'Images'}
                <span className="text-sm text-gray-500 ml-2">
                  {language === 'ur' ? '(زیادہ سے زیادہ 5)' : '(Max 5)'}
                </span>
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <HiPhotograph className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      {language === 'ur' ? 'تصاویر شامل کرنے کے لیے کلک کریں' : 'Click to upload images'}
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleImageUpload(e.target.files)}
                  />
                </label>
              </div>

              {/* Image Previews */}
              {productForm.images.length > 0 && (
                <div className="grid grid-cols-5 gap-4 mt-4">
                  {productForm.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image.preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
                        onClick={() => removeImage(index)}
                      >
                        <HiX className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Status */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {language === 'ur' ? 'حالت' : 'Status'}
              </label>
              <Select
                value={productForm.status}
                onChange={(e) => setProductForm(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="active">
                  {language === 'ur' ? 'فعال' : 'Active'}
                </option>
                <option value="inactive">
                  {language === 'ur' ? 'غیر فعال' : 'Inactive'}
                </option>
              </Select>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2">
            <Button
              color="gray"
              onClick={() => {
                setShowProductModal(false);
                resetForm();
              }}
            >
              {language === 'ur' ? 'منسوخ کریں' : 'Cancel'}
            </Button>
            <Button
              gradientDuoTone="purpleToBlue"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <Spinner size="sm" className="mr-2" />
              ) : (
                <HiPlus className="w-4 h-4 mr-2" />
              )}
              {editMode
                ? (language === 'ur' ? 'اپ ڈیٹ کریں' : 'Update')
                : (language === 'ur' ? 'شامل کریں' : 'Add')}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        size="md"
      >
        <Modal.Header>
          {language === 'ur' ? 'تصدیق کریں' : 'Confirm Delete'}
        </Modal.Header>
        <Modal.Body>
          <p>
            {language === 'ur'
              ? 'کیا آپ واقعی اس مصنوعات کو حذف کرنا چاہتے ہیں؟'
              : 'Are you sure you want to delete this product?'}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2">
            <Button
              color="gray"
              onClick={() => setShowDeleteConfirm(false)}
            >
              {language === 'ur' ? 'منسوخ کریں' : 'Cancel'}
            </Button>
            <Button
              color="failure"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? (
                <Spinner size="sm" className="mr-2" />
              ) : (
                <HiTrash className="w-4 h-4 mr-2" />
              )}
              {language === 'ur' ? 'حذف کریں' : 'Delete'}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProductManager;