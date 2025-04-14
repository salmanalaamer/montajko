# توصيات تحسين مكون الجداول (Tables)

## المشاكل الحالية
بعد تحليل كود مكون الجداول الحالي وتطبيقاته في المشروع، لاحظنا بعض النقاط التي تحتاج إلى تحسين:

1. عدم توحيد مظهر الجداول بين مختلف أجزاء التطبيق
2. ضعف القدرة على التكيف مع الشاشات الصغيرة
3. محدودية خيارات التخصيص (الترقيم، الفرز، التصفية)
4. عدم وجود دعم جيد للجداول التفاعلية
5. مشاكل في عرض الجداول ذات البيانات الكبيرة

## التحسينات المقترحة - الجزء الأول: المكونات الأساسية

### ١. إعادة تصميم مكونات الجدول الأساسية

```tsx
// table-base.tsx - المكونات الأساسية
import React from "react";
import { cn } from "@/lib/utils";

// مكون الجدول الأساسي
export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  dense?: boolean;
  bordered?: boolean;
  hoverable?: boolean;
  striped?: boolean;
}

export const TableBase: React.FC<TableProps> = ({
  className,
  dense = false,
  bordered = false,
  hoverable = false,
  striped = false,
  ...props
}) => (
  <div className="w-full overflow-auto">
    <table
      className={cn(
        "w-full caption-bottom text-sm",
        bordered && "border border-border",
        className
      )}
      {...props}
    />
  </div>
);

// مكون رأس الجدول
export interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  sticky?: boolean;
}

export const TableHeader: React.FC<TableHeaderProps> = ({
  className,
  sticky = false,
  ...props
}) => (
  <thead
    className={cn(
      sticky && "sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      className
    )}
    {...props}
  />
);

// مكون عنوان العمود
export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean;
  sortDirection?: "asc" | "desc" | null;
}

export const TableHead: React.FC<TableHeadProps> = ({
  className,
  sortable = false,
  sortDirection,
  children,
  ...props
}) => (
  <th
    className={cn(
      "h-12 px-4 text-right align-middle font-medium text-foreground [&:has([role=checkbox])]:pr-0",
      sortable && "cursor-pointer select-none",
      className
    )}
    {...props}
  >
    <div className="flex items-center justify-between">
      {children}
      {sortable && (
        <div className="w-4 h-4 mr-2">
          {sortDirection === "asc" && (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path
                fillRule="evenodd"
                d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832 6.29 12.77a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z"
                clipRule="evenodd"
              />
            </svg>
          )}
          {sortDirection === "desc" && (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      )}
    </div>
  </th>
);

// مكون جسم الجدول
export const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  className,
  ...props
}) => <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />;

// مكون صف الجدول
export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  selected?: boolean;
  disabled?: boolean;
}

export const TableRow: React.FC<TableRowProps> = ({
  className,
  selected = false,
  disabled = false,
  ...props
}) => (
  <tr
    className={cn(
      "border-b border-border transition-colors",
      selected && "bg-accent/50",
      disabled && "opacity-60 cursor-not-allowed",
      !disabled && "hover:bg-accent/10 data-[state=selected]:bg-accent/30",
      className
    )}
    {...props}
  />
);

// مكون خلية الجدول
export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {}

export const TableCell: React.FC<TableCellProps> = ({
  className,
  ...props
}) => (
  <td
    className={cn(
      "p-4 align-middle [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
);

// مكون تذييل الجدول
export const TableFooter: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  className,
  ...props
}) => (
  <tfoot
    className={cn("border-t bg-muted/50 font-medium", className)}
    {...props}
  />
);

// مكون شرح الجدول
export const TableCaption: React.FC<React.HTMLAttributes<HTMLTableCaptionElement>> = ({
  className,
  ...props
}) => (
  <caption
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
);
```

### ٢. تحسينات متغيرات CSS للجداول

يجب تحديث ملف `globals.css` لإضافة متغيرات موحدة للجداول:

```css
:root {
  /* متغيرات الجداول */
  --table-bg: transparent;
  --table-border-color: var(--border-color);
  --table-header-bg: var(--background-subtle);
  --table-header-color: var(--foreground);
  --table-cell-padding-y: 0.75rem;
  --table-cell-padding-x: 1rem;
  --table-row-hover-bg: rgba(0, 0, 0, 0.04);
  --table-stripe-bg: rgba(0, 0, 0, 0.02);
  --table-selected-bg: var(--color-primary-50);
}

.dark {
  /* متغيرات الجداول في الوضع المظلم */
  --table-header-bg: rgba(255, 255, 255, 0.05);
  --table-row-hover-bg: rgba(255, 255, 255, 0.05);
  --table-stripe-bg: rgba(255, 255, 255, 0.03);
  --table-selected-bg: rgba(var(--color-primary-rgb), 0.2);
}
```

### ٣. مكونات الجدول المتقدمة

