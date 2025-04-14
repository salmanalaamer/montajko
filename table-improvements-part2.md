# توصيات تحسين مكون الجداول (Tables) - الجزء الثاني

## التحسينات المقترحة - الجزء الثاني: مكونات إضافية

### ١. مكون عرض البيانات المتعدد الوسائط

```tsx
// DataView.tsx - مكون عرض البيانات المتعدد
import React, { useState } from "react";
import { Table, type TableProps } from "./Table";
import { cn } from "@/lib/utils";
import { Button } from "./Button";
import { LayoutGrid, List } from "lucide-react";

// أنواع العرض المتاحة
type ViewMode = "table" | "grid" | "list";

// خصائص مكون عرض البيانات
export interface DataViewProps<T = any> extends Omit<TableProps<T>, "variant"> {
  availableViews?: ViewMode[];
  defaultView?: ViewMode;
  renderGridItem?: (item: T) => React.ReactNode;
  renderListItem?: (item: T) => React.ReactNode;
  gridClassName?: string;
  listClassName?: string;
}

export function DataView<T>({
  data,
  columns,
  availableViews = ["table", "grid", "list"],
  defaultView = "table",
  renderGridItem,
  renderListItem,
  gridClassName,
  listClassName,
  onRowClick,
  selectedRowId,
  rowId = "id" as keyof T,
  ...props
}: DataViewProps<T>) {
  const [viewMode, setViewMode] = useState<ViewMode>(defaultView);

  // التحقق من توفر طرق العرض البديلة
  const hasGridView = availableViews.includes("grid") && renderGridItem;
  const hasListView = availableViews.includes("list") && renderListItem;

  // اختيار طريقة العرض
  const handleViewChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  // عرض وسائط التنقل بين طرق العرض
  const renderViewSwitcher = () => {
    if (availableViews.length <= 1) return null;

    return (
      <div className="flex items-center space-x-2 rtl:space-x-reverse mb-4">
        {availableViews.includes("table") && (
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => handleViewChange("table")}
            className="h-8 px-3"
          >
            <List className="h-4 w-4 ml-2" />
            <span>جدول</span>
          </Button>
        )}
        {hasGridView && (
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => handleViewChange("grid")}
            className="h-8 px-3"
          >
            <LayoutGrid className="h-4 w-4 ml-2" />
            <span>شبكة</span>
          </Button>
        )}
        {hasListView && (
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => handleViewChange("list")}
            className="h-8 px-3"
          >
            <List className="h-4 w-4 ml-2" />
            <span>قائمة</span>
          </Button>
        )}
      </div>
    );
  };

  // عرض البيانات كشبكة
  const renderGrid = () => {
    if (!renderGridItem) return null;

    return (
      <div
        className={cn(
          "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4",
          gridClassName
        )}
      >
        {data.map((item, index) => (
          <div
            key={index}
            className={cn(
              "cursor-pointer transition-all",
              selectedRowId !== undefined && item[rowId] === selectedRowId
                ? "ring-2 ring-primary"
                : ""
            )}
            onClick={() => onRowClick && onRowClick(item)}
          >
            {renderGridItem(item)}
          </div>
        ))}
      </div>
    );
  };

  // عرض البيانات كقائمة
  const renderList = () => {
    if (!renderListItem) return null;

    return (
      <div className={cn("space-y-3", listClassName)}>
        {data.map((item, index) => (
          <div
            key={index}
            className={cn(
              "cursor-pointer transition-all",
              selectedRowId !== undefined && item[rowId] === selectedRowId
                ? "ring-2 ring-primary"
                : ""
            )}
            onClick={() => onRowClick && onRowClick(item)}
          >
            {renderListItem(item)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full">
      {renderViewSwitcher()}

      {viewMode === "table" && (
        <Table
          data={data}
          columns={columns}
          onRowClick={onRowClick}
          selectedRowId={selectedRowId}
          rowId={rowId}
          {...props}
        />
      )}

      {viewMode === "grid" && renderGrid()}
      {viewMode === "list" && renderList()}
    </div>
  );
}
```

### ٢. مكون جدول للشاشات الصغيرة

