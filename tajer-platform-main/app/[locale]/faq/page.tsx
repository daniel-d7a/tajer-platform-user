"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from 'next/image'

export default function FAQ() {
  const faqs = [
    {
      question: "ما هي منصة تاجر؟",
      answer:
        "منصة تاجر هي منصة إلكترونية تساعد التجار وأصحاب المشاريع على عرض منتجاتهم وخدماتهم وإدارتها بسهولة.",
    },
    {
      question: "كيف أبدأ في استخدام المنصة؟",
      answer:
        "قم بإنشاء حساب جديد، أضف منتجاتك أو خدماتك، وابدأ البيع مباشرة من لوحة التحكم.",
    },
    {
      question: "هل التسجيل في المنصة مجاني؟",
      answer:
        "نعم، التسجيل مجاني، مع وجود خطط مدفوعة توفر مزايا إضافية.",
    },
    {
      question: "كيف أتواصل مع فريق الدعم؟",
      answer:
        "يمكنك التواصل عبر البريد الإلكتروني أو صفحة اتصل بنا، وسيتم الرد خلال 24 ساعة.",
    },
  ];

  return (
    <div className="max-w-full mx-auto p-6 flex flex-col ">
            <Image src="/tajer-logo.svg" alt="placeholder" className="mx-auto" width={300} height={300}></Image>
      
      <h2 className="text-4xl font-extrabold mb-8 text-center text-primary drop-shadow">
        الأسئلة الشائعة
      </h2>
      <Accordion.Root type="single" collapsible className="space-y-5">
        {faqs.map((faq, i) => (
          <Accordion.Item
            key={i}
            value={`item-${i}`}
            className="border border-gray-200 w-full rounded-xl bg-background shadow-sm transition-all duration-300"
          >
            <Accordion.Trigger
              className={cn(
                "w-full flex justify-between items-center p-5 text-right font-semibold text-lg  transition-colors group",
                "focus:outline-none "
              )}
            >
              <span className="transition-colors  group-hover:text-primary">{faq.question}</span>
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
              <span className="block leading-relaxed">{faq.answer}</span>
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
