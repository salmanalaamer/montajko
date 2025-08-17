'use client'

import { useState } from 'react'
import { Calendar, Users, DollarSign, Tag, AlertCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import { Project, User } from '@/lib/database'

export interface ProjectData {
  name: string
  description: string
  status: Project['status']
  priority: Project['priority']
  progress: number
  startDate: string
  endDate?: string
  budget?: number
  category: string
  tags: string[]
  teamMembers: string[]
}

interface ProjectFormProps {
  initialData?: Partial<Project>
  onSubmit: (data: ProjectData) => void
  onCancel: () => void
  users: User[]
}

export default function ProjectForm({ initialData, onSubmit, onCancel, users }: ProjectFormProps) {
  const [formData, setFormData] = useState<ProjectData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    status: initialData?.status || 'planning',
    priority: initialData?.priority || 'medium',
    progress: initialData?.progress || 0,
    startDate: initialData?.startDate || new Date().toISOString().split('T')[0],
    endDate: initialData?.endDate || '',
    budget: initialData?.budget || undefined,
    category: initialData?.category || '',
    tags: initialData?.tags || [],
    teamMembers: initialData?.teamMembers || []
  })

  const [tagInput, setTagInput] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const categories = [
    'تطوير ويب',
    'تطبيقات الجوال',
    'تسويق رقمي',
    'تصميم جرافيكي',
    'استشارات',
    'أبحاث وتطوير',
    'مبيعات',
    'موارد بشرية',
    'أخرى'
  ]

  const handleInputChange = (field: keyof ProjectData, value: any) => {
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

  const toggleTeamMember = (userId: string) => {
    const isSelected = formData.teamMembers.includes(userId)
    if (isSelected) {
      handleInputChange('teamMembers', formData.teamMembers.filter(id => id !== userId))
    } else {
      handleInputChange('teamMembers', [...formData.teamMembers, userId])
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'اسم المشروع مطلوب'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'وصف المشروع مطلوب'
    }

    if (!formData.category.trim()) {
      newErrors.category = 'فئة المشروع مطلوبة'
    }

    if (formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'تاريخ الانتهاء يجب أن يكون بعد تاريخ البداية'
    }

    if (formData.progress < 0 || formData.progress > 100) {
      newErrors.progress = 'التقدم يجب أن يكون بين 0 و 100'
    }

    if (formData.budget && formData.budget < 0) {
      newErrors.budget = 'الميزانية يجب أن تكون رقماً موجباً'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const getStatusLabel = (status: Project['status']) => {
    switch (status) {
      case 'planning': return 'قيد التخطيط'
      case 'active': return 'نشط'
      case 'paused': return 'متوقف'
      case 'completed': return 'مكتمل'
      case 'cancelled': return 'ملغي'
      default: return status
    }
  }

  const getPriorityLabel = (priority: Project['priority']) => {
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
        
        {/* Project Name */}
        <div>
          <Input
            label="اسم المشروع *"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            error={errors.name}
            placeholder="أدخل اسم المشروع"
          />
        </div>

        {/* Project Description */}
        <div>
          <Textarea
            label="وصف المشروع *"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            error={errors.description}
            placeholder="اكتب وصفاً مفصلاً للمشروع"
            rows={3}
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            فئة المشروع *
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.category ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">اختر فئة المشروع</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 ml-1" />
              {errors.category}
            </p>
          )}
        </div>
      </div>

      {/* Status & Priority */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            حالة المشروع
          </label>
          <select
            value={formData.status}
            onChange={(e) => handleInputChange('status', e.target.value as Project['status'])}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="planning">قيد التخطيط</option>
            <option value="active">نشط</option>
            <option value="paused">متوقف</option>
            <option value="completed">مكتمل</option>
            <option value="cancelled">ملغي</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الأولوية
          </label>
          <select
            value={formData.priority}
            onChange={(e) => handleInputChange('priority', e.target.value as Project['priority'])}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="low">منخفض</option>
            <option value="medium">متوسط</option>
            <option value="high">عالي</option>
            <option value="urgent">عاجل</option>
          </select>
        </div>
      </div>

      {/* Dates & Progress */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          التواريخ والتقدم
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="تاريخ البداية *"
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              icon={Calendar}
            />
          </div>

          <div>
            <Input
              label="تاريخ الانتهاء"
              type="date"
              value={formData.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              error={errors.endDate}
              icon={Calendar}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            نسبة التقدم: {formData.progress}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={formData.progress}
            onChange={(e) => handleInputChange('progress', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          {errors.progress && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 ml-1" />
              {errors.progress}
            </p>
          )}
        </div>
      </div>

      {/* Budget */}
      <div>
        <Input
          label="الميزانية (ريال سعودي)"
          type="number"
          value={formData.budget || ''}
          onChange={(e) => handleInputChange('budget', e.target.value ? parseFloat(e.target.value) : undefined)}
          error={errors.budget}
          placeholder="0.00"
          icon={DollarSign}
        />
      </div>

      {/* Tags */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          العلامات والفريق
        </h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            العلامات
          </label>
          <div className="flex gap-2 mb-3">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="أضف علامة جديدة"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              icon={Tag}
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

      {/* Team Members */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <Users className="w-4 h-4 inline ml-1" />
          أعضاء الفريق
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto">
          {users.map(user => (
            <label
              key={user.id}
              className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <input
                type="checkbox"
                checked={formData.teamMembers.includes(user.id)}
                onChange={() => toggleTeamMember(user.id)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <div className="mr-3">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.department}</p>
              </div>
            </label>
          ))}
        </div>
        <p className="mt-2 text-sm text-gray-500">
          تم اختيار {formData.teamMembers.length} عضو
        </p>
      </div>

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
          {initialData ? 'تحديث المشروع' : 'إنشاء المشروع'}
        </Button>
      </div>
    </form>
  )
}