'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';

const formSchema = z.object({
  phone: z.string().min(8, {
    message: 'يجب أن يكون رقم الهاتف 10 أرقام على الأقل',
  }),
  verificationCode: z
    .string()
    .min(4, {
      message: 'يجب أن يكون رمز التحقق 4 أرقام',
    })
    .optional(),
});

export default function ForgotPasswordForm() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: '',
      verificationCode: '',
    },
  });

  function sendVerificationCode() {
    const phone = form.getValues('phone');
    if (phone.length < 10) {
      form.setError('phone', {
        type: 'manual',
        message: 'يرجى إدخال رقم هاتف صحيح',
      });
      return;
    }

    setIsVerifying(true);

    // هنا هتنده API عشان يبعث الكود
    setTimeout(() => {
      setSuccessMsg('تم إرسال رمز التحقق إلى رقم الهاتف');
    }, 1000);
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setApiError(null);
    setSuccessMsg(null);
    try {
      console.log('Form Values:', values);
      setSuccessMsg('تم التحقق من الرمز، يمكنك الآن تغيير كلمة المرور ');
    } catch (error) {
      setApiError('حدث خطأ أثناء التحقق. حاول مرة أخرى.');
      console.log(error);
    };
  };

  return (
    <div className='w-full flex justify-center items-center  h-screen'>
        
    <Card className="p-6 w-[30%] ">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>رقم الهاتف</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input {...field} placeholder="+962..." />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={sendVerificationCode}
                  >
                    إرسال رمز التحقق
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {isVerifying && (
            <FormField
              control={form.control}
              name="verificationCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>رمز التحقق</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="أدخل رمز التحقق" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {apiError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{apiError}</AlertDescription>
            </Alert>
          )}

          {successMsg && (
            <Alert>
              <AlertDescription>{successMsg}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90">
            تأكيد
          </Button>
        </form>
      </Form>
    </Card>
        </div>

  );
}
