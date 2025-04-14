import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="text-center max-w-3xl">
        <div className="mb-8">
          <div className="h-24 w-24 bg-primary rounded-lg text-white flex items-center justify-center text-4xl font-bold mx-auto">
            م
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          لوحة تحكم إدارة المشاريع الإبداعية
        </h1>
        
        <p className="text-xl text-gray-600 mb-8">
          منصة متكاملة لإدارة المشاريع الإبداعية والمهام والملفات والتعاون الجماعي
        </p>
        
        <Link 
          href="/login" 
          className="inline-block bg-primary hover:bg-primary-dark text-white font-medium py-3 px-8 rounded-lg shadow-md transition-colors"
        >
          تسجيل الدخول للمتابعة
        </Link>
      </div>
      
      <div className="mt-16 text-sm text-gray-500">
        &#169; {new Date().getFullYear()} مونتاجكو. جميع الحقوق محفوظة.
      </div>
    </div>
  );
} 