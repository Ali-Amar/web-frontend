import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Table,
  Button,
  Card,
  Badge,
  TextInput,
  Select,
  Modal,
  Alert,
  Progress,
  Label
} from 'flowbite-react';
import { Link } from 'react-router-dom';
import {
  HiPlus,
  HiSearch,
  HiFilter,
  HiPencil,
  HiTrash,
  HiUserGroup,
  HiLocationMarker,
  HiCalendar,
  HiClock,
  HiExclamation
} from 'react-icons/hi';

const NGOPrograms = () => {
  const { currentUser, accessToken } = useSelector((state) => state.user);
  const { language } = useSelector((state) => state.language) || 'en';

  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    type: '',
    location: ''
  });

  const [formData, setFormData] = useState({
    name: '',
    nameUrdu: '',
    description: '',
    descriptionUrdu: '',
    type: '',
    location: '',
    locationUrdu: '',
    startDate: '',
    endDate: '',
    capacity: '',
    status: 'planned'
  });

  // Program types
  const programTypes = [
    { value: 'skillDevelopment', label: 'Skill Development', labelUrdu: 'مہارت کی ترقی' },
    { value: 'businessTraining', label: 'Business Training', labelUrdu: 'کاروباری تربیت' },
    { value: 'financialLiteracy', label: 'Financial Literacy', labelUrdu: 'مالی خواندگی' },
    { value: 'digitalSkills', label: 'Digital Skills', labelUrdu: 'ڈیجیٹل مہارتیں' },
    { value: 'entrepreneurship', label: 'Entrepreneurship', labelUrdu: 'کاروباری صلاحیت' }
  ];

  useEffect(() => {
    fetchPrograms();
  }, [filters]);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams(filters);
      const response = await fetch(
        `http://localhost:8080/api/ngo/programs?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch programs');

      const data = await response.json();
      setPrograms(data.programs);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProgram = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        'http://localhost:8080/api/ngo/programs',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify(formData)
        }
      );

      if (!response.ok) throw new Error('Failed to create program');

      const data = await response.json();
      setPrograms(prev => [data.program, ...prev]);
      setShowCreateModal(false);
      setFormData({
        name: '',
        nameUrdu: '',
        description: '',
        descriptionUrdu: '',
        type: '',
        location: '',
        locationUrdu: '',
        startDate: '',
        endDate: '',
        capacity: '',
        status: 'planned'
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteProgram = async (programId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/ngo/programs/${programId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to delete program');

      setPrograms(prevPrograms => 
        prevPrograms.filter(program => program._id !== programId)
      );
      setShowDeleteModal(false);
      setSelectedProgram(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      planned: { color: 'info', label: 'Planned', labelUrdu: 'منصوبہ بند' },
      active: { color: 'success', label: 'Active', labelUrdu: 'فعال' },
      completed: { color: 'warning', label: 'Completed', labelUrdu: 'مکمل' },
      cancelled: { color: 'failure', label: 'Cancelled', labelUrdu: 'منسوخ' }
    };

    const statusInfo = statusMap[status] || statusMap.planned;
    return (
      <Badge color={statusInfo.color}>
        {language === 'ur' ? statusInfo.labelUrdu : statusInfo.label}
      </Badge>
    );
  };

  const renderCreateProgramForm = () => (
    <form onSubmit={handleCreateProgram} className="space-y-6">
      {/* Program Name */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">
            {language === 'ur' ? 'پروگرام کا نام (انگریزی)' : 'Program Name (English)'}
          </Label>
          <TextInput
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="nameUrdu">
            {language === 'ur' ? 'پروگرام کا نام (اردو)' : 'Program Name (Urdu)'}
          </Label>
          <TextInput
            id="nameUrdu"
            value={formData.nameUrdu}
            onChange={(e) => setFormData(prev => ({ ...prev, nameUrdu: e.target.value }))}
            required
            dir="rtl"
          />
        </div>
      </div>

      {/* Description */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="description">
            {language === 'ur' ? 'تفصیل (انگریزی)' : 'Description (English)'}
          </Label>
          <TextInput
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="descriptionUrdu">
            {language === 'ur' ? 'تفصیل (اردو)' : 'Description (Urdu)'}
          </Label>
          <TextInput
            id="descriptionUrdu"
            value={formData.descriptionUrdu}
            onChange={(e) => setFormData(prev => ({ ...prev, descriptionUrdu: e.target.value }))}
            required
            dir="rtl"
          />
        </div>
      </div>

      {/* Type and Capacity */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">
            {language === 'ur' ? 'پروگرام کی قسم' : 'Program Type'}
          </Label>
          <Select
            id="type"
            value={formData.type}
            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
            required
          >
            <option value="">
              {language === 'ur' ? 'قسم منتخب کریں' : 'Select Type'}
            </option>
            {programTypes.map(type => (
              <option key={type.value} value={type.value}>
                {language === 'ur' ? type.labelUrdu : type.label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="capacity">
            {language === 'ur' ? 'گنجائش' : 'Capacity'}
          </Label>
          <TextInput
            id="capacity"
            type="number"
            value={formData.capacity}
            onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
            required
            min="1"
          />
        </div>
      </div>

      {/* Location */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="location">
            {language === 'ur' ? 'مقام (انگریزی)' : 'Location (English)'}
          </Label>
          <TextInput
            id="location"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="locationUrdu">
            {language === 'ur' ? 'مقام (اردو)' : 'Location (Urdu)'}
          </Label>
          <TextInput
            id="locationUrdu"
            value={formData.locationUrdu}
            onChange={(e) => setFormData(prev => ({ ...prev, locationUrdu: e.target.value }))}
            required
            dir="rtl"
          />
        </div>
      </div>

      {/* Dates */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate">
            {language === 'ur' ? 'شروع کی تاریخ' : 'Start Date'}
          </Label>
          <TextInput
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="endDate">
            {language === 'ur' ? 'اختتامی تاریخ' : 'End Date'}
          </Label>
          <TextInput
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
            required
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-4">
        <Button
          color="gray"
          onClick={() => setShowCreateModal(false)}
        >
          {language === 'ur' ? 'منسوخ کریں' : 'Cancel'}
        </Button>
        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
        >
          {language === 'ur' ? 'پروگرام شامل کریں' : 'Add Program'}
        </Button>
      </div>
    </form>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Card>
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {language === 'ur' ? 'پروگرامز' : 'Programs'}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {language === 'ur' 
                ? 'خواتین کارآفرینوں کے لیے پروگرامز کا انتظام کریں'
                : 'Manage programs for women entrepreneurs'}
            </p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            gradientDuoTone="purpleToBlue"
          >
            <HiPlus className="w-5 h-5 mr-2" />
            {language === 'ur' ? 'نیا پروگرام' : 'New Program'}
          </Button>
        </div>

        {/* Filters */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <TextInput
            icon={HiSearch}
            placeholder={language === 'ur' ? 'پروگرام تلاش کریں...' : 'Search programs...'}
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
            {programTypes.map(type => (
              <option key={type.value} value={type.value}>
                {language === 'ur' ? type.labelUrdu : type.label}
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
            <option value="planned">
              {language === 'ur' ? 'منصوبہ بند' : 'Planned'}
            </option>
            <option value="active">
              {language === 'ur' ? 'فعال' : 'Active'}
            </option>
            <option value="completed">
              {language === 'ur' ? 'مکمل' : 'Completed'}
            </option>
            <option value="cancelled">
              {language === 'ur' ? 'منسوخ' : 'Cancelled'}
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
          <Alert color="failure" className="mb-4">
            {error}
          </Alert>
        )}

        {/* Programs Table */}
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>
              {language === 'ur' ? 'نام' : 'Name'}
            </Table.HeadCell>
            <Table.HeadCell>
              {language === 'ur' ? 'قسم' : 'Type'}
            </Table.HeadCell>
            <Table.HeadCell>
              {language === 'ur' ? 'مقام' : 'Location'}
            </Table.HeadCell>
            <Table.HeadCell>
              {language === 'ur' ? 'تاریخ' : 'Date'}
            </Table.HeadCell>
            <Table.HeadCell>
              {language === 'ur' ? 'شرکاء' : 'Participants'}
            </Table.HeadCell>
            <Table.HeadCell>
              {language === 'ur' ? 'حالت' : 'Status'}
            </Table.HeadCell>
            <Table.HeadCell>
              {language === 'ur' ? 'اقدامات' : 'Actions'}
            </Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {programs.map((program) => (
              <Table.Row key={program._id}>
                <Table.Cell>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {language === 'ur' ? program.nameUrdu : program.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {program.organizer}
                    </p>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  {language === 'ur' 
                    ? programTypes.find(t => t.value === program.type)?.labelUrdu 
                    : programTypes.find(t => t.value === program.type)?.label}
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center">
                    <HiLocationMarker className="w-4 h-4 mr-1 text-gray-400" />
                    {language === 'ur' ? program.locationUrdu : program.location}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className="space-y-1">
                    <div className="text-sm">
                      <HiCalendar className="w-4 h-4 inline mr-1 text-gray-400" />
                      {new Date(program.startDate).toLocaleDateString()}
                    </div>
                    <div className="text-sm">
                      <HiClock className="w-4 h-4 inline mr-1 text-gray-400" />
                      {new Date(program.endDate).toLocaleDateString()}
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <HiUserGroup className="w-4 h-4 text-gray-400" />
                      <span>{program.participants?.length} / {program.capacity}</span>
                    </div>
                    <Progress
                      progress={(program.participants?.length / program.capacity) * 100}
                      size="sm"
                      color="purple"
                    />
                  </div>
                </Table.Cell>
                <Table.Cell>
                  {getStatusBadge(program.status)}
                </Table.Cell>
                <Table.Cell>
                  <div className="flex gap-2">
                    <Button
                      color="gray"
                      size="sm"
                      as={Link}
                      to={`/ngo/programs/${program._id}`}
                    >
                      <HiPencil className="w-4 h-4" />
                    </Button>
                    <Button
                      color="failure"
                      size="sm"
                      onClick={() => {
                        setSelectedProgram(program);
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

        {programs.length === 0 && !loading && (
          <div className="text-center py-4">
            <p className="text-gray-500 dark:text-gray-400">
              {language === 'ur' ? 'کوئی پروگرام نہیں ملا' : 'No programs found'}
            </p>
          </div>
        )}
      </Card>

      {/* Create Program Modal */}
      <Modal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        size="xl"
      >
        <Modal.Header>
          {language === 'ur' ? 'نیا پروگرام شامل کریں' : 'Add New Program'}
        </Modal.Header>
        <Modal.Body>
          {renderCreateProgramForm()}
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        size="md"
      >
        <Modal.Header>
          {language === 'ur' ? 'پروگرام کو حذف کریں' : 'Delete Program'}
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <HiExclamation className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              {language === 'ur'
                ? 'کیا آپ واقعی اس پروگرام کو حذف کرنا چاہتے ہیں؟'
                : 'Are you sure you want to delete this program?'}
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="gray"
                onClick={() => setShowDeleteModal(false)}
              >
                {language === 'ur' ? 'منسوخ کریں' : 'Cancel'}
              </Button>
              <Button
                color="failure"
                onClick={() => selectedProgram && handleDeleteProgram(selectedProgram._id)}
              >
                {language === 'ur' ? 'حذف کریں' : 'Delete'}
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default NGOPrograms;