"use client";

import React, { useState } from "react";

interface Client {
  id: string;
  name: string;
  contactInfo: string;
}

interface Project {
  id: string;
  clientId: string;
  title: string;
  subscriptionType: "monthly" | "one-time";
  startDate: string;
  endDate: string | null;
  status: "active" | "completed" | "on-hold";
}

export default function ClientsProjects() {
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

  // الدوال التي ستتفاعل مع الواجهة الخلفية في المستقبل
  const fetchClients = async () => {
    // بيانات تجريبية حتى يتم ربط واجهة برمجة التطبيقات
    const mockClients: Client[] = [
      { id: "1", name: "شركة الإبداع للتصميم", contactInfo: "info@example.com" },
      { id: "2", name: "مؤسسة الرقمية", contactInfo: "digital@example.com" }
    ];
    setClients(mockClients);
  };

  const fetchProjects = async (clientId: string | null = null) => {
    // بيانات تجريبية
    const mockProjects: Project[] = [
      { 
        id: "1", 
        clientId: "1", 
        title: "حملة تسويقية رمضان", 
        subscriptionType: "monthly", 
        startDate: "2023-03-01", 
        endDate: "2023-06-01", 
        status: "active" 
      },
      { 
        id: "2", 
        clientId: "1", 
        title: "تصميم هوية بصرية", 
        subscriptionType: "one-time", 
        startDate: "2023-02-15", 
        endDate: null, 
        status: "completed" 
      },
      { 
        id: "3", 
        clientId: "2", 
        title: "إدارة منصات التواصل", 
        subscriptionType: "monthly", 
        startDate: "2023-01-01", 
        endDate: "2023-12-31", 
        status: "active" 
      }
    ];
    
    if (clientId) {
      setProjects(mockProjects.filter(project => project.clientId === clientId));
    } else {
      setProjects(mockProjects);
    }
  };

  // محاكاة طلب البيانات عند تحميل المكون
  React.useEffect(() => {
    fetchClients();
    fetchProjects();
  }, []);

  // تغيير العميل المحدد
  const handleClientSelect = (clientId: string) => {
    setSelectedClient(clientId);
    fetchProjects(clientId);
  };

  // حساب الأيام المتبقية في الاشتراك
  const calculateRemainingDays = (endDate: string | null): number => {
    if (!endDate) return 0;
    
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">العملاء والمشاريع</h2>
        <button className="btn-primary">إضافة عميل جديد</button>
      </div>
      
      {/* قائمة العملاء */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-1 bg-white p-4 rounded-md shadow-sm">
          <h3 className="font-semibold mb-4 text-gray-800">العملاء</h3>
          <ul className="space-y-2">
            <li>
              <button 
                onClick={() => fetchProjects(null)}
                className={`w-full text-right p-2 rounded-md ${!selectedClient ? 'bg-gray-100 text-primary' : 'hover:bg-gray-50'}`}
              >
                جميع العملاء
              </button>
            </li>
            {clients.map((client) => (
              <li key={client.id}>
                <button 
                  onClick={() => handleClientSelect(client.id)}
                  className={`w-full text-right p-2 rounded-md ${selectedClient === client.id ? 'bg-gray-100 text-primary' : 'hover:bg-gray-50'}`}
                >
                  {client.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        {/* قائمة المشاريع */}
        <div className="col-span-2 bg-white p-4 rounded-md shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800">المشاريع</h3>
            <button className="btn-accent">إضافة مشروع جديد</button>
          </div>
          
          {projects.length === 0 ? (
            <div className="text-center text-gray-500 py-8">لا توجد مشاريع لعرضها</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((project) => (
                <div key={project.id} className="border border-gray-200 rounded-md p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      project.status === 'active' ? 'bg-green-100 text-green-800' :
                      project.status === 'completed' ? 'bg-blue-100 text-blue-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {project.status === 'active' ? 'نشط' : 
                       project.status === 'completed' ? 'مكتمل' : 'معلق'}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
                      {project.subscriptionType === 'monthly' ? 'اشتراك شهري' : 'مشروع فردي'}
                    </span>
                  </div>
                  
                  <h4 className="text-lg font-medium mt-2">{project.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    تاريخ البدء: {new Date(project.startDate).toLocaleDateString('ar-SA')}
                  </p>
                  
                  {project.endDate && (
                    <>
                      <p className="text-sm text-gray-600">
                        تاريخ الانتهاء: {new Date(project.endDate).toLocaleDateString('ar-SA')}
                      </p>
                      {project.status === 'active' && (
                        <div className="mt-2 pt-2 border-t border-gray-100">
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>الأيام المتبقية:</span>
                            <span className="font-medium">{calculateRemainingDays(project.endDate)} يوم</span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full mt-1">
                            <div 
                              className="h-full bg-primary rounded-full" 
                              style={{ 
                                width: `${Math.min(100, (calculateRemainingDays(project.endDate) / 30) * 100)}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  
                  <div className="mt-3 flex justify-end space-x-2 space-x-reverse">
                    <button className="text-xs px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">المهام</button>
                    <button className="text-xs px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">الملفات</button>
                    <button className="text-xs px-3 py-1 border border-primary text-primary rounded hover:bg-primary hover:text-white">تعديل</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 