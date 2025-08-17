'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  ArrowRight, Calendar, Users, DollarSign, Clock, CheckCircle, AlertCircle, 
  Plus, Edit, Trash2, Share, Download, Upload, MessageSquare, FileText,
  BarChart3, Target, TrendingUp, Activity, Star, Flag
} from 'lucide-react'
import AppLayout from '@/components/layout/AppLayout'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import TaskForm, { TaskData } from '@/components/forms/TaskForm'

interface ProjectDetail {
  id: string
  name: string
  description: string
  client: string
  startDate: string
  endDate: string
  budget: string
  status: string
  priority: string
  progress: number
  teamMembers: TeamMember[]
  tasks: TaskDetail[]
  files: FileDetail[]
  milestones: Milestone[]
  comments: Comment[]
  tags: string[]
}

interface TeamMember {
  id: string
  name: string
  avatar: string
  role: string
  email: string
}

interface TaskDetail {
  id: string
  title: string
  status: string
  priority: string
  assignee: string
  dueDate: string
  progress: number
}

interface FileDetail {
  id: string
  name: string
  type: string
  size: string
  uploadDate: string
  uploadedBy: string
}

interface Milestone {
  id: string
  title: string
  dueDate: string
  status: string
  progress: number
}

interface Comment {
  id: string
  author: string
  avatar: string
  content: string
  date: string
}

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  
  const [activeTab, setActiveTab] = useState('overview')
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [newComment, setNewComment] = useState('')

  // Mock data - في التطبيق الحقيقي ستأتي من API
  const project: ProjectDetail = {
    id: projectId,
    name: 'تطوير موقع الشركة الجديد',
    description: 'تطوير موقع إلكتروني حديث ومتجاوب للشركة يتضمن نظام إدارة المحتوى ولوحة تحكم إدارية متقدمة مع تكامل أنظمة الدفع والتحليلات',
    client: 'شركة التقنية المتقدمة',
    startDate: '2024-01-15',
    endDate: '2024-03-15',
    budget: '50000',
    status: 'قيد التنفيذ',
    priority: 'عالي',
    progress: 75,
    teamMembers: [
      { id: '1', name: 'أحمد محمد', avatar: 'أ', role: 'مدير المشروع', email: 'ahmed@company.com' },
      { id: '2', name: 'فاطمة علي', avatar: 'ف', role: 'مطورة واجهات', email: 'fatima@company.com' },
      { id: '3', name: 'عبدالله سالم', avatar: 'ع', role: 'مطور خلفي', email: 'abdullah@company.com' },
      { id: '4', name: 'سارة محمود', avatar: 'س', role: 'مصممة UI/UX', email: 'sara@company.com' }
    ],
    tasks: [
      { id: '1', title: 'تصميم واجهة المستخدم الرئيسية', status: 'قيد التنفيذ', priority: 'عالي', assignee: 'سارة محمود', dueDate: '2024-02-20', progress: 80 },
      { id: '2', title: 'تطوير نظام المصادقة', status: 'مكتمل', priority: 'عالي', assignee: 'عبدالله سالم', dueDate: '2024-02-10', progress: 100 },
      { id: '3', title: 'تكامل نظام الدفع', status: 'جديد', priority: 'متوسط', assignee: 'عبدالله سالم', dueDate: '2024-02-25', progress: 0 },
      { id: '4', title: 'اختبار الأداء والأمان', status: 'في المراجعة', priority: 'عاجل', assignee: 'أحمد محمد', dueDate: '2024-02-28', progress: 60 }
    ],
    files: [
      { id: '1', name: 'تصميم النماذج الأولية', type: 'figma', size: '2.5 MB', uploadDate: '2024-02-10', uploadedBy: 'سارة محمود' },
      { id: '2', name: 'متطلبات المشروع', type: 'pdf', size: '1.2 MB', uploadDate: '2024-01-20', uploadedBy: 'أحمد محمد' },
      { id: '3', name: 'كود المصدر - Frontend', type: 'zip', size: '15.8 MB', uploadDate: '2024-02-15', uploadedBy: 'فاطمة علي' }
    ],
    milestones: [
      { id: '1', title: 'إكمال التصميم', dueDate: '2024-02-01', status: 'مكتمل', progress: 100 },
      { id: '2', title: 'تطوير النسخة الأولى', dueDate: '2024-02-20', status: 'قيد التنفيذ', progress: 75 },
      { id: '3', title: 'الاختبار والمراجعة', dueDate: '2024-03-01', status: 'قادم', progress: 0 },
      { id: '4', title: 'التسليم النهائي', dueDate: '2024-03-15', status: 'قادم', progress: 0 }
    ],
    comments: [
      { id: '1', author: 'أحمد محمد', avatar: 'أ', content: 'تم الانتهاء من مراجعة التصميم، يمكن البدء في التطوير', date: '2024-02-12' },
      { id: '2', author: 'فاطمة علي', avatar: 'ف', content: 'هناك تحديث في متطلبات الواجهة الأمامية، يرجى مراجعة الملف المرفق', date: '2024-02-14' },
      { id: '3', author: 'سارة محمود', avatar: 'س', content: 'تم رفع النسخة المحدثة من التصميم مع التعديلات المطلوبة', date: '2024-02-15' }
    ],
    tags: ['تطوير ويب', 'React', 'Node.js', 'تصميم', 'عاجل']
  }

  const handleAddTask = (taskData: TaskData) => {
    console.log('إضافة مهمة جديدة للمشروع:', taskData)
    setIsTaskModalOpen(false)
    alert('تم إضافة المهمة بنجاح!')
  }

  const handleAddComment = () => {
    if (newComment.trim()) {
      console.log('إضافة تعليق:', newComment)
      setNewComment('')
      alert('تم إضافة التعليق بنجاح!')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'مكتمل': return 'bg-green-100 text-green-800 border-green-200'
      case 'قيد التنفيذ': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'في المراجعة': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'جديد': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'قادم': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'عاجل': return 'text-red-600'
      case 'عالي': return 'text-orange-600'
      case 'متوسط': return 'text-blue-600'
      case 'منخفض': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const tabs = [
    { id: 'overview', name: 'نظرة عامة', icon: BarChart3 },
    { id: 'tasks', name: 'المهام', icon: CheckCircle },
    { id: 'files', name: 'الملفات', icon: FileText },
    { id: 'team', name: 'الفريق', icon: Users },
    { id: 'comments', name: 'التعليقات', icon: MessageSquare }
  ]

  return (
    <AppLayout 
      title={project.name}
      description={`مشروع ${project.client} • ${project.status}`}
    >
      <div className="p-6 lg:p-8">
        {/* Back Button */}
        <button
          onClick={() => router.push('/projects')}
          className="flex items-center space-x-2 space-x-reverse text-primary-600 hover:text-primary-700 mb-6 group"
        >
          <ArrowRight className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>العودة إلى المشاريع</span>
        </button>

        {/* Project Header */}
        <div className="bg-gradient-to-l from-primary-500 to-primary-600 rounded-2xl p-8 text-white mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <div className="flex items-center space-x-3 space-x-reverse mb-4">
                <h1 className="text-3xl font-bold">{project.name}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)} bg-white/20 text-white border-white/30`}>
                  {project.status}
                </span>
              </div>
              <p className="text-primary-100 text-lg mb-4">{project.description}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Calendar className="w-4 h-4" />
                  <span>{project.startDate} - {project.endDate}</span>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <DollarSign className="w-4 h-4" />
                  <span>{parseInt(project.budget).toLocaleString()} ر.س</span>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Flag className={`w-4 h-4 ${getPriorityColor(project.priority)}`} />
                  <span>أولوية {project.priority}</span>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="white"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - project.progress / 100)}`}
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold">{project.progress}%</span>
                </div>
              </div>
              <p className="text-primary-100">تقدم المشروع</p>
            </div>
          </div>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-6">
            {project.tags.map((tag, index) => (
              <span key={index} className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-secondary-200 mb-8">
          <div className="border-b border-secondary-200">
            <nav className="flex space-x-8 space-x-reverse px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 space-x-reverse py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-secondary-500 hover:text-secondary-700'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <CheckCircle className="w-8 h-8 text-blue-600" />
                      <span className="text-2xl font-bold text-blue-600">
                        {project.tasks.filter(t => t.status === 'مكتمل').length}
                      </span>
                    </div>
                    <h3 className="font-semibold text-blue-900">مهام مكتملة</h3>
                    <p className="text-sm text-blue-600">من أصل {project.tasks.length} مهام</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <Users className="w-8 h-8 text-green-600" />
                      <span className="text-2xl font-bold text-green-600">{project.teamMembers.length}</span>
                    </div>
                    <h3 className="font-semibold text-green-900">أعضاء الفريق</h3>
                    <p className="text-sm text-green-600">نشطون في المشروع</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <FileText className="w-8 h-8 text-purple-600" />
                      <span className="text-2xl font-bold text-purple-600">{project.files.length}</span>
                    </div>
                    <h3 className="font-semibold text-purple-900">ملفات المشروع</h3>
                    <p className="text-sm text-purple-600">مستندات ومرفقات</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <Target className="w-8 h-8 text-orange-600" />
                      <span className="text-2xl font-bold text-orange-600">
                        {project.milestones.filter(m => m.status === 'مكتمل').length}
                      </span>
                    </div>
                    <h3 className="font-semibold text-orange-900">مراحل مكتملة</h3>
                    <p className="text-sm text-orange-600">من أصل {project.milestones.length} مراحل</p>
                  </div>
                </div>

                {/* Milestones */}
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-4">مراحل المشروع</h3>
                  <div className="space-y-4">
                    {project.milestones.map((milestone) => (
                      <div key={milestone.id} className="flex items-center justify-between p-4 bg-secondary-50 rounded-xl">
                        <div className="flex items-center space-x-4 space-x-reverse">
                          <div className={`w-4 h-4 rounded-full ${
                            milestone.status === 'مكتمل' ? 'bg-green-500' :
                            milestone.status === 'قيد التنفيذ' ? 'bg-blue-500' :
                            'bg-gray-300'
                          }`} />
                          <div>
                            <h4 className="font-medium text-secondary-900">{milestone.title}</h4>
                            <p className="text-sm text-secondary-600">موعد التسليم: {milestone.dueDate}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 space-x-reverse">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(milestone.status)}`}>
                            {milestone.status}
                          </span>
                          <div className="w-20 bg-secondary-200 rounded-full h-2">
                            <div 
                              className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${milestone.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tasks Tab */}
            {activeTab === 'tasks' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-secondary-900">مهام المشروع</h3>
                  <Button onClick={() => setIsTaskModalOpen(true)} icon={Plus}>
                    إضافة مهمة
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {project.tasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-4 bg-secondary-50 rounded-xl hover:bg-secondary-100 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 space-x-reverse mb-2">
                          <h4 className="font-medium text-secondary-900">{task.title}</h4>
                          <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(task.status)}`}>
                            {task.status}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 space-x-reverse text-sm text-secondary-600">
                          <span>المكلف: {task.assignee}</span>
                          <span>الموعد: {task.dueDate}</span>
                          <span className={`font-medium ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 space-x-reverse">
                        <div className="text-right">
                          <div className="text-sm font-medium text-secondary-900">{task.progress}%</div>
                          <div className="w-20 bg-secondary-200 rounded-full h-2 mt-1">
                            <div 
                              className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${task.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 space-x-reverse">
                          <button className="p-2 text-secondary-600 hover:text-primary-600 rounded-lg transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-secondary-600 hover:text-red-600 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Files Tab */}
            {activeTab === 'files' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-secondary-900">ملفات المشروع</h3>
                  <Button onClick={() => alert('سيتم إضافة ميزة رفع الملفات')} icon={Upload}>
                    رفع ملف
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {project.files.map((file) => (
                    <div key={file.id} className="p-4 bg-secondary-50 rounded-xl hover:bg-secondary-100 transition-colors">
                      <div className="flex items-center space-x-3 space-x-reverse mb-3">
                        <FileText className="w-8 h-8 text-primary-500" />
                        <div className="flex-1">
                          <h4 className="font-medium text-secondary-900 truncate">{file.name}</h4>
                          <p className="text-sm text-secondary-600">{file.type.toUpperCase()} • {file.size}</p>
                        </div>
                      </div>
                      <div className="text-xs text-secondary-500 mb-3">
                        رفع بواسطة {file.uploadedBy} في {file.uploadDate}
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <button className="flex-1 flex items-center justify-center p-2 text-secondary-600 hover:text-primary-600 rounded-lg transition-colors">
                          <Download className="w-4 h-4 ml-1" />
                          <span className="text-sm">تنزيل</span>
                        </button>
                        <button className="flex-1 flex items-center justify-center p-2 text-secondary-600 hover:text-blue-600 rounded-lg transition-colors">
                          <Share className="w-4 h-4 ml-1" />
                          <span className="text-sm">مشاركة</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Team Tab */}
            {activeTab === 'team' && (
              <div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-6">فريق المشروع</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {project.teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center space-x-4 space-x-reverse p-4 bg-secondary-50 rounded-xl">
                      <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-xl font-semibold text-primary-700">{member.avatar}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-secondary-900">{member.name}</h4>
                        <p className="text-sm text-secondary-600">{member.role}</p>
                        <p className="text-sm text-secondary-500">{member.email}</p>
                      </div>
                      <button 
                        onClick={() => window.open(`mailto:${member.email}`)}
                        className="p-2 text-secondary-600 hover:text-primary-600 rounded-lg transition-colors"
                      >
                        <MessageSquare className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comments Tab */}
            {activeTab === 'comments' && (
              <div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-6">تعليقات المشروع</h3>
                
                {/* Add Comment */}
                <div className="mb-8">
                  <div className="flex space-x-4 space-x-reverse">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="font-semibold text-primary-700">أ</span>
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="اكتب تعليقك هنا..."
                        className="w-full p-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                        rows={3}
                      />
                      <div className="flex justify-end mt-2">
                        <Button onClick={handleAddComment}>
                          إضافة تعليق
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-6">
                  {project.comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-4 space-x-reverse">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="font-semibold text-primary-700">{comment.avatar}</span>
                      </div>
                      <div className="flex-1">
                        <div className="bg-secondary-50 rounded-lg p-4">
                          <div className="flex items-center space-x-2 space-x-reverse mb-2">
                            <h4 className="font-medium text-secondary-900">{comment.author}</h4>
                            <span className="text-sm text-secondary-500">{comment.date}</span>
                          </div>
                          <p className="text-secondary-700">{comment.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task Modal */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title="إضافة مهمة جديدة"
        size="lg"
      >
        <TaskForm
          onSubmit={handleAddTask}
          onCancel={() => setIsTaskModalOpen(false)}
          initialData={{ project: project.name }}
        />
      </Modal>
    </AppLayout>
  )
}