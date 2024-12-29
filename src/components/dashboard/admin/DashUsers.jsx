import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Table,
  Button,
  Card,
  TextInput,
  Select,
  Badge,
  Modal,
  Alert
} from 'flowbite-react';
import {
  HiSearch,
  HiFilter,
  HiUserCircle,
  HiMail,
  HiPhone,
  HiLocationMarker,
  HiCheck,
  HiBan,
  HiExclamation
} from 'react-icons/hi';

const DashUsers = () => {
  const { language } = useSelector((state) => state.language) || 'en';
  const { accessToken } = useSelector((state) => state.user);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    status: '',
    location: ''
  });

  // Fetch users data
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams(filters);
        const response = await fetch(
          `http://localhost:8080/api/admin/users?${queryParams}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        );

        if (!response.ok) throw new Error('Failed to fetch users');

        const data = await response.json();
        setUsers(data.users);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [filters, accessToken]);

  // Handle user status change
  const handleStatusChange = async (userId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/admin/users/${userId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify({ status: newStatus })
        }
      );

      if (!response.ok) throw new Error('Failed to update user status');

      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === userId ? { ...user, status: newStatus } : user
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle user deletion
  const handleDelete = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/admin/users/${userId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to delete user');

      setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
      setShowDeleteModal(false);
      setSelectedUser(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const getRoleBadge = (role) => {
    const roleColors = {
      admin: 'purple',
      seller: 'blue',
      mentor: 'green',
      ngo: 'yellow',
      buyer: 'gray'
    };

    const roleTranslations = {
      admin: { en: 'Admin', ur: 'ایڈمن' },
      seller: { en: 'Seller', ur: 'فروخت کنندہ' },
      mentor: { en: 'Mentor', ur: 'رہنما' },
      ngo: { en: 'NGO', ur: 'این جی او' },
      buyer: { en: 'Buyer', ur: 'خریدار' }
    };

    return (
      <Badge color={roleColors[role] || 'gray'}>
        {language === 'ur' ? roleTranslations[role]?.ur : roleTranslations[role]?.en}
      </Badge>
    );
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      active: 'success',
      pending: 'warning',
      suspended: 'failure'
    };

    const statusTranslations = {
      active: { en: 'Active', ur: 'فعال' },
      pending: { en: 'Pending', ur: 'زیر التواء' },
      suspended: { en: 'Suspended', ur: 'معطل' }
    };

    return (
      <Badge color={statusColors[status] || 'gray'}>
        {language === 'ur' ? statusTranslations[status]?.ur : statusTranslations[status]?.en}
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
              {language === 'ur' ? 'صارفین' : 'Users'}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {language === 'ur' 
                ? 'تمام صارفین کا انتظام کریں'
                : 'Manage all users'}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <TextInput
            icon={HiSearch}
            placeholder={language === 'ur' ? 'تلاش کریں...' : 'Search...'}
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
          <Select
            value={filters.role}
            onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
          >
            <option value="">
              {language === 'ur' ? 'تمام کردار' : 'All Roles'}
            </option>
            <option value="seller">
              {language === 'ur' ? 'فروخت کنندہ' : 'Seller'}
            </option>
            <option value="mentor">
              {language === 'ur' ? 'رہنما' : 'Mentor'}
            </option>
            <option value="ngo">
              {language === 'ur' ? 'این جی او' : 'NGO'}
            </option>
            <option value="buyer">
              {language === 'ur' ? 'خریدار' : 'Buyer'}
            </option>
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
            <option value="pending">
              {language === 'ur' ? 'زیر التواء' : 'Pending'}
            </option>
            <option value="suspended">
              {language === 'ur' ? 'معطل' : 'Suspended'}
            </option>
          </Select>
          <Select
            value={filters.location}
            onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
          >
            <option value="">
              {language === 'ur' ? 'تمام مقامات' : 'All Locations'}
            </option>
            {/* Add location options */}
          </Select>
        </div>

        {error && (
          <Alert color="failure" icon={HiExclamation} className="mb-4">
            {error}
          </Alert>
        )}

        {/* Users Table */}
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>
              {language === 'ur' ? 'صارف' : 'User'}
            </Table.HeadCell>
            <Table.HeadCell>
              {language === 'ur' ? 'کردار' : 'Role'}
            </Table.HeadCell>
            <Table.HeadCell>
              {language === 'ur' ? 'مقام' : 'Location'}
            </Table.HeadCell>
            <Table.HeadCell>
              {language === 'ur' ? 'شامل ہونے کی تاریخ' : 'Join Date'}
            </Table.HeadCell>
            <Table.HeadCell>
              {language === 'ur' ? 'حالت' : 'Status'}
            </Table.HeadCell>
            <Table.HeadCell>
              {language === 'ur' ? 'اقدامات' : 'Actions'}
            </Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {users.map((user) => (
              <Table.Row key={user._id}>
                <Table.Cell>
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {user.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  {getRoleBadge(user.role)}
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center">
                    <HiLocationMarker className="w-4 h-4 mr-1 text-gray-500" />
                    <span>{language === 'ur' ? user.locationUrdu : user.location}</span>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>
                  {getStatusBadge(user.status)}
                </Table.Cell>
                <Table.Cell>
                  <div className="flex gap-2">
                    {user.status === 'pending' && (
                      <Button
                        size="sm"
                        color="success"
                        onClick={() => handleStatusChange(user._id, 'active')}
                      >
                        <HiCheck className="w-4 h-4" />
                      </Button>
                    )}
                    {user.status === 'active' && (
                      <Button
                        size="sm"
                        color="warning"
                        onClick={() => handleStatusChange(user._id, 'suspended')}
                      >
                        <HiBan className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      color="failure"
                      onClick={() => {
                        setSelectedUser(user);
                        setShowDeleteModal(true);
                      }}
                    >
                      <HiExclamation className="w-4 h-4" />
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
          {language === 'ur' ? 'صارف کو حذف کریں' : 'Delete User'}
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <HiExclamation className="mx-auto mb-4 h-14 w-14 text-red-600" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              {language === 'ur'
                ? 'کیا آپ واقعی اس صارف کو حذف کرنا چاہتے ہیں؟'
                : 'Are you sure you want to delete this user?'}
            </h3>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            color="failure"
            onClick={() => selectedUser && handleDelete(selectedUser._id)}
          >
            {language === 'ur' ? 'حذف کریں' : 'Delete'}
          </Button>
          <Button
            color="gray"
            onClick={() => setShowDeleteModal(false)}
          >
            {language === 'ur' ? 'منسوخ کریں' : 'Cancel'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DashUsers;