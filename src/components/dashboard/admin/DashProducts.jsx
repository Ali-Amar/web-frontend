import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { 
  Table, 
  Button, 
  TextInput, 
  Select,
  Badge,
  Card,
  Alert,
  Modal
} from 'flowbite-react';
import { Link } from 'react-router-dom';
import { 
  HiSearch,
  HiPlus,
  HiPencil,
  HiTrash,
  HiFilter,
  HiPhotograph,
  HiExclamation,
  HiX
} from 'react-icons/hi';

const DashProducts = () => {
  const { currentUser, accessToken } = useSelector((state) => state.user);
  const { language } = useSelector((state) => state.language) || 'en';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    craftType: '',
    status: ''
  });

  // Product categories for rural artisans
  const categories = [
    { id: 'handicrafts', name: 'Handicrafts', nameUrdu: 'دستکاری' },
    { id: 'textiles', name: 'Textiles', nameUrdu: 'کپڑے' },
    { id: 'jewelry', name: 'Jewelry', nameUrdu: 'زیورات' },
    { id: 'pottery', name: 'Pottery', nameUrdu: 'مٹی کے برتن' },
    { id: 'embroidery', name: 'Embroidery', nameUrdu: 'کڑھائی' }
  ];

  // Craft types
  const craftTypes = [
    { id: 'traditional', name: 'Traditional', nameUrdu: 'روایتی' },
    { id: 'modern', name: 'Modern', nameUrdu: 'جدید' },
    { id: 'fusion', name: 'Fusion', nameUrdu: 'فیوژن' }
  ];

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams(filters);
      const response = await fetch(
        `http://localhost:8080/api/products?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch products');

      const data = await response.json();
      setProducts(data.products);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/products/${productId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to delete product');

      setProducts(prevProducts => 
        prevProducts.filter(product => product._id !== productId)
      );
      setShowDeleteModal(false);
      setSelectedProduct(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      active: { color: 'success', label: 'Active', labelUrdu: 'فعال' },
      draft: { color: 'warning', label: 'Draft', labelUrdu: 'ڈرافٹ' },
      outOfStock: { color: 'failure', label: 'Out of Stock', labelUrdu: 'ناموجود' }
    };

    const statusInfo = statusMap[status] || statusMap.draft;
    return (
      <Badge color={statusInfo.color}>
        {language === 'ur' ? statusInfo.labelUrdu : statusInfo.label}
      </Badge>
    );
  };

  return (
    <div className="p-4">
      <Card>
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {language === 'ur' ? 'مصنوعات' : 'Products'}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {language === 'ur' 
                ? 'اپنی دستکاری مصنوعات کا انتظام کریں'
                : 'Manage your artisanal products'}
            </p>
          </div>
          <Button
            as={Link}
            to="/dashboard/products/add"
            gradientDuoTone="purpleToBlue"
          >
            <HiPlus className="w-5 h-5 mr-2" />
            {language === 'ur' ? 'نئی مصنوعات' : 'New Product'}
          </Button>
        </div>

        {/* Filters */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <TextInput
            icon={HiSearch}
            placeholder={language === 'ur' ? 'مصنوعات تلاش کریں...' : 'Search products...'}
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
          <Select
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
          >
            <option value="">
              {language === 'ur' ? 'تمام زمرے' : 'All Categories'}
            </option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {language === 'ur' ? category.nameUrdu : category.name}
              </option>
            ))}
          </Select>
          <Select
            value={filters.craftType}
            onChange={(e) => setFilters(prev => ({ ...prev, craftType: e.target.value }))}
          >
            <option value="">
              {language === 'ur' ? 'تمام دستکاری اقسام' : 'All Craft Types'}
            </option>
            {craftTypes.map(type => (
              <option key={type.id} value={type.id}>
                {language === 'ur' ? type.nameUrdu : type.name}
              </option>
            ))}
          </Select>
          <Select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          >
            <option value="">
              {language === 'ur' ? 'تمام حالات' : 'All Status'}
            </option>
            <option value="active">
              {language === 'ur' ? 'فعال' : 'Active'}
            </option>
            <option value="draft">
              {language === 'ur' ? 'ڈرافٹ' : 'Draft'}
            </option>
            <option value="outOfStock">
              {language === 'ur' ? 'ناموجود' : 'Out of Stock'}
            </option>
          </Select>
        </div>

        {error && (
          <Alert color="failure" className="mb-4">
            {error}
          </Alert>
        )}

        {/* Products Table */}
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>
              {language === 'ur' ? 'تصویر' : 'Image'}
            </Table.HeadCell>
            <Table.HeadCell>
              {language === 'ur' ? 'نام' : 'Name'}
            </Table.HeadCell>
            <Table.HeadCell>
              {language === 'ur' ? 'زمرہ' : 'Category'}
            </Table.HeadCell>
            <Table.HeadCell>
              {language === 'ur' ? 'قیمت' : 'Price'}
            </Table.HeadCell>
            <Table.HeadCell>
              {language === 'ur' ? 'اسٹاک' : 'Stock'}
            </Table.HeadCell>
            <Table.HeadCell>
              {language === 'ur' ? 'حالت' : 'Status'}
            </Table.HeadCell>
            <Table.HeadCell>
              {language === 'ur' ? 'اقدامات' : 'Actions'}
            </Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {products.map((product) => (
              <Table.Row key={product._id}>
                <Table.Cell>
                  <img
                    src={product.images[0]}
                    alt={language === 'ur' ? product.nameUrdu : product.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                </Table.Cell>
                <Table.Cell>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {language === 'ur' ? product.nameUrdu : product.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {product.artisanId?.name}
                    </p>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  {language === 'ur' 
                    ? categories.find(c => c.id === product.category)?.nameUrdu 
                    : categories.find(c => c.id === product.category)?.name}
                </Table.Cell>
                <Table.Cell>
                  Rs. {product.price.toLocaleString()}
                </Table.Cell>
                <Table.Cell>
                  {product.stock}
                </Table.Cell>
                <Table.Cell>
                  {getStatusBadge(product.status)}
                </Table.Cell>
                <Table.Cell>
                  <div className="flex gap-2">
                    <Button
                      color="gray"
                      size="sm"
                      as={Link}
                      to={`/dashboard/products/edit/${product._id}`}
                    >
                      <HiPencil className="w-4 h-4" />
                    </Button>
                    <Button
                      color="failure"
                      size="sm"
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowDeleteModal(true);
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
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      >
        <Modal.Header>
          {language === 'ur' ? 'مصنوعات کو حذف کریں' : 'Delete Product'}
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <HiExclamation className="w-12 h-12 text-red-500 mx-auto" />
            <p className="text-center text-gray-600 dark:text-gray-400">
              {language === 'ur'
                ? 'کیا آپ واقعی اس مصنوعات کو حذف کرنا چاہتے ہیں؟'
                : 'Are you sure you want to delete this product?'}
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            color="gray"
            onClick={() => setShowDeleteModal(false)}
          >
            {language === 'ur' ? 'منسوخ کریں' : 'Cancel'}
          </Button>
          <Button
            color="failure"
            onClick={() => selectedProduct && handleDelete(selectedProduct._id)}
          >
            {language === 'ur' ? 'حذف کریں' : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DashProducts;