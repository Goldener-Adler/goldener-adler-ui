import type {FunctionComponent} from "react";
import {Page} from "@/layouts/Page.tsx";
import {Content} from "@/layouts/Content.tsx";
import {Trans, useTranslation} from "react-i18next";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion.tsx";
import {HOSTING_PROVIDER, METADATA} from "@/assets/consts.ts";
import { PiArrowSquareOutBold, PiArrowSquareOut } from 'react-icons/pi';
import {Link} from "react-router";

export const LegalNotice: FunctionComponent = () => {
  const {t} = useTranslation();
  return (
    <Page>
      <Content className="pt-24 pb-12">
        <h1 className="text-3xl font-semibold py-2">{t('public.LegalNotice.Title')}</h1>
        <h2 className="text-xl font-semibold mt-3 py-2">{t('public.LegalNotice.DataProtection.Title')}</h2>
        <p className="text-sm"><Trans i18nKey="public.LegalNotice.DataProtection.Content" components={{1: <br/>}} /></p>
        {/* Data Protection */}
        <Accordion type="single" collapsible={true} className="w-full mt-6">
          <AccordionItem value="responsible">
            <AccordionTrigger className="text-md">{t('public.LegalNotice.Responsible.Title')}</AccordionTrigger>
            <AccordionContent>
              <p>{t('public.LegalNotice.Responsible.Content')}</p>
              <br/>
              <p>{`${METADATA.NAME} ${t('public.Imprint.Owner')} ${METADATA.OWNER}`}</p>
              <p>{`${METADATA.STREET} ${METADATA.NR}`}</p>
              <p>{METADATA.POSTCODE}</p>
              <p>{t('public.Home.Information.Location')}</p>
              <br/>
              <p>{t('public.LegalNotice.Responsible.Footer')}</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="data-collection">
            <AccordionTrigger className="text-md">{t('public.LegalNotice.DataCollection.Title')}</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm"><Trans i18nKey='public.LegalNotice.DataCollection.Content' components={{1: <br/>}} /></p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="data-usage">
            <AccordionTrigger className="text-md">{t('public.LegalNotice.DataUsage.Title')}</AccordionTrigger>
            <AccordionContent>{t('public.LegalNotice.DataUsage.Content')}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="data-storing">
            <AccordionTrigger className="text-md">{t('public.LegalNotice.DataStoring.Title')}</AccordionTrigger>
            <AccordionContent>{t('public.LegalNotice.DataStoring.Content')}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="data-rights">
            <AccordionTrigger className="text-md">{t('public.LegalNotice.DataRights.Title')}</AccordionTrigger>
            <AccordionContent>{t('public.LegalNotice.DataRights.Content')}</AccordionContent>
          </AccordionItem>
        </Accordion>
        {/* General Info */}
        <h2 className="text-xl font-semibold mt-10 py-2">{t('public.LegalNotice.GeneralInfo.Title')}</h2>
        <p className="text-sm"><Trans i18nKey="public.LegalNotice.GeneralInfo.Content" components={{1: <br/>}}/></p>
        <Accordion type="single" collapsible={true} className="w-full mt-6">
          <AccordionItem value="withdrawal">
            <AccordionTrigger className="text-md">{t('public.LegalNotice.Withdrawal.Title')}</AccordionTrigger>
            <AccordionContent>{t('public.LegalNotice.Withdrawal.Content')}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="special-withdrawal">
            <AccordionTrigger className="text-md">{t('public.LegalNotice.SpecialWithdrawal.Title')}</AccordionTrigger>
            <AccordionContent>
              <Trans i18nKey='public.LegalNotice.SpecialWithdrawal.Content' components={{1: <br/>}} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="appeal">
            <AccordionTrigger className="text-md">{t('public.LegalNotice.RightOfAppeal.Title')}</AccordionTrigger>
            <AccordionContent>{t('public.LegalNotice.RightOfAppeal.Content')}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="portability">
            <AccordionTrigger className="text-md">{t('public.LegalNotice.DataPortability.Title')}</AccordionTrigger>
            <AccordionContent>{t('public.LegalNotice.DataPortability.Content')}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="correctness">
            <AccordionTrigger className="text-md">{t('public.LegalNotice.DataCorrectness.Title')}</AccordionTrigger>
            <AccordionContent>{t('public.LegalNotice.DataCorrectness.Content')}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="restriction">
            <AccordionTrigger className="text-md">{t('public.LegalNotice.ProcessingRestriction.Title')}</AccordionTrigger>
            <AccordionContent>
              {t('public.LegalNotice.ProcessingRestriction.Content')}
              <ul className="m-5" style={{listStyle: "disc outside none"}}>
                <li className="my-2">{t('public.LegalNotice.ProcessingRestriction.List.Item1')}</li>
                <li className="my-2">{t('public.LegalNotice.ProcessingRestriction.List.Item2')}</li>
                <li className="my-2">{t('public.LegalNotice.ProcessingRestriction.List.Item3')}</li>
                <li className="my-2">{t('public.LegalNotice.ProcessingRestriction.List.Item4')}</li>
              </ul>
              {t('public.LegalNotice.ProcessingRestriction.Footer')}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        {/* Cookies */}
        <h2 className="text-xl font-semibold mt-10 py-2">{t('public.LegalNotice.Cookies.Title')}</h2>
        <p className="text-sm"><Trans i18nKey="public.LegalNotice.Cookies.Content" components={{1: <br/>}}/></p>
        {/* Hosting */}
        <h2 className="text-xl font-semibold mt-10 py-2">{t('public.LegalNotice.Hosting.Title')}</h2>
        <p className="text-sm"><Trans i18nKey="public.LegalNotice.Hosting.Content" components={{1: <br/>}}/>:</p>
        <Link className="w-fit flex items-center gap-2 mt-4 mb-2 hover:underline" target="_blank" to="https://www.scaleway.com/en/">
          <span className="text-lg">{HOSTING_PROVIDER.NAME}</span>
          <PiArrowSquareOutBold size={18} />
        </Link>
        <p className="text-sm">
          <Trans values={{provider: HOSTING_PROVIDER.NAME}} i18nKey="public.LegalNotice.Hosting.ProviderInfo" components={{1: <br/>}}/>
          <Link className="flex gap-1 underline flex-nowrap items-center" target="_blank" to={HOSTING_PROVIDER.POLICY_URL}>{HOSTING_PROVIDER.POLICY_URL} <PiArrowSquareOut/></Link>
        </p>
        <br/>
        <p className="text-sm"><Trans values={{provider: HOSTING_PROVIDER.NAME}} i18nKey="public.LegalNotice.Hosting.ProviderFooter" components={{1: <br/>}}/></p>
        <div className="mt-12"><small className="flex flex-nowrap gap-1 items-center">{t('public.LegalNotice.Source')}:<Link className="underline flex flex-nowrap gap-1 items-center" target="_blank" to="https://www.e-recht24.de/">https://www.e-recht24.de/ <PiArrowSquareOut/></Link></small></div>
      </Content>
    </Page>
  )
}