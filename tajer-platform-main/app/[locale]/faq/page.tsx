"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from 'next/image'
import {useEffect, useState} from 'react'
import { usePathname } from "next/navigation";

interface FAQ {
  answer_ar:string;
  id:number;
  answer_en:string;
  question_ar:string;
  question_en:string;
}
export default function FAQ() {
  const [data,setData] = useState<FAQ[]>([])
    const [language,setLanguage] = useState('en')
    const pathname = usePathname();
        useEffect(() => {
        const segments = pathname.split("/").filter(Boolean);
        const lang = segments[0]; 
        setLanguage(lang)
      }, [pathname]);
    const fetchFaq  = async () =>{
      try{
        const response = await fetch('https://tajer-backend.tajerplatform.workers.dev/api/admin/faqs')
        const data = await response.json()
        if(data){
          setData(data);
        };
      }catch(err){
        console.log(err);
      };
    };
  useEffect(() =>{
    fetchFaq()
  },[]);
  return (
    <div className="max-w-full mx-auto p-6 flex flex-col ">
            <Image src="/tajer-logo.svg" alt="placeholder" className="mx-auto" width={300} height={300}></Image>
      
      <h2 className="text-4xl font-extrabold mb-8 text-center text-primary drop-shadow">
        {language === 'ar' ? 'الاسئلة الشائعة' : 'FAQ'}
      </h2>
      <Accordion.Root type="single" collapsible className="space-y-5">
        {data.map((faq, i) => (
          <Accordion.Item
            key={i}
            value={`item-${i}`}
            className="border border-muted w-full rounded-xl bg-background shadow-sm transition-all duration-300"
          >
            <Accordion.Trigger
              className={cn(
                "w-full flex justify-between items-center p-5 text-right font-semibold text-lg  transition-colors group",
                "focus:outline-none "
              )}
            >
              <span className="transition-colors  group-hover:text-primary">{language === 'ar' ? faq.question_ar : faq.question_en}</span>
              <ChevronDown
                className="transition-transform duration-300 group-data-[state=open]:rotate-180 text-white-500"
                aria-hidden
              />
            </Accordion.Trigger>
            <Accordion.Content
              className={cn(
                "px-5 py-4 text-white-600 overflow-hidden w-full",
                "data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out"
              )}
            >
              <span className="block leading-relaxed">{language === 'ar' ? faq.answer_ar : faq.answer_en}</span>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px) scaleY(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scaleY(1);
          }
        }
        @keyframes fade-out {
          from {
            opacity: 1;
            transform: translateY(0) scaleY(1);
          }
          to {
            opacity: 0;
            transform: translateY(-10px) scaleY(0.95);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.4s cubic-bezier(0.4,0,0.2,1);
        }
        .animate-fade-out {
          animation: fade-out 0.3s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
    </div>
  );
}
