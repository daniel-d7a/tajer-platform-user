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
import { AlertCircle } from 'lucide-react';

const formSchema = z.object({
  phone: z.string().min(7, {
    message: 'يجب أن يكون رقم الهاتف 10 أرقام على الأقل',
  }),
  password: z.string().min(1, {
    message: 'يرجى إدخال كلمة المرور',
  }),
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
  async function  onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    try{
      setIsLoading(true);
      const response = await fetch('https://tajer-backend.tajerplatform.workers.dev/api/auth/login',{
        method:"POST",
        credentials:"include",
          headers: { 
          "Content-Type": "application/json"
        },
          body: JSON.stringify({
          phone:`${values.phone}`,
          passwordHash: `${values.password}`
         })
      });
      if(response.ok){
        router.push(redirectTo);
        const resData = await response.json(); 
         setSuccessMsg('جاري تحويلك لصفحتك الشخصيه ');
localStorage.setItem("data", JSON.stringify(resData.user));
    login(resData.user);

};
      if(!response.ok){
        setApiError( 'رقم الهاتف او كلمه السر غير صحيحه يرجي المحاوله مره اخري');
      }
    }finally{
      setIsLoading(false);
     
    };
  };
  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('phone')}</FormLabel>
                <FormControl>
                  <Input 
                  {...field}
                   placeholder="07xxxxxxxx" />
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
                <FormLabel>{t('password')}</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
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
              {t('forgotPassword')}
            </Link>
          </div>
            {apiError && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{apiError}</AlertDescription>
                      </Alert>
                    )}
                    {successMsg && (
                      <Alert >
                        <AlertDescription>{successMsg}</AlertDescription>
                      </Alert>
                    )}
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90"
            disabled={isLoading}
          >
            {isLoading ? 'جاري تسجيل الدخول...' : t('login')}
          </Button>
          <div className="text-center text-sm">
            {t('noAccount')}
            <Link href="/register" className="text-primary hover:underline">
              {' '}
              {t('registerNow')}
            </Link>
          </div>
        </form>
      </Form>
    </Card>
  );
};