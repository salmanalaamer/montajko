'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { 
  Home, 
  FolderOpen, 
  Calendar, 
  Users, 
  BarChart3, 
  FileText, 
  Settings, 
  Bell,
  Upload,
  Search,
  Menu,
  X,
  ChevronRight,
  Star,
  Clock,
  TrendingUp
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [expandedSections, setExpandedSections] = useState<string[]>(['main'])

  const mainMenuItems = [
    { 
      id: 'dashboard', 
      name: 'لوحة التحكم', 
      icon: Home, 
      href: '/', 
      badge: null 
    },
    { 
      id: 'projects', 
      name: 'المشاريع', 
      icon: FolderOpen, 
      href: '/projects', 
      badge: '12' 
    },
    { 
      id: 'tasks', 
      name: 'المهام', 
      icon: Calendar, 
      href: '/tasks', 
      badge: '8' 
    },
    { 
      id: 'team', 
      name: 'الفريق', 
      icon: Users, 
      href: '/team', 
      badge: null 
    },
    { 
      id: 'analytics', 
      name: 'التحليلات', 
      icon: BarChart3, 
      href: '/analytics', 
      badge: null 
    },
    { 
      id: 'files', 
      name: 'الملفات', 
      icon: FileText, 
      href: '/files', 
      badge: null 
    }
  ]

  const quickActions = [
    { 
      id: 'new-project', 
      name: 'مشروع جديد', 
      icon: FolderOpen, 
      action: () => handleQuickAction('project') 
    },
    { 
      id: 'new-task', 
      name: 'مهمة جديدة', 
      icon: Calendar, 
      action: () => handleQuickAction('task') 
    },
    { 
      id: 'upload', 
      name: 'رفع ملف', 
      icon: Upload, 
      action: () => handleQuickAction('upload') 
    }
  ]

  const recentItems = [
    { name: 'تطوير موقع الشركة', type: 'مشروع', href: '/projects/1' },
    { name: 'تصميم واجهة المستخدم', type: 'مهمة', href: '/tasks/1' },
    { name: 'حملة التسويق الرقمي', type: 'مشروع', href: '/projects/2' },
    { name: 'مراجعة التصاميم', type: 'مهمة', href: '/tasks/2' }
  ]

  const handleNavigation = (href: string) => {
    router.push(href)
    if (window.innerWidth < 1024) {
      onToggle() // Close sidebar on mobile after navigation
    }
  }

  const handleQuickAction = (type: string) => {
    // Dispatch custom events for quick actions
    window.dispatchEvent(new CustomEvent(`quickAction:${type}`))
    if (window.innerWidth < 1024) {
      onToggle()
    }
  }

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const isActiveRoute = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 right-0 h-full bg-gradient-to-b from-white to-blue-50/30 shadow-xl border-l border-blue-200/50 z-50
        transform transition-transform duration-300 ease-in-out w-80 backdrop-blur-sm
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        lg:translate-x-0
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-primary-200/30 bg-gradient-to-l from-primary-50/50 to-transparent">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-primary-900 text-lg">إدارة المشاريع</h2>
              <p className="text-xs text-primary-600 font-medium">الإصدار 1.0 - احترافي</p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="lg:hidden p-2 hover:bg-primary-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-primary-600" />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-primary-200/30">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-400 w-5 h-5" />
            <input
              type="text"
              placeholder="البحث السريع..."
              className="w-full pl-4 pr-12 py-3 bg-gradient-to-r from-blue-50/50 to-primary-50/30 border border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm placeholder-primary-400 shadow-inner"
            />
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {/* Main Navigation */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-primary-800 uppercase tracking-wide">القائمة الرئيسية</h3>
              <button
                onClick={() => toggleSection('main')}
                className={`p-2 hover:bg-primary-100 rounded-lg transition-all duration-200 ${
                  expandedSections.includes('main') ? 'rotate-90 bg-primary-100' : ''
                }`}
              >
                <ChevronRight className="w-4 h-4 text-primary-500" />
              </button>
            </div>
            
            {expandedSections.includes('main') && (
              <nav className="space-y-2">
                {mainMenuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.href)}
                    className={`
                      w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 group relative
                      ${isActiveRoute(item.href)
                        ? 'bg-gradient-to-l from-primary-500 to-primary-600 text-white shadow-lg transform scale-[1.02]'
                        : 'text-secondary-600 hover:bg-gradient-to-l hover:from-primary-50 hover:to-blue-50 hover:text-primary-700 hover:shadow-md'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <item.icon className={`w-5 h-5 ${
                        isActiveRoute(item.href) ? 'text-white' : 'text-primary-500 group-hover:text-primary-600'
                      }`} />
                      <span className={`font-semibold ${
                        isActiveRoute(item.href) ? 'text-white' : 'text-secondary-700'
                      }`}>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        isActiveRoute(item.href) 
                          ? 'bg-white/20 text-white' 
                          : 'bg-primary-100 text-primary-700'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    {isActiveRoute(item.href) && (
                      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white/30 rounded-l-full" />
                    )}
                  </button>
                ))}
              </nav>
            )}
          </div>

          {/* Quick Actions */}
          <div className="p-6 border-t border-primary-200/30 bg-gradient-to-br from-green-50/30 to-transparent">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-green-800 uppercase tracking-wide">الإجراءات السريعة</h3>
              <button
                onClick={() => toggleSection('actions')}
                className={`p-2 hover:bg-green-100 rounded-lg transition-all duration-200 ${
                  expandedSections.includes('actions') ? 'rotate-90 bg-green-100' : ''
                }`}
              >
                <ChevronRight className="w-4 h-4 text-green-500" />
              </button>
            </div>
            
            {expandedSections.includes('actions') && (
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={action.action}
                    className="flex flex-col items-center space-y-2 p-3 bg-gradient-to-br from-white to-green-50 hover:from-green-50 hover:to-green-100 border border-green-200/50 rounded-xl transition-all duration-200 group hover:shadow-md hover:scale-105"
                  >
                    <action.icon className="w-6 h-6 text-green-600 group-hover:text-green-700 group-hover:scale-110 transition-all" />
                    <span className="text-xs font-medium text-green-700 text-center leading-tight">{action.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="p-6 border-t border-primary-200/30 bg-gradient-to-br from-purple-50/30 to-transparent">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-purple-800 uppercase tracking-wide">إحصائيات سريعة</h3>
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gradient-to-l from-blue-50 to-primary-50 border border-blue-200/50 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-blue-900">المشاريع النشطة</p>
                  <p className="text-xs text-blue-600">هذا الشهر</p>
                </div>
                <span className="text-xl font-bold text-blue-600">12</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gradient-to-l from-green-50 to-emerald-50 border border-green-200/50 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-green-900">المهام المكتملة</p>
                  <p className="text-xs text-green-600">هذا الأسبوع</p>
                </div>
                <span className="text-xl font-bold text-green-600">24</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gradient-to-l from-purple-50 to-pink-50 border border-purple-200/50 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-purple-900">الأعضاء النشطون</p>
                  <p className="text-xs text-purple-600">الآن</p>
                </div>
                <span className="text-xl font-bold text-purple-600">8</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="p-6 border-t border-primary-200/30 bg-gradient-to-br from-orange-50/30 to-transparent">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-orange-800 uppercase tracking-wide">النشاط الأخير</h3>
              <Clock className="w-5 h-5 text-orange-500" />
            </div>
            
            <div className="space-y-2">
              {recentItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleNavigation(item.href)}
                  className="w-full text-right p-3 bg-gradient-to-l from-white to-orange-50/50 hover:from-orange-50 hover:to-orange-100 border border-orange-200/50 rounded-xl transition-all duration-200 group hover:shadow-sm"
                >
                  <p className="text-sm font-semibold text-orange-900 group-hover:text-orange-700 truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-orange-600 font-medium">{item.type}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-primary-200/30 bg-gradient-to-br from-primary-50/50 to-blue-50/30">
          <div className="flex items-center space-x-3 space-x-reverse mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-lg font-bold text-white">أ</span>
            </div>
            <div className="flex-1">
              <button 
                onClick={() => handleNavigation('/profile')}
                className="text-right hover:text-primary-700 transition-colors w-full"
              >
                <p className="text-sm font-semibold text-primary-900">أحمد محمد</p>
                <p className="text-xs text-primary-600 font-medium">مدير المشاريع</p>
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 space-x-reverse">
            <button
              onClick={() => handleNavigation('/notifications')}
              className="flex-1 flex items-center justify-center p-3 text-primary-600 hover:text-white hover:bg-primary-500 rounded-xl transition-all duration-200 hover:shadow-md hover:scale-105 relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">3</span>
            </button>
            
            <button
              onClick={() => handleNavigation('/settings')}
              className="flex-1 flex items-center justify-center p-3 text-primary-600 hover:text-white hover:bg-primary-500 rounded-xl transition-all duration-200 hover:shadow-md hover:scale-105"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}