'use client';

import { Locale } from 'next-intl';
import { ChangeEvent, ReactNode, useTransition } from 'react';
import clsx from 'clsx';
import { useRouter, usePathname } from 'next/navigation';

type Props = {
  children: ReactNode;
  defaultValue: string;
  label: string;
};

export function setUserLocaleClient(locale: string) {
  document.cookie = `user-locale=${locale}; path=/; max-age=31536000; SameSite=Lax`;
}

export default function LocaleSwitcherSelect({
  children,
  defaultValue,
  label,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();

  function onSelectChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value as Locale;

    setUserLocaleClient(nextLocale);

    startTransition(() => {
      const segments = pathname.split('/');
      if (segments.length > 1) {
        segments[1] = nextLocale;
      }
      const newPath = segments.join('/');
      router.push(newPath);
    });
  }

  return (
    <label
      className={clsx(
        'relative text-gray-400',
        isPending && 'transition-opacity [&:disabled]:opacity-30'
      )}
    >
      <p className="sr-only">{label}</p>
      <select
        className="inline-flex appearance-none bg-transparent py-3 pl-2 pr-6 cursor-pointer"
        defaultValue={defaultValue}
        disabled={isPending}
        onChange={onSelectChange}
      >
        {children}
      </select>
      <span className="pointer-events-none absolute right-2 top-[8px]">⌄</span>
    </label>
  );
}
