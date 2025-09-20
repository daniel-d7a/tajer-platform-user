"use client";
import { useState } from "react";
import { User, Shield } from "lucide-react";
import { Button } from '@/components/ui/button';

import Profile from "./profile";
import { Input } from "@/components/ui/input"; 
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslations } from "next-intl";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';



export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const t = useTranslations('dashboard')
  const formSchema = z.object({
    businessName: z.string().min(3, { message: 'يجب أن يكون الاسم التجاري 3 أحرف على الأقل' }),
    phone: z.string().min(10, { message: 'يجب أن يكون رقم الهاتف 10 أرقام على الأقل' }),
    city: z.string({ required_error: 'يرجى اختيار المدينة أو تحديد الموقع' }),
    password: z.string().min(8, { message: 'يجب أن تكون كلمة المرور 8 أحرف على الأقل' }),
    businessType: z.string({ required_error: 'يرجى اختيار نوع العمل' }),
    verificationCode: z.string().optional(),
    ConfirmPasswrod: z.string().optional(),
    ActiveBassword: z.string().optional(),
  });
  const ts = useTranslations('settings')
  const tabs = [
    { id: "profile", label: ts('label.profile'), icon: <User size={18}/> },
    { id: "security", label: ts('label.security'), icon: <Shield size={18}/> },
  ];
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: '',
      phone: '',
      city: '',
      password: '',
      businessType:'',
      verificationCode: '',
      ActiveBassword:'',
      ConfirmPasswrod: '',
    },
  });

  return (
    <div className="w-full flex flex-col gap-5">
         <div className="bg-card  rounded-2xl shadow-sm">
          <h1 className="text-2xl font-bold">
            {t('settingsTitle')}
          </h1>
          <p className="text-muted-foreground mt-2">
              {t('settingsSubTitle')}
          </p>
        </div>
      {/* Header Tabs */}
      <div className="w-full relative border-b border-gray-500 flex gap-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 transition-colors relative flex items-center  text-center  gap-2 ${
              activeTab === tab.id ? "text-primary font-semibold" : "text-gray-500"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 w-full h-[3px] text-center bg-primary rounded-full"></span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="w-full mt-6 font-cairo p-6 border rounded-xl shadow">
        {activeTab === "profile" && (
        <Profile/>
        )}
        {activeTab === "security" && (
          <div>
            <h2 className="text-xl font-bold mb-2">{ts('security.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Form {...form}>
                 <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel >{ts('security.acitvepassword')}</FormLabel>
                      <FormControl>
                        <Input className="mt-3" placeholder="Enter your  Password Now" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>

                  )}
                />
                       <FormField
                  control={form.control}
                  name="ActiveBassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel >{ts('security.password')}</FormLabel>
                      <FormControl>
                        <Input className="mt-3" placeholder="Enter Your New Password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>

                  )}
                />
                    <FormField
                  control={form.control}
                  name="ConfirmPasswrod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel >{ts('security.confirmPassword')}</FormLabel>
                      <FormControl>
                        <Input className="mt-3" placeholder="Enter your Password Again" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>

                  )}
                />
                </Form>
                <div></div>
                      <div className="p-6 flex gap-2 ">
                <Button className="bg-primary p-2 rounded-md px-4 py-2  text-white rounded-md shadow-sm text-sm font-medium ">{ts('security.saveChanges')}</Button>
            </div>       
            </div>

          </div>
        )}
      </div>
    </div>
  );
};