'use client'

import { useState } from 'react'
import { Bell, Check, Trash2, AlertCircle, Calendar, Users, FileText, Settings, Filter, CheckCircle, Clock, X } from 'lucide-react'
import AppLayout from '@/components/layout/AppLayout'
import Button from '@/components/ui/Button'

interface Notification {
  id: string
  type: 'task' | 'project' | 'team' | 'system' | 'deadline'
  title: string
  message: string
  time: string
  isRead: boolean
  priority: 'high' | 'medium' | 'low'
  actionUrl?: string
}

export default function NotificationsPage() {
  const [filter, setFilter] = useState('all')
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'deadline',
      title: 'موعد تسليم قريب',
      message: 'مهمة "تصميم واجهة المستخدم الرئيسية" مستحقة خلال يومين',
      time: '2024-02-18T10:30:00',
      isRead: false,
      priority: 'high',
      actionUrl: '/tasks/1'
    },
    {
      id: '2',
      type: 'project',
      title: 'تحديث حالة المشروع',
      message: 'تم تحديث تقدم مشروع "تطوير موقع الشركة الجديد" إلى 75%',
      time: '2024-02-18T09:15:00',
      isRead: false,
      priority: 'medium',
      actionUrl: '/projects/1'
    },
    {
      id: '3',
      type: 'team',
      title: 'عضو فريق جديد',
      message: 'انضم "محمد أحمد" إلى فريق مشروع التطبيق المحمول',
      time: '2024-02-18T08:45:00',
      isRead: true,
      priority: 'low',
      actionUrl: '/team'
    },
    {
      id: '4',
      type: 'task',
      title: 'مهمة جديدة مُعينة لك',
      message: 'تم تعيين مهمة "اختبار الأداء والأمان" لك من قبل أحمد محمد',
      time: '2024-02-17T16:20:00',
      isRead: false,
      priority: 'high',
      actionUrl: '/tasks/4'
    },
    {
      id: '5',
      type: 'system',
      title: 'تحديث النظام',
      message: 'تم تحديث النظام إلى الإصدار 1.2.0 مع إضافة ميزات جديدة',
      time: '2024-02-17T14:00:00',
      isRead: true,
      priority: 'medium'
    },
    {
      id: '6',
      type: 'project',
      title: 'موافقة على المشروع',
      message: 'تمت الموافقة على مشروع "حملة التسويق الرقمي" ويمكن البدء في التنفيذ',
      time: '2024-02-17T11:30:00',
      isRead: false,
      priority: 'high',
      actionUrl: '/projects/2'
    },
    {
      id: '7',
      type: 'team',
      title: 'تقييم الأداء',
      message: 'تم إكمال تقييم أداء الفريق لشهر يناير، النتائج متاحة الآن',
      time: '2024-02-16T13:15:00',
      isRead: true,
      priority: 'medium',
      actionUrl: '/analytics'
    },
    {
      id: '8',
      type: 'task',
      title: 'مهمة مكتملة',
      message: 'أكملت سارة محمود مهمة "تصميم النماذج الأولية"',
      time: '2024-02-16T10:45:00',
      isRead: true,
      priority: 'low'
    }
  ])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'task': return <CheckCircle className="w-6 h-6 text-green-500" />
      case 'project': return <FileText className="w-6 h-6 text-blue-500" />
      case 'team': return <Users className="w-6 h-6 text-purple-500" />
      case 'system': return <Settings className="w-6 h-6 text-orange-500" />
      case 'deadline': return <Clock className="w-6 h-6 text-red-500" />
      default: return <Bell className="w-6 h-6 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50/50'
      case 'medium': return 'border-l-yellow-500 bg-yellow-50/50'
      case 'low': return 'border-l-green-500 bg-green-50/50'
      default: return 'border-l-gray-500 bg-gray-50/50'
    }
  }

  const getTimeAgo = (time: string) => {
    const now = new Date()
    const notificationTime = new Date(time)
    const diffInHours = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      return 'الآن'
    } else if (diffInHours < 24) {
      return `منذ ${diffInHours} ساعة`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `منذ ${diffInDays} يوم`
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, isRead: true }))
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
  }

  const clearAllNotifications = () => {
    if (confirm('هل أنت متأكد من حذف جميع الإشعارات؟')) {
      setNotifications([])
    }
  }

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.isRead
    if (filter === 'high') return notif.priority === 'high'
    if (filter !== 'all') return notif.type === filter
    return true
  })

  const unreadCount = notifications.filter(n => !n.isRead).length
  const highPriorityCount = notifications.filter(n => n.priority === 'high' && !n.isRead).length

  return (
    <AppLayout 
      title="الإشعارات"
      description={`${unreadCount} إشعار غير مقروء • ${highPriorityCount} عاجل`}
    >
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="flex items-center space-x-4 space-x-reverse mb-4 lg:mb-0">
            <div className="bg-blue-100 p-3 rounded-xl">
              <Bell className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-secondary-900">مركز الإشعارات</h2>
              <p className="text-sm text-secondary-500">
                {unreadCount === 0 ? 'جميع الإشعارات مقروءة' : `${unreadCount} إشعار جديد`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 space-x-reverse">
            {unreadCount > 0 && (
              <Button onClick={markAllAsRead} variant="outline" size="sm">
                <Check className="w-4 h-4 ml-1" />
                تحديد الكل كمقروء
              </Button>
            )}
            
            <Button onClick={clearAllNotifications} variant="ghost" size="sm">
              <Trash2 className="w-4 h-4 ml-1" />
              مسح الكل
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 border border-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-secondary-900">{notifications.length}</p>
                <p className="text-sm text-secondary-600">إجمالي الإشعارات</p>
              </div>
              <Bell className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-red-600">{unreadCount}</p>
                <p className="text-sm text-secondary-600">غير مقروء</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-orange-600">{highPriorityCount}</p>
                <p className="text-sm text-secondary-600">عاجل</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {notifications.filter(n => n.isRead).length}
                </p>
                <p className="text-sm text-secondary-600">مقروء</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm font-medium text-secondary-700">فلترة:</span>
            
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-primary-500 text-white'
                  : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
              }`}
            >
              الكل ({notifications.length})
            </button>
            
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'unread'
                  ? 'bg-primary-500 text-white'
                  : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
              }`}
            >
              غير مقروء ({unreadCount})
            </button>
            
            <button
              onClick={() => setFilter('high')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'high'
                  ? 'bg-red-500 text-white'
                  : 'bg-red-100 text-red-600 hover:bg-red-200'
              }`}
            >
              عاجل ({notifications.filter(n => n.priority === 'high').length})
            </button>
            
            <button
              onClick={() => setFilter('task')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'task'
                  ? 'bg-green-500 text-white'
                  : 'bg-green-100 text-green-600 hover:bg-green-200'
              }`}
            >
              المهام ({notifications.filter(n => n.type === 'task').length})
            </button>
            
            <button
              onClick={() => setFilter('project')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'project'
                  ? 'bg-blue-500 text-white'
                  : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
              }`}
            >
              المشاريع ({notifications.filter(n => n.type === 'project').length})
            </button>
            
            <button
              onClick={() => setFilter('team')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'team'
                  ? 'bg-purple-500 text-white'
                  : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
              }`}
            >
              الفريق ({notifications.filter(n => n.type === 'team').length})
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-secondary-900 mb-2">لا توجد إشعارات</h3>
              <p className="text-secondary-600">
                {filter === 'all' 
                  ? 'لم يتم العثور على أي إشعارات'
                  : `لا توجد إشعارات في فئة "${filter}"`
                }
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-xl border-l-4 shadow-sm border border-secondary-200 p-6 transition-all hover:shadow-md ${
                  getPriorityColor(notification.priority)
                } ${!notification.isRead ? 'ring-2 ring-blue-100' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 space-x-reverse flex-1">
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 space-x-reverse mb-2">
                        <h3 className={`font-semibold ${!notification.isRead ? 'text-secondary-900' : 'text-secondary-700'}`}>
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          notification.priority === 'high' ? 'bg-red-100 text-red-800' :
                          notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {notification.priority === 'high' ? 'عاجل' :
                           notification.priority === 'medium' ? 'متوسط' : 'منخفض'}
                        </span>
                      </div>
                      
                      <p className="text-secondary-600 mb-3">{notification.message}</p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-secondary-500">
                          {getTimeAgo(notification.time)}
                        </span>
                        
                        <div className="flex items-center space-x-2 space-x-reverse">
                          {notification.actionUrl && (
                            <button
                              onClick={() => window.location.href = notification.actionUrl!}
                              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                            >
                              عرض التفاصيل
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 space-x-reverse">
                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-2 text-secondary-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="تحديد كمقروء"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-2 text-secondary-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="حذف الإشعار"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Load More */}
        {filteredNotifications.length > 0 && (
          <div className="text-center mt-8">
            <Button variant="outline" onClick={() => alert('تحميل المزيد من الإشعارات')}>
              تحميل المزيد
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  )
}