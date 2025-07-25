import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export default function CallToAction() {
  const t = useTranslations('home');
  return (
    <section className="py-16 bg-secondary/10">
      <div className="text-center">
        <h2 className="text-3xl font-bold">{t('joinTajer')}</h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          {t('joinTajerDesc')}
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/register">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              {t('joinAsTajer')}
            </Button>
          </Link>
          <Link href="/about">
            <Button size="lg" variant="outline">
              {t('getToKnowUs')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