```tsx
// ResponsiveTable.tsx - جدول متجاوب مع الشاشات الصغيرة
import React from "react";
import { cn } from "@/lib/utils";

export interface ResponsiveTableProps<T = any> {
  data: T[];
  columns: {
    key: string;
    title: string;
    render?: (value: any, item: T) => React.ReactNode;
    priority?: 1 | 2 | 3; // أولوية ظهور العمود: 1 (عالية) - 3 (منخفضة)
  }[];
  className?: string;
  onRowClick?: (item: T) => void;
  selectedId?: string | number;
  idKey?: string;
}

export function ResponsiveTable<T extends Record<string, any>>({
  data,
  columns,
  className,
  onRowClick,
  selectedId,
  idKey = "id",
}: ResponsiveTableProps<T>) {
  return (
    <div className={cn("w-full overflow-hidden", className)}>
      {/* نسخة الشاشات الكبيرة */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b dark:border-gray-700">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-4 py-3 text-right text-sm font-medium text-gray-600 dark:text-gray-300",
                    // إخفاء الأعمدة ذات الأولوية المنخفضة على الشاشات الأصغر
                    col.priority === 3 && "lg:table-cell hidden",
                    col.priority === 2 && "md:table-cell hidden"
                  )}
                >
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, rowIndex) => (
              <tr
                key={rowIndex}
                className={cn(
                  "border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors",
                  onRowClick && "cursor-pointer",
                  selectedId && item[idKey] === selectedId && "bg-primary/5"
                )}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      "px-4 py-3 text-sm",
                      col.priority === 3 && "lg:table-cell hidden",
                      col.priority === 2 && "md:table-cell hidden"
                    )}
                  >
                    {col.render
                      ? col.render(item[col.key], item)
                      : item[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* نسخة الجوال - عرض البطاقات */}
      <div className="md:hidden space-y-4">
        {data.map((item, index) => (
          <div
            key={index}
            className={cn(
              "border dark:border-gray-700 rounded-lg overflow-hidden transition-all",
              onRowClick && "cursor-pointer",
              selectedId && item[idKey] === selectedId && "border-primary"
            )}
            onClick={() => onRowClick?.(item)}
          >
            <div className="p-4 space-y-3">
              {columns
                .filter((col) => col.priority !== 3) // تصفية الأعمدة ذات الأولوية المنخفضة
                .map((col) => (
                  <div key={col.key} className="flex justify-between items-start">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {col.title}:
                    </span>
                    <div className="text-sm text-right text-gray-900 dark:text-white max-w-[60%]">
                      {col.render
                        ? col.render(item[col.key], item)
                        : item[col.key]}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### ٣. مكون للبحث والتصفية المتقدمة في الجداول

```tsx
// TableFilters.tsx - مكون البحث والتصفية للجداول
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";
import { Input } from "./Input";
import { Select } from "./Select";
import { Filter, Search, X } from "lucide-react";

export interface FilterOption {
  field: string;
  label: string;
  type: "text" | "number" | "select" | "date" | "boolean";
  options?: { label: string; value: string | number | boolean }[];
  placeholder?: string;
}

export interface TableFiltersProps {
  filters: FilterOption[];
  onFilterChange: (filters: Record<string, any>) => void;
  className?: string;
  searchField?: string;
  searchPlaceholder?: string;
}

