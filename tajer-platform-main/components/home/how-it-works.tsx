'use client';

import { CheckCircle, ShoppingCart, Truck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
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
      <motion.div 
        className="text-center mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold">{t('howItWorks')}</h2>
        <p className="mt-2 text-muted-foreground">{t('howItWorksDesc')}</p>
      </motion.div>

      <motion.div 
        className="mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.2
            }
          }
        }}
        initial="hidden"
        animate="visible"
      >
        {steps.map(step => (
          <motion.div 
            key={step.id} 
            className="text-center mx-auto w-[70%]"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 }
            }}
            whileHover={{ y: -5 }}
          >
            <motion.div 
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
              whileHover={{ rotate: 360 }}
              transition={{ duration: .5 }}
            >
              <step.icon className="h-8 w-8 text-primary" />
            </motion.div>
            <h3 className="text-xl font-semibold">{step.title}</h3>
            <p className="mt-2 text-muted-foreground">{step.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}