'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRight, Users, FolderOpen, Calendar, BarChart3, Settings, TrendingUp, Clock, Star, Activity, Target } from 'lucide-react'
import AppLayout from '@/components/layout/AppLayout'

export default function HomePage() {
  const router = useRouter()
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update time every minute
  useState(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  })

  const stats = [
    { title: 'المشاريع النشطة', value: '12', icon: FolderOpen, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'المهام المكتملة', value: '89', icon: Calendar, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'أعضاء الفريق', value: '24', icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
    { title: 'التقارير', value: '156', icon: BarChart3, color: 'text-orange-600', bg: 'bg-orange-100' },
  ]

  const recentProjects = [
    { name: 'تطوير موقع الشركة الجديد', status: 'قيد التنفيذ', progress: 75, team: 5 },
    { name: 'حملة التسويق الرقمي', status: 'في المراجعة', progress: 90, team: 3 },
    { name: 'تصميم الهوية البصرية', status: 'مكتمل', progress: 100, team: 2 },
    { name: 'تطبيق الجوال', status: 'قيد التخطيط', progress: 25, team: 8 },
  ]

  const quickActions = [
    { 
      title: 'مشروع جديد', 
      icon: FolderOpen, 
      description: 'إنشاء مشروع إبداعي جديد'
    },
    { 
      title: 'مهمة جديدة', 
      icon: Calendar, 
      description: 'إضافة مهمة جديدة للفريق'
    },
    { 
      title: 'رفع ملفات', 
      icon: Settings, 
      description: 'رفع ملفات المشروع'
    },
    { 
      title: 'عرض التقارير', 
      icon: BarChart3, 
      description: 'عرض تقارير الأداء'
    },
  ]

  const navigateTo = (path: string) => {
    router.push(path)
  }

  return (
    <AppLayout 
      title="لوحة التحكم"
      description="نظرة عامة على مشاريعك وفريقك"
    >
      <div className="p-4 lg:p-6">
        {/* Welcome Section */}
        <div className="mb-6">
          <div className="bg-gradient-to-l from-primary-500 to-primary-600 rounded-2xl p-6 lg:p-8 text-white mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold mb-2">
                  مرحباً بك يا أحمد 👋
                </h2>
                <p className="text-primary-100 text-lg mb-4">
                  اليوم {currentTime.toLocaleDateString('ar-SA', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
                <p className="text-primary-100">
                  لديك 3 مهام جديدة ومشروعان يحتاجان متابعة
                </p>
              </div>
              <div className="hidden lg:flex items-center">
                <div className="bg-white bg-opacity-20 rounded-full p-6">
                  <Activity className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="card hover:shadow-md transition-shadow animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-secondary-600 text-sm mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-secondary-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">إجراءات سريعة</h3>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => {
                  // Trigger quick actions via events for sidebar integration
                  if (action.title.includes('مشروع')) {
                    window.dispatchEvent(new CustomEvent('quickAction:project'))
                  } else if (action.title.includes('مهمة')) {
                    window.dispatchEvent(new CustomEvent('quickAction:task'))
                  } else if (action.title.includes('ملف')) {
                    window.dispatchEvent(new CustomEvent('quickAction:upload'))
                  }
                }}
                className="card hover:shadow-md transition-all hover:scale-[1.02] text-right group h-full"
              >
                <div className="flex items-center justify-between mb-2">
                  <action.icon className="w-6 h-6 text-primary-500 group-hover:text-primary-600 transition-colors" />
                  <ChevronRight className="w-4 h-4 text-secondary-400 group-hover:text-primary-500 transition-colors" />
                </div>
                <h4 className="font-semibold text-secondary-900 mb-1 text-sm">{action.title}</h4>
                <p className="text-xs text-secondary-600">{action.description}</p>
              </button>
            ))}
            </div>
          </div>

          {/* Recent Projects */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-secondary-900">المشاريع الأخيرة</h3>
              <button 
                onClick={() => navigateTo('/projects')}
                className="text-primary-500 hover:text-primary-600 font-medium flex items-center"
              >
                عرض الكل <ChevronRight className="w-4 h-4 mr-1" />
              </button>
            </div>
          
          <div className="card">
            <div className="space-y-4">
              {recentProjects.map((project, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors">
                  <div className="flex-1">
                    <h4 className="font-semibold text-secondary-900 mb-1">{project.name}</h4>
                    <div className="flex items-center space-x-4 space-x-reverse text-sm text-secondary-600">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        project.status === 'مكتمل' ? 'bg-green-100 text-green-800' :
                        project.status === 'قيد التنفيذ' ? 'bg-blue-100 text-blue-800' :
                        project.status === 'في المراجعة' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {project.status}
                      </span>
                      <span className="flex items-center">
                        <Users className="w-4 h-4 ml-1" />
                        {project.team} أعضاء
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <div className="text-left">
                      <div className="text-sm font-medium text-secondary-900">{project.progress}%</div>
                      <div className="w-24 bg-secondary-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-secondary-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">مؤشرات الأداء</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-8 h-8" />
                <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">هذا الشهر</span>
              </div>
              <p className="text-3xl font-bold mb-1">87%</p>
              <p className="text-blue-100">معدل إنجاز المهام</p>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <Target className="w-8 h-8" />
                <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">نشط</span>
              </div>
              <p className="text-3xl font-bold mb-1">24</p>
              <p className="text-green-100">مهمة مكتملة</p>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-8 h-8" />
                <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">فعال</span>
              </div>
              <p className="text-3xl font-bold mb-1">12</p>
              <p className="text-purple-100">عضو فريق نشط</p>
            </div>
            
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <Clock className="w-8 h-8" />
                <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">متوسط</span>
              </div>
              <p className="text-3xl font-bold mb-1">2.5</p>
              <p className="text-orange-100">ساعة يومياً</p>
            </div>
          </div>
        </div>

      </div>
    </AppLayout>
  )
}