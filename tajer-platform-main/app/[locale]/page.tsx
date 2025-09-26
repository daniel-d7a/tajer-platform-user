'use client';
import { motion } from 'framer-motion';
import Hero from "@/components/home/hero";
import FeaturedCategories from "@/components/home/featured-categories";
import SpecialOffers from "@/components/home/special-offers";
import HowItWorks from "@/components/home/how-it-works";
import CallToAction from "@/components/home/call-to-action";
import SpecialProducts from "@/components/home/special-products";
import Factories from "@/components/home/factories";
import Page from '@/app/[locale]/faq/page'
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
  hidden: { 
    opacity: 0, 
    y: 20 
  },
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
      className=" mx-auto"
    >
      <motion.div variants={itemVariants} className="flex items-center pt-4 pb-4 ">
        <Hero />
      </motion.div>
         <motion.div variants={itemVariants}>
        <SpecialOffers />
      </motion.div>
      <motion.div variants={itemVariants}>
        <Factories />
      </motion.div>
 <motion.div variants={itemVariants}>
        <SpecialProducts />
      </motion.div>
      <motion.div variants={itemVariants}>
        <FeaturedCategories />
      </motion.div>
        <motion.div variants={itemVariants}>
        <Page />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <HowItWorks />
      </motion.div>
   
      <motion.div variants={itemVariants}>
        <CallToAction />
      </motion.div>
    </motion.div>
  );
};