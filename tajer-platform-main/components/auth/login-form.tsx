'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/components/auth/auth-provider';
import { useTranslations } from 'next-intl';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const formSchema = z.object({
  phone: z.string()
    .min(7, { message: 'رقم الهاتف يجب أن يكون 7 أرقام على الأقل' }),
  password: z.string().min(6, { message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' }),
});

export default function LoginForm() {
  const t = useTranslations('auth');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      setApiError(null);
      setSuccessMsg(null);

      const response = await fetch('https://tajer-backend.tajerplatform.workers.dev/api/auth/login', {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          phone: values.phone,
          passwordHash: values.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        if (data.token && data.user) {
          // استخدام await مع login علشان نتأكد ان البيانات اتحفظت
          await login(data.user, data.token);
          setSuccessMsg(t('succesMessage') || 'تم تسجيل الدخول بنجاح!');
          
          // توجيه المستخدم بناءً على الدور
          setTimeout(() => {
           
              router.push(redirectTo);
              router.refresh(); // علشان نتأكد ان الـ layout يتحدث
            
          }, 1500);
        } else {
          throw new Error('بيانات الاستجابة غير مكتملة');
        }
      } else {
        // معالجة الأخطاء المختلفة
        if (data.message?.includes("user is not active") || data.message?.includes("not active")) {
          throw new Error('حسابك لم يتم تفعيله من قبل الأدمن بعد، يرجى الانتظار');
        } else if (data.message?.includes("Invalid credentials") || data.message?.includes("incorrect")) {
          throw new Error('رقم الهاتف أو كلمة المرور غير صحيحة');
        } else {
          throw new Error(data.message || 'فشل تسجيل الدخول');
        }
      }
    } catch  {
      console.error('Login error:');
      setApiError( t('errorPhoneNumberOrPassword') || 'حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('phone') || 'رقم الهاتف'}</FormLabel>
                <FormControl>
                  <Input 
                    {...field}
                    placeholder="07xxxxxxxx"
                    disabled={isLoading}
                    dir="ltr"
                    className="text-left"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('password') || 'كلمة المرور'}</FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="********" 
                    {...field} 
                    disabled={isLoading}
                    dir="ltr"
                    className="text-left"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between">
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              {t('forgotPassword') || 'نسيت كلمة المرور؟'}
            </Link>
          </div>

          {/* عرض الرسائل */}
          {apiError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{apiError}</AlertDescription>
            </Alert>
          )}
          
          {successMsg && (
            <Alert className="bg-green-50 border-green-200 ">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{successMsg}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90"
            disabled={isLoading}
          >
            {isLoading ? ( 
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                <span>{t('loggingIn') || 'جاري تسجيل الدخول...'}</span>
              </div>
            ) : (t('login') || 'تسجيل الدخول')}
          </Button>

          <div className="text-center text-sm">
            {t('noAccount') || 'ليس لديك حساب؟'}
            <Link href="/register" className="text-primary hover:underline">
              {' '}
              {t('registerNow') || 'سجل الآن'}
            </Link>
          </div>
        </form>
      </Form>
    </Card>
  );
}