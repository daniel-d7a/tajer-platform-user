'use client';

import { CheckCircle, ShoppingCart, Truck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

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
      <SectionTitle 
        title={t('howItWorks')} 
        description={t('howItWorksDesc')} 
      />
      
      <div className="mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {steps.map((step, index) => (
          <StepCard 
            key={step.id} 
            step={step} 
            index={index} 
          />
        ))}
      </div>
    </section>
  );
}

function SectionTitle({ title, description }: { title: string; description: string }) {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  return (
    <motion.div 
      ref={ref}
      className="text-center mb-10"
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <h2 className="text-3xl font-bold">{title}</h2>
      <p className="mt-2 text-muted-foreground">{description}</p>
    </motion.div>
  );
}

type Step = {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

function StepCard({ step, index }: { step: Step; index: number }) {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  return (
    <motion.div 
      ref={ref}
      className="text-center mx-auto w-[70%]"
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 60, scale: 0.9 }}
      transition={{ 
        ease: "easeOut"
      }}
      whileHover={{ 
        y: -10,
       
      }}
    >
      <motion.div 
        className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
        initial={{ scale: 0, rotate: -180 }}
        animate={inView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
        transition={{ 
          duration: 0.6, 
          type: "spring",
          stiffness: 100
        }}
        whileHover={{ 
          rotate: 360,
          scale: 1.1,
          transition: { duration: 0.5 }
        }}
      >
        <step.icon className="h-8 w-8 text-primary" />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: index * 0.2 + 0.5 }}
      >
        <h3 className="text-xl font-semibold">{step.title}</h3>
        <p className="mt-2 text-muted-foreground">{step.description}</p>
      </motion.div>
    </motion.div>
  );
}