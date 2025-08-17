'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Search, Filter, Calendar, Users, BarChart3, Edit, Trash2, ChevronRight, Eye } from 'lucide-react'
import AppLayout from '@/components/layout/AppLayout'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import ProjectForm, { ProjectData } from '@/components/forms/ProjectForm'

interface Project extends ProjectData {
  id: string
  progress: number
  createdAt: string
}

export default function ProjectsPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'تطوير موقع الشركة الجديد',
      description: 'تطوير موقع إلكتروني حديث ومتجاوب للشركة يتضمن نظام إدارة المحتوى',
      client: 'شركة التقنية المتقدمة',
      startDate: '2024-01-15',
      endDate: '2024-03-15',
      budget: '50000',
      teamMembers: ['أحمد محمد', 'فاطمة علي', 'عبدالله سالم'],
      priority: 'عالي',
      status: 'قيد التنفيذ',
      progress: 75,
      createdAt: '2024-01-10'
    },
    {
      id: '2',
      name: 'حملة التسويق الرقمي',
      description: 'حملة تسويقية شاملة عبر منصات التواصل الاجتماعي',
      client: 'مؤسسة الابتكار',
      startDate: '2024-02-01',
      endDate: '2024-04-01',
      budget: '30000',
      teamMembers: ['نورا حسن', 'محمد أحمد'],
      priority: 'متوسط',
      status: 'في المراجعة',
      progress: 90,
      createdAt: '2024-01-25'
    },
    {
      id: '3',
      name: 'تصميم الهوية البصرية',
      description: 'تصميم شعار وهوية بصرية كاملة للعلامة التجارية',
      client: 'شركة الإبداع',
      startDate: '2024-01-01',
      endDate: '2024-02-01',
      budget: '15000',
      teamMembers: ['سارة محمود'],
      priority: 'متوسط',
      status: 'مكتمل',
      progress: 100,
      createdAt: '2023-12-15'
    },
    {
      id: '4',
      name: 'تطبيق الجوال',
      description: 'تطوير تطبيق جوال متعدد المنصات للتجارة الإلكترونية',
      client: 'متجر المستقبل',
      startDate: '2024-03-01',
      endDate: '2024-06-01',
      budget: '80000',
      teamMembers: ['أحمد محمد', 'عبدالله سالم', 'فاطمة علي', 'محمد أحمد'],
      priority: 'عالي',
      status: 'قيد التخطيط',
      progress: 25,
      createdAt: '2024-02-20'
    }
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('الكل')

  const handleAddProject = (projectData: ProjectData) => {
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
      progress: 0,
      createdAt: new Date().toISOString().split('T')[0]
    }
    setProjects(prev => [newProject, ...prev])
    setIsModalOpen(false)
  }

  const handleEditProject = (projectData: ProjectData) => {
    if (editingProject) {
      setProjects(prev => 
        prev.map(p => 
          p.id === editingProject.id 
            ? { ...p, ...projectData }
            : p
        )
      )
      setEditingProject(null)
      setIsModalOpen(false)
    }
  }

  const handleDeleteProject = (projectId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المشروع؟')) {
      setProjects(prev => prev.filter(p => p.id !== projectId))
    }
  }

  const openEditModal = (project: Project) => {
    setEditingProject(project)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingProject(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'مكتمل': return 'bg-green-100 text-green-800'
      case 'قيد التنفيذ': return 'bg-blue-100 text-blue-800'
      case 'في المراجعة': return 'bg-yellow-100 text-yellow-800'
      case 'قيد التخطيط': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'عالي': return 'text-red-600'
      case 'متوسط': return 'text-yellow-600'
      case 'منخفض': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'الكل' || project.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <AppLayout 
      title="إدارة المشاريع"
      description="إدارة جميع مشاريعك الإبداعية"
    >
      <div className="p-6 lg:p-8">
        {/* Action Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="bg-primary-100 p-3 rounded-xl">
              <BarChart3 className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-secondary-900">مركز إدارة المشاريع</h2>
              <p className="text-sm text-secondary-500">تتبع ومراقب جميع مشاريعك</p>
            </div>
          </div>
          
          <Button
            onClick={() => setIsModalOpen(true)}
            icon={Plus}
          >
            مشروع جديد
          </Button>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 sm:space-x-reverse">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="البحث في المشاريع..."
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
                <option value="قيد التخطيط">قيد التخطيط</option>
                <option value="قيد التنفيذ">قيد التنفيذ</option>
                <option value="في المراجعة">في المراجعة</option>
                <option value="مكتمل">مكتمل</option>
              </select>
            </div>
            
            <div className="text-sm text-secondary-600">
              عرض {filteredProjects.length} من {projects.length} مشروع
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6 hover:shadow-md transition-shadow">
              {/* Project Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <button
                    onClick={() => router.push(`/projects/${project.id}`)}
                    className="text-xl font-semibold text-secondary-900 mb-2 hover:text-primary-600 transition-colors text-right block w-full"
                  >
                    {project.name}
                  </button>
                  <p className="text-secondary-600 text-sm mb-3">{project.description}</p>
                  
                  <div className="flex items-center space-x-4 space-x-reverse text-sm text-secondary-500">
                    <span>العميل: {project.client}</span>
                    <span className={`font-medium ${getPriorityColor(project.priority)}`}>
                      {project.priority}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 space-x-reverse">
                  <button
                    onClick={() => router.push(`/projects/${project.id}`)}
                    className="p-2 text-secondary-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="عرض التفاصيل"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openEditModal(project)}
                    className="p-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="p-2 text-secondary-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Project Status */}
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
                
                <div className="flex items-center space-x-4 space-x-reverse text-sm text-secondary-600">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 ml-1" />
                    {project.teamMembers.length} أعضاء
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 ml-1" />
                    {project.endDate}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-secondary-700">التقدم</span>
                  <span className="text-sm font-medium text-secondary-900">{project.progress}%</span>
                </div>
                <div className="w-full bg-secondary-200 rounded-full h-2">
                  <div 
                    className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Project Footer */}
              <div className="flex items-center justify-between text-sm text-secondary-500">
                <span>الميزانية: {parseInt(project.budget).toLocaleString()} ر.س</span>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <span>تم الإنشاء: {project.createdAt}</span>
                  <button
                    onClick={() => router.push(`/projects/${project.id}`)}
                    className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
                  >
                    عرض التفاصيل
                    <ChevronRight className="w-3 h-3 mr-1" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">لا توجد مشاريع</h3>
            <p className="text-secondary-600">
              {searchTerm || filterStatus !== 'الكل' 
                ? 'لم يتم العثور على مشاريع تطابق البحث'
                : 'ابدأ بإنشاء مشروعك الأول'
              }
            </p>
          </div>
        )}
      </div>

      {/* Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingProject ? 'تعديل المشروع' : 'مشروع جديد'}
        size="lg"
      >
        <ProjectForm
          onSubmit={editingProject ? handleEditProject : handleAddProject}
          onCancel={closeModal}
          initialData={editingProject || undefined}
        />
      </Modal>
    </AppLayout>
  )
}