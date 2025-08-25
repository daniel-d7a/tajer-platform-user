"use client";
import { useState } from "react";
import { User, Shield } from "lucide-react";

import Profile from "./profile";
import { Input } from "@/components/ui/input"; 
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

  const tabs = [
    { id: "profile", label: "Profile", icon: <User size={18}/> },
    { id: "security", label: "Security", icon: <Shield size={18}/> },
  ];

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
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
    <div className="w-full">
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
        <Profile></Profile>
        )}
        {activeTab === "security" && (
          <div>
            <h2 className="text-xl font-bold mb-2"> Security Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Form {...form}>
                 <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel >Your Active Password</FormLabel>
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
                      <FormLabel >Your Password</FormLabel>
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
                      <FormLabel >Confirm Password</FormLabel>
                      <FormControl>
                        <Input className="mt-3" placeholder="Enter your Password Again" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>

                  )}
                />
                
                            </Form>
                            
            </div>

          </div>
        )}
      </div>
    </div>
  );
};