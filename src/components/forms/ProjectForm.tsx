'use client'

import { useState } from 'react'
import { Calendar, Users, Target } from 'lucide-react'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Textarea from '../ui/Textarea'

interface ProjectFormProps {
  onSubmit: (project: ProjectData) => void
  onCancel: () => void
  initialData?: Partial<ProjectData>
}

export interface ProjectData {
  name: string
  description: string
  client: string
  startDate: string
  endDate: string
  budget: string
  teamMembers: string[]
  priority: 'منخفض' | 'متوسط' | 'عالي'
  status: 'قيد التخطيط' | 'قيد التنفيذ' | 'في المراجعة' | 'مكتمل'
}

export default function ProjectForm({ onSubmit, onCancel, initialData }: ProjectFormProps) {
  const [formData, setFormData] = useState<ProjectData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    client: initialData?.client || '',
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
    budget: initialData?.budget || '',
    teamMembers: initialData?.teamMembers || [],
    priority: initialData?.priority || 'متوسط',
    status: initialData?.status || 'قيد التخطيط'
  })

  const [errors, setErrors] = useState<Partial<Record<keyof ProjectData, string>>>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ProjectData, string>> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'اسم المشروع مطلوب'
    }
    if (!formData.client.trim()) {
      newErrors.client = 'اسم العميل مطلوب'
    }
    if (!formData.startDate) {
      newErrors.startDate = 'تاريخ البدء مطلوب'
    }
    if (!formData.endDate) {
      newErrors.endDate = 'تاريخ الانتهاء مطلوب'
    }
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'تاريخ الانتهاء يجب أن يكون بعد تاريخ البدء'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    
    // محاكاة API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    onSubmit(formData)
    setIsLoading(false)
  }

  const handleInputChange = (field: keyof ProjectData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="اسم المشروع *"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          error={errors.name}
          placeholder="أدخل اسم المشروع"
          icon={Target}
        />

        <Input
          label="اسم العميل *"
          value={formData.client}
          onChange={(e) => handleInputChange('client', e.target.value)}
          error={errors.client}
          placeholder="أدخل اسم العميل"
          icon={Users}
        />
      </div>

      <Textarea
        label="وصف المشروع"
        value={formData.description}
        onChange={(e) => handleInputChange('description', e.target.value)}
        placeholder="وصف تفصيلي للمشروع..."
        rows={4}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="تاريخ البدء *"
          type="date"
          value={formData.startDate}
          onChange={(e) => handleInputChange('startDate', e.target.value)}
          error={errors.startDate}
          icon={Calendar}
        />

        <Input
          label="تاريخ الانتهاء *"
          type="date"
          value={formData.endDate}
          onChange={(e) => handleInputChange('endDate', e.target.value)}
          error={errors.endDate}
          icon={Calendar}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="الميزانية"
          type="number"
          value={formData.budget}
          onChange={(e) => handleInputChange('budget', e.target.value)}
          placeholder="0"
          min="0"
        />

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            الأولوية
          </label>
          <select
            value={formData.priority}
            onChange={(e) => handleInputChange('priority', e.target.value as ProjectData['priority'])}
            className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="منخفض">منخفض</option>
            <option value="متوسط">متوسط</option>
            <option value="عالي">عالي</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-2">
          حالة المشروع
        </label>
        <select
          value={formData.status}
          onChange={(e) => handleInputChange('status', e.target.value as ProjectData['status'])}
          className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="قيد التخطيط">قيد التخطيط</option>
          <option value="قيد التنفيذ">قيد التنفيذ</option>
          <option value="في المراجعة">في المراجعة</option>
          <option value="مكتمل">مكتمل</option>
        </select>
      </div>

      <div className="flex items-center justify-end space-x-4 space-x-reverse pt-6 border-t border-secondary-200">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isLoading}
        >
          إلغاء
        </Button>
        <Button
          type="submit"
          loading={isLoading}
        >
          {initialData ? 'تحديث المشروع' : 'إنشاء المشروع'}
        </Button>
      </div>
    </form>
  )
}