import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  Button,
  ToggleSwitch,
  TextInput,
  Select,
  Alert,
  Spinner,
  Tabs
} from 'flowbite-react';
import {
  HiBell,
  HiGlobe,
  HiClock,
  HiTruck,
  HiCurrencyRupee,
  HiShieldCheck,
  HiCog,
  HiTranslate
} from 'react-icons/hi';

const Settings = () => {
  const dispatch = useDispatch();
  const { currentUser, accessToken, loading, error } = useSelector(state => state.user);
  const {language} = useSelector(state => state.language) || 'en';

  // Settings state
  const [settings, setSettings] = useState({
    businessHours: {
      monday: { open: '09:00', close: '17:00', isOpen: true },
      tuesday: { open: '09:00', close: '17:00', isOpen: true },
      wednesday: { open: '09:00', close: '17:00', isOpen: true },
      thursday: { open: '09:00', close: '17:00', isOpen: true },
      friday: { open: '09:00', close: '17:00', isOpen: true },
      saturday: { open: '09:00', close: '17:00', isOpen: true },
      sunday: { open: '09:00', close: '17:00', isOpen: false }
    },
    notifications: {
      orderUpdates: true,
      customerMessages: true,
      marketingUpdates: false,
      inventoryAlerts: true
    },
    shipping: {
      freeShippingThreshold: '1000',
      defaultShippingCost: '150',
      processingTime: '2',
      enableLocalPickup: true,
      areas: []
    },
    preferences: {
      language: 'en',
      currencyFormat: 'PKR',
      timezone: 'Asia/Karachi',
      emailNotifications: true,
      smsNotifications: true
    }
  });

  // Fetch settings on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/settings', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      
      if (data.settings) {
        setSettings(data.settings);
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    }
  };

  const handleSettingsUpdate = async (section, updates) => {
    try {
      const response = await fetch('http://localhost:8080/api/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          section,
          updates
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      // Update local settings
      setSettings(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          ...updates
        }
      }));
    } catch (err) {
      console.error('Error updating settings:', err);
    }
  };

  // Business Hours Section
  const BusinessHoursSettings = () => {
    const days = [
      { key: 'monday', label: 'Monday', labelUrdu: 'پیر' },
      { key: 'tuesday', label: 'Tuesday', labelUrdu: 'منگل' },
      { key: 'wednesday', label: 'Wednesday', labelUrdu: 'بدھ' },
      { key: 'thursday', label: 'Thursday', labelUrdu: 'جمعرات' },
      { key: 'friday', label: 'Friday', labelUrdu: 'جمعہ' },
      { key: 'saturday', label: 'Saturday', labelUrdu: 'ہفتہ' },
      { key: 'sunday', label: 'Sunday', labelUrdu: 'اتوار' }
    ];

    return (
      <Card>
        <h3 className="text-lg font-medium mb-4">
          {language === 'ur' ? 'کاروباری اوقات' : 'Business Hours'}
        </h3>
        <div className="space-y-4">
          {days.map(day => (
            <div key={day.key} className="flex items-center justify-between">
              <span className="w-32">
                {language === 'ur' ? day.labelUrdu : day.label}
              </span>
              <div className="flex items-center gap-4">
                <ToggleSwitch
                  checked={settings.businessHours[day.key].isOpen}
                  onChange={(checked) => {
                    handleSettingsUpdate('businessHours', {
                      [day.key]: {
                        ...settings.businessHours[day.key],
                        isOpen: checked
                      }
                    });
                  }}
                />
                <input
                  type="time"
                  value={settings.businessHours[day.key].open}
                  onChange={(e) => {
                    handleSettingsUpdate('businessHours', {
                      [day.key]: {
                        ...settings.businessHours[day.key],
                        open: e.target.value
                      }
                    });
                  }}
                  disabled={!settings.businessHours[day.key].isOpen}
                  className="rounded-lg text-sm"
                />
                <span>-</span>
                <input
                  type="time"
                  value={settings.businessHours[day.key].close}
                  onChange={(e) => {
                    handleSettingsUpdate('businessHours', {
                      [day.key]: {
                        ...settings.businessHours[day.key],
                        close: e.target.value
                      }
                    });
                  }}
                  disabled={!settings.businessHours[day.key].isOpen}
                  className="rounded-lg text-sm"
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  };

  // Notification Settings Section
  const NotificationSettings = () => {
    return (
      <Card>
        <h3 className="text-lg font-medium mb-4">
          {language === 'ur' ? 'نوٹیفیکیشن کی ترتیبات' : 'Notification Settings'}
        </h3>
        <div className="space-y-4">
          {[
            {
              key: 'orderUpdates',
              label: 'Order Updates',
              labelUrdu: 'آرڈر اپڈیٹس'
            },
            {
              key: 'customerMessages',
              label: 'Customer Messages',
              labelUrdu: 'گاہک کے پیغامات'
            },
            {
              key: 'marketingUpdates',
              label: 'Marketing Updates',
              labelUrdu: 'مارکیٹنگ اپڈیٹس'
            },
            {
              key: 'inventoryAlerts',
              label: 'Inventory Alerts',
              labelUrdu: 'انوینٹری الرٹس'
            }
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between">
              <span>{language === 'ur' ? item.labelUrdu : item.label}</span>
              <ToggleSwitch
                checked={settings.notifications[item.key]}
                onChange={(checked) => {
                  handleSettingsUpdate('notifications', {
                    [item.key]: checked
                  });
                }}
              />
            </div>
          ))}
        </div>
      </Card>
    );
  };

  // Shipping Settings Section
  const ShippingSettings = () => {
    return (
      <Card>
        <h3 className="text-lg font-medium mb-4">
          {language === 'ur' ? 'شپنگ کی ترتیبات' : 'Shipping Settings'}
        </h3>
        <div className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium">
              {language === 'ur' ? 'مفت شپنگ کی حد' : 'Free Shipping Threshold'}
            </label>
            <div className="flex items-center">
              <span className="mr-2">Rs.</span>
              <TextInput
                type="number"
                value={settings.shipping.freeShippingThreshold}
                onChange={(e) => {
                  handleSettingsUpdate('shipping', {
                    freeShippingThreshold: e.target.value
                  });
                }}
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              {language === 'ur' ? 'ڈیفالٹ شپنگ لاگت' : 'Default Shipping Cost'}
            </label>
            <div className="flex items-center">
              <span className="mr-2">Rs.</span>
              <TextInput
                type="number"
                value={settings.shipping.defaultShippingCost}
                onChange={(e) => {
                  handleSettingsUpdate('shipping', {
                    defaultShippingCost: e.target.value
                  });
                }}
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              {language === 'ur' ? 'پروسیسنگ ٹائم (دن)' : 'Processing Time (days)'}
            </label>
            <TextInput
              type="number"
              value={settings.shipping.processingTime}
              onChange={(e) => {
                handleSettingsUpdate('shipping', {
                  processingTime: e.target.value
                });
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <span>
              {language === 'ur' ? 'مقامی پک اپ' : 'Local Pickup'}
            </span>
            <ToggleSwitch
              checked={settings.shipping.enableLocalPickup}
              onChange={(checked) => {
                handleSettingsUpdate('shipping', {
                  enableLocalPickup: checked
                });
              }}
            />
          </div>
        </div>
      </Card>
    );
  };

  // Preferences Section
  const PreferencesSettings = () => {
    return (
      <Card>
        <h3 className="text-lg font-medium mb-4">
          {language === 'ur' ? 'ترجیحات' : 'Preferences'}
        </h3>
        <div className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium">
              {language === 'ur' ? 'زبان' : 'Language'}
            </label>
            <Select
              value={settings.preferences.language}
              onChange={(e) => {
                handleSettingsUpdate('preferences', {
                  language: e.target.value
                });
              }}
            >
              <option value="en">English</option>
              <option value="ur">اردو</option>
            </Select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              {language === 'ur' ? 'ٹائم زون' : 'Timezone'}
            </label>
            <Select
              value={settings.preferences.timezone}
              onChange={(e) => {
                handleSettingsUpdate('preferences', {
                  timezone: e.target.value
                });
              }}
            >
              <option value="Asia/Karachi">Pakistan (PKT)</option>
              {/* Add more timezones if needed */}
            </Select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              {language === 'ur' ? 'کرنسی فارمیٹ' : 'Currency Format'}
            </label>
            <Select
              value={settings.preferences.currencyFormat}
              onChange={(e) => {
                handleSettingsUpdate('preferences', {
                  currencyFormat: e.target.value
                });
              }}
            >
              <option value="PKR">PKR (Rs.)</option>
              {/* Add more currency formats if needed */}
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <span>
              {language === 'ur' ? 'ای میل نوٹیفیکیشنز' : 'Email Notifications'}
            </span>
            <ToggleSwitch
              checked={settings.preferences.emailNotifications}
              onChange={(checked) => {
                handleSettingsUpdate('preferences', {
                  emailNotifications: checked
                });
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <span>
              {language === 'ur' ? 'ایس ایم ایس نوٹیفیکیشنز' : 'SMS Notifications'}
            </span>
            <ToggleSwitch
              checked={settings.preferences.smsNotifications}
              onChange={(checked) => {
                handleSettingsUpdate('preferences', {
                  smsNotifications: checked
                });
              }}
            />
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {language === 'ur' ? 'ترتیبات' : 'Settings'}
        </h2>
      </div>

      {error && (
        <Alert color="failure">
          {error}
        </Alert>
      )}

      <Tabs.Group>
        <Tabs.Item
          title={language === 'ur' ? 'کاروباری اوقات' : 'Business Hours'}
          icon={HiClock}
        >
          <BusinessHoursSettings />
        </Tabs.Item>

        <Tabs.Item
          title={language === 'ur' ? 'نوٹیفیکیشنز' : 'Notifications'}
          icon={HiBell}
        >
          <NotificationSettings />
        </Tabs.Item>

        <Tabs.Item
          title={language === 'ur' ? 'شپنگ' : 'Shipping'}
          icon={HiTruck}
        >
          <ShippingSettings />
        </Tabs.Item>

        <Tabs.Item
          title={language === 'ur' ? 'ترجیحات' : 'Preferences'}
          icon={HiCog}
        >
          <PreferencesSettings />
        </Tabs.Item>

        <Tabs.Item
          title={language === 'ur' ? 'سیکیورٹی' : 'Security'}
          icon={HiShieldCheck}
        >
          <Card>
            <h3 className="text-lg font-medium mb-4">
              {language === 'ur' ? 'سیکیورٹی کی ترتیبات' : 'Security Settings'}
            </h3>
            <div className="space-y-6">
              {/* Password Change */}
              <div>
                <label className="block mb-2 text-sm font-medium">
                  {language === 'ur' ? 'موجودہ پاس ورڈ' : 'Current Password'}
                </label>
                <TextInput
                  type="password"
                  placeholder={language === 'ur' ? 'موجودہ پاس ورڈ درج کریں' : 'Enter current password'}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">
                  {language === 'ur' ? 'نیا پاس ورڈ' : 'New Password'}
                </label>
                <TextInput
                  type="password"
                  placeholder={language === 'ur' ? 'نیا پاس ورڈ درج کریں' : 'Enter new password'}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">
                  {language === 'ur' ? 'نئے پاس ورڈ کی تصدیق' : 'Confirm New Password'}
                </label>
                <TextInput
                  type="password"
                  placeholder={language === 'ur' ? 'نئے پاس ورڈ کی تصدیق کریں' : 'Confirm new password'}
                />
              </div>

              {/* Two Factor Authentication */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">
                    {language === 'ur' ? 'دو عنصری توثیق' : 'Two-Factor Authentication'}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {language === 'ur' 
                      ? 'اپنے اکاؤنٹ کی اضافی حفاظت کے لیے دو عنصری توثیق کو فعال کریں'  
                      : 'Enable two-factor authentication for additional account security'}
                  </p>
                </div>
                <ToggleSwitch
                  checked={false}
                  onChange={() => {}}
                />
              </div>

              <div className="pt-4">
                <Button
                  gradientDuoTone="purpleToBlue"
                  onClick={() => {}}
                >
                  {language === 'ur' ? 'تبدیلیاں محفوظ کریں' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </Card>
        </Tabs.Item>
      </Tabs.Group>

      {/* Save All Changes Button */}
      <div className="flex justify-end pt-6">
        <Button
          gradientDuoTone="purpleToBlue"
          onClick={() => {}}
          disabled={loading}
        >
          {loading ? (
            <Spinner size="sm" className="mr-2" />
          ) : null}
          {language === 'ur' ? 'تمام تبدیلیاں محفوظ کریں' : 'Save All Changes'}
        </Button>
      </div>
    </div>
  );
};

export default Settings;