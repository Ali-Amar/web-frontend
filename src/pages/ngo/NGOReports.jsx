import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Card,
  Button,
  Table,
  Select,
  // DatePicker,
  Progress,
  Alert
} from 'flowbite-react';
import {
  HiDownload,
  HiChartBar,
  HiDocumentReport,
  HiUserGroup,
  HiLocationMarker,
  HiCurrencyRupee,
  HiAcademicCap,
  HiFilter
} from 'react-icons/hi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const NGOReports = () => {
  const { currentUser, accessToken } = useSelector((state) => state.user);
  const { language } = useSelector((state) => state.language) || 'en';
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState({
    summary: {
      totalParticipants: 0,
      activePrograms: 0,
      completedPrograms: 0,
      totalFunding: 0
    },
    impactMetrics: {
      businessLaunchRate: 0,
      skillsImprovement: 0,
      avgIncomeIncrease: 0,
      communityEngagement: 0
    },
    monthlyStats: [],
    programPerformance: [],
    locationData: []
  });
  
  const [filters, setFilters] = useState({
    reportType: 'summary',
    dateRange: 'month',
    programType: '',
    location: ''
  });

  useEffect(() => {
    fetchReportData();
  }, [filters]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams(filters);
      const response = await fetch(
        `http://localhost:8080/api/ngo/reports?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch report data');

      const data = await response.json();
      setReportData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async (format = 'pdf') => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/ngo/reports/download?format=${format}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to download report');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ngo-report-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {language === 'ur' ? 'رپورٹس اور تجزیہ' : 'Reports & Analytics'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {language === 'ur' 
              ? 'پروگرام کی کارکردگی اور اثرات کا جائزہ لیں'
              : 'Monitor program performance and impact'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => downloadReport('pdf')}
            gradientDuoTone="purpleToBlue"
          >
            <HiDownload className="w-5 h-5 mr-2" />
            {language === 'ur' ? 'پی ڈی ایف ڈاؤنلوڈ کریں' : 'Download PDF'}
          </Button>
          <Button
            onClick={() => downloadReport('xlsx')}
            gradientDuoTone="cyanToBlue"
          >
            <HiDownload className="w-5 h-5 mr-2" />
            {language === 'ur' ? 'ایکسل ڈاؤنلوڈ کریں' : 'Download Excel'}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <Select
              value={filters.reportType}
              onChange={(e) => setFilters(prev => ({ ...prev, reportType: e.target.value }))}
            >
              <option value="summary">
                {language === 'ur' ? 'مجموعی جائزہ' : 'Summary Report'}
              </option>
              <option value="impact">
                {language === 'ur' ? 'اثرات کی رپورٹ' : 'Impact Report'}
              </option>
              <option value="financial">
                {language === 'ur' ? 'مالی رپورٹ' : 'Financial Report'}
              </option>
              <option value="participation">
                {language === 'ur' ? 'شرکت کی رپورٹ' : 'Participation Report'}
              </option>
            </Select>
          </div>
          <div>
            <Select
              value={filters.dateRange}
              onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
            >
              <option value="month">
                {language === 'ur' ? 'مہینہ وار' : 'Monthly'}
              </option>
              <option value="quarter">
                {language === 'ur' ? 'سہ ماہی' : 'Quarterly'}
              </option>
              <option value="year">
                {language === 'ur' ? 'سالانہ' : 'Yearly'}
              </option>
            </Select>
          </div>
          <div>
            <Select
              value={filters.programType}
              onChange={(e) => setFilters(prev => ({ ...prev, programType: e.target.value }))}
            >
              <option value="">
                {language === 'ur' ? 'تمام پروگرام' : 'All Programs'}
              </option>
              {/* Add program type options */}
            </Select>
          </div>
          <div>
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
        </div>
      </Card>

      {error && (
        <Alert color="failure">
          {error}
        </Alert>
      )}

      {/* Summary Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                {language === 'ur' ? 'کل شرکاء' : 'Total Participants'}
              </p>
              <h3 className="text-xl font-bold">
                {reportData.summary.totalParticipants}
              </h3>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <HiUserGroup className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                {language === 'ur' ? 'فعال پروگرامز' : 'Active Programs'}
              </p>
              <h3 className="text-xl font-bold">
                {reportData.summary.activePrograms}
              </h3>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <HiAcademicCap className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                {language === 'ur' ? 'مکمل پروگرامز' : 'Completed Programs'}
              </p>
              <h3 className="text-xl font-bold">
                {reportData.summary.completedPrograms}
              </h3>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <HiDocumentReport className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                {language === 'ur' ? 'کل فنڈنگ' : 'Total Funding'}
              </p>
              <h3 className="text-xl font-bold">
                Rs. {reportData.summary.totalFunding.toLocaleString()}
              </h3>
            </div>
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <HiCurrencyRupee className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Impact Metrics */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">
          {language === 'ur' ? 'اثرات کی پیمائش' : 'Impact Metrics'}
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">
                {language === 'ur' ? 'کاروبار شروع کرنے کی شرح' : 'Business Launch Rate'}
              </span>
              <span className="text-sm font-semibold">
                {reportData.impactMetrics.businessLaunchRate}%
              </span>
            </div>
            <Progress
              progress={reportData.impactMetrics.businessLaunchRate}
              size="lg"
              color="blue"
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">
                {language === 'ur' ? 'مہارتوں میں بہتری' : 'Skills Improvement'}
              </span>
              <span className="text-sm font-semibold">
                {reportData.impactMetrics.skillsImprovement}%
              </span>
            </div>
            <Progress
              progress={reportData.impactMetrics.skillsImprovement}
              size="lg"
              color="purple"
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">
                {language === 'ur' ? 'اوسط آمدنی میں اضافہ' : 'Avg. Income Increase'}
              </span>
              <span className="text-sm font-semibold">
                {reportData.impactMetrics.avgIncomeIncrease}%
              </span>
            </div>
            <Progress
              progress={reportData.impactMetrics.avgIncomeIncrease}
              size="lg"
              color="green"
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">
                {language === 'ur' ? 'کمیونٹی مشغولیت' : 'Community Engagement'}
              </span>
              <span className="text-sm font-semibold">
                {reportData.impactMetrics.communityEngagement}%
              </span>
            </div>
            <Progress
              progress={reportData.impactMetrics.communityEngagement}
              size="lg"
              color="yellow"
            />
          </div>
        </div>
      </Card>

      {/* Trends Chart */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">
          {language === 'ur' ? 'ماہانہ رجحانات' : 'Monthly Trends'}
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={reportData.monthlyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="participants"
                stroke="#6366f1"
                name={language === 'ur' ? 'شرکاء' : 'Participants'}
              />
              <Line
                type="monotone"
                dataKey="programsStarted"
                stroke="#8b5cf6"
                name={language === 'ur' ? 'نئے پروگرام' : 'New Programs'}
              />
              <Line
                type="monotone"
                dataKey="successRate"
                stroke="#10b981"
                name={language === 'ur' ? 'کامیابی کی شرح' : 'Success Rate'}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Location Performance */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">
          {language === 'ur' ? 'مقامی کارکردگی' : 'Location Performance'}
        </h3>
        <div className="overflow-x-auto">
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>
                {language === 'ur' ? 'مقام' : 'Location'}
              </Table.HeadCell>
              <Table.HeadCell>
                {language === 'ur' ? 'فعال پروگرام' : 'Active Programs'}
              </Table.HeadCell>
              <Table.HeadCell>
                {language === 'ur' ? 'کل شرکاء' : 'Total Participants'}
              </Table.HeadCell>
              <Table.HeadCell>
                {language === 'ur' ? 'کامیابی کی شرح' : 'Success Rate'}
              </Table.HeadCell>
              <Table.HeadCell>
                {language === 'ur' ? 'اوسط حاضری' : 'Avg. Attendance'}
              </Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {reportData.locationData.map((location) => (
                <Table.Row key={location.id}>
                  <Table.Cell>
                    <div className="flex items-center">
                      <HiLocationMarker className="w-4 h-4 mr-2 text-gray-400" />
                      {language === 'ur' ? location.nameUrdu : location.name}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    {location.activePrograms}
                  </Table.Cell>
                  <Table.Cell>
                    {location.totalParticipants}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-2">
                      <span>{location.successRate}%</span>
                      <Progress
                        progress={location.successRate}
                        size="sm"
                        color={location.successRate >= 75 ? 'success' : 'warning'}
                        className="w-16"
                      />
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    {location.avgAttendance}%
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </Card>

      {/* Program Performance Breakdown */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">
          {language === 'ur' ? 'پروگرام کی کارکردگی کا جائزہ' : 'Program Performance Breakdown'}
        </h3>
        <div className="overflow-x-auto">
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>
                {language === 'ur' ? 'پروگرام' : 'Program'}
              </Table.HeadCell>
              <Table.HeadCell>
                {language === 'ur' ? 'قسم' : 'Type'}
              </Table.HeadCell>
              <Table.HeadCell>
                {language === 'ur' ? 'مدت' : 'Duration'}
              </Table.HeadCell>
              <Table.HeadCell>
                {language === 'ur' ? 'شرکاء' : 'Participants'}
              </Table.HeadCell>
              <Table.HeadCell>
                {language === 'ur' ? 'کامیابی' : 'Success'}
              </Table.HeadCell>
              <Table.HeadCell>
                {language === 'ur' ? 'لاگت' : 'Cost'}
              </Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {reportData.programPerformance.map((program) => (
                <Table.Row key={program.id}>
                  <Table.Cell>
                    <div>
                      <p className="font-medium">
                        {language === 'ur' ? program.nameUrdu : program.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {language === 'ur' ? program.statusUrdu : program.status}
                      </p>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    {language === 'ur' ? program.typeUrdu : program.type}
                  </Table.Cell>
                  <Table.Cell>
                    {program.duration} {language === 'ur' ? 'دن' : 'days'}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="space-y-1">
                      <div className="text-sm">
                        {program.currentParticipants} / {program.targetParticipants}
                      </div>
                      <Progress
                        progress={(program.currentParticipants / program.targetParticipants) * 100}
                        size="sm"
                        color="purple"
                      />
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="space-y-1">
                      <div className="text-sm">
                        {program.successRate}%
                      </div>
                      <Progress
                        progress={program.successRate}
                        size="sm"
                        color={program.successRate >= 75 ? 'success' : 'warning'}
                      />
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    Rs. {program.cost.toLocaleString()}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default NGOReports;