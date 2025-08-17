'use client'

import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, TrendingDown, Users, Target, Calendar, Clock, Award, Filter, Download, AlertCircle } from 'lucide-react'
import AppLayout from '@/components/layout/AppLayout'
import Button from '@/components/ui/Button'
import { database, Project, Task, User } from '@/lib/database'

interface AnalyticsData {
  projects: {
    total: number
    active: number
    completed: number
    pending: number
    cancelled: number
    paused: number
  }
  tasks: {
    total: number
    completed: number
    inProgress: number
    overdue: number
    todo: number
  }
  users: {
    total: number
    active: number
    avgTasksPerUser: number
    avgProjectsPerUser: number
  }
  productivity: {
    completionRate: number
    overdueRate: number
    avgProjectProgress: number
  }
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('month')
  const [selectedMetric, setSelectedMetric] = useState('projects')
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = () => {
    setLoading(true)
    
    const allProjects = database.getProjects()
    const allTasks = database.getTasks()
    const allUsers = database.getUsers()
    
    setProjects(allProjects)
    setTasks(allTasks)
    setUsers(allUsers)

    // Calculate analytics
    const analytics: AnalyticsData = {
      projects: {
        total: allProjects.length,
        active: allProjects.filter(p => p.status === 'active').length,
        completed: allProjects.filter(p => p.status === 'completed').length,
        pending: allProjects.filter(p => p.status === 'planning').length,
        cancelled: allProjects.filter(p => p.status === 'cancelled').length,
        paused: allProjects.filter(p => p.status === 'paused').length
      },
      tasks: {
        total: allTasks.length,
        completed: allTasks.filter(t => t.status === 'completed').length,
        inProgress: allTasks.filter(t => t.status === 'in-progress').length,
        overdue: allTasks.filter(t => {
          if (!t.dueDate) return false
          return new Date(t.dueDate) < new Date() && t.status !== 'completed'
        }).length,
        todo: allTasks.filter(t => t.status === 'todo').length
      },
      users: {
        total: allUsers.length,
        active: allUsers.filter(u => u.isActive).length,
        avgTasksPerUser: allUsers.length > 0 ? Math.round(allTasks.length / allUsers.length * 10) / 10 : 0,
        avgProjectsPerUser: allUsers.length > 0 ? Math.round(allProjects.length / allUsers.length * 10) / 10 : 0
      },
      productivity: {
        completionRate: allTasks.length > 0 ? Math.round((allTasks.filter(t => t.status === 'completed').length / allTasks.length) * 100) : 0,
        overdueRate: allTasks.length > 0 ? Math.round((allTasks.filter(t => {
          if (!t.dueDate) return false
          return new Date(t.dueDate) < new Date() && t.status !== 'completed'
        }).length / allTasks.length) * 100) : 0,
        avgProjectProgress: allProjects.length > 0 ? Math.round(allProjects.reduce((sum, p) => sum + p.progress, 0) / allProjects.length) : 0
      }
    }

    setAnalyticsData(analytics)
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const getTopPerformers = () => {
    const userStats = users.map(user => {
      const userTasks = tasks.filter(t => t.assignedTo === user.id)
      const completedTasks = userTasks.filter(t => t.status === 'completed')
      const userProjects = projects.filter(p => p.teamMembers.includes(user.id) || p.managerId === user.id)
      
      return {
        ...user,
        tasksCompleted: completedTasks.length,
        totalTasks: userTasks.length,
        projectsInvolved: userProjects.length,
        efficiency: userTasks.length > 0 ? Math.round((completedTasks.length / userTasks.length) * 100) : 0
      }
    })

    return userStats
      .filter(u => u.totalTasks > 0)
      .sort((a, b) => b.efficiency - a.efficiency || b.tasksCompleted - a.tasksCompleted)
      .slice(0, 5)
  }

  const getProjectsAnalysis = () => {
    return projects.slice(0, 6).map(project => {
      const projectTasks = tasks.filter(t => t.projectId === project.id)
      const completedTasks = projectTasks.filter(t => t.status === 'completed')
      const overdueTasks = projectTasks.filter(t => {
        if (!t.dueDate) return false
        return new Date(t.dueDate) < new Date() && t.status !== 'completed'
      })

      let status = 'On Track'
      if (project.status === 'completed') {
        status = 'Completed'
      } else if (project.progress >= 90) {
        status = 'Ahead'
      } else if (overdueTasks.length > 0 || project.progress < 30) {
        status = 'Behind'
      }

      const daysLeft = project.endDate 
        ? Math.max(0, Math.ceil((new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
        : 0

      return {
        name: project.name,
        progress: project.progress,
        budget: project.budget || 0,
        spent: Math.round((project.budget || 0) * (project.progress / 100)),
        daysLeft,
        status,
        tasksCompleted: completedTasks.length,
        totalTasks: projectTasks.length
      }
    })
  }

  const generateChartData = () => {
    // Generate last 6 months data
    const months = []
    const now = new Date()
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthName = date.toLocaleDateString('ar-SA', { month: 'long' })
      
      // Filter projects/tasks created in this month
      const monthProjects = projects.filter(p => {
        const createdDate = new Date(p.createdAt)
        return createdDate.getMonth() === date.getMonth() && createdDate.getFullYear() === date.getFullYear()
      })
      
      const monthTasks = tasks.filter(t => {
        const createdDate = new Date(t.createdAt)
        return createdDate.getMonth() === date.getMonth() && createdDate.getFullYear() === date.getFullYear()
      })

      months.push({
        month: monthName,
        projects: {
          completed: monthProjects.filter(p => p.status === 'completed').length,
          active: monthProjects.filter(p => p.status === 'active').length,
          total: monthProjects.length
        },
        tasks: {
          completed: monthTasks.filter(t => t.status === 'completed').length,
          created: monthTasks.length,
          inProgress: monthTasks.filter(t => t.status === 'in-progress').length
        }
      })
    }

    return months
  }

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
    if (!analyticsData) return
    
    const reportData = {
      generatedAt: new Date().toLocaleString('ar-SA'),
      summary: analyticsData,
      topPerformers: getTopPerformers(),
      projectsAnalysis: getProjectsAnalysis(),
      chartData: generateChartData()
    }
    
    const dataStr = JSON.stringify(reportData, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `analytics-report-${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  if (loading) {
    return (
      <AppLayout title="التحليلات والإحصائيات" description="تحميل التحليلات...">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-secondary-600">جاري تحليل البيانات...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (!analyticsData) {
    return (
      <AppLayout title="التحليلات والإحصائيات" description="خطأ في تحميل البيانات">
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-red-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-secondary-900 mb-2">خطأ في تحميل البيانات</h3>
          <p className="text-secondary-600">حدث خطأ أثناء تحليل البيانات. يرجى المحاولة مرة أخرى.</p>
          <Button onClick={loadData} className="mt-4">إعادة المحاولة</Button>
        </div>
      </AppLayout>
    )
  }

  const topPerformers = getTopPerformers()
  const projectsAnalysis = getProjectsAnalysis()
  const chartData = generateChartData()

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
              <div className="flex items-center space-x-1 space-x-reverse text-green-300">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {analyticsData.projects.total > 0 ? Math.round((analyticsData.projects.completed / analyticsData.projects.total) * 100) : 0}%
                </span>
              </div>
            </div>
            <div className="mb-2">
              <h3 className="text-3xl font-bold">{analyticsData.projects.total}</h3>
              <p className="text-blue-100">إجمالي المشاريع</p>
            </div>
            <div className="flex items-center justify-between text-sm text-blue-100">
              <span>{analyticsData.projects.active} نشط</span>
              <span>{analyticsData.projects.completed} مكتمل</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-8 h-8 text-white/80" />
              <div className={`flex items-center space-x-1 space-x-reverse ${analyticsData.productivity.completionRate >= 70 ? 'text-green-300' : 'text-red-300'}`}>
                {analyticsData.productivity.completionRate >= 70 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span className="text-sm font-medium">{analyticsData.productivity.completionRate}%</span>
              </div>
            </div>
            <div className="mb-2">
              <h3 className="text-3xl font-bold">{analyticsData.tasks.total}</h3>
              <p className="text-green-100">إجمالي المهام</p>
            </div>
            <div className="flex items-center justify-between text-sm text-green-100">
              <span>{analyticsData.tasks.completed} مكتملة</span>
              <span>{analyticsData.tasks.overdue} متأخرة</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-white/80" />
              <div className={`flex items-center space-x-1 space-x-reverse ${analyticsData.productivity.avgProjectProgress >= 70 ? 'text-green-300' : 'text-red-300'}`}>
                {analyticsData.productivity.avgProjectProgress >= 70 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span className="text-sm font-medium">{analyticsData.productivity.avgProjectProgress}%</span>
              </div>
            </div>
            <div className="mb-2">
              <h3 className="text-3xl font-bold">{analyticsData.users.total}</h3>
              <p className="text-purple-100">أعضاء الفريق</p>
            </div>
            <div className="flex items-center justify-between text-sm text-purple-100">
              <span>{analyticsData.users.active} نشط</span>
              <span>{analyticsData.users.avgTasksPerUser} مهام/عضو</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Award className="w-8 h-8 text-white/80" />
              <div className={`flex items-center space-x-1 space-x-reverse ${analyticsData.productivity.overdueRate <= 10 ? 'text-green-300' : 'text-red-300'}`}>
                {analyticsData.productivity.overdueRate <= 10 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span className="text-sm font-medium">{analyticsData.productivity.completionRate}%</span>
              </div>
            </div>
            <div className="mb-2">
              <h3 className="text-3xl font-bold">{analyticsData.productivity.completionRate}%</h3>
              <p className="text-orange-100">معدل الإنجاز</p>
            </div>
            <div className="flex items-center justify-between text-sm text-orange-100">
              <span>{analyticsData.tasks.overdue} متأخرة</span>
              <span>{analyticsData.productivity.overdueRate}% معدل التأخير</span>
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
              {chartData.map((data, index) => (
                <div key={index} className="flex items-center space-x-4 space-x-reverse">
                  <div className="w-16 text-sm text-secondary-600">{data.month}</div>
                  <div className="flex-1 flex space-x-1 space-x-reverse">
                    <div className="flex-1 bg-secondary-100 rounded-full h-8 flex items-center overflow-hidden">
                      <div 
                        className="bg-blue-500 h-full flex items-center justify-center text-white text-xs font-medium"
                        style={{ width: `${Math.max(10, (data.projects.active / Math.max(1, Math.max(...chartData.map(d => d.projects.active)))) * 100)}%` }}
                      >
                        {data.projects.active}
                      </div>
                    </div>
                    <div className="flex-1 bg-secondary-100 rounded-full h-8 flex items-center overflow-hidden">
                      <div 
                        className="bg-green-500 h-full flex items-center justify-center text-white text-xs font-medium"
                        style={{ width: `${Math.max(10, (data.projects.completed / Math.max(1, Math.max(...chartData.map(d => d.projects.completed)))) * 100)}%` }}
                      >
                        {data.projects.completed}
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
              {chartData.map((data, index) => (
                <div key={index} className="flex items-center space-x-4 space-x-reverse">
                  <div className="w-16 text-sm text-secondary-600">{data.month}</div>
                  <div className="flex-1 flex space-x-1 space-x-reverse">
                    <div className="flex-1 bg-secondary-100 rounded-full h-8 flex items-center overflow-hidden">
                      <div 
                        className="bg-purple-500 h-full flex items-center justify-center text-white text-xs font-medium"
                        style={{ width: `${Math.max(10, (data.tasks.created / Math.max(1, Math.max(...chartData.map(d => d.tasks.created)))) * 100)}%` }}
                      >
                        {data.tasks.created}
                      </div>
                    </div>
                    <div className="flex-1 bg-secondary-100 rounded-full h-8 flex items-center overflow-hidden">
                      <div 
                        className="bg-green-500 h-full flex items-center justify-center text-white text-xs font-medium"
                        style={{ width: `${Math.max(10, (data.tasks.completed / Math.max(1, Math.max(...chartData.map(d => d.tasks.completed)))) * 100)}%` }}
                      >
                        {data.tasks.completed}
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
            
            {topPerformers.length > 0 ? (
              <div className="space-y-4">
                {topPerformers.map((performer, index) => (
                  <div key={performer.id} className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
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
                          {performer.tasksCompleted} من {performer.totalTasks} مهام • {performer.projectsInvolved} مشاريع
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
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-secondary-300 mx-auto mb-2" />
                <p className="text-secondary-600">لا توجد بيانات أداء متاحة</p>
              </div>
            )}
          </div>

          {/* Project Status */}
          <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-6">حالة المشاريع</h3>
            
            {projectsAnalysis.length > 0 ? (
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
                        <div className="text-secondary-600">المهام</div>
                        <div className="font-semibold">{project.tasksCompleted}/{project.totalTasks}</div>
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
            ) : (
              <div className="text-center py-8">
                <Target className="w-12 h-12 text-secondary-300 mx-auto mb-2" />
                <p className="text-secondary-600">لا توجد مشاريع للتحليل</p>
              </div>
            )}
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
                {analyticsData.productivity.completionRate >= 70 ? (
                  <TrendingUp className="w-5 h-5 text-green-600" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-600" />
                )}
                <h4 className={`font-medium ${analyticsData.productivity.completionRate >= 70 ? 'text-green-900' : 'text-red-900'}`}>
                  {analyticsData.productivity.completionRate >= 70 ? 'أداء جيد' : 'يحتاج تحسين'}
                </h4>
              </div>
              <p className={`text-sm ${analyticsData.productivity.completionRate >= 70 ? 'text-green-700' : 'text-red-700'}`}>
                معدل إكمال المهام {analyticsData.productivity.completionRate}%
                {analyticsData.productivity.completionRate >= 70 ? ' - أداء ممتاز!' : ' - يحتاج إلى تحسين'}
              </p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center space-x-2 space-x-reverse mb-2">
                {analyticsData.tasks.overdue > 0 ? (
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                ) : (
                  <TrendingUp className="w-5 h-5 text-green-600" />
                )}
                <h4 className={`font-medium ${analyticsData.tasks.overdue > 0 ? 'text-yellow-900' : 'text-green-900'}`}>
                  {analyticsData.tasks.overdue > 0 ? 'مهام متأخرة' : 'لا توجد مهام متأخرة'}
                </h4>
              </div>
              <p className={`text-sm ${analyticsData.tasks.overdue > 0 ? 'text-yellow-700' : 'text-green-700'}`}>
                {analyticsData.tasks.overdue > 0 
                  ? `${analyticsData.tasks.overdue} مهمة متأخرة عن الموعد المحدد`
                  : 'جميع المهام في المواعيد المحددة'
                }
              </p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center space-x-2 space-x-reverse mb-2">
                <Target className="w-5 h-5 text-blue-600" />
                <h4 className="font-medium text-blue-900">توزيع الأعمال</h4>
              </div>
              <p className="text-sm text-blue-700">
                متوسط {analyticsData.users.avgTasksPerUser} مهام لكل عضو فريق
                {analyticsData.users.avgTasksPerUser > 10 ? ' - قد يحتاج إعادة توزيع' : ' - توزيع جيد'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}