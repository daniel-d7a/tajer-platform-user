import { CheckCircle, ShoppingCart, Truck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function HowItWorks() {
  const t = useTranslations('home');

  const steps = [
    {
      id: 1,
      title: t('step1Title'),
      description: t('step1Desc'),
      icon: CheckCircle,
    },
    {
      id: 2,
      title: t('step2Title'),
      description: t('step2Desc'),
      icon: ShoppingCart,
    },
    {
      id: 3,
      title: t('step3Title'),
      description: t('step3Desc'),
      icon: Truck,
    },
  ];
  return (
    <section className="py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold">{t('howItWorks')}</h2>
        <p className="mt-2 text-muted-foreground">{t('howItWorksDesc')}</p>
      </div>
      <div className="mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {steps.map(step => (
          <div key={step.id} className="text-center mx-auto w-[70%]">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <step.icon className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">{step.title}</h3>
            <p className="mt-2 text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <Image
          src="/brandTwo.png"
          alt="How It Works"
          width={1920}
          height={1080}
          className="max-w-[85%] h-auto rounded-lg shadow-lg"
        />
      </div>
    </section>
  );
}