export function TableFilters({
  filters,
  onFilterChange,
  className,
  searchField,
  searchPlaceholder = "بحث...",
}: TableFiltersProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [searchQuery, setSearchQuery] = useState("");

  // تطبيق الفلاتر عند تغييرها
  useEffect(() => {
    let newFilters = { ...activeFilters };
    
    // إضافة قيمة البحث إذا كانت موجودة
    if (searchField && searchQuery) {
      newFilters[searchField] = searchQuery;
    } else if (searchField) {
      delete newFilters[searchField];
    }
    
    onFilterChange(newFilters);
  }, [activeFilters, searchQuery]);

  // تحديث قيمة الفلتر
  const handleFilterChange = (field: string, value: any) => {
    setActiveFilters((prev) => {
      const newFilters = { ...prev };
      
      if (value === undefined || value === "" || value === null) {
        delete newFilters[field];
      } else {
        newFilters[field] = value;
      }
      
      return newFilters;
    });
  };

  // مسح جميع الفلاتر
  const handleClearFilters = () => {
    setActiveFilters({});
    setSearchQuery("");
  };

  // عرض عنصر الفلتر المناسب حسب النوع
  const renderFilterInput = (filter: FilterOption) => {
    const value = activeFilters[filter.field] || "";
    
    switch (filter.type) {
      case "select":
        return (
          <Select
            value={value}
            onChange={(e) => handleFilterChange(filter.field, e.target.value)}
            className="w-full"
            placeholder={filter.placeholder || `اختر ${filter.label}`}
          >
            <option value="">الكل</option>
            {filter.options?.map((option) => (
              <option key={String(option.value)} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        );
        
      case "boolean":
        return (
          <Select
            value={value}
            onChange={(e) => handleFilterChange(filter.field, e.target.value)}
            className="w-full"
            placeholder={filter.placeholder || `اختر ${filter.label}`}
          >
            <option value="">الكل</option>
            <option value="true">نعم</option>
            <option value="false">لا</option>
          </Select>
        );
        
      case "date":
        return (
          <Input
            type="date"
            value={value}
            onChange={(e) => handleFilterChange(filter.field, e.target.value)}
            className="w-full"
            placeholder={filter.placeholder}
          />
        );
        
      case "number":
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => handleFilterChange(filter.field, e.target.value)}
            className="w-full"
            placeholder={filter.placeholder}
          />
        );
        
      default:
        return (
          <Input
            type="text"
            value={value}
            onChange={(e) => handleFilterChange(filter.field, e.target.value)}
            className="w-full"
            placeholder={filter.placeholder}
          />
        );
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* شريط البحث والفلاتر */}
      <div className="flex flex-wrap gap-3 items-center">
        {searchField && (
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 w-full"
              placeholder={searchPlaceholder}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={cn(
            "flex items-center",
            Object.keys(activeFilters).length > 0 && "border-primary text-primary"
          )}
        >
          <Filter className="ml-2 h-4 w-4" />
          فلترة
          {Object.keys(activeFilters).length > 0 && (
            <span className="mr-2 px-1.5 py-0.5 text-xs rounded-full bg-primary text-white">
              {Object.keys(activeFilters).length}
            </span>
          )}
        </Button>

        {Object.keys(activeFilters).length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-gray-700 hover:text-destructive dark:text-gray-300"
          >
            <X className="ml-2 h-4 w-4" />
            مسح الفلاتر
          </Button>
        )}
      </div>

      {/* منطقة الفلاتر */}
      {isFilterOpen && (
        <div className="border dark:border-gray-700 rounded-lg p-4 bg-background">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filters.map((filter) => (
              <div key={filter.field} className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {filter.label}
                </label>
                {renderFilterInput(filter)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

## مبادئ تصميم الجداول

### ١. الوضوح والترتيب
- تنظيم البيانات بطريقة منطقية ومتسقة
- استخدام مساحات وحدود كافية لتمييز الصفوف والأعمدة
- الحفاظ على تباين ألوان كافٍ لسهولة القراءة

### ٢. التفاعلية
- توفير ميزات فرز البيانات، والتصفية، والبحث
- إضافة تأثيرات بصرية للتفاعلات (hover, selection)
- دعم الترقيم للجداول الكبيرة

### ٣. التجاوب مع أحجام الشاشات
- تكييف عرض الجدول حسب حجم الشاشة
- تحويل عرض الجدول إلى بطاقات على الشاشات الصغيرة
- الحفاظ على البيانات المهمة وإخفاء البيانات الثانوية عند الضرورة

### ٤. الكفاءة والأداء
- استخدام التحميل الافتراضي للجداول الكبيرة
- تحسين أداء التفاعلات (الفرز، البحث، التصفية)
- التعامل مع المحتوى الفارغ بطريقة لائقة

### ٥. سهولة الوصول
- دعم التنقل باستخدام لوحة المفاتيح
- استخدام علامات وصف مناسبة للقراء الشاشة
- توفير تباين كافٍ للألوان والنصوص

## اعتبارات إضافية

### الاستخدام في الشاشات المختلفة
- **سطح المكتب**: جدول كامل مع جميع الميزات
- **الأجهزة اللوحية**: جدول أبسط مع أعمدة أقل
- **الهواتف الذكية**: عرض على شكل بطاقات بدلاً من الجدول التقليدي

### تخصيص الجداول
- إتاحة اختيار الأعمدة المعروضة للمستخدم
- حفظ تفضيلات العرض للمستخدم (الفرز، الترتيب، التصفية)
- دعم إعدادات مخصصة للجداول في كل صفحة 