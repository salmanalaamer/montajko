"use client";

import React, { useState, useRef, useEffect } from "react";
import { Plus, Folder, FilePlus, MoreVertical, ChevronLeft, Grid, List, User } from "lucide-react";

interface File {
  id: string;
  name: string;
  projectId: string;
  taskId: string | null;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
  url: string;
  folderId: string | null;
}

interface Project {
  id: string;
  title: string;
}

interface Folder {
  id: string;
  name: string;
  projectId: string | null; // null يعني أنه مجلد ملفاتي الخاصة
  createdAt: string;
  createdBy: string;
  userId?: string; // معرف المستخدم لمجلد "ملفاتي الخاصة"
  parentId: string | null; // معرف المجلد الأب (null إذا كان مجلد جذر)
}

export default function FileManager() {
  const [files, setFiles] = useState<File[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("date");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<{id: string, name: string}[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFolderForUpload, setSelectedFolderForUpload] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const currentUserId = "current-user"; // سنستبدل هذا بمعرف المستخدم الحقيقي
  
  // محاكاة جلب البيانات
  useEffect(() => {
    // مشاريع تجريبية
    const mockProjects: Project[] = [
      { id: "1", title: "حملة تسويقية رمضان" },
      { id: "2", title: "تصميم هوية بصرية" },
      { id: "3", title: "إدارة منصات التواصل" }
    ];
    
    // مجلدات تجريبية
    const mockFolders: Folder[] = [
      // مجلدات المشاريع
      { id: "folder-1", name: "حملة تسويقية رمضان", projectId: "1", createdAt: "2023-05-01T10:00:00Z", createdBy: "النظام", parentId: null },
      { id: "folder-2", name: "تصميم هوية بصرية", projectId: "2", createdAt: "2023-05-01T10:00:00Z", createdBy: "النظام", parentId: null },
      { id: "folder-3", name: "إدارة منصات التواصل", projectId: "3", createdAt: "2023-05-01T10:00:00Z", createdBy: "النظام", parentId: null },
      
      // مجلد ملفاتي الخاصة
      { id: "folder-personal", name: "ملفاتي الخاصة", projectId: null, createdAt: "2023-05-01T10:00:00Z", createdBy: "النظام", userId: currentUserId, parentId: null },
      
      // مجلدات فرعية داخل المشاريع
      { id: "folder-1-1", name: "تصاميم", projectId: "1", createdAt: "2023-05-02T10:00:00Z", createdBy: "أحمد علي", parentId: "folder-1" },
      { id: "folder-2-1", name: "شعارات", projectId: "2", createdAt: "2023-05-03T10:00:00Z", createdBy: "سارة محمد", parentId: "folder-2" },
    ];
    
    // ملفات تجريبية
    const mockFiles: File[] = [
      {
        id: "1",
        name: "بوستات رمضان - النسخة النهائية.psd",
        projectId: "1",
        taskId: "1",
        type: "image/psd",
        size: 4500000, // 4.5 MB
        uploadedBy: "أحمد علي",
        uploadedAt: "2023-05-02T10:30:00Z",
        url: "#",
        folderId: "folder-1-1"
      },
      {
        id: "2",
        name: "شعار الشركة - ملف مفتوح.ai",
        projectId: "2",
        taskId: "3",
        type: "application/illustrator",
        size: 3200000, // 3.2 MB
        uploadedBy: "سارة محمد",
        uploadedAt: "2023-05-01T14:20:00Z",
        url: "#",
        folderId: "folder-2-1"
      },
      {
        id: "3",
        name: "دليل الهوية البصرية.pdf",
        projectId: "2",
        taskId: null,
        type: "application/pdf",
        size: 2100000, // 2.1 MB
        uploadedBy: "محمد خالد",
        uploadedAt: "2023-04-28T09:45:00Z",
        url: "#",
        folderId: "folder-2"
      },
      {
        id: "4",
        name: "تقويم محتوى وسائل التواصل الاجتماعي.xlsx",
        projectId: "3",
        taskId: null,
        type: "application/excel",
        size: 980000, // 980 KB
        uploadedBy: "نورا حسن",
        uploadedAt: "2023-04-25T16:10:00Z",
        url: "#",
        folderId: "folder-3"
      },
      {
        id: "5",
        name: "ملاحظات شخصية.txt",
        projectId: "", // ليس مرتبط بمشروع
        taskId: null,
        type: "text/plain",
        size: 12500, // 12.5 KB
        uploadedBy: "المستخدم الحالي",
        uploadedAt: "2023-05-10T11:30:00Z",
        url: "#",
        folderId: "folder-personal"
      }
    ];
    
    setProjects(mockProjects);
    setFolders(mockFolders);
    setFiles(mockFiles);
  }, []);

  // الحصول على المجلدات الحالية (المجلدات الجذرية أو المجلدات الفرعية للمجلد الحالي)
  const getCurrentFolders = () => {
    if (!currentFolder) {
      // عرض المجلدات الرئيسية (المشاريع + ملفاتي الخاصة)
      return folders.filter(folder => folder.parentId === null);
    } else {
      // عرض المجلدات الفرعية للمجلد الحالي
      return folders.filter(folder => folder.parentId === currentFolder);
    }
  };

  // الحصول على الملفات الحالية (في المجلد الحالي)
  const getCurrentFiles = () => {
    // إذا كنا في المجلد الجذر (لا مجلد محدد)، لا نعرض أي ملفات
    if (!currentFolder) {
      return [];
    }
    
    // عرض الملفات في المجلد الحالي
    return files
      .filter(file => file.folderId === currentFolder)
      .filter(file => {
        // تصفية حسب البحث
        if (searchQuery && !file.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        // فرز حسب التاريخ أو الاسم أو الحجم
        if (sortBy === "date") {
          return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
        } else if (sortBy === "name") {
          return a.name.localeCompare(b.name);
        } else if (sortBy === "size") {
          return b.size - a.size;
        }
        return 0;
      });
  };

  // تحديث مسار التنقل
  const updateBreadcrumbs = (folderId: string | null) => {
    if (!folderId) {
      // إذا عدنا للجذر
      setBreadcrumbs([]);
      return;
    }

    const breadcrumbsPath: {id: string, name: string}[] = [];
    let currentId = folderId;
    let iterations = 0; // لمنع الحلقات اللانهائية

    // بناء مسار التنقل بشكل عكسي
    while (currentId && iterations < 10) {
      const folder = folders.find(f => f.id === currentId);
      if (folder) {
        breadcrumbsPath.unshift({ id: folder.id, name: folder.name });
        currentId = folder.parentId;
      } else {
        break;
      }
      iterations++;
    }

    setBreadcrumbs(breadcrumbsPath);
  };

  // التنقل إلى المجلد
  const navigateToFolder = (folderId: string) => {
    setCurrentFolder(folderId);
    updateBreadcrumbs(folderId);
  };

  // العودة إلى المجلد السابق
  const navigateBack = () => {
    if (breadcrumbs.length <= 1) {
      // إذا كنا في المستوى الأول، نعود إلى الجذر
      setCurrentFolder(null);
      setBreadcrumbs([]);
    } else {
      // نعود إلى المجلد السابق
      const previousFolder = breadcrumbs[breadcrumbs.length - 2];
      setCurrentFolder(previousFolder.id);
      updateBreadcrumbs(previousFolder.id);
    }
  };

  // تنسيق حجم الملف
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    else return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB";
  };

  // فتح مربع حوار اختيار الملف
  const handleUploadClick = () => {
    // إذا كنا داخل مجلد، نرفع الملف مباشرة إلى هذا المجلد
    if (currentFolder) {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    } else {
      // إذا كنا في الجذر، نفتح مربع حوار لاختيار المجلد أولاً
      setIsUploadModalOpen(true);
    }
  };

  // محاكاة تحميل الملف
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;
    
    // لأغراض العرض فقط، سنضيف معلومات الملف إلى القائمة
    const targetFolderId = currentFolder || selectedFolderForUpload;
    
    if (!targetFolderId) {
      alert("الرجاء اختيار مجلد لرفع الملف إليه");
      return;
    }
    
    // الحصول على معلومات المجلد المستهدف
    const targetFolder = folders.find(f => f.id === targetFolderId);
    if (!targetFolder) return;
    
    const newFile: File = {
      id: `new-${Date.now()}`,
      name: selectedFiles[0].name,
      projectId: targetFolder.projectId || "",
      taskId: null,
      type: selectedFiles[0].type,
      size: selectedFiles[0].size,
      uploadedBy: "المستخدم الحالي",
      uploadedAt: new Date().toISOString(),
      url: "#",
      folderId: targetFolderId
    };
    
    setFiles(prevFiles => [newFile, ...prevFiles]);
    
    // إعادة تعيين قيمة عنصر الإدخال
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    
    // إغلاق مربع حوار اختيار المجلد
    setIsUploadModalOpen(false);
    setSelectedFolderForUpload(null);
  };

  // إضافة مجلد جديد
  const handleAddFolder = () => {
    if (!newFolderName.trim()) {
      alert("الرجاء إدخال اسم للمجلد");
      return;
    }
    
    // إنشاء مجلد جديد
    const newFolder: Folder = {
      id: `folder-new-${Date.now()}`,
      name: newFolderName,
      projectId: currentFolder ? folders.find(f => f.id === currentFolder)?.projectId || null : null,
      createdAt: new Date().toISOString(),
      createdBy: "المستخدم الحالي",
      parentId: currentFolder
    };
    
    setFolders(prevFolders => [...prevFolders, newFolder]);
    setNewFolderName("");
    setIsAddingFolder(false);
  };

  // الحصول على أيقونة مناسبة لنوع الملف
  const getFileIcon = (fileType: string) => {
    if (fileType.includes("image")) {
      return "📷";
    } else if (fileType.includes("pdf")) {
      return "📄";
    } else if (fileType.includes("excel") || fileType.includes("spreadsheet")) {
      return "📊";
    } else if (fileType.includes("word") || fileType.includes("document")) {
      return "📝";
    } else if (fileType.includes("illustrator")) {
      return "🎨";
    } else if (fileType.includes("psd")) {
      return "🖌️";
    } else {
      return "📁";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">مدير الملفات</h2>
          {/* مسار التنقل - Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <button 
                onClick={() => {
                  setCurrentFolder(null);
                  setBreadcrumbs([]);
                }}
                className="hover:text-primary"
              >
                الرئيسية
              </button>
              
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.id}>
                  <span className="mx-1">/</span>
                  {index === breadcrumbs.length - 1 ? (
                    <span className="font-medium text-gray-700">{crumb.name}</span>
                  ) : (
                    <button 
                      onClick={() => navigateToFolder(crumb.id)}
                      className="hover:text-primary"
                    >
                      {crumb.name}
                    </button>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* أزرار تبديل العرض */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-1 flex items-center">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
              title="عرض شبكي"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
              title="عرض قائمة"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          
          {/* زر إضافة مجلد - يظهر فقط داخل مجلد */}
          {currentFolder && (
            <button 
              className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 flex items-center text-sm"
              onClick={() => setIsAddingFolder(true)}
            >
              <Folder className="h-4 w-4 ml-1" />
              <span>مجلد جديد</span>
            </button>
          )}
          
          {/* زر رفع ملف */}
          <button 
            className="px-3 py-1.5 bg-primary text-white rounded-md hover:bg-primary-hover flex items-center text-sm"
            onClick={handleUploadClick}
          >
            <FilePlus className="h-4 w-4 ml-1" />
            <span>رفع ملف</span>
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
          />
        </div>
      </div>
      
      {/* إضافة مجلد جديد */}
      {isAddingFolder && (
        <div className="bg-gray-50 p-4 rounded-md mb-4">
          <div className="flex items-center">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="اسم المجلد الجديد"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              autoFocus
            />
            <button
              onClick={handleAddFolder}
              className="mr-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover"
            >
              إضافة
            </button>
            <button
              onClick={() => {
                setIsAddingFolder(false);
                setNewFolderName('');
              }}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}
      
      {/* شريط البحث والتصفية */}
      <div className="bg-white p-4 rounded-md shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">بحث عن ملف</label>
            <input
              type="text"
              id="search"
              placeholder="اكتب اسم الملف للبحث..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="w-full md:w-1/4">
            <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">ترتيب حسب</label>
            <select
              id="sort"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">تاريخ الرفع (الأحدث أولاً)</option>
              <option value="name">اسم الملف (أبجدي)</option>
              <option value="size">حجم الملف (الأكبر أولاً)</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* زر العودة للخلف */}
      {currentFolder && (
        <button
          onClick={navigateBack}
          className="flex items-center mb-4 text-primary hover:text-primary-hover"
        >
          <ChevronLeft className="h-5 w-5 ml-1" />
          <span>العودة للخلف</span>
        </button>
      )}
      
      {/* عرض المجلدات والملفات */}
      <div className="bg-white rounded-md shadow-sm overflow-hidden p-4">
        {/* عرض المجلدات */}
        {getCurrentFolders().length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">المجلدات</h3>
            
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' 
              : 'divide-y divide-gray-200'
            }>
              {getCurrentFolders().map(folder => (
                <div 
                  key={folder.id}
                  onClick={() => navigateToFolder(folder.id)}
                  className={viewMode === 'grid' 
                    ? 'bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 flex flex-col items-center text-center transition-colors' 
                    : 'flex items-center p-3 cursor-pointer hover:bg-gray-50 transition-colors'
                  }
                >
                  <div className={viewMode === 'grid' ? 'mb-2' : 'ml-3'}>
                    <Folder className="h-10 w-10 text-yellow-500" />
                  </div>
                  <div className={viewMode === 'grid' ? 'w-full' : 'flex-1'}>
                    <h4 className="font-medium text-gray-800 truncate">
                      {folder.name}
                    </h4>
                    {folder.projectId === null && folder.userId === currentUserId && (
                      <div className="flex items-center text-xs text-gray-500 mt-1 justify-center">
                        <User className="h-3 w-3 ml-1" />
                        <span>ملفاتي الشخصية</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* عرض الملفات */}
        {getCurrentFiles().length > 0 ? (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">الملفات</h3>
            
            {viewMode === 'grid' ? (
              // عرض شبكي للملفات
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {getCurrentFiles().map(file => (
                  <div key={file.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="h-24 bg-gray-50 flex items-center justify-center">
                      <div className="text-4xl">{getFileIcon(file.type)}</div>
                    </div>
                    <div className="p-3">
                      <h4 className="font-medium text-gray-800 text-sm truncate mb-1">{file.name}</h4>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>{formatFileSize(file.size)}</span>
                        <span>{new Date(file.uploadedAt).toLocaleDateString('ar-SA')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // عرض قائمة للملفات
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3 px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الملف</th>
                      <th scope="col" className="py-3 px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحجم</th>
                      <th scope="col" className="py-3 px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاريخ الرفع</th>
                      <th scope="col" className="py-3 px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رفع بواسطة</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getCurrentFiles().map(file => (
                      <tr key={file.id} className="hover:bg-gray-50">
                        <td className="py-4 px-6 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center">
                              <span className="text-2xl">{getFileIcon(file.type)}</span>
                            </div>
                            <div className="mr-4">
                              <div className="text-sm font-medium text-gray-900">{file.name}</div>
                              <div className="text-sm text-gray-500">{file.type.split('/')[1]}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500">
                          {formatFileSize(file.size)}
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500">
                          {new Date(file.uploadedAt).toLocaleDateString('ar-SA')}
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500">
                          {file.uploadedBy}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : currentFolder ? (
          <div className="text-center py-10">
            <div className="text-gray-400 mb-2">
              <FilePlus className="h-12 w-12 mx-auto" />
            </div>
            <p className="text-gray-500 mb-4">لا توجد ملفات في هذا المجلد</p>
            <button 
              onClick={handleUploadClick}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover"
            >
              رفع ملف
            </button>
          </div>
        ) : getCurrentFolders().length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">لا توجد مجلدات أو ملفات</p>
          </div>
        ) : null}
      </div>
      
      {/* مربع حوار اختيار المجلد للرفع */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">اختر المجلد</h3>
            <p className="text-gray-500 mb-4">يرجى اختيار المجلد الذي تريد رفع الملف إليه</p>
            
            <div className="max-h-60 overflow-y-auto mb-4">
              <div className="divide-y divide-gray-200">
                {folders.filter(folder => folder.parentId === null).map(folder => (
                  <div 
                    key={folder.id}
                    onClick={() => setSelectedFolderForUpload(folder.id)}
                    className={`p-3 cursor-pointer hover:bg-gray-50 flex items-center ${selectedFolderForUpload === folder.id ? 'bg-gray-50' : ''}`}
                  >
                    <Folder className="h-5 w-5 text-yellow-500 ml-2" />
                    <span>{folder.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 space-x-reverse">
              <button 
                onClick={() => {
                  setIsUploadModalOpen(false);
                  setSelectedFolderForUpload(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                إلغاء
              </button>
              <button 
                onClick={() => {
                  if (selectedFolderForUpload && fileInputRef.current) {
                    fileInputRef.current.click();
                  } else {
                    alert("الرجاء اختيار مجلد أولاً");
                  }
                }}
                disabled={!selectedFolderForUpload}
                className={`px-4 py-2 rounded-md ${
                  selectedFolderForUpload 
                    ? 'bg-primary text-white hover:bg-primary-hover' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                اختيار ملف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}