```tsx
// Table.tsx - مكون الجدول المتقدم

import React, { useState, useEffect } from "react";
import {
  TableBase,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableFooter,
  TableCaption,
  type TableProps as BaseTableProps
} from "./table-base";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./Button";

// تعريف أنواع البيانات
type SortDirection = "asc" | "desc" | null;

export interface TableColumn<T = any> {
  header: React.ReactNode;
  accessorKey?: string;
  cell?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

export interface TablePagination {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

// خصائص الجدول
export interface TableProps<T = any> extends Omit<BaseTableProps, "children"> {
  data: T[];
  columns: TableColumn<T>[];
  pagination?: TablePagination;
  sortable?: boolean;
  variant?: "default" | "elegant" | "compact";
  hoverable?: boolean;
  striped?: boolean;
  bordered?: boolean;
  rounded?: boolean;
  animate?: boolean;
  isLoading?: boolean;
  emptyState?: React.ReactNode;
  onRowClick?: (item: T) => void;
  selectedRowId?: string | number;
  rowId?: keyof T;
}

export function Table<T>({
  data,
  columns,
  pagination,
  sortable = false,
  variant = "default",
  hoverable = true,
  striped = false,
  bordered = false,
  rounded = false,
  animate = false,
  isLoading = false,
  emptyState,
  onRowClick,
  selectedRowId,
  rowId = "id" as keyof T,
  className,
  ...props
}: TableProps<T>) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [currentItems, setCurrentItems] = useState<T[]>([]);

  // تحديث العناصر المعروضة عند تغيير البيانات أو الترتيب أو الصفحة
  useEffect(() => {
    let sortedData = [...data];

    // ترتيب البيانات إذا كان هناك عمود مختار للترتيب
    if (sortColumn && sortDirection) {
      sortedData.sort((a: any, b: any) => {
        const valueA = a[sortColumn];
        const valueB = b[sortColumn];

        if (valueA === valueB) return 0;

        // التحقق من نوع القيمة وإجراء المقارنة المناسبة
        if (typeof valueA === "string") {
          if (sortDirection === "asc") {
            return valueA.localeCompare(valueB);
          }
          return valueB.localeCompare(valueA);
        } else {
          if (sortDirection === "asc") {
            return valueA > valueB ? 1 : -1;
          }
          return valueA < valueB ? 1 : -1;
        }
      });
    }

    // تقسيم الصفحات إذا كان هناك ترقيم
    if (pagination) {
      const { currentPage, pageSize } = pagination;
      const startIndex = (currentPage - 1) * pageSize;
      setCurrentItems(sortedData.slice(startIndex, startIndex + pageSize));
    } else {
      setCurrentItems(sortedData);
    }
  }, [data, sortColumn, sortDirection, pagination]);

  // معالجة النقر على رأس العمود للترتيب
  const handleSort = (column: TableColumn) => {
    if (!sortable || !column.sortable || !column.accessorKey) return;

    let direction: SortDirection = "asc";

    if (sortColumn === column.accessorKey) {
      if (sortDirection === "asc") {
        direction = "desc";
      } else if (sortDirection === "desc") {
        direction = null;
      }
    }

    setSortColumn(direction ? column.accessorKey : null);
    setSortDirection(direction);
  };

  // معالجة النقر على الصف
  const handleRowClick = (item: T) => {
    if (onRowClick) {
      onRowClick(item);
    }
  };

  // تحديد أسلوب الجدول حسب النوع المختار
  const tableStyle = cn(
    "w-full",
    striped && "table-striped",
    rounded && "rounded-lg overflow-hidden",
    animate && "table-animate",
    variant === "elegant" && "table-elegant",
    variant === "compact" && "table-compact",
    className
  );

  // عرض حالة التحميل
  if (isLoading) {
    return (
      <div className="w-full min-h-[200px] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-r-transparent rounded-full" />
      </div>
    );
  }

  // عرض حالة عدم وجود بيانات
  if (data.length === 0 && emptyState) {
    return <div className="w-full">{emptyState}</div>;
  }

  return (
    <div className={cn("w-full", rounded && "rounded-lg overflow-hidden")}>
      <TableBase className={tableStyle} hoverable={hoverable} bordered={bordered} {...props}>
        <TableHeader sticky={variant === "elegant"}>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead
                key={index}
                className={cn(
                  column.sortable && sortable && "cursor-pointer",
                  variant === "elegant" && "bg-accent/10"
                )}
                onClick={() => handleSort(column)}
                sortable={column.sortable && sortable}
                sortDirection={
                  column.accessorKey === sortColumn ? sortDirection : null
                }
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((item, rowIndex) => (
            <TableRow
              key={rowIndex}
              onClick={() => handleRowClick(item)}
              className={cn(onRowClick && "cursor-pointer")}
              selected={selectedRowId !== undefined && item[rowId] === selectedRowId}
            >
              {columns.map((column, colIndex) => (
                <TableCell key={colIndex}>
                  {column.cell
                    ? column.cell(item)
                    : column.accessorKey
                    ? (item as any)[column.accessorKey]
                    : null}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </TableBase>

      {/* ترقيم الصفحات */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            صفحة {pagination.currentPage} من {pagination.totalPages}
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                pagination.onPageChange(pagination.currentPage - 1)
              }
              disabled={pagination.currentPage <= 1}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            {/* عرض أرقام الصفحات */}
            <div className="flex items-center">
              {Array.from(
                { length: Math.min(5, pagination.totalPages) },
                (_, i) => {
                  let pageNum;
                  const currentPage = pagination.currentPage;
                  const totalPages = pagination.totalPages;
                  
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={i}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => pagination.onPageChange(pageNum)}
                      className={cn(
                        "h-8 w-8 p-0 mx-1",
                        currentPage === pageNum
                          ? "bg-primary text-primary-foreground"
                          : ""
                      )}
                    >
                      {pageNum}
                    </Button>
                  );
                }
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                pagination.onPageChange(pagination.currentPage + 1)
              }
              disabled={pagination.currentPage >= pagination.totalPages}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}