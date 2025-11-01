"use client";
import { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { MapPin, AlertCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";

export default function RegisterForm() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [detectedCity, setDetectedCity] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const t = useTranslations("auth");
  const [referredByRepId, setReferredByRepId] = useState<number | null>(null);
  const [language, setLanguage] = useState("en");
  const pathname = usePathname();

  const formSchema = z.object({
    businessName: z.string().min(3, {
      message: t("commercialNameError"),
    }),
    phone: z.string().min(8, {
      message: t("errorPhoneNumber"),
    }),
    verificationCode: z
      .string()
      .min(4, {
        message: t("errorCode"),
      })
      .optional(),
    city: z.string({
      required_error: t("cityError"),
    }),
    businessType: z.string({
      required_error: t("businessesError"),
    }),
    password: z.string().min(8, {
      message: t("passwordError"),
    }),
    referralCode: z.string().optional(),
    termsAccepted: z.boolean().refine((val) => val === true, {
      message: t("termsError"),
    }),
  });

  useEffect(() => {
    const segments = pathname.split("/").filter(Boolean);
    const lang = segments[0];
    setLanguage(lang);
  }, [pathname]);
  useEffect(() => {
    const referredParam = searchParams.get("referredByRepId");

    if (referredParam) {
      localStorage.setItem("referredByRepId", referredParam);
      setReferredByRepId(Number(referredParam));
    } else {
      const savedRef = localStorage.getItem("referredByRepId");
      if (savedRef) {
        setReferredByRepId(Number(savedRef));
      }
    }
  }, [searchParams]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      phone: "",
      city: "",
      businessType: "",
      password: "",
      referralCode: "",
      termsAccepted: false,
    },
  });

  const businessTypes = [
    { value: "shop", label: t("businessTypes.shop") },
    { value: "supermarket", label: t("businessTypes.supermarket") },
    { value: "restaurant", label: t("businessTypes.restaurant") },
    { value: "roastery", label: t("businessTypes.roastery") },
    { value: "sweets shop", label: t("businessTypes.coffee_shop") },
    { value: "coffee shop", label: t("businessTypes.sweets_shop") },
    { value: "cafe", label: t("businessTypes.bookstore") },
    { value: "library", label: t("businessTypes.cafe") },
  ];

  const cities = [
    { value: "amman", label: t("cities.amman") },
    { value: "zarqa", label: t("cities.zarqa") },
    { value: "irbid", label: t("cities.irbid") },
    { value: "russeifa", label: t("cities.russeifa") },
    { value: "aqaba", label: t("cities.aqaba") },
    { value: "salt", label: t("cities.salt") },
    { value: "Madaba", label: t("cities.Madaba ") },
    { value: "jerash", label: t("cities.jerash") },
    { value: "ajloun", label: t("cities.ajloun") },
    { value: "karak", label: t("cities.Karak") },
    { value: "tafilah", label: t("cities.tafilah") },
    { value: "maan", label: t("cities.maan") },
  ];

  function getCityFromCoordinates(lat: number, lng: number): string {
    const jordanianCities = [
      { name: "عمان", lat: 31.9454, lng: 35.9284, value: "amman" },
      { name: "الزرقاء", lat: 32.0728, lng: 36.0879, value: "zarqa" },
      { name: "إربد", lat: 32.5556, lng: 35.85, value: "irbid" },
      { name: "العقبة", lat: 29.532, lng: 35.0063, value: "aqaba" },
      { name: "السلط", lat: 32.0389, lng: 35.7272, value: "salt" },
      { name: "مادبا", lat: 31.7197, lng: 35.7956, value: "Madaba" },
      { name: "جرش", lat: 32.2811, lng: 35.8992, value: "jerash" },
      { name: "عجلون", lat: 32.3328, lng: 35.7517, value: "ajloun" },
      { name: "الكرك", lat: 31.1801, lng: 35.7048, value: "karak" },
      { name: "الطفيلة", lat: 30.8378, lng: 35.604, value: "tafilah" },
      { name: "معان", lat: 30.1962, lng: 35.734, value: "maan" },
    ];

    let closestCity = jordanianCities[0];
    let minDistance = Number.MAX_VALUE;

    jordanianCities.forEach((city) => {
      const distance = Math.sqrt(
        Math.pow(lat - city.lat, 2) + Math.pow(lng - city.lng, 2)
      );
      if (distance < minDistance) {
        minDistance = distance;
        closestCity = city;
      }
    });

    if (minDistance > 2) {
      return t("Outside");
    }
    return closestCity.name;
  }

  function detectLocation() {
    setIsDetectingLocation(true);
    setLocationError(null);
    setDetectedCity(null);

    if (!navigator.geolocation) {
      setLocationError("متصفحك لا يدعم تحديد الموقع");
      setIsDetectingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLocation({ lat, lng });

        const cityName = getCityFromCoordinates(lat, lng);
        setDetectedCity(cityName);

        if (cityName !== "خارج الأردن") {
          const matchingCity = cities.find((city) => city.label === cityName);
          if (matchingCity) {
            form.setValue("city", matchingCity.value);
          }
        }
        setIsDetectingLocation(false);
      },
      (error) => {
        setIsDetectingLocation(false);
        let errorMessage = "حدث خطأ في تحديد الموقع";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = t("locationPermese");
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = t("locationPermese");
            break;
          case error.TIMEOUT:
            errorMessage = t("locationTimeout");
            break;
          default:
            errorMessage = t("locationError");
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

  function sendVerificationCode() {
    const phone = form.getValues("phone");
    if (phone.length < 10) {
      form.setError("phone", {
        type: "manual",
        message: t("errorPhoneNumber"),
      });
      return;
    }
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
    }, 1000);
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setApiError(null);
    setSuccessMsg(null);
    setErrorMessage("");

    form.clearErrors("phone");
    form.clearErrors("referralCode");

    try {
      const response = await fetch(
        "https://tajer-backend.tajerplatform.workers.dev/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
          },
          body: JSON.stringify({
            commercialName: values.businessName,
            phone: values.phone.trim().startsWith("+")
              ? values.phone.trim()
              : `+${values.phone.trim()}`,
            email: null,
            passwordHash: values.password,
            city: values.city,
            area: values.city,
            locationDetails: `Latitude : ${location?.lat} ,Longitude :${location?.lng}`,
            businessType: values.businessType,
            role: "MERCHANT",
            referredByRepId: referredByRepId,
            referralCode: values.referralCode || null,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.log("Error response:", errorData);

        const errorMessage =
          errorData.error?.issues?.[0]?.message ||
          errorData.message ||
          t("errorsignUp");

        if (
          errorMessage.toLowerCase().includes("phone") ||
          errorMessage.toLowerCase().includes("duplicate") ||
          errorMessage.toLowerCase().includes("رقم") ||
          errorMessage.toLowerCase().includes("users.phone")
        ) {
          form.setError("phone", {
            type: "manual",
            message: t("errorPhoneNumberAgain"),
          });
        }
        if (
          errorMessage.toLowerCase().includes("referral_code") ||
          errorMessage.toLowerCase().includes("referral") ||
          errorMessage.toLowerCase().includes("كود") ||
          errorMessage.toLowerCase().includes("دعوة") ||
          errorMessage.toLowerCase().includes("unique constraint")
        ) {
          form.setError("referralCode", {
            type: "manual",
            message: t("errorRefferrlaCode"),
          });
        }

        const hasFieldError =
          form.formState.errors.phone || form.formState.errors.referralCode;
        if (!hasFieldError) {
          setApiError(t("errorsignUp"));
        }
      } else {
        setSuccessMsg(t("succesMessage"));
        router.push(redirectTo);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setApiError(t("errorsignUp"));
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
            disabled={isLoading}
            name="businessName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("businessName")}</FormLabel>
                <FormControl className="mt-2">
                  <Input
                    {...field}
                    placeholder={t("businessNamePlaceholder")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="spa">
            <FormField
              control={form.control}
              disabled={isLoading}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("phone")}</FormLabel>
                  <div className="flex gap-2">
                    <FormControl className="mt-2">
                      <Input {...field} placeholder="+962..." />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-2"
                      onClick={sendVerificationCode}
                      disabled={isVerifying}
                    >
                      {isVerifying ? t("verifiying") : t("sendVerification")}
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
                    <FormLabel>{t("verificationCode")}</FormLabel>
                    <FormControl className="mt-2">
                      <Input
                        placeholder={t("verificationCodePlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <div
            className="space-y-4"
            aria-disabled={isLoading}
            dir={language === "ar" ? "rtl" : "ltr"}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">{t("location")}</h3>
              <Button
                type="button"
                variant="outline"
                onClick={detectLocation}
                disabled={isDetectingLocation}
                className="flex items-center gap-2"
              >
                <MapPin
                  className={`h-4 w-4 ${
                    isDetectingLocation ? "animate-pulse" : ""
                  }`}
                />
                {isDetectingLocation ? t("locating") : t("locateMe")}
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
                      {t("located")}
                    </p>
                    <p className="text-lg">{detectedCity}</p>
                    {detectedCity === "خارج الأردن" && (
                      <p className="text-sm text-muted-foreground">
                        {t("notWork")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <FormField
              control={form.control}
              name="city"
              disabled={isLoading}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("city")}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl
                      className="mt-2"
                      dir={language === "ar" ? "rtl" : "ltr"}
                    >
                      <SelectTrigger disabled={isLoading}>
                        <SelectValue placeholder={t("cityPlaceholder")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent dir={language === "ar" ? "rtl" : "ltr"}>
                      {cities.map((city) => (
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
            disabled={isLoading}
            control={form.control}
            name="businessType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("businessType")}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl
                    className="mt-2"
                    dir={language === "ar" ? "rtl" : "ltr"}
                  >
                    <SelectTrigger disabled={isLoading}>
                      <SelectValue placeholder={t("chooseBusinessType")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent dir={language === "ar" ? "rtl" : "ltr"}>
                    {businessTypes.map((type) => (
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
            disabled={isLoading}
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("password")}</FormLabel>
                <FormControl className="mt-2">
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            disabled={isLoading}
            control={form.control}
            name="referralCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("referralCode")}</FormLabel>
                <FormControl className="mt-2">
                  <Input placeholder={t("referralCode")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            disabled={isLoading}
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
                    {t("agreeTo")}{" "}
                    <Link
                      href="/terms"
                      className="text-primary hover:underline"
                    >
                      {t("terms")}
                    </Link>
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

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

          {errorMessage && (
            <Alert className="border-destructive">
              <AlertDescription className="text-destructive">
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full bg-secondary hover:bg-secondary/90"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
              </div>
            ) : (
              t("registerNow")
            )}
          </Button>

          <div className="text-center text-sm">
            {t("haveAccount")}{" "}
            <Link href="/login" className="text-primary hover:underline">
              {t("login")}
            </Link>
          </div>
        </form>
      </Form>
    </Card>
  );
}
