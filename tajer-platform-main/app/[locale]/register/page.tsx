import RegisterForm from '@/components/auth/register-form';

 
import { useTranslations } from 'next-intl';

export default function RegisterPage() {
  const t = useTranslations('auth');

  return (
    <div className="container max-w-md mx-auto py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">{t('register')}</h1>
        <p className="mt-2 text-muted-foreground">{t('registerDesc')}</p>
      </div>
      <RegisterForm />
    </div>
  );
}
