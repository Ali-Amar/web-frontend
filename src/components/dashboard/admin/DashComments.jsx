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
  Alert,
  Avatar
} from 'flowbite-react';
import {
  HiSearch,
  HiFilter,
  HiCheck,
  HiBan,
  HiExclamation,
  HiEye,
  HiTrash,
  HiFlag
} from 'react-icons/hi';

const DashComments = () => {
  const { language } = useSelector((state) => state.language) || 'en';
  const { accessToken } = useSelector((state) => state.user);

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedComment, setSelectedComment] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    status: '',
    reportStatus: ''
  });

  // Fetch comments data
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams(filters);
        const response = await fetch(
          `http://localhost:8080/api/admin/comments?${queryParams}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        );

        if (!response.ok) throw new Error('Failed to fetch comments');

        const data = await response.json();
        setComments(data.comments);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [filters, accessToken]);

  // Handle comment status change
  const handleStatusChange = async (commentId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/admin/comments/${commentId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify({ status: newStatus })
        }
      );

      if (!response.ok) throw new Error('Failed to update comment status');

      setComments(prevComments =>
        prevComments.map(comment =>
          comment._id === commentId ? { ...comment, status: newStatus } : comment
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle comment deletion
  const handleDelete = async (commentId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/admin/comments/${commentId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to delete comment');

      setComments(prevComments => 
        prevComments.filter(comment => comment._id !== commentId)
      );
      setShowDeleteModal(false);
      setSelectedComment(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      approved: 'success',
      pending: 'warning',
      rejected: 'failure'
    };

    const statusTranslations = {
      approved: { en: 'Approved', ur: 'منظور شدہ' },
      pending: { en: 'Pending', ur: 'زیر التواء' },
      rejected: { en: 'Rejected', ur: 'مسترد' }
    };

    return (
      <Badge color={statusColors[status] || 'gray'}>
        {language === 'ur' ? statusTranslations[status]?.ur : statusTranslations[status]?.en}
      </Badge>
    );
  };

  const getReportBadge = (reportCount) => {
    let color = 'gray';
    if (reportCount > 10) color = 'failure';
    else if (reportCount > 5) color = 'warning';

    return (
      <Badge color={color}>
        <div className="flex items-center gap-1">
          <HiFlag className="w-3 h-3" />
          <span>{reportCount}</span>
        </div>
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
              {language === 'ur' ? 'تبصرے' : 'Comments'}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {language === 'ur' 
                ? 'تمام تبصروں کا انتظام کریں'
                : 'Manage all comments and reviews'}
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
            value={filters.type}
            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
          >
            <option value="">
              {language === 'ur' ? 'تمام اقسام' : 'All Types'}
            </option>
            <option value="product">
              {language === 'ur' ? 'مصنوعات' : 'Product'}
            </option>
            <option value="post">
              {language === 'ur' ? 'پوسٹ' : 'Post'}
            </option>
          </Select>
          <Select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          >
            <option value="">
              {language === 'ur' ? 'تمام حالات' : 'All Status'}
            </option>
            <option value="approved">
              {language === 'ur' ? 'منظور شدہ' : 'Approved'}
            </option>
            <option value="pending">
              {language === 'ur' ? 'زیر التواء' : 'Pending'}
            </option>
            <option value="rejected">
              {language === 'ur' ? 'مسترد' : 'Rejected'}
            </option>
          </Select>
          <Select
            value={filters.reportStatus}
            onChange={(e) => setFilters(prev => ({ ...prev, reportStatus: e.target.value }))}
          >
            <option value="">
              {language === 'ur' ? 'تمام رپورٹس' : 'All Reports'}
            </option>
            <option value="reported">
              {language === 'ur' ? 'رپورٹ شدہ' : 'Reported'}
            </option>
            <option value="flagged">
              {language === 'ur' ? 'نشان زد' : 'Flagged'}
            </option>
          </Select>
        </div>

        {error && (
          <Alert color="failure" icon={HiExclamation} className="mb-4">
            {error}
          </Alert>
        )}

        {/* Comments Table */}
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>
              {language === 'ur' ? 'صارف' : 'User'}
            </Table.HeadCell>
            <Table.HeadCell>
              {language === 'ur' ? 'تبصرہ' : 'Comment'}
            </Table.HeadCell>
            <Table.HeadCell>
              {language === 'ur' ? 'قسم' : 'Type'}
            </Table.HeadCell>
            <Table.HeadCell>
              {language === 'ur' ? 'تاریخ' : 'Date'}
            </Table.HeadCell>
            <Table.HeadCell>
              {language === 'ur' ? 'رپورٹس' : 'Reports'}
            </Table.HeadCell>
            <Table.HeadCell>
              {language === 'ur' ? 'حالت' : 'Status'}
            </Table.HeadCell>
            <Table.HeadCell>
              {language === 'ur' ? 'اقدامات' : 'Actions'}
            </Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {comments.map((comment) => (
              <Table.Row key={comment._id}>
                <Table.Cell>
                  <div className="flex items-center gap-3">
                    <Avatar
                      img={comment.user.avatar}
                      alt={comment.user.name}
                      size="sm"
                      rounded
                    />
                    <span className="font-medium">
                      {comment.user.name}
                    </span>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <p className="line-clamp-2">
                    {comment.content}
                  </p>
                </Table.Cell>
                <Table.Cell>
                  <Badge color={comment.type === 'product' ? 'blue' : 'purple'}>
                    {comment.type}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  {new Date(comment.createdAt).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>
                  {getReportBadge(comment.reportCount)}
                </Table.Cell>
                <Table.Cell>
                  {getStatusBadge(comment.status)}
                </Table.Cell>
                <Table.Cell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      color="gray"
                      onClick={() => {
                        setSelectedComment(comment);
                        setShowViewModal(true);
                      }}
                    >
                      <HiEye className="w-4 h-4" />
                    </Button>
                    {comment.status === 'pending' && (
                      <Button
                        size="sm"
                        color="success"
                        onClick={() => handleStatusChange(comment._id, 'approved')}
                      >
                        <HiCheck className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      color="failure"
                      onClick={() => {
                        setSelectedComment(comment);
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

      {/* View Comment Modal */}
      <Modal
        show={showViewModal}
        onClose={() => setShowViewModal(false)}
        size="xl"
      >
        <Modal.Header>
          {language === 'ur' ? 'تبصرہ کی تفصیلات' : 'Comment Details'}
        </Modal.Header>
        <Modal.Body>
          {selectedComment && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar
                  img={selectedComment.user.avatar}
                  alt={selectedComment.user.name}
                  size="lg"
                  rounded
                />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {selectedComment.user.name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {new Date(selectedComment.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                {selectedComment.content}
              </p>
              {selectedComment.reports?.length > 0 && (
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                  <h5 className="font-medium text-red-600 dark:text-red-400 mb-2">
                    {language === 'ur' ? 'رپورٹس' : 'Reports'}
                  </h5>
                  <ul className="space-y-2">
                    {selectedComment.reports.map((report, index) => (
                      <li key={index} className="text-sm text-red-500">
                        {report.reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            color="gray"
            onClick={() => setShowViewModal(false)}
          >
            {language === 'ur' ? 'بند کریں' : 'Close'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      >
        <Modal.Header>
          {language === 'ur' ? 'تبصرہ حذف کریں' : 'Delete Comment'}
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <HiExclamation className="mx-auto mb-4 h-14 w-14 text-red-600" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              {language === 'ur'
                ? 'کیا آپ واقعی اس تبصرے کو حذف کرنا چاہتے ہیں؟'
                : 'Are you sure you want to delete this comment?'}
            </h3>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            color="failure"
            onClick={() => selectedComment && handleDelete(selectedComment._id)}
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

export default DashComments;