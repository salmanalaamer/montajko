'use client'

import { useState } from 'react'
import { Upload, Search, Filter, Download, Eye, Trash2, FileText, Image, File, Folder, MoreVertical, Share } from 'lucide-react'
import AppLayout from '@/components/layout/AppLayout'
import Button from '@/components/ui/Button'

interface FileItem {
  id: string
  name: string
  type: 'file' | 'folder'
  extension?: string
  size: number
  uploadedBy: string
  uploadDate: string
  project: string
  isShared: boolean
  downloads: number
}

export default function FilesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('الكل')
  const [sortBy, setSortBy] = useState('date')

  const files: FileItem[] = [
    {
      id: '1',
      name: 'تصميم الواجهة الرئيسية',
      type: 'file',
      extension: 'figma',
      size: 2.5 * 1024 * 1024, // 2.5 MB
      uploadedBy: 'سارة محمود',
      uploadDate: '2024-02-15',
      project: 'تطوير موقع الشركة',
      isShared: true,
      downloads: 12
    },
    {
      id: '2',
      name: 'مستندات المشروع',
      type: 'folder',
      size: 45 * 1024 * 1024, // 45 MB
      uploadedBy: 'أحمد محمد',
      uploadDate: '2024-02-10',
      project: 'تطوير موقع الشركة',
      isShared: false,
      downloads: 0
    },
    {
      id: '3',
      name: 'شعار الشركة الجديد',
      type: 'file',
      extension: 'svg',
      size: 156 * 1024, // 156 KB
      uploadedBy: 'محمد أحمد',
      uploadDate: '2024-02-14',
      project: 'تصميم الهوية البصرية',
      isShared: true,
      downloads: 8
    },
    {
      id: '4',
      name: 'خطة التسويق الرقمي',
      type: 'file',
      extension: 'pdf',
      size: 3.8 * 1024 * 1024, // 3.8 MB
      uploadedBy: 'نورا حسن',
      uploadDate: '2024-02-12',
      project: 'حملة التسويق الرقمي',
      isShared: true,
      downloads: 15
    },
    {
      id: '5',
      name: 'كود المصدر',
      type: 'folder',
      size: 125 * 1024 * 1024, // 125 MB
      uploadedBy: 'عبدالله سالم',
      uploadDate: '2024-02-11',
      project: 'تطبيق الجوال',
      isShared: false,
      downloads: 0
    },
    {
      id: '6',
      name: 'لقطات الشاشة',
      type: 'file',
      extension: 'png',
      size: 890 * 1024, // 890 KB
      uploadedBy: 'فاطمة علي',
      uploadDate: '2024-02-13',
      project: 'تطبيق الجوال',
      isShared: true,
      downloads: 6
    }
  ]

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (item: FileItem) => {
    if (item.type === 'folder') {
      return <Folder className="w-8 h-8 text-blue-500" />
    }
    
    switch (item.extension) {
      case 'pdf':
        return <FileText className="w-8 h-8 text-red-500" />
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'svg':
        return <Image className="w-8 h-8 text-green-500" />
      case 'figma':
        return <File className="w-8 h-8 text-purple-500" />
      default:
        return <File className="w-8 h-8 text-secondary-500" />
    }
  }

  const handleFileUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true
    input.accept = '*/*'
    input.onchange = (e) => {
      const uploadedFiles = (e.target as HTMLInputElement).files
      if (uploadedFiles && uploadedFiles.length > 0) {
        console.log('رفع الملفات:', Array.from(uploadedFiles).map(f => f.name))
        alert(`تم رفع ${uploadedFiles.length} ملف بنجاح!`)
        // Here you would handle the actual file upload
      }
    }
    input.click()
  }

  const handleDownload = (file: FileItem) => {
    alert(`تنزيل ${file.name}`)
    // Here you would handle the actual download
  }

  const handleShare = (file: FileItem) => {
    navigator.clipboard.writeText(`https://example.com/files/${file.id}`)
    alert(`تم نسخ رابط المشاركة لملف ${file.name}`)
  }

  const handleDelete = (fileId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الملف؟')) {
      alert('تم حذف الملف بنجاح')
      // Here you would handle the actual deletion
    }
  }

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase())
    
    let matchesType = true
    if (filterType !== 'الكل') {
      if (filterType === 'مجلدات') matchesType = file.type === 'folder'
      else if (filterType === 'ملفات') matchesType = file.type === 'file'
      else if (filterType === 'مشاركة') matchesType = file.isShared
    }
    
    return matchesSearch && matchesType
  })

  const sortedFiles = [...filteredFiles].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'size':
        return b.size - a.size
      case 'date':
      default:
        return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
    }
  })

  const totalSize = files.reduce((acc, file) => acc + file.size, 0)
  const totalFiles = files.filter(f => f.type === 'file').length
  const totalFolders = files.filter(f => f.type === 'folder').length
  const sharedFiles = files.filter(f => f.isShared).length

  return (
    <AppLayout 
      title="إدارة الملفات"
      description="تنظيم ومشاركة ملفات المشاريع"
    >
      <div className="p-6 lg:p-8">
        {/* Action Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="bg-orange-100 p-3 rounded-xl">
              <FileText className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-secondary-900">مركز إدارة الملفات</h2>
              <p className="text-sm text-secondary-500">تنظيم ومشاركة جميع ملفاتك</p>
            </div>
          </div>
          
          <Button
            onClick={handleFileUpload}
            icon={Upload}
          >
            رفع ملفات
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 border border-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-secondary-900">{totalFiles}</p>
                <p className="text-sm text-secondary-600">ملف</p>
              </div>
              <File className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-secondary-900">{totalFolders}</p>
                <p className="text-sm text-secondary-600">مجلد</p>
              </div>
              <Folder className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-secondary-900">{sharedFiles}</p>
                <p className="text-sm text-secondary-600">مشارك</p>
              </div>
              <Share className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-secondary-900">{formatFileSize(totalSize)}</p>
                <p className="text-sm text-secondary-600">إجمالي الحجم</p>
              </div>
              <MoreVertical className="w-8 h-8 text-orange-500" />
            </div>
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
                  placeholder="البحث في الملفات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-10 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 w-full sm:w-64"
                />
              </div>
              
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="الكل">جميع الأنواع</option>
                <option value="ملفات">الملفات فقط</option>
                <option value="مجلدات">المجلدات فقط</option>
                <option value="مشاركة">المشاركة فقط</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="date">التاريخ</option>
                <option value="name">الاسم</option>
                <option value="size">الحجم</option>
              </select>
            </div>
            
            <div className="text-sm text-secondary-600">
              عرض {sortedFiles.length} من {files.length} عنصر
            </div>
          </div>
        </div>

        {/* Files Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedFiles.map((file) => (
            <div key={file.id} className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6 hover:shadow-md transition-shadow">
              {/* File Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3 space-x-reverse">
                  {getFileIcon(file)}
                  <div className="flex-1">
                    <h3 className="font-semibold text-secondary-900 truncate">{file.name}</h3>
                    <p className="text-sm text-secondary-600">{file.project}</p>
                  </div>
                </div>
                
                {file.isShared && (
                  <div className="bg-green-100 p-1 rounded">
                    <Share className="w-4 h-4 text-green-600" />
                  </div>
                )}
              </div>

              {/* File Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-secondary-600">الحجم:</span>
                  <span className="font-medium text-secondary-900">{formatFileSize(file.size)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-secondary-600">رفع بواسطة:</span>
                  <span className="font-medium text-secondary-900">{file.uploadedBy}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-secondary-600">التاريخ:</span>
                  <span className="font-medium text-secondary-900">{file.uploadDate}</span>
                </div>
                {file.type === 'file' && file.downloads > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-secondary-600">التنزيلات:</span>
                    <span className="font-medium text-secondary-900">{file.downloads}</span>
                  </div>
                )}
              </div>

              {/* File Actions */}
              <div className="flex items-center space-x-2 space-x-reverse">
                <button
                  onClick={() => alert(`عرض ${file.name}`)}
                  className="flex-1 flex items-center justify-center p-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  <Eye className="w-4 h-4 ml-1" />
                  <span className="text-sm">عرض</span>
                </button>
                
                {file.type === 'file' && (
                  <button
                    onClick={() => handleDownload(file)}
                    className="flex-1 flex items-center justify-center p-2 text-secondary-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4 ml-1" />
                    <span className="text-sm">تنزيل</span>
                  </button>
                )}
                
                <button
                  onClick={() => handleShare(file)}
                  className="flex-1 flex items-center justify-center p-2 text-secondary-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Share className="w-4 h-4 ml-1" />
                  <span className="text-sm">مشاركة</span>
                </button>
                
                <button
                  onClick={() => handleDelete(file.id)}
                  className="p-2 text-secondary-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {sortedFiles.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">لا توجد ملفات</h3>
            <p className="text-secondary-600">
              {searchTerm || filterType !== 'الكل'
                ? 'لم يتم العثور على ملفات تطابق البحث'
                : 'ابدأ برفع ملفاتك الأولى'
              }
            </p>
            <Button
              onClick={handleFileUpload}
              icon={Upload}
              className="mt-4"
            >
              رفع ملفات
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  )
}