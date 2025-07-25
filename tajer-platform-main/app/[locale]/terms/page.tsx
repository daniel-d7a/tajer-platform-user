import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function TermsPage() {
  const t = useTranslations('terms');
  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <ArrowRight className="h-4 w-4 ml-2" />
            {t('backToHome')}
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-center mb-2">{t('title')}</h1>
        <p className="text-center text-sm text-muted-foreground mt-2">
          آخر تحديث: 13 يونيو 2025 | Last updated: June 13, 2025
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              1.
              {t('sections.introduction')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="leading-relaxed">
              مرحباً بك في منصة <strong>تاجر</strong> – سوق الجملة المصمم خصيصاً
              لتلبية احتياجات التجار في الأردن. عند تسجيلك في المنصة أو استخدامك
              لأي من خدماتنا، فإنك توافق على الالتزام بالشروط والأحكام التالية.
            </p>
            <p className="leading-relaxed">
              إذا كنت لا توافق على أي جزء من هذه الشروط، نرجو منك عدم استخدام
              المنصة.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              2. {t('sections.definitions')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <strong>المنصة:</strong> تشير إلى موقع وتطبيق &quot;تاجر&quot;
                المملوك بالكامل لشركة تاجر.
              </div>
              <div>
                <strong>العميل/المستخدم:</strong> التاجر المسجل والذي يستخدم
                المنصة لطلب المنتجات.
              </div>
              <div>
                <strong>المندوبة:</strong> أي شخص مفوض من قبل تاجر للترويج
                للمنصة وجلب العملاء.
              </div>
              <div>
                <strong>الشركة:</strong> تشير إلى شركة تاجر، المالكة والمشغلة
                للمنصة.
              </div>
              <div>
                <strong>سياسة الخصوصية:</strong> الوثيقة المصاحبة لهذه الشروط
                والتي توضح كيفية استخدام وحماية بيانات المستخدم.
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              3. {t('sections.registration')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 list-disc list-inside">
              <li>
                يجب أن تكون المعلومات التي تقدمها أثناء التسجيل صحيحة، كاملة
                ومحدثة.
              </li>
              <li>
                تحتفظ الشركة بالحق في رفض التسجيل أو إلغاء أو تعليق الحساب إذا
                تبين وجود بيانات مزيفة أو استخدام غير قانوني.
              </li>
              <li>
                يجب أن يكون المستخدم تاجراً فعلياً وأن يستخدم المنصة فقط لأغراض
                تجارية وليس للاستخدام الشخصي أو الفردي.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              4. {t('sections.intellectualProperty')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 list-disc list-inside">
              <li>
                جميع حقوق الملكية الفكرية في المنصة، بما في ذلك التصميم، الشعار،
                المحتوى، البرمجيات، محفوظة لصالح شركة تاجر.
              </li>
              <li>
                يُمنع إعادة إنتاج أو نسخ أو توزيع أو استخدام أي جزء من المنصة
                دون إذن كتابي مسبق من الشركة.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              5. {t('sections.ordersDelivery')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 list-disc list-inside">
              <li>
                الشركة تعمل كوسيط بين التجار والمصانع، وتقوم بتحويل الطلبات إلى
                شركات التوصيل مباشرة.
              </li>
              <li>
                الشركة غير مسؤولة عن أي تأخير في التوصيل أو مشاكل في الشحن، ولكن
                ستبذل قصارى جهدها في التعاون لحل المشكلات.
              </li>
              <li>
                في حال تم إرجاع أي طلب بسبب خطأ من العميل، يتم خصم رسوم التوصيل
                أو أي رسوم معالجة حسب السياسة السارية.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              6. {t('sections.returnsRefunds')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 list-disc list-inside">
              <li>
                يتم التعامل مع كل حالة إرجاع على حدة حسب نوع المنتج والمورد
                وسياسة التوصيل.
              </li>
              <li>
                يحق للشركة رفض طلب الإرجاع في حال تم استخدام أو فتح المنتج أو
                إذا لم يكن هناك سبب مقبول.
              </li>
              <li>
                في حال الموافقة، يتم إعادة المبلغ إلى رصيد العميل في المنصة، أو
                حسب الاتفاق.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              7. {t('sections.privacy')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 list-disc list-inside">
              <li>
                تحتفظ الشركة ببيانات المستخدمين بشكل آمن وسري، ولا يتم بيعها أو
                مشاركتها مع أي طرف ثالث دون موافقة مسبقة، باستثناء ما تقتضيه
                الحاجة لتقديم الخدمة (مثل التوصيل).
              </li>
              <li>
                يمكن مراجعة سياسة الخصوصية الكاملة عبر الرابط الظاهر أسفل
                الموقع.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              8. {t('sections.referral')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 list-disc list-inside">
              <li>
                عند التسجيل باستخدام رابط إحالة، يتم تسجيل العميل باسم المندوبة
                بشكل تلقائي.
              </li>
              <li>
                لا تتحمل الشركة مسؤولية أي التزام تعاقدي بين العميل والمندوبة
                خارج المنصة.
              </li>
              <li>
                يتم احتساب العمولات فقط عند تنفيذ أول طلب مؤكد، وفقاً لسياسة
                الحوافز المعتمدة.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              9. {t('sections.liability')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 list-disc list-inside">
              <li>
                الشركة غير مسؤولة عن أي خسائر مباشرة أو غير مباشرة أو أضرار
                ناتجة عن استخدام المنصة أو اعتماد المستخدمين على المعلومات
                المعروضة.
              </li>
              <li>
                المستخدم يتحمل المسؤولية الكاملة عن دقة طلباته وعن صحة عنوان
                التوصيل.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              10. {t('sections.modifications')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 list-disc list-inside">
              <li>
                تحتفظ الشركة بحق تعديل هذه الشروط في أي وقت دون إشعار مسبق.
              </li>
              <li>
                سيتم إشعار المستخدمين بالتعديلات عند تسجيل الدخول أو عبر البريد
                الإلكتروني المسجل.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              11. {t('sections.governingLaw')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 list-disc list-inside">
              <li>
                تخضع هذه الاتفاقية وتُفسر وفقاً لقوانين المملكة الأردنية
                الهاشمية.
              </li>
              <li>يُحال أي نزاع إلى المحاكم الأردنية المختصة في عمان.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              12. {t('sections.agreement')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="leading-relaxed">
              عند تسجيلك في المنصة، أو استخدامك لأي من خدماتها، فإنك تقر بأنك
              قرأت هذه الشروط وفهمتها ووافقت عليها بالكامل دون تحفظ.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 text-center">
        <Link href="/">
          <Button className="bg-primary hover:bg-primary/90">
            {t('backToHome')}
          </Button>
        </Link>
      </div>
    </div>
  );
}
