'use client'

import { useState } from 'react'
import { Calendar, User, AlertCircle } from 'lucide-react'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Textarea from '../ui/Textarea'

interface TaskFormProps {
  onSubmit: (task: TaskData) => void
  onCancel: () => void
  initialData?: Partial<TaskData>
}

export interface TaskData {
  title: string
  description: string
  assignee: string
  dueDate: string
  priority: 'منخفض' | 'متوسط' | 'عالي' | 'عاجل'
  status: 'جديد' | 'قيد التنفيذ' | 'في المراجعة' | 'مكتمل'
  project: string
  estimatedHours: string
}

export default function TaskForm({ onSubmit, onCancel, initialData }: TaskFormProps) {
  const [formData, setFormData] = useState<TaskData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    assignee: initialData?.assignee || '',
    dueDate: initialData?.dueDate || '',
    priority: initialData?.priority || 'متوسط',
    status: initialData?.status || 'جديد',
    project: initialData?.project || '',
    estimatedHours: initialData?.estimatedHours || ''
  })

  const [errors, setErrors] = useState<Partial<Record<keyof TaskData, string>>>({})
  const [isLoading, setIsLoading] = useState(false)

  const projects = [
    'تطوير موقع الشركة الجديد',
    'حملة التسويق الرقمي',
    'تصميم الهوية البصرية',
    'تطبيق الجوال'
  ]

  const teamMembers = [
    'أحمد محمد',
    'فاطمة علي',
    'عبدالله سالم',
    'نورا حسن',
    'محمد أحمد',
    'سارة محمود'
  ]

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof TaskData, string>> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'عنوان المهمة مطلوب'
    }
    if (!formData.assignee) {
      newErrors.assignee = 'يجب تعيين المهمة لشخص'
    }
    if (!formData.dueDate) {
      newErrors.dueDate = 'تاريخ الاستحقاق مطلوب'
    }
    if (!formData.project) {
      newErrors.project = 'يجب اختيار المشروع'
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

  const handleInputChange = (field: keyof TaskData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const getPriorityColor = (priority: TaskData['priority']) => {
    switch (priority) {
      case 'عاجل': return 'text-red-600 bg-red-50'
      case 'عالي': return 'text-orange-600 bg-orange-50'
      case 'متوسط': return 'text-blue-600 bg-blue-50'
      case 'منخفض': return 'text-gray-600 bg-gray-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="عنوان المهمة *"
        value={formData.title}
        onChange={(e) => handleInputChange('title', e.target.value)}
        error={errors.title}
        placeholder="أدخل عنوان المهمة"
        icon={AlertCircle}
      />

      <Textarea
        label="وصف المهمة"
        value={formData.description}
        onChange={(e) => handleInputChange('description', e.target.value)}
        placeholder="وصف تفصيلي للمهمة..."
        rows={4}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            المشروع *
          </label>
          <select
            value={formData.project}
            onChange={(e) => handleInputChange('project', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              errors.project ? 'border-red-300 focus:ring-red-500' : 'border-secondary-300'
            }`}
          >
            <option value="">اختر المشروع</option>
            {projects.map((project) => (
              <option key={project} value={project}>{project}</option>
            ))}
          </select>
          {errors.project && (
            <p className="mt-1 text-sm text-red-600">{errors.project}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            المكلف بالمهمة *
          </label>
          <select
            value={formData.assignee}
            onChange={(e) => handleInputChange('assignee', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              errors.assignee ? 'border-red-300 focus:ring-red-500' : 'border-secondary-300'
            }`}
          >
            <option value="">اختر عضو الفريق</option>
            {teamMembers.map((member) => (
              <option key={member} value={member}>{member}</option>
            ))}
          </select>
          {errors.assignee && (
            <p className="mt-1 text-sm text-red-600">{errors.assignee}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="تاريخ الاستحقاق *"
          type="date"
          value={formData.dueDate}
          onChange={(e) => handleInputChange('dueDate', e.target.value)}
          error={errors.dueDate}
          icon={Calendar}
        />

        <Input
          label="الساعات المقدرة"
          type="number"
          value={formData.estimatedHours}
          onChange={(e) => handleInputChange('estimatedHours', e.target.value)}
          placeholder="0"
          min="0"
          step="0.5"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            الأولوية
          </label>
          <select
            value={formData.priority}
            onChange={(e) => handleInputChange('priority', e.target.value as TaskData['priority'])}
            className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="منخفض">منخفض</option>
            <option value="متوسط">متوسط</option>
            <option value="عالي">عالي</option>
            <option value="عاجل">عاجل</option>
          </select>
          <div className={`mt-2 px-2 py-1 rounded text-xs ${getPriorityColor(formData.priority)}`}>
            أولوية {formData.priority}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            حالة المهمة
          </label>
          <select
            value={formData.status}
            onChange={(e) => handleInputChange('status', e.target.value as TaskData['status'])}
            className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="جديد">جديد</option>
            <option value="قيد التنفيذ">قيد التنفيذ</option>
            <option value="في المراجعة">في المراجعة</option>
            <option value="مكتمل">مكتمل</option>
          </select>
        </div>
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
          {initialData ? 'تحديث المهمة' : 'إنشاء المهمة'}
        </Button>
      </div>
    </form>
  )
}