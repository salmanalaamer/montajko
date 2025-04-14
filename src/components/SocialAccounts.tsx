"use client";

import React, { useState } from "react";

interface SocialAccount {
  id: string;
  platform: "instagram" | "tiktok" | "twitter" | "facebook" | "linkedin" | "youtube" | "other";
  username: string;
  email: string;
  password: string; // ستكون مشفرة في التطبيق الحقيقي
  lastUpdated: string;
  notes: string;
  clientId: string;
}

interface Client {
  id: string;
  name: string;
}

export default function SocialAccounts() {
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>("all");
  const [showPassword, setShowPassword] = useState<{[key: string]: boolean}>({});
  
  // محاكاة جلب البيانات
  React.useEffect(() => {
    // بيانات تجريبية للعملاء
    const mockClients: Client[] = [
      { id: "1", name: "شركة الإبداع للتصميم" },
      { id: "2", name: "مؤسسة الرقمية" }
    ];
    
    // بيانات تجريبية لحسابات التواصل الاجتماعي
    const mockAccounts: SocialAccount[] = [
      {
        id: "1",
        platform: "instagram",
        username: "creative_designs",
        email: "social@example.com",
        password: "●●●●●●●●●●", // مثال على كلمة مرور مخفية
        lastUpdated: "2023-04-15T10:30:00Z",
        notes: "الحساب الرسمي للشركة",
        clientId: "1"
      },
      {
        id: "2",
        platform: "tiktok",
        username: "creative_tiktok",
        email: "tiktok@example.com",
        password: "●●●●●●●●",
        lastUpdated: "2023-04-10T14:20:00Z",
        notes: "محتوى إبداعي للشركة",
        clientId: "1"
      },
      {
        id: "3",
        platform: "twitter",
        username: "digital_agency",
        email: "digital@example.com",
        password: "●●●●●●●●●●●",
        lastUpdated: "2023-03-22T09:45:00Z",
        notes: "حساب الأخبار والتحديثات",
        clientId: "2"
      },
      {
        id: "4",
        platform: "linkedin",
        username: "digital-foundation",
        email: "hr@example.com",
        password: "●●●●●●●●●●●●",
        lastUpdated: "2023-03-15T16:10:00Z",
        notes: "للتوظيف والأخبار المهنية",
        clientId: "2"
      }
    ];
    
    setClients(mockClients);
    setSocialAccounts(mockAccounts);
    
    // تهيئة حالة عرض كلمات المرور (مخفية افتراضيًا)
    const initialPasswordStates: {[key: string]: boolean} = {};
    mockAccounts.forEach(account => {
      initialPasswordStates[account.id] = false;
    });
    setShowPassword(initialPasswordStates);
  }, []);

  // تصفية الحسابات حسب العميل
  const filteredAccounts = selectedClient === "all"
    ? socialAccounts
    : socialAccounts.filter(account => account.clientId === selectedClient);

  // الحصول على اسم المنصة بالعربية
  const getPlatformName = (platform: SocialAccount["platform"]): string => {
    switch(platform) {
      case "instagram": return "انستجرام";
      case "tiktok": return "تيك توك";
      case "twitter": return "تويتر";
      case "facebook": return "فيسبوك";
      case "linkedin": return "لينكد إن";
      case "youtube": return "يوتيوب";
      default: return "أخرى";
    }
  };

  // الحصول على لون المنصة
  const getPlatformColor = (platform: SocialAccount["platform"]): string => {
    switch(platform) {
      case "instagram": return "bg-pink-100 text-pink-800";
      case "tiktok": return "bg-gray-100 text-gray-800";
      case "twitter": return "bg-blue-100 text-blue-800";
      case "facebook": return "bg-indigo-100 text-indigo-800";
      case "linkedin": return "bg-blue-100 text-blue-800";
      case "youtube": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // تبديل عرض كلمة المرور
  const togglePasswordVisibility = (accountId: string) => {
    setShowPassword(prev => ({
      ...prev,
      [accountId]: !prev[accountId]
    }));
  };

  // محاكاة نسخ كلمة المرور إلى الحافظة
  const copyPasswordToClipboard = (accountId: string) => {
    // في التطبيق الحقيقي، سنستعيد كلمة المرور المشفرة من الخادم وفك تشفيرها
    alert('تم نسخ كلمة المرور إلى الحافظة');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">حسابات التواصل الاجتماعي</h2>
        <button className="btn-primary">إضافة حساب جديد</button>
      </div>
      
      {/* فلتر العميل */}
      <div className="bg-white p-4 rounded-md shadow-sm">
        <div className="max-w-md">
          <label htmlFor="client-filter" className="block text-sm font-medium text-gray-700 mb-1">تصفية حسب العميل</label>
          <select
            id="client-filter"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
          >
            <option value="all">جميع العملاء</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* قائمة الحسابات */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAccounts.length === 0 ? (
          <div className="col-span-2 text-center py-10 bg-white rounded-md shadow-sm">
            <p className="text-gray-500">لا توجد حسابات اجتماعية متاحة للعميل المحدد</p>
          </div>
        ) : (
          filteredAccounts.map(account => {
            const client = clients.find(c => c.id === account.clientId);
            return (
              <div key={account.id} className="bg-white rounded-md shadow-sm p-4">
                <div className="flex justify-between mb-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${getPlatformColor(account.platform)}`}>
                    {getPlatformName(account.platform)}
                  </span>
                  <span className="text-xs text-gray-500">
                    آخر تحديث: {new Date(account.lastUpdated).toLocaleDateString('ar-SA')}
                  </span>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-500">العميل: {client?.name}</p>
                </div>
                
                <div className="space-y-3 mt-2">
                  <div>
                    <label className="block text-xs text-gray-500">اسم المستخدم</label>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{account.username}</span>
                      <button 
                        className="text-xs px-2 py-1 text-accent hover:text-accent-dark"
                        onClick={() => navigator.clipboard.writeText(account.username)}
                      >
                        نسخ
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs text-gray-500">البريد الإلكتروني</label>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{account.email}</span>
                      <button 
                        className="text-xs px-2 py-1 text-accent hover:text-accent-dark"
                        onClick={() => navigator.clipboard.writeText(account.email)}
                      >
                        نسخ
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs text-gray-500">كلمة المرور</label>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">
                        {showPassword[account.id] ? "password123" : account.password}
                      </span>
                      <div className="space-x-1 space-x-reverse">
                        <button 
                          className="text-xs px-2 py-1 text-accent hover:text-accent-dark"
                          onClick={() => copyPasswordToClipboard(account.id)}
                        >
                          نسخ
                        </button>
                        <button 
                          className="text-xs px-2 py-1 text-gray-500 hover:text-gray-700"
                          onClick={() => togglePasswordVisibility(account.id)}
                        >
                          {showPassword[account.id] ? "إخفاء" : "عرض"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {account.notes && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500">ملاحظات: {account.notes}</p>
                  </div>
                )}
                
                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                  <button className="text-xs px-3 py-1 border border-primary text-primary rounded hover:bg-primary hover:text-white mr-2">
                    تعديل
                  </button>
                  <button className="text-xs px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
                    حذف
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
} 