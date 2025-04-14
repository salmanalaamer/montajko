"use client";

import React, { useState } from "react";

interface Task {
  id: string;
  projectId: string;
  assignedUserId: string;
  taskType: "new-design" | "edit";
  status: "pending" | "in-progress" | "review" | "completed";
  dueDate: string;
  designCount: number;
  previousTaskId: string | null; // للمراجعات
  title: string;
  description: string;
}

interface User {
  id: string;
  name: string;
  role: "designer" | "manager" | "owner";
}

export default function TasksManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  // بيانات تجريبية للمستخدمين
  const users: User[] = [
    { id: "1", name: "أحمد علي", role: "designer" },
    { id: "2", name: "سارة محمد", role: "designer" },
    { id: "3", name: "محمد خالد", role: "manager" },
    { id: "4", name: "نورا حسن", role: "owner" }
  ];
  
  // محاكاة جلب المهام من الخادم
  React.useEffect(() => {
    // بيانات تجريبية للمهام
    const mockTasks: Task[] = [
      {
        id: "1",
        projectId: "1",
        assignedUserId: "1",
        taskType: "new-design",
        status: "in-progress",
        dueDate: "2023-05-15",
        designCount: 3,
        previousTaskId: null,
        title: "تصميم بوستات رمضان",
        description: "تصميم مجموعة من البوستات لشهر رمضان"
      },
      {
        id: "2",
        projectId: "1",
        assignedUserId: "2",
        taskType: "edit",
        status: "review",
        dueDate: "2023-05-10",
        designCount: 1,
        previousTaskId: "1",
        title: "تعديل بوستات رمضان",
        description: "تعديل البوستات بناءً على ملاحظات العميل"
      },
      {
        id: "3",
        projectId: "2",
        assignedUserId: "1",
        taskType: "new-design",
        status: "pending",
        dueDate: "2023-05-20",
        designCount: 2,
        previousTaskId: null,
        title: "تصميم هوية بصرية",
        description: "تصميم شعار وهوية بصرية متكاملة"
      }
    ];
    setTasks(mockTasks);
  }, []);

  // تصفية المهام حسب الحالة
  const filteredTasks = filter === "all" 
    ? tasks 
    : tasks.filter(task => task.status === filter);

  // الحصول على اسم المستخدم المعين للمهمة
  const getAssignedUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : "غير معين";
  };

  // تغيير حالة المهمة
  const updateTaskStatus = (taskId: string, newStatus: Task["status"]) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  // حساب الأيام المتبقية حتى تاريخ الاستحقاق
  const getDaysRemaining = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };

  // الحصول على لون حالة المهمة
  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "in-progress": return "bg-blue-100 text-blue-800";
      case "review": return "bg-purple-100 text-purple-800";
      case "completed": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">إدارة المهام</h2>
        <div className="flex space-x-2 space-x-reverse">
          <button className="btn-primary">إضافة مهمة جديدة</button>
        </div>
      </div>

      {/* فلاتر المهام */}
      <div className="flex space-x-2 space-x-reverse bg-white p-2 rounded-md shadow-sm">
        <button 
          onClick={() => setFilter("all")}
          className={`px-3 py-1 rounded-md ${filter === "all" ? "bg-gray-200" : "hover:bg-gray-100"}`}
        >
          الكل
        </button>
        <button 
          onClick={() => setFilter("pending")}
          className={`px-3 py-1 rounded-md ${filter === "pending" ? "bg-yellow-100" : "hover:bg-gray-100"}`}
        >
          قيد الانتظار
        </button>
        <button 
          onClick={() => setFilter("in-progress")}
          className={`px-3 py-1 rounded-md ${filter === "in-progress" ? "bg-blue-100" : "hover:bg-gray-100"}`}
        >
          قيد التنفيذ
        </button>
        <button 
          onClick={() => setFilter("review")}
          className={`px-3 py-1 rounded-md ${filter === "review" ? "bg-purple-100" : "hover:bg-gray-100"}`}
        >
          قيد المراجعة
        </button>
        <button 
          onClick={() => setFilter("completed")}
          className={`px-3 py-1 rounded-md ${filter === "completed" ? "bg-green-100" : "hover:bg-gray-100"}`}
        >
          مكتملة
        </button>
      </div>

      {/* قائمة المهام */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTasks.length === 0 ? (
          <div className="col-span-2 text-center py-10 bg-white rounded-md shadow-sm">
            <p className="text-gray-500">لا توجد مهام تطابق المعايير المحددة</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div key={task.id} className="bg-white rounded-md shadow-sm p-4">
              <div className="flex justify-between mb-2">
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(task.status)}`}>
                  {task.status === "pending" ? "قيد الانتظار" : 
                   task.status === "in-progress" ? "قيد التنفيذ" : 
                   task.status === "review" ? "قيد المراجعة" : "مكتملة"}
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
                  {task.taskType === "new-design" ? "تصميم جديد" : "تعديل"}
                </span>
              </div>
              
              <h3 className="font-medium text-lg">{task.title}</h3>
              <p className="text-gray-600 text-sm mt-1">{task.description}</p>
              
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">المُكلف:</span>
                  <span className="font-medium mr-1">{getAssignedUserName(task.assignedUserId)}</span>
                </div>
                <div>
                  <span className="text-gray-500">عدد التصاميم:</span>
                  <span className="font-medium mr-1">{task.designCount}</span>
                </div>
                <div>
                  <span className="text-gray-500">تاريخ التسليم:</span>
                  <span className="font-medium mr-1">{new Date(task.dueDate).toLocaleDateString('ar-SA')}</span>
                </div>
                <div>
                  <span className="text-gray-500">المتبقي:</span>
                  <span className={`font-medium mr-1 ${getDaysRemaining(task.dueDate) < 3 ? "text-red-500" : ""}`}>
                    {getDaysRemaining(task.dueDate)} يوم
                  </span>
                </div>
              </div>
              
              {task.previousTaskId && (
                <div className="mt-2 text-xs text-gray-500">
                  تعديل على المهمة #<span className="font-medium">{task.previousTaskId}</span>
                </div>
              )}
              
              <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between">
                <div className="space-x-1 space-x-reverse">
                  <button 
                    onClick={() => updateTaskStatus(task.id, "in-progress")}
                    className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                    disabled={task.status === "in-progress"}
                  >
                    بدء العمل
                  </button>
                  <button 
                    onClick={() => updateTaskStatus(task.id, "review")}
                    className="text-xs px-2 py-1 bg-purple-50 text-purple-600 rounded hover:bg-purple-100"
                    disabled={task.status === "review"}
                  >
                    للمراجعة
                  </button>
                  <button 
                    onClick={() => updateTaskStatus(task.id, "completed")}
                    className="text-xs px-2 py-1 bg-green-50 text-green-600 rounded hover:bg-green-100"
                    disabled={task.status === "completed"}
                  >
                    إكمال
                  </button>
                </div>
                <div>
                  <button className="text-xs px-2 py-1 border border-gray-300 rounded hover:bg-gray-50">
                    عرض الملفات
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}