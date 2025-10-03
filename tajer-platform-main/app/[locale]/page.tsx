'use client';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

// Lazy load components
const Hero = dynamic(() => import('@/components/home/hero'));
const FeaturedCategories = dynamic(() => import('@/components/home/featured-categories'));
const SpecialOffers = dynamic(() => import('@/components/home/special-offers'));
const HowItWorks = dynamic(() => import('@/components/home/how-it-works'));
const CallToAction = dynamic(() => import('@/components/home/call-to-action'));
const SpecialProducts = dynamic(() => import('@/components/home/special-products'));
const Factories = dynamic(() => import('@/components/home/factories'));
const Page = dynamic(() => import('@/app/[locale]/faq/page'));

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const 
    }
  }
};

export default function Home() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="mx-auto"
    >
      <motion.div variants={itemVariants} >
        <Hero />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Factories />
      </motion.div>

      <motion.div variants={itemVariants}>
        <SpecialOffers />
      </motion.div>

      <motion.div variants={itemVariants}>
        <SpecialProducts />
      </motion.div>

      <motion.div variants={itemVariants}>
        <FeaturedCategories />
      </motion.div>

      <motion.div variants={itemVariants}>
        <HowItWorks />
      </motion.div>

      <motion.div variants={itemVariants}>
        <CallToAction />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Page />
      </motion.div>
    </motion.div>
  );
};
