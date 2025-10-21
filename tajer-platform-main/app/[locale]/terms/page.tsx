import {Link} from '@/i18n/navigation';
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
          <Button variant="ghost" className="mb-4 duration-300 bg-primary hover:bg-primary/90">
            <ArrowRight className="h-4 w-4 ml-2" />
            {t('backToHome')}
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-center mb-2">{t('title')}</h1>
        <p className="text-center text-sm text-muted-foreground mt-2">
          {t('lastUpdate')}
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
                {t("introductionContent.introduction")}                
            </p>
            <p className="leading-relaxed">
                  {t('introductionContent.notagree')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              2.{t('sections.definitions')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <strong>{t('StrongWord.platform')}:</strong> 
                 {t('Definitions.DefinitionTagr')}
              </div>
              <div>
                <strong>{t('StrongWord.client')}:</strong>    
                   {t('Definitions.DefinitionClient')}
              </div>
             <div>
                <strong>{t('StrongWord.Company')}:</strong>
                {t('Definitions.DefinitionsCompany')}
              </div>
                <div>
                <strong>{t('StrongWord.Suppliers')}:</strong>
                {t('Definitions.definitionSuppliers')}
              </div>
               <div>
                <strong>{t('StrongWord.Balance')}:</strong> 
                  {t('Definitions.DefinitionBalance')}              
                </div>
              
              <div>
                <strong>{t('StrongWord.privacy')}:</strong> 
                  {t('Definitions.DefinitionsPrivacy')}              
                </div>
            </div>
          </CardContent>
        </Card>
   <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              3. {t('sections.Eligibility')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 list-disc list-inside">
              <li>
                {t('EligibilityDetails.EligibilityDetails1')}
              </li>
              <li>
                {t('EligibilityDetails.EligibilityDetails2')}
              </li>
              <li>
                {t('EligibilityDetails.EligibilityDetails3')}
              </li>
                 <li>
                {t('EligibilityDetails.EligibilityDetails4')}
              </li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              4. {t('sections.registration')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 list-disc list-inside">
              <li>
                {t('Registration.Registration1')}
              </li>
              <li>
                {t('Registration.Registration2')}
            
              </li>
              <li>
                {t('Registration.Registration3')}

              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              5. {t('sections.intellectualProperty')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 list-disc list-inside">
              <li>
                {t('Intellectual.Intellectual1')}
              </li>
              <li>
                {t('Intellectual.Intellectual2')} 
              </li>
                 <li>
                {t('Intellectual.Intellectual3')} 
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              6. {t('sections.ordersDelivery')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 list-disc list-inside">
              <li>
                    {t('OrdersPolicy.OrdersPolicy1')}
              </li>
              <li>
                    {t('OrdersPolicy.OrdersPolicy2')}
                
              </li>
              <li>
                    {t('OrdersPolicy.OrdersPolicy3')}
              </li>
                <li>
                    {t('OrdersPolicy.OrdersPolicy4')}
              </li>
                <li>
                    {t('OrdersPolicy.OrdersPolicy5')}
              </li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              7. {t('sections.returnsRefunds')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 list-disc list-inside">
              <li>
                {t('ReturnsPolicy.ReturnsPolicy1')}
              </li>
              <li>
                {t('ReturnsPolicy.ReturnsPolicy2')}
    
              </li>
              <li>
                {t('ReturnsPolicy.ReturnsPolicy3')}
              </li>
                <li>
                {t('ReturnsPolicy.ReturnsPolicy4')}
              </li>
                <li>
                {t('ReturnsPolicy.ReturnsPolicy5')}
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              8. {t('sections.BalanceSection')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 list-disc list-inside">
              <li>
                {t('BalanceDefinitions.BalanceDefinitions1')}
              </li>
              <li>
                {t('BalanceDefinitions.BalanceDefinitions2')}
              </li>
                   <li>
                {t('BalanceDefinitions.BalanceDefinitions3')}
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              9. {t('sections.referral')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 list-disc list-inside">
              <li>
                {t('ReferralLinkPolicy.ReferralLinkPolicy1')}
              </li>
              <li>
                    {t('ReferralLinkPolicy.ReferralLinkPolicy2')}
              </li>
              <li>
                  {t('ReferralLinkPolicy.ReferralLinkPolicy3')}
              </li>
            </ul>
          </CardContent>
        </Card>
   <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              10. {t('sections.Compensation')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
              <h3>
                {t('Compensation.CompensationDetails')}
              </h3>
                <ul className="space-y-2 list-disc list-inside">

              <li>
                    {t('Compensation.CompensationInfo.CompensationInfo1')}
              </li>
                <li>
                    {t('Compensation.CompensationInfo.CompensationInfo2')}
              </li>
                  <li>
                    {t('Compensation.CompensationInfo.CompensationInfo3')}
              </li>
            </ul>
          </CardContent>
        </Card>
            <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              11. {t('sections.majeure')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
              <h3>{t('majeure.majeure1')}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              12. {t('sections.liability')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 list-disc list-inside">
              <li>
                  {t('LimitationPolicy.LimitationPolicy1')}
              </li>
              <li>
                  {t('LimitationPolicy.LimitationPolicy2')}
              </li>
            </ul>
          </CardContent>
        </Card>
    <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              13. {t('sections.TerminationTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 list-disc list-inside">
              <li>
                  {t('Termination.Termination1')}
              </li>
              <li>
                  {t('Termination.Termination2')}
              </li>
                   <li>
                  {t('Termination.Termination3')}
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              14. {t('sections.modifications')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 list-disc list-inside">
              <li>
                  {t('ModificationsPolicy.Modifications1')}
              </li>
              <li>
                  {t('ModificationsPolicy.Modifications2')}

              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              15 {t('sections.governingLaw')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 list-disc list-inside">
              <li>
                {t('GoverningLow.GoverningLow1')}
              </li>
              <li>
                {t('GoverningLow.GoverningLow2')}
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              16. {t('sections.agreement')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="leading-relaxed">
              {t('agree')}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              17. {t('sections.technicalTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 list-disc list-inside">
              <li>
                {t('technical.technical1')}
                <ul className="p-4 space-y-2 list-decimal list-inside">
                  <li> {t('technical.technicalInfo.IP')}</li>
                   <li> {t('technical.technicalInfo.Device')}</li>
                    <li> {t('technical.technicalInfo.OS')}</li>
                     <li> {t('technical.technicalInfo.Rosultion')}</li>
                      <li> {t('technical.technicalInfo.Language')}</li>
                </ul>
              </li>
              <li>
                {t('technical.technical2')}
              </li>
               <li>
                {t('technical.technical3')}
              </li>
               <li>
                {t('technical.technical4')}
              </li>
            </ul>
          </CardContent>
        </Card>
        
         <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              18. {t('sections.agreement')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="leading-relaxed">
              {t('agree')}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 text-center">
        <Link href="/">
          <Button className="duration-300 bg-primary hover:bg-primary/90">
            {t('backToHome')}
          </Button>
        </Link>
      </div>
    </div>
  );
};