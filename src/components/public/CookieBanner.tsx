import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog.tsx";
import { useCookieConsent } from "@/hooks/useCookieConsent.ts";
import {useTranslation} from "react-i18next";
import type {FunctionComponent} from "react";

interface CookieBannerProps {
  handleOpen:  (openFn: () => void) => void;
}

export const CookieBanner: FunctionComponent<CookieBannerProps> = ({ handleOpen }) => {
  const { isOpen, setIsOpen, accept, decline, essential } = useCookieConsent();
  const {t} = useTranslation();

  handleOpen(() => setIsOpen(true));

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>{t('public.CookieBanner.Title')}</AlertDialogTitle>
          <AlertDialogDescription>{t('public.CookieBanner.Content')}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={decline}>{t('public.Buttons.Decline')}</AlertDialogCancel>
          <AlertDialogAction className="bg-gray-200 hover:bg-gray-300 text-black" onClick={essential}>{t('public.Buttons.Essential')}</AlertDialogAction>
          <AlertDialogAction onClick={accept}>{t('public.Buttons.Accept')}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
