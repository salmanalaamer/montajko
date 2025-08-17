'use client'

import { useState, useEffect } from 'react'
import { Bell, Check, Trash2, AlertCircle, Calendar, Users, FileText, Settings, Filter, CheckCircle, Clock, X } from 'lucide-react'
import AppLayout from '@/components/layout/AppLayout'
import Button from '@/components/ui/Button'
import { database, Notification } from '@/lib/database'

export default function NotificationsPage() {
  const [filter, setFilter] = useState('all')
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  // Load notifications
  const loadNotifications = () => {
    setLoading(true)
    const currentUser = database.getCurrentUser()
    if (currentUser) {
      const userNotifications = database.getUserNotifications(currentUser.id)
      setNotifications(userNotifications)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadNotifications()
  }, [])

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
    const diffInMinutes = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) {
      return 'الآن'
    } else if (diffInMinutes < 60) {
      return `منذ ${diffInMinutes} دقيقة`
    } else if (diffInMinutes < 1440) { // 24 hours
      const diffInHours = Math.floor(diffInMinutes / 60)
      return `منذ ${diffInHours} ساعة`
    } else {
      const diffInDays = Math.floor(diffInMinutes / 1440)
      return `منذ ${diffInDays} يوم`
    }
  }

  const markAsRead = (id: string) => {
    const success = database.markNotificationAsRead(id)
    if (success) {
      loadNotifications()
    }
  }

  const markAllAsRead = () => {
    const currentUser = database.getCurrentUser()
    if (currentUser) {
      notifications.forEach(notif => {
        if (!notif.isRead) {
          database.markNotificationAsRead(notif.id)
        }
      })
      loadNotifications()
    }
  }

  const deleteNotification = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الإشعار؟')) {
      const success = database.deleteNotification(id)
      if (success) {
        loadNotifications()
      }
    }
  }

  const clearAllNotifications = () => {
    if (confirm('هل أنت متأكد من حذف جميع الإشعارات؟')) {
      const currentUser = database.getCurrentUser()
      if (currentUser) {
        notifications.forEach(notif => {
          database.deleteNotification(notif.id)
        })
        loadNotifications()
      }
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

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'task': return 'المهام'
      case 'project': return 'المشاريع'
      case 'team': return 'الفريق'
      case 'system': return 'النظام'
      case 'deadline': return 'المواعيد'
      default: return type
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read when clicked
    if (!notification.isRead) {
      markAsRead(notification.id)
    }
    
    // Navigate to action URL if available
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl
    }
  }

  if (loading) {
    return (
      <AppLayout title="الإشعارات" description="تحميل الإشعارات...">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-secondary-600">جاري تحميل الإشعارات...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

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
            
            {notifications.length > 0 && (
              <Button onClick={clearAllNotifications} variant="ghost" size="sm">
                <Trash2 className="w-4 h-4 ml-1" />
                مسح الكل
              </Button>
            )}
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

            {/* Type filters */}
            {['task', 'project', 'team', 'system', 'deadline'].map(type => {
              const typeNotifications = notifications.filter(n => n.type === type)
              if (typeNotifications.length === 0) return null

              return (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === type
                      ? 'bg-blue-500 text-white'
                      : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                  }`}
                >
                  {getTypeLabel(type)} ({typeNotifications.length})
                </button>
              )
            })}
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
                  : `لا توجد إشعارات في فئة "${getTypeLabel(filter)}"`
                }
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-xl border-l-4 shadow-sm border border-secondary-200 p-6 transition-all hover:shadow-md cursor-pointer ${
                  getPriorityColor(notification.priority)
                } ${!notification.isRead ? 'ring-2 ring-blue-100' : ''}`}
                onClick={() => handleNotificationClick(notification)}
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
                          {getTimeAgo(notification.createdAt)}
                        </span>
                        
                        <div className="flex items-center space-x-2 space-x-reverse">
                          {notification.actionUrl && (
                            <span className="text-sm text-primary-600 font-medium">
                              انقر للعرض
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 space-x-reverse">
                    {!notification.isRead && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          markAsRead(notification.id)
                        }}
                        className="p-2 text-secondary-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="تحديد كمقروء"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteNotification(notification.id)
                      }}
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

        {/* Empty state with action */}
        {notifications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">لا توجد إشعارات حتى الآن</h3>
            <p className="text-secondary-600 mb-4">
              عندما تتم إضافة مهام أو مشاريع جديدة، ستظهر الإشعارات هنا
            </p>
            <div className="flex items-center justify-center space-x-4 space-x-reverse">
              <Button onClick={() => window.location.href = '/projects'} variant="outline">
                إنشاء مشروع
              </Button>
              <Button onClick={() => window.location.href = '/tasks'} variant="outline">
                إنشاء مهمة
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}