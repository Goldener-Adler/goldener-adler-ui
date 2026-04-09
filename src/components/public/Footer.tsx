import {type FunctionComponent, useRef} from "react";
import {Link} from "react-router";
import {useTranslation} from "react-i18next";
import {METADATA} from "@/assets/consts.ts";
import { PiCopyright } from 'react-icons/pi';
import {CookieBanner} from "@/components/public/CookieBanner.tsx";

export const Footer: FunctionComponent = () => {
  const {t} = useTranslation();
  const openCookieBannerRef = useRef<() => void>(null);

  return (
    <div id="footer-container" className="bg-slate-950 text-white">
      <div className="max-w-6xl w-full m-auto px-5 py-8 flex gap-5">
        <div>
          <b>{`${t('public.Imprint.Owner')} ${METADATA.OWNER}`}</b>
          <ul>
            <li><Link className="hover:underline" to="/imprint">{t('public.Imprint.Title')}</Link></li>
            <li><Link className="hover:underline" to="/legal">{t('public.LegalNotice.Title')}</Link></li>
            <li onClick={() => openCookieBannerRef.current?.()} className="hover:underline hover:cursor-pointer">{t('public.CookieBanner.Link')}</li>
            <li className="mt-2">
              <small><Link className="hover:underline flex gap-1 items-center" target="_blank" to="http://www.soenke-schaarschmidt.de"><PiCopyright />Sönke Schaarschmidt, 2025</Link></small>
            </li>
          </ul>
        </div>
        <div className="flex-1"></div>
        <div>
          <b>{METADATA.NAME}</b>
          <p>{`${METADATA.STREET} ${METADATA.NR}`}</p>
          <p>{METADATA.POSTCODE}</p>
          <p>{t('public.Home.Information.Location')}</p>
        </div>
      </div>
      <CookieBanner handleOpen={(fn) => (openCookieBannerRef.current = fn)} />
    </div>
  )
}
