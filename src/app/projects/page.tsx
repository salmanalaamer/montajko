'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar, 
  Users, 
  Clock,
  AlertCircle,
  CheckCircle,
  PlayCircle,
  PauseCircle,
  Target
} from 'lucide-react'
import AppLayout from '@/components/layout/AppLayout'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import ProjectForm from '@/components/forms/ProjectForm'
import { database, Project, User } from '@/lib/database'

type ViewMode = 'grid' | 'list'
type StatusFilter = 'all' | 'active' | 'completed' | 'planning' | 'paused'
type PriorityFilter = 'all' | 'urgent' | 'high' | 'medium' | 'low'

export default function ProjectsPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deletingProject, setDeletingProject] = useState<Project | null>(null)

  // Load data
  useEffect(() => {
    loadData()
  }, [])

  // Apply filters
  useEffect(() => {
    applyFilters()
  }, [projects, searchQuery, statusFilter, priorityFilter])

  const loadData = () => {
    const projectsData = database.getProjects()
    const usersData = database.getUsers()
    setProjects(projectsData)
    setUsers(usersData)
  }

  const applyFilters = () => {
    let filtered = [...projects]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => project.status === statusFilter)
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(project => project.priority === priorityFilter)
    }

    setFilteredProjects(filtered)
  }

  const handleCreateProject = (projectData: any) => {
    const currentUser = database.getCurrentUser()
    if (!currentUser) return

    const newProject = database.createProject({
      ...projectData,
      managerId: currentUser.id
    })
    
    loadData()
    setIsCreateModalOpen(false)
    showSuccessMessage('تم إنشاء المشروع بنجاح!')
  }

  const handleEditProject = (projectData: any) => {
    if (!editingProject) return
    
    database.updateProject(editingProject.id, projectData)
    loadData()
    setIsEditModalOpen(false)
    setEditingProject(null)
    showSuccessMessage('تم تحديث المشروع بنجاح!')
  }

  const handleDeleteProject = () => {
    if (!deletingProject) return
    
    database.deleteProject(deletingProject.id)
    loadData()
    setIsDeleteModalOpen(false)
    setDeletingProject(null)
    showSuccessMessage('تم حذف المشروع بنجاح!')
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

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100'
      case 'completed': return 'text-blue-600 bg-blue-100'
      case 'planning': return 'text-yellow-600 bg-yellow-100'
      case 'paused': return 'text-orange-600 bg-orange-100'
      case 'cancelled': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPriorityColor = (priority: Project['priority']) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100'
      case 'high': return 'text-orange-600 bg-orange-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: Project['status']) => {
    switch (status) {
      case 'active': return PlayCircle
      case 'completed': return CheckCircle
      case 'planning': return Target
      case 'paused': return PauseCircle
      case 'cancelled': return AlertCircle
      default: return Clock
    }
  }

  const getTeamMemberNames = (memberIds: string[]) => {
    return memberIds
      .map(id => users.find(user => user.id === id)?.name)
      .filter(Boolean)
      .slice(0, 3) // Show only first 3 members
  }

  return (
    <AppLayout 
      title="إدارة المشاريع"
      description="عرض وإدارة جميع مشاريع الشركة"
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
                placeholder="البحث في المشاريع..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">كل الحالات</option>
              <option value="active">نشط</option>
              <option value="completed">مكتمل</option>
              <option value="planning">قيد التخطيط</option>
              <option value="paused">متوقف</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as PriorityFilter)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">كل الأولويات</option>
              <option value="urgent">عاجل</option>
              <option value="high">عالي</option>
              <option value="medium">متوسط</option>
              <option value="low">منخفض</option>
            </select>
          </div>

          {/* View Toggle & Create Button */}
          <div className="flex gap-3">
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-white shadow text-primary-600' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-white shadow text-primary-600' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center space-x-2 space-x-reverse"
            >
              <Plus className="w-5 h-5" />
              <span>مشروع جديد</span>
            </Button>
          </div>
        </div>

        {/* Projects Count */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            عرض {filteredProjects.length} من {projects.length} مشروع
          </p>
        </div>

        {/* Projects Grid/List */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">لا توجد مشاريع</h3>
            <p className="text-gray-500 mb-4">ابدأ بإنشاء مشروعك الأول</p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              إنشاء مشروع جديد
            </Button>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }>
            {filteredProjects.map((project) => {
              const StatusIcon = getStatusIcon(project.status)
              const teamNames = getTeamMemberNames(project.teamMembers)
              
              return (
                <div
                  key={project.id}
                  className={`bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-100 ${
                    viewMode === 'list' ? 'p-6' : 'p-6'
                  }`}
                >
                  {viewMode === 'grid' ? (
                    // Grid View
                    <>
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                            {project.name}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                            {project.description}
                          </p>
                        </div>
                      </div>

                      {/* Status & Priority */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {project.status === 'active' && 'نشط'}
                          {project.status === 'completed' && 'مكتمل'}
                          {project.status === 'planning' && 'تخطيط'}
                          {project.status === 'paused' && 'متوقف'}
                          {project.status === 'cancelled' && 'ملغي'}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                          {project.priority === 'urgent' && 'عاجل'}
                          {project.priority === 'high' && 'عالي'}
                          {project.priority === 'medium' && 'متوسط'}
                          {project.priority === 'low' && 'منخفض'}
                        </span>
                      </div>

                      {/* Progress */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">التقدم</span>
                          <span className="text-sm font-medium text-gray-900">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Team & Dates */}
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          <span>{project.teamMembers.length} عضو</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{new Date(project.startDate).toLocaleDateString('ar-SA')}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/projects/${project.id}`)}
                          className="flex items-center space-x-1 space-x-reverse"
                        >
                          <Eye className="w-4 h-4" />
                          <span>عرض</span>
                        </Button>
                        
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <button
                            onClick={() => {
                              setEditingProject(project)
                              setIsEditModalOpen(true)
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setDeletingProject(project)
                              setIsDeleteModalOpen(true)
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    // List View
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-4 space-x-reverse">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {project.name}
                            </h3>
                            <p className="text-sm text-gray-600 truncate">
                              {project.description}
                            </p>
                          </div>
                          
                          <div className="flex items-center space-x-6 space-x-reverse">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {project.status === 'active' && 'نشط'}
                              {project.status === 'completed' && 'مكتمل'}
                              {project.status === 'planning' && 'تخطيط'}
                              {project.status === 'paused' && 'متوقف'}
                            </span>
                            
                            <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
                              <Users className="w-4 h-4" />
                              <span>{project.teamMembers.length}</span>
                            </div>
                            
                            <div className="w-24">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs text-gray-500">{project.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div 
                                  className="bg-primary-500 h-1.5 rounded-full"
                                  style={{ width: `${project.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 space-x-reverse ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/projects/${project.id}`)}
                          className="flex items-center space-x-1 space-x-reverse"
                        >
                          <Eye className="w-4 h-4" />
                          <span>عرض</span>
                        </Button>
                        
                        <button
                          onClick={() => {
                            setEditingProject(project)
                            setIsEditModalOpen(true)
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setDeletingProject(project)
                            setIsDeleteModalOpen(true)
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="إنشاء مشروع جديد"
        size="lg"
      >
        <ProjectForm
          onSubmit={handleCreateProject}
          onCancel={() => setIsCreateModalOpen(false)}
          users={users}
        />
      </Modal>

      {/* Edit Project Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingProject(null)
        }}
        title="تعديل المشروع"
        size="lg"
      >
        {editingProject && (
          <ProjectForm
            initialData={editingProject}
            onSubmit={handleEditProject}
            onCancel={() => {
              setIsEditModalOpen(false)
              setEditingProject(null)
            }}
            users={users}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setDeletingProject(null)
        }}
        title="تأكيد الحذف"
      >
        <div className="p-6">
          <div className="flex items-center mb-4">
            <AlertCircle className="w-6 h-6 text-red-600 ml-3" />
            <h3 className="text-lg font-semibold text-gray-900">
              هل أنت متأكد من حذف هذا المشروع؟
            </h3>
          </div>
          
          {deletingProject && (
            <div className="mb-6">
              <p className="text-gray-600 mb-2">
                المشروع: <span className="font-semibold">{deletingProject.name}</span>
              </p>
              <p className="text-sm text-red-600">
                ⚠️ سيتم حذف جميع المهام المرتبطة بهذا المشروع أيضاً. هذا الإجراء لا يمكن التراجع عنه.
              </p>
            </div>
          )}
          
          <div className="flex justify-end space-x-3 space-x-reverse">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteModalOpen(false)
                setDeletingProject(null)
              }}
            >
              إلغاء
            </Button>
            <Button
              variant="outline"
              onClick={handleDeleteProject}
              className="bg-red-600 text-white hover:bg-red-700 border-red-600"
            >
              حذف المشروع
            </Button>
          </div>
        </div>
      </Modal>
    </AppLayout>
  )
}