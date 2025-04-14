"use client";

import React from "react";
import { Bell } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 h-[65px] flex items-center px-4">
      <div className="flex-1">
        {/* <h1 className=\"text-2xl font-bold text-primary\">لوحة تحكم إدارة المشاريع الإبداعية</h1> */}
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="relative p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light focus:outline-none transition-colors"
        >
          <span className="sr-only">عرض الإشعارات</span>
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-primary ring-1 ring-white dark:ring-gray-800"></span>
        </button>
        <div className="relative flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-accent text-white flex items-center justify-center font-medium text-sm shrink-0">
            <span>أ</span>
          </div>
          <span className="font-medium text-sm text-gray-700 dark:text-gray-200 hidden sm:block">أحمد محمد</span>
        </div>
      </div>
    </header>
  );
} 