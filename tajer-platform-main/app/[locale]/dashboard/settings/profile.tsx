"use client";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Input } from "@/components/ui/input"; 
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Cairo } from "next/font/google";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
  const cities = [
    { value: 'amman', label: 'عمان' },
    { value: 'zarqa', label: 'الزرقاء' },
    { value: 'irbid', label: 'إربد' },
    { value: 'russeifa', label: 'الرصيفة' },
    { value: 'wadi_sir', label: 'وادي السير' },
    { value: 'aqaba', label: 'العقبة' },
    { value: 'salt', label: 'السلط' },
    { value: 'madaba', label: 'مادبا' },
    { value: 'jerash', label: 'جرش' },
    { value: 'ajloun', label: 'عجلون' },
    { value: 'karak', label: 'الكرك' },
    { value: 'tafilah', label: 'الطفيلة' },
    { value: 'maan', label: 'معان' },
  ];
  const cairo = Cairo({
    subsets: ["arabic"],
    display: "swap",
    variable: "--font-cairo",
  });
    const businessTypes = [
    { value: 'grocery', label: 'بقالة' },
    { value: 'medium_supermarket', label: 'سوبر ماركت متوسط' },
    { value: 'large_supermarket', label: 'سوبر ماركت كبير' },
    { value: 'restaurant', label: 'مطعم' },
    { value: 'sweets_shop', label: 'محل حلويات' },
    { value: 'bookstore', label: 'مكتبة' },
    { value: 'coffee_shop', label: 'كوفيشوب' },
  ];
export default function Profile() {
      const formSchema = z.object({
        businessName: z.string().min(3, { message: 'يجب أن يكون الاسم التجاري 3 أحرف على الأقل' }),
        phone: z.string().min(10, { message: 'يجب أن يكون رقم الهاتف 10 أرقام على الأقل' }),
        city: z.string({ required_error: 'يرجى اختيار المدينة أو تحديد الموقع' }),
        businessType: z.string({ required_error: 'يرجى اختيار نوع العمل' }),
        verificationCode: z.string().optional(),
      });
      const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          businessName: '',
          phone: '',
          city: '',
          businessType:'',
          verificationCode: '',
        },
      });
      const [isVerifying, setIsVerifying] = useState(false);
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
        setTimeout(() => {
          setIsVerifying(false);
        }, 500);
      };
  return (
   <Form {...form} >
            <form className={`flex flex-col gap-8 ${cairo.variable}`} >
              <h2 className="text-lg font-medium">Edit your profile info</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="businessName"
                  
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel >Your Business Name</FormLabel>
                      <FormControl>
                        <Input className="mt-3" placeholder="Enter your business name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div>

                  <div className="space-y-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>phone</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input className="mt-3" {...field} placeholder="+962..." />
                    </FormControl>
                    <Button
                    className="mt-3"
                      type="button"
                      variant="outline"
                      onClick={sendVerificationCode}
                      disabled={isVerifying}
                    >
                      {isVerifying ? 'verifiying' : 'sendVerification'}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

              
                </div>

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <Select  onValueChange={field.onChange} value={field.value}>
                        <FormControl className="mt-3">
                          <SelectTrigger>
                            <SelectValue placeholder="اختر المدينة" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {cities.map(city => (
                            <SelectItem key={city.value} value={city.value}>
                              {city.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="businessType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl className="mt-3">
                          <SelectTrigger>
                            <SelectValue placeholder="اختر نوع عملك" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {businessTypes.map(business => (
                            <SelectItem key={business.value} value={business.value}>
                              {business.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />         
              </div>
            </form>
         
          </Form> 
         );
}