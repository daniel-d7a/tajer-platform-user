'use client';

import { useState } from 'react';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { MapPin, AlertCircle } from 'lucide-react';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTranslations } from 'next-intl';

const businessTypes = [
  { value: 'grocery', label: 'بقالة' },
  { value: 'medium_supermarket', label: 'سوبر ماركت متوسط' },
  { value: 'large_supermarket', label: 'سوبر ماركت كبير' },
  { value: 'restaurant', label: 'مطعم' },
  { value: 'sweets_shop', label: 'محل حلويات' },
  { value: 'bookstore', label: 'مكتبة' },
  { value: 'coffee_shop', label: 'كوفيشوب' },
];

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

const formSchema = z.object({
  businessName: z.string().min(3, {
    message: 'يجب أن يكون الاسم التجاري 3 أحرف على الأقل',
  }),
  phone: z.string().min(10, {
    message: 'يجب أن يكون رقم الهاتف 10 أرقام على الأقل',
  }),
  verificationCode: z
    .string()
    .min(4, {
      message: 'يجب أن يكون رمز التحقق 4 أرقام',
    })
    .optional(),
  city: z.string({
    required_error: 'يرجى اختيار المدينة أو تحديد الموقع',
  }),
  businessType: z.string({
    required_error: 'يرجى اختيار نوع العمل',
  }),
  password: z.string().min(8, {
    message: 'يجب أن تكون كلمة المرور 8 أحرف على الأقل',
  }),
  referralCode: z.string().optional(),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: 'يجب الموافقة على الشروط والأحكام',
  }),
});

export default function RegisterForm() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [detectedCity, setDetectedCity] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const t = useTranslations('auth');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: '',
      phone: '',
      city: '',
      businessType: '',
      password: '',
      referralCode: '',
      termsAccepted: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const submitData = {
      ...values,
      location: location,
      detectedCity: detectedCity,
    };
    console.log(submitData);
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = '/dashboard';
    }, 2000);
  }

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
    }, 2000);
  }

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
  }

  function detectLocation() {
    console.log('تم الضغط على زر تحديد الموقع'); 
    setIsDetectingLocation(true);
    setLocationError(null);
    setDetectedCity(null);

    if (!navigator.geolocation) {
      setLocationError('متصفحك لا يدعم تحديد الموقع');
      setIsDetectingLocation(false);
      return;
    }

    console.log('بدء تحديد الموقع...');

    navigator.geolocation.getCurrentPosition(
      position => {
        console.log('تم الحصول على الموقع:', position);
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLocation({ lat, lng });

        const cityName = getCityFromCoordinates(lat, lng);
        console.log('المدينة المكتشفة:', cityName);

        setDetectedCity(cityName);

        if (cityName !== 'خارج الأردن') {
          const matchingCity = cities.find(city => city.label === cityName);
          if (matchingCity) {
            form.setValue('city', matchingCity.value);
            console.log('تم تعيين المدينة:', matchingCity.value);
          }
        }

        setIsDetectingLocation(false);
      },
      error => {
        console.error('خطأ في تحديد الموقع:', error);
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
  }

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="businessName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('businessName')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('businessNamePlaceholder')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('phone')}</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input placeholder="07xxxxxxxx" {...field} />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={sendVerificationCode}
                      disabled={isVerifying}
                    >
                      {isVerifying ? t('verifiying') : t('sendVerification')}
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
                    <FormLabel>{t('verificationCode')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('verificationCodePlaceholder')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">{t('location')}</h3>
              <Button
                type="button"
                variant="outline"
                onClick={detectLocation}
                disabled={isDetectingLocation}
                className="flex items-center gap-2"
              >
                <MapPin
                  className={`h-4 w-4 ${
                    isDetectingLocation ? 'animate-pulse' : ''
                  }`}
                />
                {isDetectingLocation ? t('locating') : t('locateMe')}
              </Button>
            </div>

            {locationError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{locationError}</AlertDescription>
              </Alert>
            )}

            {detectedCity && (
              <div className="bg-secondary/10 p-4 rounded-lg border border-secondary/20">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-secondary" />
                  <div>
                    <p className="font-semibold text-secondary">
                      {t('located')}
                    </p>
                    <p className="text-lg">{detectedCity}</p>
                    {detectedCity === 'خارج الأردن' && (
                      <p className="text-sm text-muted-foreground">
                        يرجى اختيار المدينة يدوياً من القائمة أدناه
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('city')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!!detectedCity && detectedCity !== 'خارج الأردن'}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('cityPlaceholder')} />
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
          </div>

          <FormField
            control={form.control}
            name="businessType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('businessType')}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('chooseBusinessType')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {businessTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
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

          <FormField
            control={form.control}
            name="referralCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('referralCode')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('referralCode')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="termsAccepted"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-x-reverse space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="mx-2"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    {t('agreeTo')}{' '}
                    <Link
                      href="/terms"
                      className="text-primary hover:underline"
                    >
                      {t('terms')}
                    </Link>
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-secondary hover:bg-secondary/90"
            disabled={isLoading}
          >
            {isLoading ? 'جاري التسجيل...' : 'إنشاء الحساب'}
          </Button>

          <div className="text-center text-sm">
            {t('haveAccount')}{' '}
            <Link href="/login" className="text-primary hover:underline">
              {t('login')}
            </Link>
          </div>
        </form>
      </Form>
    </Card>
  );
}
