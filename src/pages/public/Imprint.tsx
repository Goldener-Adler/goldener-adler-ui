import type {FunctionComponent} from "react";
import {Page} from "@/layouts/Page.tsx";
import {Content} from "@/layouts/Content.tsx";
import { Link } from "react-router";
import {METADATA} from "@/assets/consts.ts";
import {Trans, useTranslation} from "react-i18next";

export const Imprint: FunctionComponent = () => {
  const {t} = useTranslation();
  return (
    <Page>
      <Content className="pt-24 pb-12">
        <h1 className="text-3xl font-semibold">{t('public.Imprint.Title')}</h1>
        <div className="pt-6">
          <h2 className="text-lg font-semibold">{t('public.Imprint.Provider')}</h2>
          <p>{`${METADATA.NAME} ${t('public.Imprint.Owner')} ${METADATA.OWNER}`}</p>
          <p>{`${METADATA.STREET} ${METADATA.NR}`}</p>
          <p>{METADATA.POSTCODE} {METADATA.CITY}</p>
          <br/>
          <p>{`${t('public.Imprint.Court')} ${METADATA.REGISTER_CITY}, ${METADATA.REGISTER_ID}`}</p>
          <p>USt-ID Nr.: {METADATA.UST_ID}</p>
          <p>{`${t('public.Imprint.TaxNr')}: ${METADATA.TAX_NR}`}</p>
          <br/>
          <p>{t('public.Imprint.Suggestions')} <Link to="/contact" className="text-blue-700 hover:underline">{t('public.Imprint.ContactForm')}</Link>.</p>
        </div>
        <div className="pt-6">
          <h2 className="text-lg font-semibold">{t('public.Imprint.Copyright.Title')}</h2>
          <p>{t('public.Imprint.Copyright.Content')}</p>
        </div>
        <div className="pt-6">
          <h2 className="text-lg font-semibold">{t('public.Imprint.ContentResponsibility.Title')}</h2>
          <p>{METADATA.DOMAIN}</p>
        </div>
        <div className="pt-6">
          <h2 className="text-lg font-semibold">{t('public.Imprint.DataPrivacy.Title')}</h2>
          <Trans i18nKey="public.Imprint.DataPrivacy.Content" components={{1: <br/>}}/> <Link to="/contact" className="text-blue-700 hover:underline">{t("public.Imprint.ContactForm")}</Link>.
        </div>
        <div className="pt-6">
          <h2 className="text-lg font-semibold">{t('public.Imprint.Disclaimer.Title')}</h2>
          <p>{t('public.Imprint.Disclaimer.Content', {domain: METADATA.DOMAIN})}</p>
        </div>
      </Content>
    </Page>
  )
}
