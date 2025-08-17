'use client'

import { useState } from 'react'
import { Save, User, Bell, Shield, Palette } from 'lucide-react'
import AppLayout from '@/components/layout/AppLayout'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [isSaving, setIsSaving] = useState(false)

  const [profileData, setProfileData] = useState({
    name: 'أحمد محمد',
    email: 'ahmed@example.com',
    phone: '+966501234567',
    position: 'مدير المشاريع',
    company: 'شركة الإبداع التقني',
    bio: 'مدير مشاريع متخصص في إدارة المشاريع الإبداعية والتقنية'
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    taskReminders: true,
    projectUpdates: true,
    teamMessages: false,
    weeklyReports: true
  })

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: '30',
    passwordExpiry: '90'
  })

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'light',
    language: 'ar',
    dateFormat: 'dd/mm/yyyy',
    timezone: 'Asia/Riyadh'
  })

  const handleSave = async () => {
    setIsSaving(true)
    // محاكاة API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    
    // إظهار رسالة نجاح
    alert('تم حفظ الإعدادات بنجاح!')
  }

  const tabs = [
    { id: 'profile', name: 'الملف الشخصي', icon: User },
    { id: 'notifications', name: 'الإشعارات', icon: Bell },
    { id: 'security', name: 'الأمان', icon: Shield },
    { id: 'appearance', name: 'المظهر', icon: Palette },
  ]

  return (
    <AppLayout 
      title="الإعدادات"
      description="إدارة إعدادات الحساب والتفضيلات"
    >
      <div className="p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-lg text-right transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-secondary-600 hover:bg-secondary-50'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-secondary-200">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="p-8">
                  <h2 className="text-xl font-semibold text-secondary-900 mb-6">الملف الشخصي</h2>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="الاسم الكامل"
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        icon={User}
                      />
                      <Input
                        label="البريد الإلكتروني"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="رقم الهاتف"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      />
                      <Input
                        label="المنصب"
                        value={profileData.position}
                        onChange={(e) => setProfileData({...profileData, position: e.target.value})}
                      />
                    </div>

                    <Input
                      label="الشركة"
                      value={profileData.company}
                      onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                    />

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        نبذة شخصية
                      </label>
                      <textarea
                        value={profileData.bio}
                        onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                        rows={4}
                        className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-vertical"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="p-8">
                  <h2 className="text-xl font-semibold text-secondary-900 mb-6">إعدادات الإشعارات</h2>
                  
                  <div className="space-y-6">
                    {Object.entries({
                      emailNotifications: 'إشعارات البريد الإلكتروني',
                      pushNotifications: 'الإشعارات المنبثقة',
                      taskReminders: 'تذكير المهام',
                      projectUpdates: 'تحديثات المشاريع',
                      teamMessages: 'رسائل الفريق',
                      weeklyReports: 'التقارير الأسبوعية'
                    }).map(([key, label]) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                        <div>
                          <h3 className="font-medium text-secondary-900">{label}</h3>
                          <p className="text-sm text-secondary-600">
                            {key === 'emailNotifications' && 'تلقي الإشعارات عبر البريد الإلكتروني'}
                            {key === 'pushNotifications' && 'إظهار الإشعارات في المتصفح'}
                            {key === 'taskReminders' && 'تذكير بالمهام المستحقة'}
                            {key === 'projectUpdates' && 'تحديثات حول تقدم المشاريع'}
                            {key === 'teamMessages' && 'رسائل من أعضاء الفريق'}
                            {key === 'weeklyReports' && 'تقرير أسبوعي عن الإنجازات'}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={notificationSettings[key as keyof typeof notificationSettings]}
                            onChange={(e) => setNotificationSettings({
                              ...notificationSettings,
                              [key]: e.target.checked
                            })}
                          />
                          <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="p-8">
                  <h2 className="text-xl font-semibold text-secondary-900 mb-6">إعدادات الأمان</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-secondary-900">المصادقة الثنائية</h3>
                        <p className="text-sm text-secondary-600">حماية إضافية للحساب</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={securitySettings.twoFactorAuth}
                          onChange={(e) => setSecuritySettings({
                            ...securitySettings,
                            twoFactorAuth: e.target.checked
                          })}
                        />
                        <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        انتهاء الجلسة (بالدقائق)
                      </label>
                      <select
                        value={securitySettings.sessionTimeout}
                        onChange={(e) => setSecuritySettings({
                          ...securitySettings,
                          sessionTimeout: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="15">15 دقيقة</option>
                        <option value="30">30 دقيقة</option>
                        <option value="60">ساعة واحدة</option>
                        <option value="240">4 ساعات</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        انتهاء صلاحية كلمة المرور (بالأيام)
                      </label>
                      <select
                        value={securitySettings.passwordExpiry}
                        onChange={(e) => setSecuritySettings({
                          ...securitySettings,
                          passwordExpiry: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="30">30 يوم</option>
                        <option value="60">60 يوم</option>
                        <option value="90">90 يوم</option>
                        <option value="180">180 يوم</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance Tab */}
              {activeTab === 'appearance' && (
                <div className="p-8">
                  <h2 className="text-xl font-semibold text-secondary-900 mb-6">إعدادات المظهر</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        المظهر
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() => setAppearanceSettings({...appearanceSettings, theme: 'light'})}
                          className={`p-4 border-2 rounded-lg transition-all ${
                            appearanceSettings.theme === 'light'
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-secondary-200 hover:border-secondary-300'
                          }`}
                        >
                          <div className="w-full h-8 bg-white border border-secondary-200 rounded mb-2"></div>
                          <span className="text-sm font-medium">فاتح</span>
                        </button>
                        <button
                          onClick={() => setAppearanceSettings({...appearanceSettings, theme: 'dark'})}
                          className={`p-4 border-2 rounded-lg transition-all ${
                            appearanceSettings.theme === 'dark'
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-secondary-200 hover:border-secondary-300'
                          }`}
                        >
                          <div className="w-full h-8 bg-gray-800 rounded mb-2"></div>
                          <span className="text-sm font-medium">داكن</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        اللغة
                      </label>
                      <select
                        value={appearanceSettings.language}
                        onChange={(e) => setAppearanceSettings({
                          ...appearanceSettings,
                          language: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="ar">العربية</option>
                        <option value="en">English</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        تنسيق التاريخ
                      </label>
                      <select
                        value={appearanceSettings.dateFormat}
                        onChange={(e) => setAppearanceSettings({
                          ...appearanceSettings,
                          dateFormat: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                        <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                        <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        المنطقة الزمنية
                      </label>
                      <select
                        value={appearanceSettings.timezone}
                        onChange={(e) => setAppearanceSettings({
                          ...appearanceSettings,
                          timezone: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="Asia/Riyadh">الرياض (GMT+3)</option>
                        <option value="Asia/Dubai">دبي (GMT+4)</option>
                        <option value="Africa/Cairo">القاهرة (GMT+2)</option>
                        <option value="UTC">UTC (GMT+0)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="px-8 py-4 border-t border-secondary-200 bg-secondary-50 rounded-b-xl">
                <div className="flex justify-end">
                  <Button
                    onClick={handleSave}
                    loading={isSaving}
                    icon={Save}
                  >
                    حفظ الإعدادات
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}