# توصيات تحسين مكون الأزرار (Buttons)

## المشاكل الحالية
بعد مراجعة كود مكون الأزرار الحالي وتطبيقاته في المشروع، لاحظنا بعض النقاط التي تحتاج إلى تحسين:

1. عدم توحيد أنماط وأحجام الأزرار في جميع أنحاء التطبيق
2. محدودية خيارات تخصيص الأزرار (الألوان، الأحجام، الزوايا)
3. عدم وجود دعم كامل للأيقونات في مواقع مختلفة من الزر
4. تباين ضعيف بين حالات الزر المختلفة (hover, focus, active, disabled)
5. ضعف دعم إمكانية الوصول (Accessibility) للأزرار

## التحسينات المقترحة

### ١. إعادة تصميم مكون الزر الأساسي

```tsx
// Button.tsx - النسخة المحسنة
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { Loader2 } from "lucide-react";

// تعريف الأنواع
export type ButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link"
  | "accent";

export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl" | "icon";

// خصائص الزر
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  rounded?: boolean;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      asChild = false,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      rounded = false,
      fullWidth = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const isDisabled = disabled || loading;
    
    // تعريف أنماط الأزرار
    const variantStyles: Record<ButtonVariant, string> = {
      default:
        "bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary",
      destructive:
        "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive",
      outline:
        "border border-input bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-accent",
      secondary:
        "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-secondary",
      ghost:
        "hover:bg-accent hover:text-accent-foreground focus-visible:ring-accent",
      link: "text-primary underline-offset-4 hover:underline focus-visible:ring-primary",
      accent:
        "bg-accent text-accent-foreground hover:bg-accent/90 focus-visible:ring-accent",
    };

    // تعريف أحجام الأزرار
    const sizeStyles: Record<ButtonSize, string> = {
      xs: "h-8 px-2.5 text-xs",
      sm: "h-9 px-3 text-sm",
      md: "h-10 px-4 text-sm",
      lg: "h-11 px-6 text-base",
      xl: "h-12 px-8 text-base",
      icon: "h-10 w-10",
    };

    // تعريف أنماط الأيقونات حسب حجم الزر
    const iconSizeStyles: Record<ButtonSize, string> = {
      xs: "h-3.5 w-3.5",
      sm: "h-4 w-4",
      md: "h-4 w-4",
      lg: "h-5 w-5",
      xl: "h-5 w-5",
      icon: "h-5 w-5",
    };

    return (
      <Comp
        className={cn(
          // الأسلوب الأساسي
          "relative inline-flex items-center justify-center font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:opacity-70 disabled:pointer-events-none",
          
          // أنماط متغيرة
          variantStyles[variant],
          sizeStyles[size],
          rounded ? "rounded-full" : "rounded-md",
          fullWidth && "w-full",
          loading && "opacity-80",
          
          // التخصيص
          className
        )}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {/* أيقونة التحميل */}
        {loading && (
          <Loader2 className={cn("animate-spin ml-2", iconSizeStyles[size])} />
        )}
        
        {/* الأيقونة اليسرى */}
        {leftIcon && !loading && (
          <span className={cn("ml-2 -mr-1 rtl:ml-0 rtl:mr-2", iconSizeStyles[size])}>
            {leftIcon}
          </span>
        )}
        
        {/* محتوى الزر */}
        {children}
        
        {/* الأيقونة اليمنى */}
        {rightIcon && (
          <span className={cn("mr-2 -ml-1 rtl:mr-0 rtl:ml-2", iconSizeStyles[size])}>
            {rightIcon}
          </span>
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button };
```

### ٢. تحسينات متغيرات CSS للأزرار

يجب تحديث ملف `globals.css` لإضافة متغيرات موحدة للأزرار:

```css
:root {
  /* متغيرات الأزرار */
  --button-radius: 0.5rem;
  --button-radius-full: 9999px;
  
  /* الألوان الأساسية */
  --button-default-bg: var(--color-primary);
  --button-default-text: white;
  --button-default-hover: var(--color-primary-dark);
  
  /* الألوان التدميرية */
  --button-destructive-bg: var(--color-red-500);
  --button-destructive-text: white;
  --button-destructive-hover: var(--color-red-600);
  
  /* الألوان الثانوية */
  --button-secondary-bg: var(--color-gray-200);
  --button-secondary-text: var(--color-gray-800);
  --button-secondary-hover: var(--color-gray-300);
  
  /* تأثيرات التحويم والتركيز */
  --button-focus-ring: 2px solid rgba(var(--color-primary-rgb), 0.5);
  --button-transition: all 0.2s ease-in-out;
}

.dark {
  /* متغيرات الأزرار في الوضع المظلم */
  --button-secondary-bg: var(--color-gray-700);
  --button-secondary-text: var(--color-gray-200);
  --button-secondary-hover: var(--color-gray-600);
}
```

### ٣. أمثلة لأزرار متخصصة مشتقة من المكون الأساسي

#### زر الإجراء الرئيسي

