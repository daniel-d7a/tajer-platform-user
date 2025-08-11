import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';


export default function SpecialOffers() {
  const t = useTranslations('home');
  const tc = useTranslations('common');
  const tof = useTranslations('offers');
const offers = [
  {
    id: 1,
    title: tof('groceryOffer'),
    discount: '20%',
    image: '/placeholder.svg?height=300&width=400',
    expiresAt: '2025-07-01',
  },
  {
    id: 2,
    title: tof('beverageOffer'),
    discount: '15%',
    image: '/placeholder.svg?height=300&width=400',
    expiresAt: '2025-07-15',
  }, 
  {
    id: 3,
    title: tof('IceCreamOffer'),
    discount: '25%',
    image: '/placeholder.svg?height=300&width=400',
    expiresAt: '2025-08-01',
  },
  {
    id: 4,
    title: tof('cleaningProductsOffer'),
    discount: '30%',
    image: '/placeholder.svg?height=300&width=400',
    expiresAt: '2025-07-10',
  },
];
  return (
    <section className="py-12 bg-muted/30 rounded-lg">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold">{t('specialOffers')}</h2>
        <p className="mt-2 text-muted-foreground">{t('specialOffersDesc')}</p>
      </div>
      <div className="w-[90%] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {offers.map(offer => (
          <Link key={offer.id} href={`/offers/${offer.id}`}>
            <Card className="overflow-hidden transition-all hover:shadow-md h-full flex flex-col">
              <div className="relative h-48">
                <Badge className="absolute top-2 right-2 bg-primary z-10">
                  {tc('discount')} {offer.discount}
                </Badge>
                <Image
                  src={offer.image || '/placeholder.svg'}
                  alt={offer.title}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="pt-4 flex-grow">
                <h3 className="font-semibold text-lg">{offer.title}</h3>
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground border-t pt-4">
                {tc('ExpiresAt')}{' '}
                {new Date(offer.expiresAt).toLocaleDateString('ar-JO')}
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
      <div className="text-center mt-8">
        <Link href="/offers">
          <Badge
            variant="outline"
            className="text-base py-2 px-4 cursor-pointer hover:bg-secondary hover:text-white"
          >
            {tc('viewAllOffers')}
          </Badge>
        </Link>
      </div>
    </section>
  );
}
