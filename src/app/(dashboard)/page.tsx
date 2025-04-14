import React from 'react';
import { Info } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">لوحة تحكم إدارة المشاريع الإبداعية</h1>
      
      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-start space-x-4 rtl:space-x-reverse">
        <div className="flex-shrink-0 mt-1">
          <Info className="w-5 h-5 text-blue-500" />
        </div>
        <div>
          <p className="text-md font-medium text-gray-700 dark:text-gray-200">سيتم إضافة المكونات التفاعلية لاحقًا</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">يتم العمل على تطوير الواجهة وتحسين تجربة المستخدم.</p>
        </div>
      </div>
    </div>
  );
} 