"use client";
import { useState,useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Toast from "./toast";
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
  { value: 'supermarket', label: 'supermarket' },
  { value: 'resturant', label: 'resturant' },
  { value: 'pharmacy', label: 'pharmacy' },
  { value: 'bakery', label: 'bakery' },
  { value: 'clothes', label: 'clothes' },
  { value: 'coffee_shop', label: 'coffee shop' },
];
type UserData = {
  id?: number;
  commercialName?: string;
  phone?: string;
  city?: string;
  businessType?: string;
};


export default function Profile() {
  
  const [userData, SetUserData] = useState<UserData>({});
  const localUserData: UserData = typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("data") || "{}")
    : {};
    const [state,SetState] = useState(false)
    const [loading,SetLoading] = useState(false)
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
      businessName: localUserData.commercialName || "",
      phone: localUserData.phone || "",
      city: localUserData.city || "",
      businessType: localUserData.businessType || "",
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
        useEffect( () =>{
    const fetchData = async () =>{
      console.log(userData.id)
    const fetchData = await fetch(`https://tajer-backend.tajerplatform.workers.dev/api/public/users/${localUserData.id}`);
      const res = await fetchData.json();
      console.log(res);
      SetUserData(res);
    }
    fetchData();
  },[])
  const handleEdite = async() =>{
    SetLoading(true)
    const EditeData = fetch('https://tajer-backend.tajerplatform.workers.dev/api/public/users', {
  method: 'PUT',
  credentials:'include',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    commercialName: form.getValues('businessName'),
    email: null,
    city: form.getValues('city'),
    area:form.getValues('city') ,
    locationDetails: null,
    businessType: form.getValues('businessType'),
    referralCode: null
  })
})
const res = await (await EditeData).json();
  console.log(res);
   SetUserData(res);
localStorage.setItem("data", JSON.stringify(res));
  SetState(!state);
  SetLoading(false);
  }
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
            {state && <Toast message="Profile updated successfully!" />}
                  <div className="p-6 flex gap-2 ">
                <Button onClick={() => handleEdite()} className={loading ? "bg-primary p-2 rounded-md px-4 py-2  rounded-md shadow-sm text-sm font-medium cursor-not-allowed" : " p-2 rounded-md px-4 py-2  rounded-md shadow-sm text-sm font-medium cursor-pointer"} disabled={loading}>Save Changes</Button>
                <button className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium  hover:bg-gray-800 cursor-pointer">cancel</button>
            </div>       
          </Form> 
         );
};