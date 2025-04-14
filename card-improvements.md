# توصيات تحسين مكون البطاقات (Cards)

## المشاكل الحالية
بعد تحليل الملفات الحالية، لاحظنا بعض التحديات في مكونات البطاقات:

1. عدم توحيد أسلوب البطاقات بين الصفحات المختلفة
2. استخدام متغيرات CSS غير متسقة للظلال والحواف
3. عدم وجود تأثيرات انتقالية سلسة بين حالات البطاقة (عادي، hover، active)
4. تباين غير كافٍ في وضع الظلام مما يؤثر على سهولة القراءة
5. عدم مرونة المكون لاستيعاب احتياجات العرض المختلفة

## التحسينات المقترحة

### ١. إعادة تصميم مكون البطاقة الأساسي

```tsx
// Card.tsx - النسخة المحسنة
import { cn } from "@/lib/utils";
import React from "react";

// تعريف أنواع البطاقات المتاحة
type CardVariant = "default" | "outline" | "ghost" | "elevated" | "interactive";
type CardSize = "sm" | "md" | "lg" | "xl" | "auto";

interface CardProperties {
  className?: string;
  children?: React.ReactNode;
  variant?: CardVariant;
  size?: CardSize;
  hover?: boolean;
  elevation?: "none" | "sm" | "md" | "lg";
  border?: boolean;
  rounded?: "none" | "sm" | "md" | "lg" | "full";
  onClick?: () => void;
}

// الخصائص الافتراضية
const defaultProps = {
  variant: "default" as CardVariant,
  size: "md" as CardSize,
  hover: false,
  elevation: "sm" as "none" | "sm" | "md" | "lg",
  border: true,
  rounded: "lg" as "none" | "sm" | "md" | "lg" | "full",
};

export const Card: React.FC<CardProperties> = ({
  className,
  children,
  variant = defaultProps.variant,
  size = defaultProps.size,
  hover = defaultProps.hover,
  elevation = defaultProps.elevation,
  border = defaultProps.border,
  rounded = defaultProps.rounded,
  onClick,
  ...props
}) => {
  // تعريف أنماط البطاقات
  const variantStyles: Record<CardVariant, string> = {
    default: "bg-card text-card-foreground",
    outline: "bg-transparent border-2",
    ghost: "bg-transparent border-0 shadow-none",
    elevated: "bg-card text-card-foreground shadow-lg",
    interactive: "bg-card text-card-foreground cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1",
  };

  // تعريف أحجام البطاقات
  const sizeStyles: Record<CardSize, string> = {
    sm: "p-3",
    md: "p-5",
    lg: "p-6",
    xl: "p-8",
    auto: "",
  };

  // تعريف أنماط الزوايا
  const roundedStyles: Record<"none" | "sm" | "md" | "lg" | "full", string> = {
    none: "rounded-none",
    sm: "rounded-md",
    md: "rounded-lg",
    lg: "rounded-xl",
    full: "rounded-[var(--border-radius-card)]",
  };

  // تعريف أنماط الظلال
  const elevationStyles: Record<"none" | "sm" | "md" | "lg", string> = {
    none: "shadow-none",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
  };

  return (
    <div
      className={cn(
        "card-component",
        variantStyles[variant],
        sizeStyles[size],
        roundedStyles[rounded],
        elevationStyles[elevation],
        border && variant !== "ghost" && variant !== "outline" && "border border-border",
        hover && "transition-all duration-200 hover:shadow-card-hover",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

// تعريف مكونات فرعية للبطاقة
export const CardHeader: React.FC<{ className?: string; children?: React.ReactNode }> = ({
  className,
  children,
  ...props
}) => (
  <div
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  >
    {children}
  </div>
);

export const CardTitle: React.FC<{ className?: string; children?: React.ReactNode }> = ({
  className,
  children,
  ...props
}) => (
  <h3
    className={cn("text-2xl font-semibold text-foreground leading-none tracking-tight", className)}
    {...props}
  >
    {children}
  </h3>
);

export const CardDescription: React.FC<{ className?: string; children?: React.ReactNode }> = ({
  className,
  children,
  ...props
}) => (
  <p
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  >
    {children}
  </p>
);

export const CardContent: React.FC<{ className?: string; children?: React.ReactNode }> = ({
  className,
  children,
  ...props
}) => (
  <div className={cn("p-6 pt-0", className)} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<{ className?: string; children?: React.ReactNode }> = ({
  className,
  children,
  ...props
}) => (
  <div
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  >
    {children}
  </div>
);
```

### ٢. تحسينات متغيرات CSS للبطاقات

يجب تحديث ملف `globals.css` لإضافة متغيرات موحدة للبطاقات:

```css
:root {
  /* متغيرات البطاقات */
  --card-bg: #ffffff;
  --card-bg-hover: #f9fafb;
  --card-border: #e5e7eb;
  --card-border-radius: 1rem;
  --card-border-radius-sm: 0.375rem;
  --card-border-radius-md: 0.5rem;
  --card-border-radius-lg: 0.75rem;
  --card-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  --card-shadow-hover: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --card-shadow-active: 0 2px 4px rgba(0, 0, 0, 0.06);
  --card-transition: all 0.2s ease-in-out;
}

.dark {
  /* متغيرات البطاقات في الوضع المظلم */
  --card-bg: #1f2937;
  --card-bg-hover: #283548;
  --card-border: #374151;
  --card-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  --card-shadow-hover: 0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3);
  --card-shadow-active: 0 2px 4px rgba(0, 0, 0, 0.2);
}
```

