'use client'

import { useState } from 'react'
import { Plus, Search, Filter, Calendar, User, CheckCircle, Edit, Trash2, Clock } from 'lucide-react'
import AppLayout from '@/components/layout/AppLayout'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import TaskForm, { TaskData } from '@/components/forms/TaskForm'

interface Task extends TaskData {
  id: string
  createdAt: string
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'تصميم واجهة المستخدم الرئيسية',
      description: 'تصميم وتطوير الواجهة الرئيسية للموقع مع مراعاة تجربة المستخدم',
      assignee: 'فاطمة علي',
      dueDate: '2024-02-15',
      priority: 'عالي',
      status: 'قيد التنفيذ',
      project: 'تطوير موقع الشركة الجديد',
      estimatedHours: '16',
      createdAt: '2024-01-20'
    },
    {
      id: '2',
      title: 'إنشاء المحتوى التسويقي',
      description: 'كتابة وتصميم المحتوى التسويقي لمنصات التواصل الاجتماعي',
      assignee: 'نورا حسن',
      dueDate: '2024-02-10',
      priority: 'متوسط',
      status: 'في المراجعة',
      project: 'حملة التسويق الرقمي',
      estimatedHours: '12',
      createdAt: '2024-02-01'
    },
    {
      id: '3',
      title: 'تطوير API المنتجات',
      description: 'برمجة وتطوير واجهة برمجة التطبيقات للمنتجات',
      assignee: 'أحمد محمد',
      dueDate: '2024-02-20',
      priority: 'عالي',
      status: 'جديد',
      project: 'تطبيق الجوال',
      estimatedHours: '24',
      createdAt: '2024-02-05'
    },
    {
      id: '4',
      title: 'مراجعة الشعار النهائي',
      description: 'مراجعة وتطوير الشعار النهائي للعلامة التجارية',
      assignee: 'سارة محمود',
      dueDate: '2024-01-30',
      priority: 'منخفض',
      status: 'مكتمل',
      project: 'تصميم الهوية البصرية',
      estimatedHours: '4',
      createdAt: '2024-01-15'
    },
    {
      id: '5',
      title: 'اختبار الأداء',
      description: 'اختبار أداء الموقع وتحسين سرعة التحميل',
      assignee: 'عبدالله سالم',
      dueDate: '2024-02-25',
      priority: 'عاجل',
      status: 'قيد التنفيذ',
      project: 'تطوير موقع الشركة الجديد',
      estimatedHours: '8',
      createdAt: '2024-02-10'
    }
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('الكل')
  const [filterPriority, setFilterPriority] = useState<string>('الكل')

  const handleAddTask = (taskData: TaskData) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0]
    }
    setTasks(prev => [newTask, ...prev])
    setIsModalOpen(false)
  }

  const handleEditTask = (taskData: TaskData) => {
    if (editingTask) {
      setTasks(prev => 
        prev.map(t => 
          t.id === editingTask.id 
            ? { ...t, ...taskData }
            : t
        )
      )
      setEditingTask(null)
      setIsModalOpen(false)
    }
  }

  const handleDeleteTask = (taskId: string) => {
    if (confirm('هل أنت متأكد من حذف هذه المهمة؟')) {
      setTasks(prev => prev.filter(t => t.id !== taskId))
    }
  }

  const handleStatusChange = (taskId: string, newStatus: TaskData['status']) => {
    setTasks(prev => 
      prev.map(t => 
        t.id === taskId 
          ? { ...t, status: newStatus }
          : t
      )
    )
  }

  const openEditModal = (task: Task) => {
    setEditingTask(task)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingTask(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'مكتمل': return 'bg-green-100 text-green-800 border-green-200'
      case 'قيد التنفيذ': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'في المراجعة': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'جديد': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'عاجل': return 'text-red-600 bg-red-50 border-red-200'
      case 'عالي': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'متوسط': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'منخفض': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getDaysRemaining = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.assignee.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.project.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'الكل' || task.status === filterStatus
    const matchesPriority = filterPriority === 'الكل' || task.priority === filterPriority
    return matchesSearch && matchesStatus && matchesPriority
  })

  const statusCounts = {
    total: tasks.length,
    new: tasks.filter(t => t.status === 'جديد').length,
    inProgress: tasks.filter(t => t.status === 'قيد التنفيذ').length,
    inReview: tasks.filter(t => t.status === 'في المراجعة').length,
    completed: tasks.filter(t => t.status === 'مكتمل').length
  }

  return (
    <AppLayout 
      title="إدارة المهام"
      description="تتبع وإدارة جميع مهام فريقك"
    >
      <div className="p-6 lg:p-8">
        {/* Action Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="bg-green-100 p-3 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-secondary-900">مركز إدارة المهام</h2>
              <p className="text-sm text-secondary-500">تنظيم ومتابعة جميع المهام</p>
            </div>
          </div>
          
          <Button
            onClick={() => setIsModalOpen(true)}
            icon={Plus}
          >
            مهمة جديدة
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 border border-secondary-200">
            <div className="text-2xl font-bold text-secondary-900">{statusCounts.total}</div>
            <div className="text-sm text-secondary-600">إجمالي المهام</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-2xl font-bold text-gray-600">{statusCounts.new}</div>
            <div className="text-sm text-gray-600">جديد</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">{statusCounts.inProgress}</div>
            <div className="text-sm text-blue-600">قيد التنفيذ</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-yellow-200">
            <div className="text-2xl font-bold text-yellow-600">{statusCounts.inReview}</div>
            <div className="text-sm text-yellow-600">في المراجعة</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <div className="text-2xl font-bold text-green-600">{statusCounts.completed}</div>
            <div className="text-sm text-green-600">مكتمل</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 sm:space-x-reverse">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="البحث في المهام..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-10 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 w-full sm:w-64"
                />
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="الكل">جميع الحالات</option>
                <option value="جديد">جديد</option>
                <option value="قيد التنفيذ">قيد التنفيذ</option>
                <option value="في المراجعة">في المراجعة</option>
                <option value="مكتمل">مكتمل</option>
              </select>

              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="الكل">جميع الأولويات</option>
                <option value="عاجل">عاجل</option>
                <option value="عالي">عالي</option>
                <option value="متوسط">متوسط</option>
                <option value="منخفض">منخفض</option>
              </select>
            </div>
            
            <div className="text-sm text-secondary-600">
              عرض {filteredTasks.length} من {tasks.length} مهمة
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks.map((task) => {
            const daysRemaining = getDaysRemaining(task.dueDate)
            const isOverdue = daysRemaining < 0
            const isDueSoon = daysRemaining <= 3 && daysRemaining >= 0

            return (
              <div key={task.id} className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 space-x-reverse mb-3">
                      <h3 className="text-lg font-semibold text-secondary-900">{task.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </div>
                    
                    <p className="text-secondary-600 text-sm mb-4">{task.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-secondary-500">
                      <div className="flex items-center">
                        <User className="w-4 h-4 ml-1" />
                        {task.assignee}
                      </div>
                      <div className="flex items-center">
                        <Calendar className={`w-4 h-4 ml-1 ${isOverdue ? 'text-red-500' : isDueSoon ? 'text-yellow-500' : ''}`} />
                        <span className={isOverdue ? 'text-red-500 font-medium' : isDueSoon ? 'text-yellow-500 font-medium' : ''}>
                          {task.dueDate}
                          {isOverdue && ' (متأخر)'}
                          {isDueSoon && !isOverdue && ` (${daysRemaining} أيام)`}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 ml-1" />
                        {task.estimatedHours} ساعة
                      </div>
                      <div className="text-primary-600 font-medium">
                        {task.project}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 space-x-reverse">
                    {task.status !== 'مكتمل' && (
                      <button
                        onClick={() => handleStatusChange(task.id, 'مكتمل')}
                        className="p-2 text-secondary-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="إكمال المهمة"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => openEditModal(task)}
                      className="p-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-2 text-secondary-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">لا توجد مهام</h3>
            <p className="text-secondary-600">
              {searchTerm || filterStatus !== 'الكل' || filterPriority !== 'الكل'
                ? 'لم يتم العثور على مهام تطابق البحث'
                : 'ابدأ بإنشاء مهمتك الأولى'
              }
            </p>
          </div>
        )}
      </div>

      {/* Task Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingTask ? 'تعديل المهمة' : 'مهمة جديدة'}
        size="lg"
      >
        <TaskForm
          onSubmit={editingTask ? handleEditTask : handleAddTask}
          onCancel={closeModal}
          initialData={editingTask || undefined}
        />
      </Modal>
    </AppLayout>
  )
}