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
import toast from "react-hot-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useTranslations } from "next-intl";
import { MapPin } from "lucide-react";


const cairo = Cairo({
  subsets: ["arabic"],
  display: "swap",
  variable: "--font-cairo",
});

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
  const t = useTranslations("settingsProfile");
  const ta = useTranslations('auth')
    const localUserData: UserData = typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("data") || "{}")
    : {};
  const [state, SetState] = useState(false);
  const [loading, SetLoading] = useState(false);
  // Location state
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [detectedCity, setDetectedCity] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
 
const businessTypes = [
  { value: 'shop', label: ta('businessTypes.shop') },
  { value: 'supermarket', label: ta('businessTypes.supermarket') },
  { value: 'restaurant', label: ta('businessTypes.restaurant') },
  { value: 'roastery', label: ta('businessTypes.roastery') },
  { value: 'sweets shop', label: ta('businessTypes.coffee_shop') },
  { value: 'coffee shop', label: ta('businessTypes.sweets_shop') },
  { value: 'cafe', label: ta('businessTypes.bookstore') },
  { value: 'library', label: ta('businessTypes.cafe') },
];
const cities = [
  { value: 'amman', label: ta('cities.amman') },
  { value: 'zarqa', label: ta('cities.zarqa') },
  { value: 'irbid', label: ta('cities.irbid') },
  { value: 'russeifa', label: ta('cities.russeifa') },
  { value: 'aqaba', label: ta('cities.aqaba') },
  { value: 'salt', label: ta('cities.salt') },
  { value: 'Madaba', label: ta('cities.Madaba ')},
  { value: 'jerash', label:ta('cities.jerash') },
  { value: 'ajloun', label: ta('cities.ajloun') },
  { value: 'karak', label: ta('cities.Karak') },
  { value: 'tafilah', label: ta('cities.tafilah') },
  { value: 'maan', label: ta('cities.maan') }
];
  const formSchema = z.object({
    businessName: z.string().min(3, { message: t('schema.businessNameMin') }),
    phone: z.string().min(10, { message: t('schema.phoneMin') }),
    city: z.string({ required_error: t('schema.cityRequired') }),
    businessType: z.string({ required_error: t('schema.businessTypeRequired') }),
    verificationCode: z.string().optional(),
    email: z.string().optional(),
    referralCode: z.string().optional() 
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
      referralCode: localUserData.referralCode ?? "", 
    },
  });

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
      return t('location.outsideJordan');
    }

    return closestCity.name;
  };

  function detectLocation() {
    setIsDetectingLocation(true);
    setLocationError(null);
    setDetectedCity(null);

    if (!navigator.geolocation) {
      setLocationError(t('location.browserNotSupported'));
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

        if (cityName !== t('location.outsideJordan')) {
          const matchingCity = cities.find(city => city.label === cityName);
          if (matchingCity) {
            form.setValue('city', matchingCity.value);
          }
        }

        setIsDetectingLocation(false);
      },
      error => {
        setIsDetectingLocation(false);

        let errorMessage = t('location.unknownError');
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = t('location.permissionDenied');
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = t('location.positionUnavailable');
            break;
          case error.TIMEOUT:
            errorMessage = t('location.timeout');
            break;
          default:
            errorMessage = t('location.unknownError');
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
        message: t('schema.phoneInvalid'),
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
        locationDetails: location ? `Latitude : ${location.lat} ,Longitude :${location.lng}` : null,
        businessType: form.getValues('businessType'),
        referralCode: form.getValues('referralCode') || ""
      })
    });
    const res = await (await EditeData).json();
    if(!(await EditeData).ok){
      toast.error(t('faild'))
    }else{
      toast.success(t('success'))
    }
    localStorage.setItem("data", JSON.stringify(res));
    SetState(!state);
    SetLoading(false);
  }

  return (
    <Form {...form} >
      <form className={`flex flex-col gap-8 ${cairo.variable}`}>
        <h2 className="text-lg font-medium">{t('title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="businessName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('fields.businessName')}</FormLabel>
                <FormControl>
                  <Input className="mt-3" placeholder={t('fields.businessNamePlaceholder')} {...field} />
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
                <FormLabel>{t('fields.email')}</FormLabel>
                <FormControl>
                  <Input className="mt-3" type="email" placeholder={t('fields.emailPlaceholder')} {...field} />
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
                    <FormLabel>{t('fields.phone')}</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input className="mt-3" {...field} placeholder={t('fields.phonePlaceholder')} />
                      </FormControl>
                      <Button
                        className="mt-3"
                        type="button"
                        variant="outline"
                        onClick={sendVerificationCode}
                        disabled={isVerifying}
                      >
                        {isVerifying ? t('fields.verifying') : t('fields.sendVerification')}
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
                <FormLabel>{t('fields.city')}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={!!detectedCity && detectedCity !== t('location.outsideJordan')}>
                  <FormControl className="mt-3">
                    <SelectTrigger>
                      <SelectValue placeholder={t('fields.cityPlaceholder')} />
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
                <FormLabel>{t('fields.businessType')}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl className="mt-3">
                    <SelectTrigger>
                      <SelectValue placeholder={t('fields.businessTypePlaceholder')} />
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
                <FormLabel>{t('fields.referralCode')}</FormLabel>
                <FormControl>
                  <Input
                    className="mt-3"
                    type="text"
                    placeholder={t('fields.referralCodePlaceholder')}
                    {...field}
                    value={field.value ?? ""}
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
              <MapPin/>
              {isDetectingLocation ? t('location.locating') : t('location.locateMe')}
            </Button>
          </div>
          {locationError && (
            <div className="bg-red-100 text-red-700 p-4 rounded-md mt-2">{locationError}</div>
          )}
          {detectedCity && (
            <div className="bg-secondary/10 p-4 rounded-lg border border-secondary/20 mt-2">
              <div>
                <p className="font-semibold text-secondary">
                  {t('location.locatedCity')}
                </p>
                <p className="text-lg">{detectedCity}</p>
                {detectedCity === t('location.outsideJordan') && (
                  <p className="text-sm text-muted-foreground">
                    {t('location.outsideJordanAlert')}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </form>
    
      <div className="p-6 flex gap-2 ">
        <Button
          onClick={handleEdite}
          className={
            loading
              ? "bg-primary p-2 rounded-md text-white px-4 py-2  rounded-md shadow-sm text-sm font-medium cursor-not-allowed"
              : "p-2 rounded-md text-white px-4 py-2 rounded-md shadow-sm text-sm font-medium cursor-pointer"
          }
          disabled={loading}
        >
          {loading ? (
              <div className="col-span-5 flex items-center h-full justify-center gap-2">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
          </div>
          ):t('fields.saveChanges')}
        </Button>
      </div>
    </Form>
  );
};