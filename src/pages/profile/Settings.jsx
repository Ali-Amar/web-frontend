import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  Button,
  Alert,
  ToggleSwitch,
  Select,
  Modal,
  TextInput
} from 'flowbite-react';
import {
  HiCog,
  HiGlobe,
  HiMoon,
  HiKey,
  HiShieldCheck,
  HiTrash,
  HiExclamationCircle,
  HiCheck,
  HiBell
} from 'react-icons/hi';
import Input from '../../components/common/Input';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { updateStart, updateSuccess, updateFailure, signOut } from '../../features/auth/authSlice';
import { toggleTheme } from '../../features/theme/themeSlice';

const Settings = () => {
  const dispatch = useDispatch();
  const { currentUser, loading, error, accessToken } = useSelector(state => state.user);
  const { theme } = useSelector(state => state.theme);
  const {language} = useSelector(state => state.language) || 'en';

  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    orderUpdates: true,
    language: 'en',
    darkMode: theme === 'dark',
    twoFactorAuth: false,
    privacyMode: false
  });

  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchUserSettings();
  }, []);

  const fetchUserSettings = async () => {
    try {
      const response = await fetch(
        'http://localhost:8080/api/users/settings',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );
      const data = await response.json();
      if (response.ok) {
        setSettings(prevSettings => ({
          ...prevSettings,
          ...data.settings
        }));
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    }
  };

  const handleSettingChange = async (setting, value) => {
    try {
      const response = await fetch(
        'http://localhost:8080/api/users/settings',
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify({ [setting]: value })
        }
      );

      if (response.ok) {
        setSettings(prev => ({ ...prev, [setting]: value }));
        if (setting === 'darkMode') {
          dispatch(toggleTheme());
        }
        setUpdateSuccess(true);
        setTimeout(() => setUpdateSuccess(false), 3000);
      }
    } catch (err) {
      dispatch(updateFailure(err.message));
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      dispatch(updateFailure(
        language === 'ur' 
          ? 'نئے پاس ورڈز مماثل نہیں ہیں'
          : 'New passwords do not match'
      ));
      return;
    }

    try {
      dispatch(updateStart());
      const response = await fetch(
        'http://localhost:8080/api/users/change-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            currentPassword: passwordForm.currentPassword,
            newPassword: passwordForm.newPassword
          })
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      dispatch(updateSuccess({ user: data.user, accessToken }));
      setUpdateSuccess(true);
      setShowPasswordModal(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err) {
      dispatch(updateFailure(err.message));
    }
  };

  const handleAccountDeletion = async () => {
    if (deleteConfirmation !== currentUser.email) return;

    try {
      const response = await fetch(
        'http://localhost:8080/api/users/delete-account',
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (response.ok) {
        dispatch(signOut());
      }
    } catch (err) {
      dispatch(updateFailure(err.message));
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Success/Error Alerts */}
      {error && (
        <Alert color="failure" className="mb-4">
          {error}
        </Alert>
      )}
      {updateSuccess && (
        <Alert color="success" icon={HiCheck} className="mb-4">
          {language === 'ur'
            ? 'ترتیبات کامیابی سے اپ ڈیٹ ہو گئیں'
            : 'Settings updated successfully'}
        </Alert>
      )}

      {/* Notifications Settings */}
      <Card className="mb-6">
        <div className="flex items-center gap-2 mb-6">
          <HiBell className="w-6 h-6 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {language === 'ur' ? 'اطلاعات' : 'Notifications'}
          </h2>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-900 dark:text-white">
                {language === 'ur' ? 'ای میل اطلاعات' : 'Email Notifications'}
              </p>
              <p className="text-sm text-gray-500">
                {language === 'ur'
                  ? 'اہم اپ ڈیٹس کے لیے ای میل وصول کریں'
                  : 'Receive emails for important updates'}
              </p>
            </div>
            <ToggleSwitch
              checked={settings.emailNotifications}
              onChange={(checked) => handleSettingChange('emailNotifications', checked)}
            />
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-900 dark:text-white">
                {language === 'ur' ? 'پش اطلاعات' : 'Push Notifications'}
              </p>
              <p className="text-sm text-gray-500">
                {language === 'ur'
                  ? 'براؤزر پش اطلاعات کو فعال کریں'
                  : 'Enable browser push notifications'}
              </p>
            </div>
            <ToggleSwitch
              checked={settings.pushNotifications}
              onChange={(checked) => handleSettingChange('pushNotifications', checked)}
            />
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-900 dark:text-white">
                {language === 'ur' ? 'آرڈر اپ ڈیٹس' : 'Order Updates'}
              </p>
              <p className="text-sm text-gray-500">
                {language === 'ur'
                  ? 'آرڈر کی حالت میں تبدیلیوں کے بارے میں مطلع کریں'
                  : 'Get notified about order status changes'}
              </p>
            </div>
            <ToggleSwitch
              checked={settings.orderUpdates}
              onChange={(checked) => handleSettingChange('orderUpdates', checked)}
            />
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-900 dark:text-white">
                {language === 'ur' ? 'مارکیٹنگ ای میلز' : 'Marketing Emails'}
              </p>
              <p className="text-sm text-gray-500">
                {language === 'ur'
                  ? 'خصوصی پیشکشوں اور پروموشنز وصول کریں'
                  : 'Receive special offers and promotions'}
              </p>
            </div>
            <ToggleSwitch
              checked={settings.marketingEmails}
              onChange={(checked) => handleSettingChange('marketingEmails', checked)}
            />
          </div>
        </div>
      </Card>

      {/* Preferences */}
      <Card className="mb-6">
        <div className="flex items-center gap-2 mb-6">
          <HiCog className="w-6 h-6 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {language === 'ur' ? 'ترجیحات' : 'Preferences'}
          </h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              {language === 'ur' ? 'زبان' : 'Language'}
            </label>
            <Select
              value={settings.language}
              onChange={(e) => handleSettingChange('language', e.target.value)}
            >
              <option value="en">English</option>
              <option value="ur">اردو</option>
            </Select>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-900 dark:text-white">
                {language === 'ur' ? 'ڈارک موڈ' : 'Dark Mode'}
              </p>
              <p className="text-sm text-gray-500">
                {language === 'ur'
                  ? 'ڈارک تھیم کو فعال کریں'
                  : 'Enable dark theme'}
              </p>
            </div>
            <ToggleSwitch
              checked={settings.darkMode}
              onChange={(checked) => handleSettingChange('darkMode', checked)}
            />
          </div>
        </div>
      </Card>

      {/* Security */}
      <Card className="mb-6">
        <div className="flex items-center gap-2 mb-6">
          <HiShieldCheck className="w-6 h-6 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {language === 'ur' ? 'سیکیورٹی' : 'Security'}
          </h2>
        </div>

        <div className="space-y-4">
          <Button
            color="gray"
            className="w-full"
            onClick={() => setShowPasswordModal(true)}
          >
            <HiKey className="w-5 h-5 mr-2" />
            {language === 'ur' ? 'پاس ورڈ تبدیل کریں' : 'Change Password'}
          </Button>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-900 dark:text-white">
                {language === 'ur' ? 'دو عنصری توثیق' : 'Two-Factor Authentication'}
              </p>
              <p className="text-sm text-gray-500">
                {language === 'ur'
                  ? 'اضافی سیکیورٹی کے لیے دو عنصری توثیق کو فعال کریں'
                  : 'Enable two-factor authentication for added security'}
              </p>
            </div>
            <ToggleSwitch
              checked={settings.twoFactorAuth}
              onChange={(checked) => handleSettingChange('twoFactorAuth', checked)}
            />
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-900 dark:text-white">
                {language === 'ur' ? 'پرائیویسی موڈ' : 'Privacy Mode'}
              </p>
              <p className="text-sm text-gray-500">
                {language === 'ur'
                  ? 'اپنی پروفائل کو صرف دوستوں کے لیے نظر آنے دیں'
                  : 'Make your profile visible only to friends'}
              </p>
            </div>
            <ToggleSwitch
              checked={settings.privacyMode}
              onChange={(checked) => handleSettingChange('privacyMode', checked)}
            />
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/50">
        <div className="flex items-center gap-2 mb-6">
          <HiExclamationCircle className="w-6 h-6 text-red-600" />
          <h2 className="text-xl font-semibold text-red-600">
            {language === 'ur' ? 'خطرناک زون' : 'Danger Zone'}
          </h2>
        </div>

        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {language === 'ur'
            ? 'اکاؤنٹ کو حذف کرنے کے بعد تمام ڈیٹا مستقل طور پر ختم ہو جائے گا'
            : 'Deleting your account will permanently remove all your data'}
        </p>

        <Button
          color="failure"
          onClick={() => setShowDeleteModal(true)}
        >
          <HiTrash className="w-5 h-5 mr-2" />
          {language === 'ur' ? 'اکاؤنٹ حذف کریں' : 'Delete Account'}
        </Button>
      </Card>

      {/* Password Change Modal */}
      <Modal
        show={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      >
        <Modal.Header>
          {language === 'ur' ? 'پاس ورڈ تبدیل کریں' : 'Change Password'}
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <Input
              type="password"
              label={language === 'ur' ? 'موجودہ پاس ورڈ' : 'Current Password'}
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm(prev => ({
                ...prev,
                currentPassword: e.target.value
              }))}
              required
            />
            <Input
              type="password"
              label={language === 'ur' ? 'نیا پاس ورڈ' : 'New Password'}
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm(prev => ({
                ...prev,
                newPassword: e.target.value
              }))}
              required
            />
            <Input
              type="password"
              label={language === 'ur' ? 'نیا پاس ورڈ دوبارہ' : 'Confirm New Password'}
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm(prev => ({
                ...prev,
                confirmPassword: e.target.value
              }))}
              required
            />
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            color="gray"
            onClick={() => setShowPasswordModal(false)}
          >
            {language === 'ur' ? 'منسوخ کریں' : 'Cancel'}
          </Button>
          <Button
            gradientDuoTone="purpleToBlue"
            onClick={handlePasswordChange}
            disabled={loading}
          >
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : (
              language === 'ur' ? 'تبدیل کریں' : 'Change Password'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      >
        <Modal.Header>
          {language === 'ur' ? 'اکاؤنٹ حذف کریں' : 'Delete Account'}
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              {language === 'ur'
                ? 'اکاؤنٹ حذف کرنے کی تصدیق کے لیے اپنا ای میل درج کریں'
                : 'Please enter your email to confirm account deletion'}
            </p>
            <Input
              type="email"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder={currentUser.email}
            />
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
            onClick={handleAccountDeletion}
            disabled={deleteConfirmation !== currentUser.email}
          >
            {language === 'ur' ? 'مستقل طور پر حذف کریں' : 'Permanently Delete'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Settings;