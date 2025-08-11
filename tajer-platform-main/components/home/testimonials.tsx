'use client';

import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { getLangDir } from 'rtl-detect';
import { useParams } from 'next/navigation';

export default function Testimonials() {
  const t = useTranslations('home');
  const tct = useTranslations('customerReview');
  const { locale } = useParams();
  const direction = getLangDir(locale as string);

  const testimonials = [
    {
      id: 1,
      name: tct('customer1.Name'),
      business: tct('customer1.groceryName'),
      image: '/placeholder.svg?height=100&width=100',
      rating: 5,
      content: tct('customer1.Review'),
    },
    {
      id: 2,
      name: tct('customer2.Name'),
      business: tct('customer2.groceryName'),
      image: '/placeholder.svg?height=100&width=100',
      rating: 4,
      content: tct('customer2.Review'),
    },
    {
      id: 3,
      name: tct('customer3.Name'),
      business: tct('customer3.groceryName'),
      image: '/placeholder.svg?height=100&width=100',
      rating: 5,
      content: tct('customer3.Review'),
    },
  ];

  return (
    <section className="py-12" dir={direction}>
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold">{t('testimonials')}</h2>
        <p className="mt-2 text-muted-foreground">{t('testimonialsDesc')}</p>
      </div>
      <div className="w-[95%] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} className="h-full flex flex-col">
            <CardContent className="pt-6 flex-grow">
              <div className="flex mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < testimonial.rating
                        ? 'text-primary fill-primary'
                        : 'text-muted'
                    }`}
                  />
                ))}
              </div>
              <p className="text-muted-foreground">{testimonial.content}</p>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 rounded-full overflow-hidden">
                  <Image
                    src={testimonial.image || '/placeholder.svg'}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="mr-3">
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.business}
                  </p>
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
