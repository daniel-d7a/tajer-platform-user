"use client";
import { useState } from "react";
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
  email?: string;
  referralCode?: string;
};

export default function Profile() {
  const localUserData: UserData = typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("data") || "{}")
    : {};
  const [state, SetState] = useState(false);
  const [loading, SetLoading] = useState(false);
  const [message, setMessage] = useState('');
  // Location state
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [detectedCity, setDetectedCity] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const formSchema = z.object({
    businessName: z.string().min(3, { message: 'يجب أن يكون الاسم التجاري 3 أحرف على الأقل' }),
    phone: z.string().min(10, { message: 'يجب أن يكون رقم الهاتف 10 أرقام على الأقل' }),
    city: z.string({ required_error: 'يرجى اختيار المدينة أو تحديد الموقع' }),
    businessType: z.string({ required_error: 'يرجى اختيار نوع العمل' }),
    verificationCode: z.string().optional(),
    email: z.string().optional(),
    referralCode: z.string().optional() // لا تستخدم .nullable()
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: localUserData.commercialName || "",
      phone: localUserData.phone || "",
      city: localUserData.city || "",
      businessType: localUserData.businessType || "",
      verificationCode: '',
      email: localUserData.email || "",
      referralCode: localUserData.referralCode ?? "", // خليها string دايمًا
    },
  });

  // Location detection functions from RegisterForm
  function getCityFromCoordinates(lat: number, lng: number): string {
    const jordanianCities = [
      { name: 'عمان', lat: 31.9454, lng: 35.9284, value: 'amman' },
      { name: 'الزرقاء', lat: 32.0728, lng: 36.0879, value: 'zarqa' },
      { name: 'إربد', lat: 32.5556, lng: 35.85, value: 'irbid' },
      { name: 'العقبة', lat: 29.532, lng: 35.0063, value: 'aqaba' },
      { name: 'السلط', lat: 32.0389, lng: 35.7272, value: 'salt' },
      { name: 'مادبا', lat: 31.7197, lng: 35.7956, value: 'madaba' },
      { name: 'جرش', lat: 32.2811, lng: 35.8992, value: 'jerash' },
      { name: 'عجلون', lat: 32.3328, lng: 35.7517, value: 'ajloun' },
      { name: 'الكرك', lat: 31.1801, lng: 35.7048, value: 'karak' },
      { name: 'الطفيلة', lat: 30.8378, lng: 35.604, value: 'tafilah' },
      { name: 'معان', lat: 30.1962, lng: 35.734, value: 'maan' },
    ];

    let closestCity = jordanianCities[0];
    let minDistance = Number.MAX_VALUE;

    jordanianCities.forEach(city => {
      const distance = Math.sqrt(
        Math.pow(lat - city.lat, 2) + Math.pow(lng - city.lng, 2)
      );
      if (distance < minDistance) {
        minDistance = distance;
        closestCity = city;
      }
    });

    if (minDistance > 2) {
      return 'خارج الأردن';
    }

    return closestCity.name;
  };

  function detectLocation() {
    setIsDetectingLocation(true);
    setLocationError(null);
    setDetectedCity(null);

    if (!navigator.geolocation) {
      setLocationError('متصفحك لا يدعم تحديد الموقع');
      setIsDetectingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLocation({ lat, lng });

        const cityName = getCityFromCoordinates(lat, lng);
        setDetectedCity(cityName);

        if (cityName !== 'خارج الأردن') {
          const matchingCity = cities.find(city => city.label === cityName);
          if (matchingCity) {
            form.setValue('city', matchingCity.value);
          }
        }

        setIsDetectingLocation(false);
      },
      error => {
        setIsDetectingLocation(false);

        let errorMessage = 'حدث خطأ في تحديد الموقع';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              'تم رفض الإذن لتحديد الموقع. يرجى السماح بالوصول للموقع في إعدادات المتصفح';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'معلومات الموقع غير متاحة';
            break;
          case error.TIMEOUT:
            errorMessage = 'انتهت مهلة تحديد الموقع';
            break;
          default:
            errorMessage = 'حدث خطأ غير معروف في تحديد الموقع';
            break;
        }
        setLocationError(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };
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
  const handleEdite = async () => {
    SetLoading(true);
    const EditeData = fetch('https://tajer-backend.tajerplatform.workers.dev/api/public/users', {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        commercialName: form.getValues('businessName'),
        email: form.getValues('email'),
        city: form.getValues('city'),
        area: form.getValues('city'),
        locationDetails: location ? `Latitude : ${location.lat} ,Longitude :${location.lng}` : null, // be careful when you edite this line 
        businessType: form.getValues('businessType'),
        referralCode: form.getValues('referralCode') || ""
      })
    });
    const res = await (await EditeData).json();
    if(!(await EditeData).ok){
      setMessage('حدث خطا يرجي المحاوله مره اخري ');
    }else{
      setMessage('تم التعديل بنجاح');
    }
    localStorage.setItem("data", JSON.stringify(res));
    SetState(!state);
    SetLoading(false);
  }

  return (
    <Form {...form} >
      <form className={`flex flex-col gap-8 ${cairo.variable}`}>
        <h2 className="text-lg font-medium">Edit your profile info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="businessName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Business Name</FormLabel>
                <FormControl>
                  <Input className="mt-3" placeholder="Enter your business name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Email</FormLabel>
                <FormControl>
                  <Input className="mt-3" type="email" placeholder="Enter your email" {...field} />
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
                <Select onValueChange={field.onChange} value={field.value} disabled={!!detectedCity && detectedCity !== 'خارج الأردن'}>
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
          <FormField
            control={form.control}
            name="referralCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Referral Code</FormLabel>
                <FormControl>
                  <Input
                    className="mt-3"
                    type="text"
                    placeholder="Enter your referral code"
                    {...field}
                    value={field.value ?? ""} // دايما هتبقي string
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
         <div className="space-y-4">
          <div className="flex items-center ">
            <Button
              type="button"
              variant="outline"
              onClick={detectLocation}
              disabled={isDetectingLocation}
              className="flex items-center gap-2"
            >
              {isDetectingLocation ? 'Locating...' : 'Locate Me'}
            </Button>
          </div>
          {locationError && (
            <div className="bg-red-100 text-red-700 p-4 rounded-md mt-2">{locationError}</div>
          )}
          {detectedCity && (
            <div className="bg-secondary/10 p-4 rounded-lg border border-secondary/20 mt-2">
              <div>
                <p className="font-semibold text-secondary">
                  Located City
                </p>
                <p className="text-lg">{detectedCity}</p>
                {detectedCity === 'خارج الأردن' && (
                  <p className="text-sm text-muted-foreground">
                    يرجي العلم انه لن يعمل التطبيق بشكل مناسب لانك من خارج الأردن يرجى اختيار المدينة يدوياً من القائمة أدناه
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </form>
      <div className="mt-2">
        {state && <Toast message={message} />}
      </div>
      <div className="p-6 flex gap-2 ">
        <Button
          onClick={handleEdite}
          className={
            loading
              ? "bg-primary p-2 rounded-md px-4 py-2  rounded-md shadow-sm text-sm font-medium cursor-not-allowed"
              : " p-2 rounded-md px-4 py-2  rounded-md shadow-sm text-sm font-medium cursor-pointer"
          }
          disabled={loading}
        >
          Save Changes
        </Button>
        <button className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium  hover:bg-gray-800 cursor-pointer">
          cancel
        </button>
      </div>
    </Form>
  );
}