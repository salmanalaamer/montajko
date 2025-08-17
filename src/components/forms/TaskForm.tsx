'use client'

import { useState } from 'react'
import { Calendar, Clock, Users, FolderOpen, Tag, AlertCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import { Task, User, Project } from '@/lib/database'

export interface TaskData {
  name: string
  description: string
  projectId: string
  status: Task['status']
  priority: Task['priority']
  assignedTo?: string
  dueDate?: string
  estimatedHours?: number
  tags: string[]
}

interface TaskFormProps {
  initialData?: Partial<Task>
  onSubmit: (data: TaskData) => void
  onCancel: () => void
  users: User[]
  projects: Project[]
}

export default function TaskForm({ initialData, onSubmit, onCancel, users, projects }: TaskFormProps) {
  const [formData, setFormData] = useState<TaskData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    projectId: initialData?.projectId || '',
    status: initialData?.status || 'todo',
    priority: initialData?.priority || 'medium',
    assignedTo: initialData?.assignedTo || '',
    dueDate: initialData?.dueDate || '',
    estimatedHours: initialData?.estimatedHours || undefined,
    tags: initialData?.tags || []
  })

  const [tagInput, setTagInput] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: keyof TaskData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      handleInputChange('tags', [...formData.tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    handleInputChange('tags', formData.tags.filter(tag => tag !== tagToRemove))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'اسم المهمة مطلوب'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'وصف المهمة مطلوب'
    }

    if (!formData.projectId) {
      newErrors.projectId = 'يجب اختيار المشروع'
    }

    if (formData.estimatedHours && formData.estimatedHours < 0) {
      newErrors.estimatedHours = 'ساعات العمل المقدرة يجب أن تكون رقماً موجباً'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      // Clean up empty fields
      const cleanData = { ...formData }
      if (!cleanData.assignedTo) delete cleanData.assignedTo
      if (!cleanData.dueDate) delete cleanData.dueDate
      if (!cleanData.estimatedHours) delete cleanData.estimatedHours
      
      onSubmit(cleanData)
    }
  }

  const getStatusLabel = (status: Task['status']) => {
    switch (status) {
      case 'todo': return 'مهمة جديدة'
      case 'in-progress': return 'قيد التنفيذ'
      case 'review': return 'قيد المراجعة'
      case 'completed': return 'مكتملة'
      default: return status
    }
  }

  const getPriorityLabel = (priority: Task['priority']) => {
    switch (priority) {
      case 'low': return 'منخفض'
      case 'medium': return 'متوسط'
      case 'high': return 'عالي'
      case 'urgent': return 'عاجل'
      default: return priority
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          المعلومات الأساسية
        </h3>
        
        {/* Task Name */}
        <div>
          <Input
            label="اسم المهمة *"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            error={errors.name}
            placeholder="أدخل اسم المهمة"
          />
        </div>

        {/* Task Description */}
        <div>
          <Textarea
            label="وصف المهمة *"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            error={errors.description}
            placeholder="اكتب وصفاً مفصلاً للمهمة"
            rows={3}
          />
        </div>

        {/* Project Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FolderOpen className="w-4 h-4 inline ml-1" />
            المشروع *
          </label>
          <select
            value={formData.projectId}
            onChange={(e) => handleInputChange('projectId', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.projectId ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">اختر المشروع</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
          {errors.projectId && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 ml-1" />
              {errors.projectId}
            </p>
          )}
        </div>
      </div>

      {/* Status & Priority */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            حالة المهمة
          </label>
          <select
            value={formData.status}
            onChange={(e) => handleInputChange('status', e.target.value as Task['status'])}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="todo">مهمة جديدة</option>
            <option value="in-progress">قيد التنفيذ</option>
            <option value="review">قيد المراجعة</option>
            <option value="completed">مكتملة</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الأولوية
          </label>
          <select
            value={formData.priority}
            onChange={(e) => handleInputChange('priority', e.target.value as Task['priority'])}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="low">منخفض</option>
            <option value="medium">متوسط</option>
            <option value="high">عالي</option>
            <option value="urgent">عاجل</option>
          </select>
        </div>
      </div>

      {/* Assignment & Dates */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          التعيين والمواعيد
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Assigned To */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="w-4 h-4 inline ml-1" />
              مُعيّن إلى
            </label>
            <select
              value={formData.assignedTo}
              onChange={(e) => handleInputChange('assignedTo', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">غير محدد</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} - {user.department}
                </option>
              ))}
            </select>
          </div>

          {/* Due Date */}
          <div>
            <Input
              label="تاريخ الاستحقاق"
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleInputChange('dueDate', e.target.value)}
              icon={Calendar}
            />
          </div>
        </div>

        {/* Estimated Hours */}
        <div>
          <Input
            label="ساعات العمل المقدرة"
            type="number"
            value={formData.estimatedHours || ''}
            onChange={(e) => handleInputChange('estimatedHours', e.target.value ? parseFloat(e.target.value) : undefined)}
            error={errors.estimatedHours}
            placeholder="0"
            icon={Clock}
            min="0"
            step="0.5"
          />
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          العلامات
        </h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Tag className="w-4 h-4 inline ml-1" />
            علامات المهمة
          </label>
          <div className="flex gap-2 mb-3">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="أضف علامة جديدة"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            />
            <Button
              type="button"
              onClick={addTag}
              variant="outline"
              className="whitespace-nowrap"
            >
              إضافة
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {formData.tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="mr-2 text-primary-600 hover:text-primary-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Task Details Preview */}
      {formData.projectId && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">معاينة المهمة</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p><span className="font-medium">المشروع:</span> {projects.find(p => p.id === formData.projectId)?.name}</p>
            <p><span className="font-medium">الحالة:</span> {getStatusLabel(formData.status)}</p>
            <p><span className="font-medium">الأولوية:</span> {getPriorityLabel(formData.priority)}</p>
            {formData.assignedTo && (
              <p><span className="font-medium">مُعيّن إلى:</span> {users.find(u => u.id === formData.assignedTo)?.name}</p>
            )}
            {formData.dueDate && (
              <p><span className="font-medium">تاريخ الاستحقاق:</span> {new Date(formData.dueDate).toLocaleDateString('ar-SA')}</p>
            )}
            {formData.estimatedHours && (
              <p><span className="font-medium">الوقت المقدر:</span> {formData.estimatedHours} ساعة</p>
            )}
            {formData.tags.length > 0 && (
              <p><span className="font-medium">العلامات:</span> {formData.tags.join(', ')}</p>
            )}
          </div>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 space-x-reverse pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          إلغاء
        </Button>
        <Button type="submit">
          {initialData ? 'تحديث المهمة' : 'إنشاء المهمة'}
        </Button>
      </div>
    </form>
  )
}