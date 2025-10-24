"use client";

import { useLocale, useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";

type Locale = "ar" | "en";
import Image from "next/image";
import { useState, useRef, useEffect, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

export function setUserLocaleClient(locale: string) {
  document.cookie = `user-locale=${locale}; path=/; max-age=31536000; SameSite=Lax`;
}

interface LocaleOptionProps {
  locale: Locale;
  currentLocale: Locale;
  t: ReturnType<typeof useTranslations<"LocaleSwitcher">>;
  onSelect: () => void;
}

function LocaleOption({
  locale,
  currentLocale,
  t,
  onSelect,
}: LocaleOptionProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLocaleChange = () => {
    setUserLocaleClient(locale);

    startTransition(() => {
      const segments = pathname.split("/");
      if (
        segments.length > 1 &&
        routing.locales.includes(segments[1] as Locale)
      ) {
        segments[1] = locale;
      } else {
        segments.splice(1, 0, locale);
      }
      const newPath = segments.join("/");
      router.push(newPath);
      onSelect();
    });
  };

  const getFlagSrc = (locale: Locale) => {
    return locale === "ar" ? "/JD.jpeg" : "/US.jpeg";
  };

  const getLocaleName = (locale: Locale) => {
    return t("locale", { locale });
  };

  return (
    <button
      className={`flex items-center w-full gap-2 px-4 py-3 text-sm transition-colors duration-200 ${
        locale === currentLocale
          ? "border-r-2 border-primary font-semibold bg-primary/10"
          : "hover:bg-muted/30"
      } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
      onClick={handleLocaleChange}
      disabled={isPending}
    >
      <Image
        src={getFlagSrc(locale)}
        alt={locale}
        width={24}
        height={18}
        className="rounded-sm"
      />

      <span className="flex-1 text-right font-medium">
        {getLocaleName(locale)}
      </span>

      <span className="flex items-center justify-center min-w-[18px] min-h-[18px]">
        {isPending && (
          <div className="w-4 h-4 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
        )}
      </span>
    </button>
  );
}

export default function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale() as Locale;
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [locale]);

  const getCurrentFlag = () => {
    return locale === "ar" ? "/JD.jpeg" : "/US.jpeg";
  };

  const getCurrentLocaleName = () => {
    return t("locale", { locale });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-lg shadow-sm hover:bg-muted transition-colors duration-200 min-w-[120px] justify-center"
        aria-label={t("label")}
        aria-expanded={isOpen}
      >
        <Image
          src={getCurrentFlag()}
          alt={locale}
          width={20}
          height={15}
          className="rounded-sm"
        />

        <span className="font-medium">{getCurrentLocaleName()}</span>

        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-background border border-border rounded-lg shadow-lg z-50 py-2">
          <div className="flex flex-col">
            {routing.locales.map((cur) => (
              <LocaleOption
                key={cur}
                locale={cur}
                currentLocale={locale}
                t={t}
                onSelect={() => setIsOpen(false)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
