'use client'

import { useState, useEffect } from 'react'
import { Users, UserPlus, Mail, Phone, MapPin, Calendar, Award, TrendingUp, Settings, MoreVertical, Edit, Trash2, Plus } from 'lucide-react'
import AppLayout from '@/components/layout/AppLayout'
import Button from '@/components/ui/Button'
import { database, User } from '@/lib/database'
import UserForm from '@/components/forms/UserForm'

export default function TeamPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('الكل')
  const [filterRole, setFilterRole] = useState('الكل')
  const [users, setUsers] = useState<User[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Load users data
  const loadUsers = () => {
    setLoading(true)
    const allUsers = database.getUsers()
    setUsers(allUsers)
    setLoading(false)
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const departments = ['الكل', 'الإدارة', 'التطوير', 'التصميم', 'التسويق', 'المبيعات', 'الموارد البشرية']
  const roles = ['الكل', 'مدير', 'مطور', 'مصمم', 'مسوق', 'محلل', 'أخصائي']

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getStatusText = (isActive: boolean) => {
    return isActive ? 'نشط' : 'غير نشط'
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.role && user.role.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesDepartment = filterDepartment === 'الكل' || user.department === filterDepartment
    const matchesRole = filterRole === 'الكل' || user.role === filterRole
    return matchesSearch && matchesDepartment && matchesRole
  })

  const stats = {
    total: users.length,
    active: users.filter(u => u.isActive).length,
    departments: new Set(users.filter(u => u.department).map(u => u.department)).size,
    roles: new Set(users.filter(u => u.role).map(u => u.role)).size
  }

  const handleCreateUser = (userData: any) => {
    const newUser = database.createUser(userData)
    if (newUser) {
      loadUsers()
      setIsCreateModalOpen(false)
      alert('تم إنشاء المستخدم بنجاح!')
    } else {
      alert('حدث خطأ أثناء إنشاء المستخدم')
    }
  }

  const handleUpdateUser = (userData: any) => {
    if (editingUser) {
      const success = database.updateUser(editingUser.id, userData)
      if (success) {
        loadUsers()
        setEditingUser(null)
        alert('تم تحديث المستخدم بنجاح!')
      } else {
        alert('حدث خطأ أثناء تحديث المستخدم')
      }
    }
  }

  const handleDeleteUser = (userId: string, userName: string) => {
    if (confirm(`هل أنت متأكد من حذف المستخدم "${userName}"؟`)) {
      const success = database.deleteUser(userId)
      if (success) {
        loadUsers()
        alert('تم حذف المستخدم بنجاح!')
      } else {
        alert('حدث خطأ أثناء حذف المستخدم')
      }
    }
  }

  const getUserProjects = (userId: string) => {
    return database.getProjectsByUser(userId).length
  }

  const getUserTasks = (userId: string) => {
    return database.getTasksByUser(userId).length
  }

  const getUserAvatar = (name: string) => {
    return name.charAt(0).toUpperCase()
  }

  if (loading) {
    return (
      <AppLayout title="إدارة الفريق" description="تنظيم ومتابعة أعضاء الفريق">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-secondary-600">جاري تحميل بيانات الفريق...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout 
      title="إدارة الفريق"
      description="تنظيم ومتابعة أعضاء الفريق"
    >
      <div className="p-6 lg:p-8">
        {/* Action Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="bg-purple-100 p-3 rounded-xl">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-secondary-900">مركز إدارة الفريق</h2>
              <p className="text-sm text-secondary-500">متابعة وإدارة أعضاء الفريق</p>
            </div>
          </div>
          
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            icon={UserPlus}
          >
            إضافة عضو
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 border border-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-secondary-900">{stats.total}</p>
                <p className="text-sm text-secondary-600">إجمالي الأعضاء</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                <p className="text-sm text-secondary-600">نشط</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-600">{stats.departments}</p>
                <p className="text-sm text-secondary-600">الأقسام</p>
              </div>
              <Award className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-orange-600">{stats.roles}</p>
                <p className="text-sm text-secondary-600">الأدوار</p>
              </div>
              <MoreVertical className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 sm:space-x-reverse">
              <div className="relative">
                <input
                  type="text"
                  placeholder="البحث عن عضو..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-4 pr-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 w-full sm:w-64"
                />
              </div>
              
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>

              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            
            <div className="text-sm text-secondary-600">
              عرض {filteredUsers.length} من {users.length} عضو
            </div>
          </div>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div key={user.id} className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6 hover:shadow-md transition-shadow">
              {/* Member Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-lg font-semibold text-primary-700">
                      {getUserAvatar(user.name)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary-900">{user.name}</h3>
                    <p className="text-sm text-secondary-600">{user.role || 'غير محدد'}</p>
                  </div>
                </div>
                
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.isActive)}`}>
                  {getStatusText(user.isActive)}
                </span>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 space-x-reverse text-sm text-secondary-600">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center space-x-2 space-x-reverse text-sm text-secondary-600">
                    <Phone className="w-4 h-4" />
                    <span>{user.phone}</span>
                  </div>
                )}
                {user.department && (
                  <div className="flex items-center space-x-2 space-x-reverse text-sm text-secondary-600">
                    <MapPin className="w-4 h-4" />
                    <span>{user.department}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2 space-x-reverse text-sm text-secondary-600">
                  <Calendar className="w-4 h-4" />
                  <span>انضم في {new Date(user.createdAt).toLocaleDateString('ar-SA')}</span>
                </div>
              </div>

              {/* Performance Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-secondary-50 rounded-lg">
                  <p className="text-lg font-semibold text-secondary-900">{getUserTasks(user.id)}</p>
                  <p className="text-xs text-secondary-600">مهام</p>
                </div>
                <div className="text-center p-3 bg-secondary-50 rounded-lg">
                  <p className="text-lg font-semibold text-secondary-900">{getUserProjects(user.id)}</p>
                  <p className="text-xs text-secondary-600">مشاريع</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 space-x-reverse">
                <button
                  onClick={() => window.open(`mailto:${user.email}`)}
                  className="flex-1 flex items-center justify-center p-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  title="مراسلة"
                >
                  <Mail className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => setEditingUser(user)}
                  className="flex-1 flex items-center justify-center p-2 text-secondary-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="تعديل"
                >
                  <Edit className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDeleteUser(user.id, user.name)}
                  className="flex-1 flex items-center justify-center p-2 text-secondary-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="حذف"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">لا يوجد أعضاء</h3>
            <p className="text-secondary-600">
              {searchTerm || filterDepartment !== 'الكل' || filterRole !== 'الكل'
                ? 'لم يتم العثور على أعضاء تطابق البحث'
                : 'ابدأ بإضافة أعضاء الفريق'
              }
            </p>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              icon={Plus}
              className="mt-4"
            >
              إضافة عضو جديد
            </Button>
          </div>
        )}

        {/* Create/Edit User Modal */}
        {(isCreateModalOpen || editingUser) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="p-6 border-b border-secondary-200">
                <h3 className="text-lg font-semibold text-secondary-900">
                  {editingUser ? 'تعديل المستخدم' : 'إضافة مستخدم جديد'}
                </h3>
              </div>
              
              <div className="p-6">
                <UserForm
                  user={editingUser || undefined}
                  onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
                  onCancel={() => {
                    setIsCreateModalOpen(false)
                    setEditingUser(null)
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}