```tsx
// PrimaryActionButton.tsx
import { Button, ButtonProps } from "./Button";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

interface PrimaryActionButtonProps extends ButtonProps {
  actionType?: "create" | "save" | "submit" | "next";
}

export const PrimaryActionButton = forwardRef<HTMLButtonElement, PrimaryActionButtonProps>(
  ({ actionType = "save", children, className, ...props }, ref) => {
    // تحديد النص والأيقونة حسب نوع الإجراء
    const actionContent = {
      create: {
        text: "إنشاء",
        icon: <Plus className="h-5 w-5" />,
      },
      save: {
        text: "حفظ",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        ),
      },
      submit: {
        text: "تقديم",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        ),
      },
      next: {
        text: "التالي",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        ),
      },
    };

    return (
      <Button
        variant="default"
        size="lg"
        leftIcon={actionContent[actionType].icon}
        className={cn("shadow-md", className)}
        ref={ref}
        {...props}
      >
        {children || actionContent[actionType].text}
      </Button>
    );
  }
);

PrimaryActionButton.displayName = "PrimaryActionButton";
```

#### زر الفلتر

```tsx
// FilterButton.tsx
import { Button, ButtonProps } from "./Button";
import { forwardRef, useState } from "react";
import { cn } from "@/lib/utils";

interface FilterButtonProps extends ButtonProps {
  active?: boolean;
  count?: number;
}

export const FilterButton = forwardRef<HTMLButtonElement, FilterButtonProps>(
  ({ active = false, count, children, className, ...props }, ref) => {
    return (
      <Button
        variant={active ? "default" : "outline"}
        size="sm"
        className={cn(
          "transition-all",
          active ? "bg-primary text-white" : "hover:bg-gray-100 dark:hover:bg-gray-800",
          className
        )}
        ref={ref}
        {...props}
      >
        <span>{children}</span>
        {count !== undefined && (
          <span
            className={cn(
              "mr-2 px-1.5 py-0.5 text-xs rounded-full",
              active
                ? "bg-white text-primary"
                : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
            )}
          >
            {count}
          </span>
        )}
      </Button>
    );
  }
);

FilterButton.displayName = "FilterButton";
```

### ٤. مبادئ تصميم الأزرار

1. **الوضوح والتمييز**: يجب أن تكون الأزرار واضحة ومميزة بصريًا عن العناصر الأخرى
2. **التسلسل الهرمي**: استخدام أنماط مختلفة لإظهار أهمية الإجراءات:
   - أزرار أساسية (Primary): للإجراءات الرئيسية مثل الحفظ والإرسال
   - أزرار ثانوية (Secondary): للإجراءات الثانوية مثل الإلغاء
   - أزرار خفيفة (Ghost): للإجراءات الأقل أهمية
3. **الاتساق**: الحفاظ على اتساق تصميم الأزرار في جميع أنحاء التطبيق
4. **التفاعلية**: توفير تغذية راجعة بصرية للمستخدم (hover, active, focus)
5. **إمكانية الوصول**: ضمان تباين كافٍ وإمكانية الوصول للأزرار

### ٥. حالات الأزرار المختلفة

#### ١. الحالة العادية (Default)
الحالة الأساسية للزر في التصميم.

#### ٢. حالة التحويم (Hover)
تغيير خفيف في اللون أو الظل عند تحويم المؤشر فوق الزر.

#### ٣. حالة التركيز (Focus)
إظهار حلقة تركيز عند التنقل باستخدام لوحة المفاتيح.

#### ٤. حالة النشاط (Active)
تغيير في المظهر عند النقر على الزر.

#### ٥. حالة التعطيل (Disabled)
تعتيم الزر وتعطيل التفاعل عندما لا يكون الإجراء متاحًا.

#### ٦. حالة التحميل (Loading)
إظهار مؤشر تحميل داخل الزر أثناء معالجة الإجراء.

### ٦. اعتبارات إضافية

1. **دعم اللغة العربية**: ضمان عرض الأيقونات والمحتوى بشكل صحيح في اتجاه RTL
2. **تحسين الأداء**: تجنب إعادة التقديم غير الضرورية للأزرار
3. **إعادة الاستخدام**: تصميم واجهة مرنة تسمح بإعادة استخدام الأزرار في مواقف مختلفة
4. **التوثيق**: توثيق جميع الخيارات والأنماط المتاحة للمطورين

## أمثلة للاستخدام

### مثال لشريط إجراءات

```tsx
import { Button } from "@/components/ui/Button";
import { PrimaryActionButton } from "@/components/ui/PrimaryActionButton";
import { FilterButton } from "@/components/ui/FilterButton";
import { Plus, Filter, Download, Trash } from "lucide-react";

const ActionBar = () => {
  return (
    <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
      <div className="flex flex-wrap gap-2">
        <FilterButton active count={12}>الكل</FilterButton>
        <FilterButton count={8}>قيد التنفيذ</FilterButton>
        <FilterButton count={4}>مكتملة</FilterButton>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="md" leftIcon={<Filter className="h-4 w-4" />}>
          تصفية
        </Button>
        <Button variant="outline" size="md" leftIcon={<Download className="h-4 w-4" />}>
          تصدير
        </Button>
        <Button variant="destructive" size="md" leftIcon={<Trash className="h-4 w-4" />}>
          حذف
        </Button>
        <PrimaryActionButton actionType="create">
          إضافة جديد
        </PrimaryActionButton>
      </div>
    </div>
  );
};
```

### مثال للأزرار في النماذج

```tsx
import { Button } from "@/components/ui/Button";
import { useState } from "react";

const FormExample = () => {
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // محاكاة عملية الحفظ
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* حقول النموذج */}
      
      <div className="flex justify-end gap-3 mt-8">
        <Button variant="outline" type="button">
          إلغاء
        </Button>
        <Button 
          variant="default" 
          type="submit" 
          loading={loading}
        >
          حفظ البيانات
        </Button>
      </div>
    </form>
  );
};
``` 