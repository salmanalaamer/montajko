'use client'

import { useState, useEffect } from 'react'
import { User, Mail, Phone, MapPin, Building, UserCheck, Save, X } from 'lucide-react'
import Button from '@/components/ui/Button'
import { User as UserType } from '@/lib/database'

interface UserFormProps {
  user?: UserType
  onSubmit: (userData: any) => void
  onCancel: () => void
}

export default function UserForm({ user, onSubmit, onCancel }: UserFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    isActive: true,
    bio: ''
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const departments = [
    'الإدارة',
    'التطوير', 
    'التصميم',
    'التسويق',
    'المبيعات',
    'الموارد البشرية',
    'المحاسبة',
    'خدمة العملاء'
  ]

  const roles = [
    'مدير عام',
    'مدير مشاريع',
    'مطور أول',
    'مطور',
    'مصمم أول',
    'مصمم',
    'أخصائي تسويق',
    'مسوق',
    'مندوب مبيعات',
    'محاسب',
    'موظف خدمة عملاء'
  ]

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role || '',
        department: user.department || '',
        isActive: user.isActive,
        bio: user.bio || ''
      })
    }
  }, [user])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'الاسم مطلوب'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'الاسم يجب أن يكون على الأقل حرفين'
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح'
    }

    // Phone validation (optional)
    if (formData.phone.trim() && !/^[\+]?[0-9\-\s\(\)]{8,}$/.test(formData.phone)) {
      newErrors.phone = 'رقم الهاتف غير صحيح'
    }

    // Role validation
    if (!formData.role.trim()) {
      newErrors.role = 'المنصب مطلوب'
    }

    // Department validation
    if (!formData.department.trim()) {
      newErrors.department = 'القسم مطلوب'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      await onSubmit({
        ...formData,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        role: formData.role.trim(),
        department: formData.department.trim(),
        bio: formData.bio.trim() || undefined
      })
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h4 className="font-medium text-secondary-900 flex items-center space-x-2 space-x-reverse">
          <User className="w-4 h-4" />
          <span>المعلومات الأساسية</span>
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-secondary-700 mb-2">
              الاسم الكامل *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.name ? 'border-red-300' : 'border-secondary-300'
              }`}
              placeholder="أدخل الاسم الكامل"
              disabled={isSubmitting}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
              البريد الإلكتروني *
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.email ? 'border-red-300' : 'border-secondary-300'
              }`}
              placeholder="أدخل البريد الإلكتروني"
              disabled={isSubmitting}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-secondary-700 mb-2">
              رقم الهاتف
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.phone ? 'border-red-300' : 'border-secondary-300'
              }`}
              placeholder="+966501234567"
              disabled={isSubmitting}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label htmlFor="isActive" className="block text-sm font-medium text-secondary-700 mb-2">
              الحالة
            </label>
            <select
              id="isActive"
              value={formData.isActive ? 'active' : 'inactive'}
              onChange={(e) => handleInputChange('isActive', e.target.value === 'active')}
              className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={isSubmitting}
            >
              <option value="active">نشط</option>
              <option value="inactive">غير نشط</option>
            </select>
          </div>
        </div>
      </div>

      {/* Work Information */}
      <div className="space-y-4">
        <h4 className="font-medium text-secondary-900 flex items-center space-x-2 space-x-reverse">
          <Building className="w-4 h-4" />
          <span>معلومات العمل</span>
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-secondary-700 mb-2">
              المنصب *
            </label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) => handleInputChange('role', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.role ? 'border-red-300' : 'border-secondary-300'
              }`}
              disabled={isSubmitting}
            >
              <option value="">اختر المنصب</option>
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
          </div>

          <div>
            <label htmlFor="department" className="block text-sm font-medium text-secondary-700 mb-2">
              القسم *
            </label>
            <select
              id="department"
              value={formData.department}
              onChange={(e) => handleInputChange('department', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.department ? 'border-red-300' : 'border-secondary-300'
              }`}
              disabled={isSubmitting}
            >
              <option value="">اختر القسم</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
          </div>
        </div>
      </div>

      {/* Bio */}
      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-secondary-700 mb-2">
          نبذة تعريفية
        </label>
        <textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => handleInputChange('bio', e.target.value)}
          rows={3}
          className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="اكتب نبذة مختصرة عن المستخدم..."
          disabled={isSubmitting}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end space-x-3 space-x-reverse pt-4 border-t border-secondary-200">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          icon={X}
        >
          إلغاء
        </Button>
        
        <Button
          type="submit"
          disabled={isSubmitting}
          icon={Save}
          loading={isSubmitting}
        >
          {user ? 'تحديث المستخدم' : 'إنشاء المستخدم'}
        </Button>
      </div>
    </form>
  )
}