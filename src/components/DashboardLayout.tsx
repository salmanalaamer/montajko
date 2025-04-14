"use client";

import React, { useState, ReactNode } from "react";

interface TabProps {
  title: string;
  icon?: ReactNode;
  content: ReactNode;
}

interface DashboardLayoutProps {
  tabs: TabProps[];
}

export default function DashboardLayout({ tabs }: DashboardLayoutProps) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="bg-white shadow-sm border-b border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-primary">لوحة تحكم إدارة المشاريع الإبداعية</h1>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-l border-gray-200 hidden md:block">
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <a href="#" className="flex items-center p-2 rounded hover:bg-gray-100 text-primary font-medium">
                  <span>العملاء والمشاريع</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center p-2 rounded hover:bg-gray-100 text-gray-700">
                  <span>المهام</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center p-2 rounded hover:bg-gray-100 text-gray-700">
                  <span>الملفات</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center p-2 rounded hover:bg-gray-100 text-gray-700">
                  <span>حسابات التواصل الاجتماعي</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center p-2 rounded hover:bg-gray-100 text-gray-700">
                  <span>الإحصائيات</span>
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex -mb-px space-x-2 space-x-reverse">
              {tabs.map((tab, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`py-3 px-4 text-sm font-medium transition-colors ${
                    activeTab === index
                      ? "border-b-2 border-primary text-primary"
                      : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.icon && <span className="ml-2">{tab.icon}</span>}
                  {tab.title}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="bg-white p-6 rounded-md shadow-sm">
            {tabs[activeTab] && tabs[activeTab].content}
          </div>
        </main>
      </div>
    </div>
  );
} 