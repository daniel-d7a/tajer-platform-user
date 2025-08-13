'use client';

import { Locale } from 'next-intl';
import { ChangeEvent, ReactNode, useTransition } from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

type Props = {
  children: ReactNode;
  defaultValue: string;
  label: string;
};

export function getUserLocaleClient(): string | null {
  const match = document.cookie.match(/(?:^|;\s*)user-locale=([^;]+)/);
  return match ? match[1] : null;
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
    startTransition(() => {
      const segments = pathname.split('/');
      if (segments.length > 1) {
        segments[1] = nextLocale;
      }
      const newPath = segments.join('/');
      router.replace(newPath);
    });
  }

  return (
    <label
      className={clsx(
        'relative text-gray-400 ',
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
