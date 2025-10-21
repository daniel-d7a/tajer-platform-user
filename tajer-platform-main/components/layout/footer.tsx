import {Link} from '@/i18n/navigation';
import Image from 'next/image';
import { Facebook, Instagram, Linkedin } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');
  const tc = useTranslations('common');

  return (
    <div className="bg-muted z-999">
      <div className="container py-10 mx-auto">
        <div className="w-[90%] mx-auto grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <Link
              href="/"
              className="flex items-center space-x-2 space-x-reverse"
            >
              <Image
                src="/tajer-logo.svg"
                alt="تاجر"
                width={80}
                height={80}
                className="ml-2"
              />
              <span className="text-xl font-bold text-primary">تاجر</span>
            </Link>
            <p className="mt-4 md:text-sm text-muted-foreground">
              {t('footerLine')}
            </p>
            <div className="mt-4 flex space-x-4">
              <Link
                href="https://www.facebook.com/share/1CJ9RgtSax/?mibextid=wwXIfr"
                className="text-muted-foreground hover:text-primary"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">فيسبوك</span>
              </Link>
              <Link
                href="https://www.instagram.com/tajer_jo?igsh=cGVncDA5cDVvMndk"
                className="text-muted-foreground hover:text-primary"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">انستغرام</span>
              </Link>
              <Link
                href="https://www.linkedin.com/company/tajer-%D8%AA%D8%A7%D8%AC%D8%B1/"
                className="text-muted-foreground hover:text-primary"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">تويتر</span>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold">{t('quickLinks')}</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/categories"
                  className="md:text-sm text-muted-foreground hover:text-primary"
                >
                  {tc('categories')}
                </Link>
              </li>
              <li>
                <Link
                  href="/companies"
                  className="md:text-sm text-muted-foreground hover:text-primary"
                >
                  {tc('companies')}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="md:text-sm text-muted-foreground hover:text-primary"
                >
                  {tc('about')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">{t('support')}</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/faq"
                  className="md:text-sm text-muted-foreground hover:text-primary"
                >
                  {t('faq')}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="md:text-sm text-muted-foreground hover:text-primary"
                >
                  {t('terms')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">{t('contactUs')}</h3>
        <ul className="mt-4 space-y-2">
  <li className="md:text-sm text-muted-foreground hover:text-primary hover:underline underline-offset-2">
    <Link
      href="mailto:info@tajer-jo.com"
      className="hover:text-primary "
    >
      {t('email')} info@tajer-jo.com
    </Link>
  </li>

  <li className="md:text-sm text-muted-foreground hover:text-primary hover:underline underline-offset-2">
    <Link
      href="https://wa.me/962797560047"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-primary"
    >
      {t('phone')} 0797560047
    </Link>
  </li>

  <li className="md:text-sm text-muted-foreground">
    {t('address')}
  </li>
</ul>

          </div>
        </div>
        <div className="mt-10 border-t border-border pt-6 text-center">
          <p className="md:text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {t('copyright')} - Tajer.
          </p>
        </div>
      </div>
    </div>
  );
};