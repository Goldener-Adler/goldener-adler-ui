import type {UnsafeReportingRequirementForm} from "@/assets/guestTypes";
import type {FunctionComponent} from "react";
import {AccordionContent, AccordionItem, AccordionTrigger} from "../ui/accordion";
import {Item, ItemContent, ItemDescription, ItemTitle} from "@/components/ui/item";
import {toDateOnly} from "@/utils/formatDate";
import {useTranslation} from "react-i18next";
import {getCountryDisplayName} from "@/utils/getNationalities";

interface ReportingRequirementsMainGuestItemsProps {
  values: UnsafeReportingRequirementForm['mainGuest'];
}

export const ReportingRequirementsMainGuestItems: FunctionComponent<ReportingRequirementsMainGuestItemsProps> = ({ values }: ReportingRequirementsMainGuestItemsProps) => {
  const { t, i18n } = useTranslation();

  return (
  <AccordionItem value="mainGuest">
    <AccordionTrigger>{t('public.GuestInfo.MainGuest')}</AccordionTrigger>
    <AccordionContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Item className="p-0">
        <ItemContent>
          <ItemTitle>{t('public.Forms.Labels.Citizenship')}</ItemTitle>
          <ItemDescription>
            {values.citizenship && getCountryDisplayName(values.citizenship, i18n.language)}
          </ItemDescription>
        </ItemContent>
      </Item>
      {values.citizenship !== "de" && (
        <>
          {values.birthDate && <Item className="p-0">
              <ItemContent>
                  <ItemTitle>{t('public.Forms.Labels.BirthDate')}</ItemTitle>
                  <ItemDescription>
                    {toDateOnly(values.birthDate).toLocaleDateString()}
                  </ItemDescription>
              </ItemContent>
          </Item>}
          {values.address && (
            <>
              <Item className="p-0">
                <ItemContent>
                  <ItemTitle>{t('public.Forms.Labels.Address')}</ItemTitle>
                  <ItemDescription>
                    {values.address.street}
                  </ItemDescription>
                </ItemContent>
              </Item>
              <Item className="p-0">
                <ItemContent>
                  <ItemTitle>{t('public.Forms.Labels.PostalCode')}</ItemTitle>
                  <ItemDescription>
                    {values.address.postalCode}
                  </ItemDescription>
                </ItemContent>
              </Item>
              <Item className="p-0">
                <ItemContent>
                  <ItemTitle>{t('public.Forms.Labels.City')}</ItemTitle>
                  <ItemDescription>
                    {values.address.city}
                  </ItemDescription>
                </ItemContent>
              </Item>
              <Item className="p-0">
                <ItemContent>
                  <ItemTitle>{t('public.Forms.Labels.Country')}</ItemTitle>
                  <ItemDescription>
                    {values.address.country}
                  </ItemDescription>
                </ItemContent>
              </Item>
            </>
          )}
        </>
      )}
    </AccordionContent>
  </AccordionItem>
)}