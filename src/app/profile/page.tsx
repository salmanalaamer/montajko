'use client'

import { useState } from 'react'
import { User, Mail, Phone, MapPin, Calendar, Award, Edit, Camera, Save, Star, TrendingUp } from 'lucide-react'
import AppLayout from '@/components/layout/AppLayout'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: 'أحمد محمد',
    email: 'ahmed@company.com',
    phone: '+966501234567',
    position: 'مدير المشاريع',
    department: 'الإدارة',
    location: 'الرياض، السعودية',
    joinDate: '2023-01-15',
    bio: 'مدير مشاريع محترف مع خبرة 8 سنوات في إدارة المشاريع التقنية والإبداعية. متخصص في تطبيق منهجيات Agile و Scrum لضمان تسليم المشاريع في الوقت المحدد وضمن الميزانية.',
    skills: ['إدارة المشاريع', 'Agile & Scrum', 'التخطيط الاستراتيجي', 'القيادة', 'التحليل', 'إدارة الفرق'],
    avatar: 'أ'
  })

  const stats = {
    projectsManaged: 24,
    tasksCompleted: 156,
    teamMembers: 15,
    successRate: 95.2
  }

  const recentAchievements = [
    { title: 'مدير الشهر', date: '2024-02-01', description: 'تقديراً للأداء المتميز في إدارة المشاريع' },
    { title: 'إكمال 100 مهمة', date: '2024-01-20', description: 'تحقيق إنجاز إكمال 100 مهمة بنجاح' },
    { title: 'قائد الفريق المثالي', date: '2024-01-10', description: 'لقب قائد الفريق المثالي لعام 2024' }
  ]

  const projectHistory = [
    { name: 'تطوير موقع الشركة الجديد', status: 'قيد التنفيذ', progress: 75, role: 'مدير المشروع' },
    { name: 'حملة التسويق الرقمي', status: 'في المراجعة', progress: 90, role: 'مدير المشروع' },
    { name: 'تصميم الهوية البصرية', status: 'مكتمل', progress: 100, role: 'مشرف' },
    { name: 'تطبيق الجوال', status: 'قيد التخطيط', progress: 25, role: 'مدير المشروع' }
  ]

  const handleSave = () => {
    // حفظ البيانات
    console.log('حفظ بيانات الملف الشخصي:', profileData)
    setIsEditing(false)
    alert('تم حفظ التغييرات بنجاح!')
  }

  const handleAvatarChange = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        // معالجة رفع الصورة
        alert('تم رفع الصورة بنجاح!')
      }
    }
    input.click()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'مكتمل': return 'bg-green-100 text-green-800 border-green-200'
      case 'قيد التنفيذ': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'في المراجعة': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'قيد التخطيط': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <AppLayout 
      title="الملف الشخصي"
      description="إدارة المعلومات الشخصية والإعدادات"
    >
      <div className="p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="bg-gradient-to-l from-primary-500 to-primary-600 rounded-2xl p-8 text-white mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center space-x-6 space-x-reverse mb-6 lg:mb-0">
                <div className="relative">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-4xl font-bold text-white">{profileData.avatar}</span>
                  </div>
                  <button
                    onClick={handleAvatarChange}
                    className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary-700 hover:bg-primary-800 rounded-full flex items-center justify-center transition-colors"
                  >
                    <Camera className="w-4 h-4 text-white" />
                  </button>
                </div>
                
                <div>
                  <h1 className="text-3xl font-bold mb-2">{profileData.name}</h1>
                  <p className="text-primary-100 text-lg mb-2">{profileData.position}</p>
                  <div className="flex items-center space-x-4 space-x-reverse text-primary-100">
                    <div className="flex items-center space-x-1 space-x-reverse">
                      <MapPin className="w-4 h-4" />
                      <span>{profileData.location}</span>
                    </div>
                    <div className="flex items-center space-x-1 space-x-reverse">
                      <Calendar className="w-4 h-4" />
                      <span>انضم في {profileData.joinDate}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 space-x-reverse">
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant={isEditing ? 'secondary' : 'outline'}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Edit className="w-4 h-4 ml-1" />
                  {isEditing ? 'إلغاء التعديل' : 'تعديل الملف'}
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <Award className="w-8 h-8 text-blue-600" />
                <span className="text-3xl font-bold text-blue-600">{stats.projectsManaged}</span>
              </div>
              <h3 className="font-semibold text-blue-900">مشروع مُدار</h3>
              <p className="text-sm text-blue-600">إجمالي المشاريع</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
              <div className="flex items-center justify-between mb-4">
                <Star className="w-8 h-8 text-green-600" />
                <span className="text-3xl font-bold text-green-600">{stats.tasksCompleted}</span>
              </div>
              <h3 className="font-semibold text-green-900">مهمة مكتملة</h3>
              <p className="text-sm text-green-600">إجمالي المهام</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
              <div className="flex items-center justify-between mb-4">
                <User className="w-8 h-8 text-purple-600" />
                <span className="text-3xl font-bold text-purple-600">{stats.teamMembers}</span>
              </div>
              <h3 className="font-semibold text-purple-900">عضو فريق</h3>
              <p className="text-sm text-purple-600">تحت الإدارة</p>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-8 h-8 text-orange-600" />
                <span className="text-3xl font-bold text-orange-600">{stats.successRate}%</span>
              </div>
              <h3 className="font-semibold text-orange-900">معدل النجاح</h3>
              <p className="text-sm text-orange-600">في المشاريع</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Personal Information */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-secondary-900">المعلومات الشخصية</h2>
                  {isEditing && (
                    <Button onClick={handleSave} size="sm">
                      <Save className="w-4 h-4 ml-1" />
                      حفظ
                    </Button>
                  )}
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="الاسم الكامل"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      disabled={!isEditing}
                      icon={User}
                    />
                    <Input
                      label="البريد الإلكتروني"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      disabled={!isEditing}
                      icon={Mail}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="رقم الهاتف"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      disabled={!isEditing}
                      icon={Phone}
                    />
                    <Input
                      label="المنصب"
                      value={profileData.position}
                      onChange={(e) => setProfileData({...profileData, position: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="القسم"
                      value={profileData.department}
                      onChange={(e) => setProfileData({...profileData, department: e.target.value})}
                      disabled={!isEditing}
                    />
                    <Input
                      label="الموقع"
                      value={profileData.location}
                      onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                      disabled={!isEditing}
                      icon={MapPin}
                    />
                  </div>

                  <Textarea
                    label="نبذة شخصية"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    disabled={!isEditing}
                    rows={4}
                  />
                </div>
              </div>

              {/* Skills */}
              <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
                <h2 className="text-lg font-semibold text-secondary-900 mb-6">المهارات والخبرات</h2>
                
                <div className="flex flex-wrap gap-3">
                  {profileData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-primary-100 text-primary-800 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                  {isEditing && (
                    <button className="px-4 py-2 border-2 border-dashed border-secondary-300 text-secondary-600 rounded-full text-sm hover:border-primary-300 hover:text-primary-600 transition-colors">
                      + إضافة مهارة
                    </button>
                  )}
                </div>
              </div>

              {/* Project History */}
              <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
                <h2 className="text-lg font-semibold text-secondary-900 mb-6">المشاريع الأخيرة</h2>
                
                <div className="space-y-4">
                  {projectHistory.map((project, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-secondary-50 rounded-xl">
                      <div className="flex-1">
                        <h3 className="font-medium text-secondary-900 mb-1">{project.name}</h3>
                        <p className="text-sm text-secondary-600">الدور: {project.role}</p>
                      </div>
                      
                      <div className="flex items-center space-x-4 space-x-reverse">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                        
                        <div className="text-right">
                          <div className="text-sm font-medium text-secondary-900">{project.progress}%</div>
                          <div className="w-16 bg-secondary-200 rounded-full h-2 mt-1">
                            <div 
                              className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Recent Achievements */}
              <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
                <h2 className="text-lg font-semibold text-secondary-900 mb-6">الإنجازات الأخيرة</h2>
                
                <div className="space-y-4">
                  {recentAchievements.map((achievement, index) => (
                    <div key={index} className="flex items-start space-x-3 space-x-reverse">
                      <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Award className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-secondary-900">{achievement.title}</h3>
                        <p className="text-sm text-secondary-600 mb-1">{achievement.description}</p>
                        <p className="text-xs text-secondary-500">{achievement.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
                <h2 className="text-lg font-semibold text-secondary-900 mb-6">إجراءات سريعة</h2>
                
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="w-4 h-4 ml-2" />
                    تحديث البريد الإلكتروني
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <User className="w-4 h-4 ml-2" />
                    تغيير كلمة المرور
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="w-4 h-4 ml-2" />
                    إعدادات الإشعارات
                  </Button>
                </div>
              </div>

              {/* Contact Card */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">معلومات الاتصال</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 space-x-reverse text-blue-800">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{profileData.email}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 space-x-reverse text-blue-800">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{profileData.phone}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 space-x-reverse text-blue-800">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{profileData.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}