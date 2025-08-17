'use client'

import { useState, useEffect, ReactNode } from 'react'
import { Menu, Bell, User, LogOut } from 'lucide-react'
import Sidebar from './Sidebar'
import Modal from '../ui/Modal'
import ProjectForm, { ProjectData } from '../forms/ProjectForm'
import TaskForm, { TaskData } from '../forms/TaskForm'

interface AppLayoutProps {
  children: ReactNode
  title?: string
  description?: string
}

export default function AppLayout({ children, title, description }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifications, setNotifications] = useState(3)
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  // Handle quick actions from sidebar
  useEffect(() => {
    const handleProjectAction = () => setIsProjectModalOpen(true)
    const handleTaskAction = () => setIsTaskModalOpen(true)
    const handleUploadAction = () => handleFileUpload()

    window.addEventListener('quickAction:project', handleProjectAction)
    window.addEventListener('quickAction:task', handleTaskAction)
    window.addEventListener('quickAction:upload', handleUploadAction)

    return () => {
      window.removeEventListener('quickAction:project', handleProjectAction)
      window.removeEventListener('quickAction:task', handleTaskAction)
      window.removeEventListener('quickAction:upload', handleUploadAction)
    }
  }, [])

  // Handle sidebar toggle
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleAddProject = (projectData: ProjectData) => {
    console.log('إضافة مشروع جديد:', projectData)
    setIsProjectModalOpen(false)
    // Add to database here
    showSuccessMessage('تم إنشاء المشروع بنجاح!')
  }

  const handleAddTask = (taskData: TaskData) => {
    console.log('إضافة مهمة جديدة:', taskData)
    setIsTaskModalOpen(false)
    // Add to database here
    showSuccessMessage('تم إنشاء المهمة بنجاح!')
  }

  const handleFileUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true
    input.accept = 'image/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx'
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files
      if (files && files.length > 0) {
        console.log('رفع الملفات:', Array.from(files).map(f => f.name))
        showSuccessMessage(`تم رفع ${files.length} ملف بنجاح!`)
        // Upload files here
      }
    }
    input.click()
  }

  const showSuccessMessage = (message: string) => {
    // Create toast notification
    const toast = document.createElement('div')
    toast.className = 'fixed top-4 left-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in'
    toast.textContent = message
    document.body.appendChild(toast)
    
    setTimeout(() => {
      toast.remove()
    }, 3000)
  }

  const handleNotificationClick = () => {
    setNotifications(0)
    showSuccessMessage('تم عرض جميع الإشعارات')
  }

  const handleLogout = () => {
    if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
      showSuccessMessage('تم تسجيل الخروج بنجاح')
      // Handle logout logic here
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* Main Content */}
      <div className="flex-1 lg:mr-72 flex flex-col">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-secondary-200 sticky top-0 z-30">
          <div className="px-4 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              {/* Left side - Menu toggle and title */}
              <div className="flex items-center space-x-4 space-x-reverse">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 hover:bg-secondary-100 rounded-lg transition-colors"
                >
                  <Menu className="w-6 h-6 text-secondary-600" />
                </button>
                
                <div>
                  {title && (
                    <h1 className="text-xl lg:text-2xl font-bold text-secondary-900">{title}</h1>
                  )}
                  {description && (
                    <p className="text-secondary-600 text-sm lg:text-base">{description}</p>
                  )}
                </div>
              </div>

              {/* Right side - User actions */}
              <div className="flex items-center space-x-2 lg:space-x-4 space-x-reverse">
                {/* Notifications */}
                <button
                  onClick={handleNotificationClick}
                  className="relative p-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  <Bell className="w-5 h-5 lg:w-6 lg:h-6" />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notifications}
                    </span>
                  )}
                </button>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 space-x-reverse p-2 hover:bg-secondary-100 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-700">أ</span>
                    </div>
                    <div className="hidden lg:block text-right">
                      <p className="text-sm font-medium text-secondary-900">أحمد محمد</p>
                      <p className="text-xs text-secondary-500">مدير المشاريع</p>
                    </div>
                  </button>

                  {/* User dropdown */}
                  {showUserMenu && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowUserMenu(false)}
                      />
                      <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-secondary-200 py-2 z-20">
                        <button
                          onClick={() => {
                            setShowUserMenu(false)
                            // Navigate to profile
                          }}
                          className="w-full flex items-center space-x-3 space-x-reverse px-4 py-2 text-secondary-700 hover:bg-secondary-50"
                        >
                          <User className="w-4 h-4" />
                          <span>الملف الشخصي</span>
                        </button>
                        <hr className="my-2 border-secondary-200" />
                        <button
                          onClick={() => {
                            setShowUserMenu(false)
                            handleLogout()
                          }}
                          className="w-full flex items-center space-x-3 space-x-reverse px-4 py-2 text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>تسجيل الخروج</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-secondary-200 px-4 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-2 lg:space-y-0">
            <p className="text-sm text-secondary-500">
              © 2024 منصة إدارة المشاريع الإبداعية. جميع الحقوق محفوظة.
            </p>
            <div className="flex items-center space-x-4 space-x-reverse text-sm text-secondary-500">
              <button className="hover:text-primary-600 transition-colors">
                الدعم الفني
              </button>
              <span>•</span>
              <button className="hover:text-primary-600 transition-colors">
                سياسة الخصوصية
              </button>
              <span>•</span>
              <button className="hover:text-primary-600 transition-colors">
                شروط الاستخدام
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* Modals */}
      <Modal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        title="مشروع جديد"
        size="lg"
      >
        <ProjectForm
          onSubmit={handleAddProject}
          onCancel={() => setIsProjectModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title="مهمة جديدة"
        size="lg"
      >
        <TaskForm
          onSubmit={handleAddTask}
          onCancel={() => setIsTaskModalOpen(false)}
        />
      </Modal>
    </div>
  )
}