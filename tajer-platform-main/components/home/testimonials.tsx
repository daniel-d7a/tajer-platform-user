import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { useTranslations } from 'next-intl';

const testimonials = [
  {
    id: 1,
    name: 'أحمد محمد',
    business: 'سوبر ماركت الأمانة',
    image: '/placeholder.svg?height=100&width=100',
    rating: 5,
    content:
      'منصة تاجر وفرت علي الكثير من الوقت والجهد في طلب البضائع لمتجري. الأسعار تنافسية والتوصيل سريع.',
  },
  {
    id: 2,
    name: 'سارة عبدالله',
    business: 'مطعم الذواقة',
    image: '/placeholder.svg?height=100&width=100',
    rating: 4,
    content:
      'أصبح طلب المكونات والمواد الغذائية أسهل بكثير مع تاجر. أنصح كل صاحب مطعم بالتسجيل في المنصة.',
  },
  {
    id: 3,
    name: 'خالد العمري',
    business: 'بقالة الحي',
    image: '/placeholder.svg?height=100&width=100',
    rating: 5,
    content:
      'العروض الحصرية التي تقدمها المنصة ساعدتني على توفير تكاليف البضائع وزيادة هامش الربح.',
  },
];

export default function Testimonials() {
  const t = useTranslations('home');

  return (
    <section className="py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold">{t('testimonials')}</h2>
        <p className="mt-2 text-muted-foreground">{t('testimonialsDesc')}</p>
      </div>
      <div className="w-[95%] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map(testimonial => (
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
              <div className="flex items-center">
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
