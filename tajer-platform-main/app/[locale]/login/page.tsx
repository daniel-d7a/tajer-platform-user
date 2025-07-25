import LoginForm from '@/components/auth/login-form';

import { useTranslations } from 'next-intl';
import { Suspense } from 'react';

function LoginFormSkeleton() {
  return <div>Loading...</div>;
}

export default function LoginPage() {
  const t = useTranslations('auth');
  return (
    <div className="container max-w-md mx-auto py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">{t('login')}</h1>
        <p className="mt-2 text-muted-foreground">{t('loginDesc')} </p>
      </div>
      <Suspense fallback={<LoginFormSkeleton />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
