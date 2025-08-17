'use client'

import { useState } from 'react'
import { BarChart3, TrendingUp, TrendingDown, Users, Target, Calendar, Clock, Award, Filter, Download, AlertCircle } from 'lucide-react'
import AppLayout from '@/components/layout/AppLayout'
import Button from '@/components/ui/Button'

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('month')
  const [selectedMetric, setSelectedMetric] = useState('projects')

  const stats = {
    projects: {
      total: 24,
      active: 12,
      completed: 8,
      pending: 4,
      growth: 15.2
    },
    tasks: {
      total: 156,
      completed: 89,
      inProgress: 32,
      overdue: 12,
      growth: -2.4
    },
    team: {
      total: 15,
      active: 12,
      productivity: 87.5,
      avgTasksPerMember: 10.4,
      growth: 8.1
    },
    revenue: {
      total: 285000,
      thisMonth: 45000,
      avgProjectValue: 18750,
      growth: 22.3
    }
  }

  const chartData = {
    projects: [
      { month: 'يناير', completed: 5, active: 8 },
      { month: 'فبراير', completed: 8, active: 12 },
      { month: 'مارس', completed: 6, active: 10 },
      { month: 'أبريل', completed: 9, active: 15 },
      { month: 'مايو', completed: 7, active: 11 },
      { month: 'يونيو', completed: 10, active: 14 }
    ],
    tasks: [
      { month: 'يناير', completed: 45, created: 52 },
      { month: 'فبراير', completed: 52, created: 58 },
      { month: 'مارس', completed: 48, created: 55 },
      { month: 'أبريل', completed: 65, created: 72 },
      { month: 'مايو', completed: 58, created: 63 },
      { month: 'يونيو', completed: 71, created: 76 }
    ]
  }

  const topPerformers = [
    { name: 'سارة محمود', tasksCompleted: 23, projectsInvolved: 5, efficiency: 92 },
    { name: 'عبدالله سالم', tasksCompleted: 19, projectsInvolved: 4, efficiency: 89 },
    { name: 'فاطمة علي', tasksCompleted: 17, projectsInvolved: 3, efficiency: 85 },
    { name: 'أحمد محمد', tasksCompleted: 15, projectsInvolved: 6, efficiency: 88 },
    { name: 'نورا حسن', tasksCompleted: 14, projectsInvolved: 3, efficiency: 83 }
  ]

  const projectsAnalysis = [
    { name: 'تطوير موقع الشركة', progress: 75, budget: 50000, spent: 37500, daysLeft: 15, status: 'On Track' },
    { name: 'حملة التسويق الرقمي', progress: 90, budget: 30000, spent: 28500, daysLeft: 5, status: 'Ahead' },
    { name: 'تطبيق الجوال', progress: 25, budget: 80000, spent: 15000, daysLeft: 45, status: 'Behind' },
    { name: 'تصميم الهوية البصرية', progress: 100, budget: 15000, spent: 14200, daysLeft: 0, status: 'Completed' }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Track': return 'text-green-600 bg-green-100'
      case 'Ahead': return 'text-blue-600 bg-blue-100'
      case 'Behind': return 'text-red-600 bg-red-100'
      case 'Completed': return 'text-purple-600 bg-purple-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'On Track': return 'في المسار الصحيح'
      case 'Ahead': return 'متقدم عن الجدول'
      case 'Behind': return 'متأخر عن الجدول'
      case 'Completed': return 'مكتمل'
      default: return status
    }
  }

  const generateReport = () => {
    alert('سيتم إنشاء التقرير وتنزيله قريباً!')
  }

  return (
    <AppLayout 
      title="التحليلات والإحصائيات"
      description="تحليل شامل لأداء المشاريع والفريق"
    >
      <div className="p-6 lg:p-8">
        {/* Header Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="flex items-center space-x-4 space-x-reverse mb-4 lg:mb-0">
            <div className="bg-orange-100 p-3 rounded-xl">
              <BarChart3 className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-secondary-900">مركز التحليلات</h2>
              <p className="text-sm text-secondary-500">نظرة شاملة على الأداء والإحصائيات</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 space-x-reverse">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="week">هذا الأسبوع</option>
              <option value="month">هذا الشهر</option>
              <option value="quarter">هذا الربع</option>
              <option value="year">هذا العام</option>
            </select>
            
            <Button onClick={generateReport} icon={Download} variant="outline">
              تصدير التقرير
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Target className="w-8 h-8 text-white/80" />
              <div className={`flex items-center space-x-1 space-x-reverse ${stats.projects.growth > 0 ? 'text-green-300' : 'text-red-300'}`}>
                {stats.projects.growth > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span className="text-sm font-medium">{Math.abs(stats.projects.growth)}%</span>
              </div>
            </div>
            <div className="mb-2">
              <h3 className="text-3xl font-bold">{stats.projects.total}</h3>
              <p className="text-blue-100">إجمالي المشاريع</p>
            </div>
            <div className="flex items-center justify-between text-sm text-blue-100">
              <span>{stats.projects.active} نشط</span>
              <span>{stats.projects.completed} مكتمل</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-8 h-8 text-white/80" />
              <div className={`flex items-center space-x-1 space-x-reverse ${stats.tasks.growth > 0 ? 'text-green-300' : 'text-red-300'}`}>
                {stats.tasks.growth > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span className="text-sm font-medium">{Math.abs(stats.tasks.growth)}%</span>
              </div>
            </div>
            <div className="mb-2">
              <h3 className="text-3xl font-bold">{stats.tasks.total}</h3>
              <p className="text-green-100">إجمالي المهام</p>
            </div>
            <div className="flex items-center justify-between text-sm text-green-100">
              <span>{stats.tasks.completed} مكتملة</span>
              <span>{stats.tasks.overdue} متأخرة</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-white/80" />
              <div className={`flex items-center space-x-1 space-x-reverse ${stats.team.growth > 0 ? 'text-green-300' : 'text-red-300'}`}>
                {stats.team.growth > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span className="text-sm font-medium">{Math.abs(stats.team.growth)}%</span>
              </div>
            </div>
            <div className="mb-2">
              <h3 className="text-3xl font-bold">{stats.team.productivity}%</h3>
              <p className="text-purple-100">معدل الإنتاجية</p>
            </div>
            <div className="flex items-center justify-between text-sm text-purple-100">
              <span>{stats.team.active} نشط</span>
              <span>{stats.team.avgTasksPerMember} مهام/عضو</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Award className="w-8 h-8 text-white/80" />
              <div className={`flex items-center space-x-1 space-x-reverse ${stats.revenue.growth > 0 ? 'text-green-300' : 'text-red-300'}`}>
                {stats.revenue.growth > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span className="text-sm font-medium">{Math.abs(stats.revenue.growth)}%</span>
              </div>
            </div>
            <div className="mb-2">
              <h3 className="text-3xl font-bold">{(stats.revenue.total / 1000).toFixed(0)}k</h3>
              <p className="text-orange-100">إجمالي الإيرادات (ر.س)</p>
            </div>
            <div className="flex items-center justify-between text-sm text-orange-100">
              <span>{(stats.revenue.thisMonth / 1000).toFixed(0)}k هذا الشهر</span>
              <span>{(stats.revenue.avgProjectValue / 1000).toFixed(0)}k متوسط</span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Projects Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-secondary-900">تقدم المشاريع</h3>
              <div className="flex items-center space-x-2 space-x-reverse text-sm">
                <div className="flex items-center space-x-1 space-x-reverse">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span>نشط</span>
                </div>
                <div className="flex items-center space-x-1 space-x-reverse">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span>مكتمل</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              {chartData.projects.map((data, index) => (
                <div key={index} className="flex items-center space-x-4 space-x-reverse">
                  <div className="w-16 text-sm text-secondary-600">{data.month}</div>
                  <div className="flex-1 flex space-x-1 space-x-reverse">
                    <div className="flex-1 bg-secondary-100 rounded-full h-8 flex items-center overflow-hidden">
                      <div 
                        className="bg-blue-500 h-full flex items-center justify-center text-white text-xs font-medium"
                        style={{ width: `${(data.active / 20) * 100}%` }}
                      >
                        {data.active}
                      </div>
                    </div>
                    <div className="flex-1 bg-secondary-100 rounded-full h-8 flex items-center overflow-hidden">
                      <div 
                        className="bg-green-500 h-full flex items-center justify-center text-white text-xs font-medium"
                        style={{ width: `${(data.completed / 20) * 100}%` }}
                      >
                        {data.completed}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tasks Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-secondary-900">إنجاز المهام</h3>
              <div className="flex items-center space-x-2 space-x-reverse text-sm">
                <div className="flex items-center space-x-1 space-x-reverse">
                  <div className="w-3 h-3 bg-purple-500 rounded"></div>
                  <span>مُنشأة</span>
                </div>
                <div className="flex items-center space-x-1 space-x-reverse">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span>مكتملة</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              {chartData.tasks.map((data, index) => (
                <div key={index} className="flex items-center space-x-4 space-x-reverse">
                  <div className="w-16 text-sm text-secondary-600">{data.month}</div>
                  <div className="flex-1 flex space-x-1 space-x-reverse">
                    <div className="flex-1 bg-secondary-100 rounded-full h-8 flex items-center overflow-hidden">
                      <div 
                        className="bg-purple-500 h-full flex items-center justify-center text-white text-xs font-medium"
                        style={{ width: `${(data.created / 80) * 100}%` }}
                      >
                        {data.created}
                      </div>
                    </div>
                    <div className="flex-1 bg-secondary-100 rounded-full h-8 flex items-center overflow-hidden">
                      <div 
                        className="bg-green-500 h-full flex items-center justify-center text-white text-xs font-medium"
                        style={{ width: `${(data.completed / 80) * 100}%` }}
                      >
                        {data.completed}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Performers */}
          <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-6">أفضل الأداءات</h3>
            
            <div className="space-y-4">
              {topPerformers.map((performer, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ${
                      index === 0 ? 'bg-yellow-500' :
                      index === 1 ? 'bg-gray-400' :
                      index === 2 ? 'bg-orange-600' : 'bg-blue-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium text-secondary-900">{performer.name}</h4>
                      <p className="text-sm text-secondary-600">
                        {performer.tasksCompleted} مهام • {performer.projectsInvolved} مشاريع
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-secondary-900">{performer.efficiency}%</div>
                    <div className="text-sm text-secondary-600">كفاءة</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Project Status */}
          <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-6">حالة المشاريع</h3>
            
            <div className="space-y-4">
              {projectsAnalysis.map((project, index) => (
                <div key={index} className="p-4 bg-secondary-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-secondary-900">{project.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {getStatusText(project.status)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                    <div>
                      <div className="text-secondary-600">التقدم</div>
                      <div className="font-semibold">{project.progress}%</div>
                    </div>
                    <div>
                      <div className="text-secondary-600">المصروف</div>
                      <div className="font-semibold">{(project.spent / 1000).toFixed(0)}k</div>
                    </div>
                    <div>
                      <div className="text-secondary-600">الأيام المتبقية</div>
                      <div className="font-semibold">{project.daysLeft}</div>
                    </div>
                  </div>
                  
                  <div className="w-full bg-secondary-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        project.status === 'Completed' ? 'bg-green-500' :
                        project.status === 'Ahead' ? 'bg-blue-500' :
                        project.status === 'On Track' ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="bg-gradient-to-l from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
            <Clock className="w-5 h-5 ml-2" />
            رؤى وتوصيات
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center space-x-2 space-x-reverse mb-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h4 className="font-medium text-green-900">أداء ممتاز</h4>
              </div>
              <p className="text-sm text-green-700">معدل إكمال المهام في تحسن مستمر بنسبة 15% هذا الشهر</p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center space-x-2 space-x-reverse mb-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <h4 className="font-medium text-yellow-900">يحتاج انتباه</h4>
              </div>
              <p className="text-sm text-yellow-700">12 مهمة متأخرة عن الموعد المحدد، يُنصح بإعادة جدولتها</p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center space-x-2 space-x-reverse mb-2">
                <Target className="w-5 h-5 text-blue-600" />
                <h4 className="font-medium text-blue-900">فرصة للتحسين</h4>
              </div>
              <p className="text-sm text-blue-700">يمكن زيادة الإنتاجية بتوزيع المهام بشكل أكثر توازناً</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}