'use client'

import { useState } from 'react'
import { Users, UserPlus, Mail, Phone, MapPin, Calendar, Award, TrendingUp, Settings, MoreVertical } from 'lucide-react'
import AppLayout from '@/components/layout/AppLayout'
import Button from '@/components/ui/Button'

interface TeamMember {
  id: string
  name: string
  email: string
  phone: string
  position: string
  department: string
  avatar: string
  status: 'active' | 'offline' | 'busy'
  tasksCompleted: number
  projectsInvolved: number
  joinDate: string
  performance: number
}

export default function TeamPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('الكل')

  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'أحمد محمد',
      email: 'ahmed@company.com',
      phone: '+966501234567',
      position: 'مدير المشاريع',
      department: 'الإدارة',
      avatar: 'أ',
      status: 'active',
      tasksCompleted: 45,
      projectsInvolved: 8,
      joinDate: '2023-01-15',
      performance: 92
    },
    {
      id: '2',
      name: 'فاطمة علي',
      email: 'fatima@company.com',
      phone: '+966502345678',
      position: 'مطورة واجهات أمامية',
      department: 'التطوير',
      avatar: 'ف',
      status: 'active',
      tasksCompleted: 38,
      projectsInvolved: 5,
      joinDate: '2023-02-20',
      performance: 87
    },
    {
      id: '3',
      name: 'عبدالله سالم',
      email: 'abdullah@company.com',
      phone: '+966503456789',
      position: 'مطور خلفي',
      department: 'التطوير',
      avatar: 'ع',
      status: 'busy',
      tasksCompleted: 52,
      projectsInvolved: 6,
      joinDate: '2023-01-30',
      performance: 95
    },
    {
      id: '4',
      name: 'نورا حسن',
      email: 'nora@company.com',
      phone: '+966504567890',
      position: 'مديرة التسويق',
      department: 'التسويق',
      avatar: 'ن',
      status: 'active',
      tasksCompleted: 29,
      projectsInvolved: 4,
      joinDate: '2023-03-10',
      performance: 83
    },
    {
      id: '5',
      name: 'محمد أحمد',
      email: 'mohammed@company.com',
      phone: '+966505678901',
      position: 'مصمم UI/UX',
      department: 'التصميم',
      avatar: 'م',
      status: 'offline',
      tasksCompleted: 31,
      projectsInvolved: 7,
      joinDate: '2023-02-05',
      performance: 78
    },
    {
      id: '6',
      name: 'سارة محمود',
      email: 'sara@company.com',
      phone: '+966506789012',
      position: 'مصممة جرافيك',
      department: 'التصميم',
      avatar: 'س',
      status: 'active',
      tasksCompleted: 43,
      projectsInvolved: 9,
      joinDate: '2023-01-20',
      performance: 90
    }
  ]

  const departments = ['الكل', 'الإدارة', 'التطوير', 'التصميم', 'التسويق']

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'busy': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'offline': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'متاح'
      case 'busy': return 'مشغول'
      case 'offline': return 'غير متصل'
      default: return 'غير معروف'
    }
  }

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return 'text-green-600'
    if (performance >= 80) return 'text-blue-600'
    if (performance >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = filterDepartment === 'الكل' || member.department === filterDepartment
    return matchesSearch && matchesDepartment
  })

  const stats = {
    total: teamMembers.length,
    active: teamMembers.filter(m => m.status === 'active').length,
    departments: new Set(teamMembers.map(m => m.department)).size,
    avgPerformance: Math.round(teamMembers.reduce((acc, m) => acc + m.performance, 0) / teamMembers.length)
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
            onClick={() => alert('سيتم إضافة ميزة دعوة أعضاء جدد قريباً!')}
            icon={UserPlus}
          >
            دعوة عضو
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
                <p className="text-sm text-secondary-600">نشط الآن</p>
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
                <p className="text-2xl font-bold text-orange-600">{stats.avgPerformance}%</p>
                <p className="text-sm text-secondary-600">متوسط الأداء</p>
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
            </div>
            
            <div className="text-sm text-secondary-600">
              عرض {filteredMembers.length} من {teamMembers.length} عضو
            </div>
          </div>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <div key={member.id} className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6 hover:shadow-md transition-shadow">
              {/* Member Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-lg font-semibold text-primary-700">{member.avatar}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary-900">{member.name}</h3>
                    <p className="text-sm text-secondary-600">{member.position}</p>
                  </div>
                </div>
                
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(member.status)}`}>
                  {getStatusText(member.status)}
                </span>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 space-x-reverse text-sm text-secondary-600">
                  <Mail className="w-4 h-4" />
                  <span>{member.email}</span>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse text-sm text-secondary-600">
                  <Phone className="w-4 h-4" />
                  <span>{member.phone}</span>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse text-sm text-secondary-600">
                  <MapPin className="w-4 h-4" />
                  <span>{member.department}</span>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse text-sm text-secondary-600">
                  <Calendar className="w-4 h-4" />
                  <span>انضم في {member.joinDate}</span>
                </div>
              </div>

              {/* Performance Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-secondary-50 rounded-lg">
                  <p className="text-lg font-semibold text-secondary-900">{member.tasksCompleted}</p>
                  <p className="text-xs text-secondary-600">مهام مكتملة</p>
                </div>
                <div className="text-center p-3 bg-secondary-50 rounded-lg">
                  <p className="text-lg font-semibold text-secondary-900">{member.projectsInvolved}</p>
                  <p className="text-xs text-secondary-600">مشاريع</p>
                </div>
              </div>

              {/* Performance Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-secondary-700">الأداء</span>
                  <span className={`text-sm font-semibold ${getPerformanceColor(member.performance)}`}>
                    {member.performance}%
                  </span>
                </div>
                <div className="w-full bg-secondary-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      member.performance >= 90 ? 'bg-green-500' :
                      member.performance >= 80 ? 'bg-blue-500' :
                      member.performance >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${member.performance}%` }}
                  ></div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 space-x-reverse">
                <button
                  onClick={() => window.open(`mailto:${member.email}`)}
                  className="flex-1 flex items-center justify-center p-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  <Mail className="w-4 h-4 ml-1" />
                  <span className="text-sm">مراسلة</span>
                </button>
                
                <button
                  onClick={() => alert(`عرض ملف ${member.name} الشخصي`)}
                  className="flex-1 flex items-center justify-center p-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  <Settings className="w-4 h-4 ml-1" />
                  <span className="text-sm">إدارة</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">لا يوجد أعضاء</h3>
            <p className="text-secondary-600">
              {searchTerm || filterDepartment !== 'الكل'
                ? 'لم يتم العثور على أعضاء تطابق البحث'
                : 'ابدأ بدعوة أعضاء الفريق'
              }
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  )
}