### ٣. أنماط البطاقات المقترحة

#### بطاقة إحصائيات (StatCard)

```tsx
import { Card } from "./Card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  color?: "primary" | "secondary" | "accent" | "success" | "warning" | "danger" | "info";
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  trendValue,
  color = "primary",
  className,
}) => {
  // تعريف الألوان حسب النوع
  const colorStyles: Record<string, { bg: string; text: string; iconBg: string }> = {
    primary: {
      bg: "bg-primary-light/20",
      text: "text-primary",
      iconBg: "bg-primary-light",
    },
    secondary: {
      bg: "bg-gray-100",
      text: "text-gray-800",
      iconBg: "bg-gray-200",
    },
    accent: {
      bg: "bg-accent-light/20",
      text: "text-accent",
      iconBg: "bg-accent-light",
    },
    success: {
      bg: "bg-green-100",
      text: "text-green-800",
      iconBg: "bg-green-200",
    },
    warning: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      iconBg: "bg-yellow-200",
    },
    danger: {
      bg: "bg-red-100",
      text: "text-red-800",
      iconBg: "bg-red-200",
    },
    info: {
      bg: "bg-blue-100",
      text: "text-blue-800",
      iconBg: "bg-blue-200",
    },
  };

  return (
    <Card
      variant="default"
      hover={true}
      elevation="sm"
      className={cn("overflow-hidden transition-all duration-300", className)}
    >
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
            <p className="text-3xl font-bold mt-1 text-gray-900 dark:text-white">{value}</p>
            {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
          </div>
          {icon && (
            <div
              className={cn(
                "p-3 rounded-full",
                colorStyles[color].iconBg,
                colorStyles[color].text
              )}
            >
              {icon}
            </div>
          )}
        </div>

        {trend && (
          <div className="mt-4 flex items-center text-xs">
            {trend === "up" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 text-green-500 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {trend === "down" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 text-red-500 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12 13a1 1 0 110 2h-5a1 1 0 01-1-1v-5a1 1 0 112 0v2.586l4.293-4.293a1 1 0 011.414 0L16 9.586l4.293-4.293a1 1 0 011.414 1.414l-5 5a1 1 0 01-1.414 0L11 9.414 7.414 13H12z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <span
              className={cn(
                trend === "up" && "text-green-500",
                trend === "down" && "text-red-500",
                trend === "neutral" && "text-gray-500"
              )}
            >
              {trendValue}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};
```

#### بطاقة مشروع (ProjectCard)

```tsx
import { Card } from "./Card";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ProjectCardProps {
  id: string;
  title: string;
  client: string;
  progress: number;
  dueDate: string;
  tasks: number;
  completedTasks: number;
  className?: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  title,
  client,
  progress,
  dueDate,
  tasks,
  completedTasks,
  className,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const progressColor = progress > 66 
    ? "bg-green-500"
    : progress > 33
    ? "bg-yellow-500"
    : "bg-red-500";

  return (
    <Link href={`/projects/${id}`}>
      <Card
        variant="interactive"
        className={cn("border border-gray-200 dark:border-gray-700", className)}
      >
        <div className="p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white text-base line-clamp-1">
            {title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            {client}
          </p>

          <div className="mb-3">
            <div className="flex justify-between text-sm mb-1">
              <span>التقدم</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all", progressColor)}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              التسليم: {formatDate(dueDate)}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {completedTasks} / {tasks} مهمة مكتملة
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
};
```

### ٤. مبادئ تصميم البطاقات

1. **البساطة والاتساق**: توحيد أسلوب البطاقات في جميع أنحاء التطبيق
2. **المرونة**: توفير خيارات متعددة للبطاقات مع الحفاظ على مظهر متسق
3. **التفاعلية**: إضافة تأثيرات انتقالية سلسة للبطاقات التفاعلية
4. **قابلية القراءة**: ضمان تباين جيد للنص داخل البطاقات في جميع الأوضاع
5. **قابلية التوسيع**: تصميم نظام بطاقات يمكن توسيعه بسهولة لأنواع جديدة

### ٥. اعتبارات إضافية

1. **توافق الأجهزة المحمولة**: ضمان عرض البطاقات بشكل جيد على جميع أحجام الشاشات
2. **الوصول (Accessibility)**: تحسين دعم قارئات الشاشة وإمكانية التنقل باستخدام لوحة المفاتيح
3. **أداء التطبيق**: تحسين أداء عرض البطاقات المتعددة باستخدام التحميل المتدرج
4. **انسجام التصميم**: ضمان انسجام تصميم البطاقات مع بقية واجهة المستخدم للتطبيق

## أمثلة للاستخدام

### مثال لصفحة لوحة التحكم

```tsx
// استخدام البطاقات المحسنة في صفحة لوحة التحكم
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { BarChart3, Users, CheckSquare, Calendar } from "lucide-react";

export default function Dashboard() {
  // البيانات...
  
  return (
    <div className="space-y-6">
      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="إجمالي المشاريع"
          value="12"
          icon={<BarChart3 className="h-5 w-5" />}
          trend="up"
          trendValue="+2 هذا الشهر"
          color="primary"
        />
        <StatCard
          title="المهام النشطة"
          value="24"
          icon={<CheckSquare className="h-5 w-5" />}
          trend="down"
          trendValue="-3 هذا الأسبوع"
          color="accent"
        />
        {/* المزيد من البطاقات */}
      </div>

      {/* محتوى آخر */}
    </div>
  );
} 