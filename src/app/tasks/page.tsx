'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  User,
  Clock,
  AlertTriangle,
  CheckCircle2,
  PlayCircle,
  Eye,
  Edit,
  Trash2,
  FolderOpen,
  Tag,
  Users
} from 'lucide-react'
import AppLayout from '@/components/layout/AppLayout'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import TaskForm from '@/components/forms/TaskForm'
import { database, Task, Project, User as UserType } from '@/lib/database'

type StatusFilter = 'all' | 'todo' | 'in-progress' | 'review' | 'completed'
type PriorityFilter = 'all' | 'urgent' | 'high' | 'medium' | 'low'
type ViewMode = 'board' | 'list'

export default function TasksPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [users, setUsers] = useState<UserType[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all')
  const [projectFilter, setProjectFilter] = useState<string>('all')
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<ViewMode>('board')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deletingTask, setDeletingTask] = useState<Task | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [tasks, searchQuery, statusFilter, priorityFilter, projectFilter, assigneeFilter])

  const loadData = () => {
    const tasksData = database.getTasks()
    const projectsData = database.getProjects()
    const usersData = database.getUsers()
    setTasks(tasksData)
    setProjects(projectsData)
    setUsers(usersData)
  }

  const applyFilters = () => {
    let filtered = [...tasks]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter)
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter)
    }

    // Project filter
    if (projectFilter !== 'all') {
      filtered = filtered.filter(task => task.projectId === projectFilter)
    }

    // Assignee filter
    if (assigneeFilter !== 'all') {
      filtered = filtered.filter(task => task.assignedTo === assigneeFilter)
    }

    setFilteredTasks(filtered)
  }

  const handleCreateTask = (taskData: any) => {
    const currentUser = database.getCurrentUser()
    if (!currentUser) return

    database.createTask({
      ...taskData,
      createdBy: currentUser.id
    })
    
    loadData()
    setIsCreateModalOpen(false)
    showSuccessMessage('تم إنشاء المهمة بنجاح!')
  }

  const handleEditTask = (taskData: any) => {
    if (!editingTask) return
    
    database.updateTask(editingTask.id, taskData)
    loadData()
    setIsEditModalOpen(false)
    setEditingTask(null)
    showSuccessMessage('تم تحديث المهمة بنجاح!')
  }

  const handleDeleteTask = () => {
    if (!deletingTask) return
    
    const tasks = database.getTasks()
    const filteredTasks = tasks.filter(task => task.id !== deletingTask.id)
    database['setStorageData']('montajko_tasks', filteredTasks)
    
    loadData()
    setIsDeleteModalOpen(false)
    setDeletingTask(null)
    showSuccessMessage('تم حذف المهمة بنجاح!')
  }

  const updateTaskStatus = (taskId: string, newStatus: Task['status']) => {
    database.updateTask(taskId, { status: newStatus })
    loadData()
  }

  const showSuccessMessage = (message: string) => {
    const toast = document.createElement('div')
    toast.className = 'fixed top-4 left-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50'
    toast.textContent = message
    document.body.appendChild(toast)
    
    setTimeout(() => {
      toast.remove()
    }, 3000)
  }

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'todo': return 'text-gray-600 bg-gray-100'
      case 'in-progress': return 'text-blue-600 bg-blue-100'
      case 'review': return 'text-yellow-600 bg-yellow-100'
      case 'completed': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent': return 'border-r-4 border-red-500'
      case 'high': return 'border-r-4 border-orange-500'
      case 'medium': return 'border-r-4 border-yellow-500'
      case 'low': return 'border-r-4 border-green-500'
      default: return 'border-r-4 border-gray-300'
    }
  }

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'todo': return Clock
      case 'in-progress': return PlayCircle
      case 'review': return Eye
      case 'completed': return CheckCircle2
      default: return Clock
    }
  }

  const getProjectName = (projectId: string) => {
    return projects.find(p => p.id === projectId)?.name || 'مشروع غير معروف'
  }

  const getUserName = (userId: string) => {
    return users.find(u => u.id === userId)?.name || 'غير محدد'
  }

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false
    return new Date(dueDate) < new Date() && true
  }

  const tasksByStatus = {
    todo: filteredTasks.filter(t => t.status === 'todo'),
    'in-progress': filteredTasks.filter(t => t.status === 'in-progress'),
    review: filteredTasks.filter(t => t.status === 'review'),
    completed: filteredTasks.filter(t => t.status === 'completed')
  }

  const TaskCard = ({ task }: { task: Task }) => {
    const StatusIcon = getStatusIcon(task.status)
    const overdue = isOverdue(task.dueDate)
    
    return (
      <div className={`bg-white rounded-xl shadow-sm border hover:shadow-md transition-all duration-200 p-4 ${getPriorityColor(task.priority)}`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 flex-1">
            {task.name}
          </h3>
          <div className="flex items-center space-x-1 space-x-reverse ml-2">
            <button
              onClick={() => {
                setEditingTask(task)
                setIsEditModalOpen(true)
              }}
              className="p-1 text-gray-400 hover:text-blue-600 rounded"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setDeletingTask(task)
                setIsDeleteModalOpen(true)
              }}
              className="p-1 text-gray-400 hover:text-red-600 rounded"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-xs text-gray-600 mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Tags */}
        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {task.tags.slice(0, 2).map(tag => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
            {task.tags.length > 2 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{task.tags.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Project */}
        <div className="flex items-center text-xs text-gray-500 mb-3">
          <FolderOpen className="w-3 h-3 ml-1" />
          <span className="truncate">{getProjectName(task.projectId)}</span>
        </div>

        {/* Due Date */}
        {task.dueDate && (
          <div className={`flex items-center text-xs mb-3 ${overdue ? 'text-red-600' : 'text-gray-500'}`}>
            <Calendar className="w-3 h-3 ml-1" />
            <span>{new Date(task.dueDate).toLocaleDateString('ar-SA')}</span>
            {overdue && <AlertTriangle className="w-3 h-3 mr-1" />}
          </div>
        )}

        {/* Assignee */}
        {task.assignedTo && (
          <div className="flex items-center text-xs text-gray-500 mb-3">
            <User className="w-3 h-3 ml-1" />
            <span>{getUserName(task.assignedTo)}</span>
          </div>
        )}

        {/* Priority */}
        <div className="flex items-center justify-between">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            task.priority === 'urgent' ? 'bg-red-100 text-red-700' :
            task.priority === 'high' ? 'bg-orange-100 text-orange-700' :
            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
            'bg-green-100 text-green-700'
          }`}>
            {task.priority === 'urgent' && 'عاجل'}
            {task.priority === 'high' && 'عالي'}
            {task.priority === 'medium' && 'متوسط'}
            {task.priority === 'low' && 'منخفض'}
          </span>

          {/* Status Actions */}
          <div className="flex items-center space-x-1 space-x-reverse">
            {task.status !== 'completed' && (
              <button
                onClick={() => updateTaskStatus(task.id, 'completed')}
                className="p-1 text-gray-400 hover:text-green-600 rounded"
                title="إكمال المهمة"
              >
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
            {task.status === 'todo' && (
              <button
                onClick={() => updateTaskStatus(task.id, 'in-progress')}
                className="p-1 text-gray-400 hover:text-blue-600 rounded"
                title="بدء المهمة"
              >
                <PlayCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <AppLayout 
      title="إدارة المهام"
      description="عرض وإدارة جميع مهام المشاريع"
    >
      <div className="p-6">
        {/* Header Actions */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="البحث في المهام..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-3 flex-wrap">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">كل الحالات</option>
              <option value="todo">مهام جديدة</option>
              <option value="in-progress">قيد التنفيذ</option>
              <option value="review">قيد المراجعة</option>
              <option value="completed">مكتملة</option>
            </select>

            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">كل المشاريع</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>

            <select
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">كل الأعضاء</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
          </div>

          {/* Create Button */}
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center space-x-2 space-x-reverse"
          >
            <Plus className="w-5 h-5" />
            <span>مهمة جديدة</span>
          </Button>
        </div>

        {/* Tasks Count */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            عرض {filteredTasks.length} من {tasks.length} مهمة
          </p>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Todo Column */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700 flex items-center">
                <Clock className="w-5 h-5 ml-2" />
                مهام جديدة
              </h3>
              <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">
                {tasksByStatus.todo.length}
              </span>
            </div>
            <div className="space-y-3">
              {tasksByStatus.todo.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>

          {/* In Progress Column */}
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-blue-700 flex items-center">
                <PlayCircle className="w-5 h-5 ml-2" />
                قيد التنفيذ
              </h3>
              <span className="bg-blue-200 text-blue-700 px-2 py-1 rounded-full text-sm">
                {tasksByStatus['in-progress'].length}
              </span>
            </div>
            <div className="space-y-3">
              {tasksByStatus['in-progress'].map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>

          {/* Review Column */}
          <div className="bg-yellow-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-yellow-700 flex items-center">
                <Eye className="w-5 h-5 ml-2" />
                قيد المراجعة
              </h3>
              <span className="bg-yellow-200 text-yellow-700 px-2 py-1 rounded-full text-sm">
                {tasksByStatus.review.length}
              </span>
            </div>
            <div className="space-y-3">
              {tasksByStatus.review.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>

          {/* Completed Column */}
          <div className="bg-green-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-green-700 flex items-center">
                <CheckCircle2 className="w-5 h-5 ml-2" />
                مكتملة
              </h3>
              <span className="bg-green-200 text-green-700 px-2 py-1 rounded-full text-sm">
                {tasksByStatus.completed.length}
              </span>
            </div>
            <div className="space-y-3">
              {tasksByStatus.completed.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Create Task Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="إنشاء مهمة جديدة"
        size="lg"
      >
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setIsCreateModalOpen(false)}
          users={users}
          projects={projects}
        />
      </Modal>

      {/* Edit Task Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingTask(null)
        }}
        title="تعديل المهمة"
        size="lg"
      >
        {editingTask && (
          <TaskForm
            initialData={editingTask}
            onSubmit={handleEditTask}
            onCancel={() => {
              setIsEditModalOpen(false)
              setEditingTask(null)
            }}
            users={users}
            projects={projects}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setDeletingTask(null)
        }}
        title="تأكيد الحذف"
      >
        <div className="p-6">
          <div className="flex items-center mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600 ml-3" />
            <h3 className="text-lg font-semibold text-gray-900">
              هل أنت متأكد من حذف هذه المهمة؟
            </h3>
          </div>
          
          {deletingTask && (
            <div className="mb-6">
              <p className="text-gray-600 mb-2">
                المهمة: <span className="font-semibold">{deletingTask.name}</span>
              </p>
              <p className="text-sm text-red-600">
                ⚠️ هذا الإجراء لا يمكن التراجع عنه.
              </p>
            </div>
          )}
          
          <div className="flex justify-end space-x-3 space-x-reverse">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteModalOpen(false)
                setDeletingTask(null)
              }}
            >
              إلغاء
            </Button>
            <Button
              variant="outline"
              onClick={handleDeleteTask}
              className="bg-red-600 text-white hover:bg-red-700 border-red-600"
            >
              حذف المهمة
            </Button>
          </div>
        </div>
      </Modal>
    </AppLayout>
  )
}