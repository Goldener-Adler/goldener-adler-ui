import type { ReportingRequirement } from "@/assets/guestTypes";
import type {FunctionComponent} from "react";
import {AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {Item, ItemContent, ItemDescription, ItemMedia, ItemTitle} from "@/components/ui/item";
import {getCountryDisplayName} from "@/utils/getNationalities";
import { toDateOnly } from "@/utils/formatDate";
import {Check} from "lucide-react";
import {useTranslation} from "react-i18next";
import {EMPTY_STRING} from "@/assets/consts";

interface ReportingRequirementsAdditionalGuestItems {
  values: NonNullable<ReportingRequirement['additionalGuests']>[number],
  index: number,
  allIsFamily: boolean
}

export const ReportingRequirementsAdditionalGuestItems: FunctionComponent<ReportingRequirementsAdditionalGuestItems> =  ({ values, index, allIsFamily }: ReportingRequirementsAdditionalGuestItems) => {
  const { t, i18n } = useTranslation();

  return (
    <AccordionItem value={`additionalGuest-${index}`}>
    <AccordionTrigger>{`${t('public.GuestInfo.Guest_one')} ${index + 1}`}</AccordionTrigger>
    <AccordionContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {values.firstName && values.firstName !== EMPTY_STRING && (
        <Item className="p-0">
          <ItemContent>
            <ItemTitle>{t('public.Forms.Labels.FirstName')}</ItemTitle>
            <ItemDescription>{values.firstName}</ItemDescription>
          </ItemContent>
        </Item>
      )}
      {values.lastName && values.lastName !== EMPTY_STRING && (
        <Item className="p-0">
          <ItemContent>
            <ItemTitle>{t('public.Forms.Labels.LastName')}</ItemTitle>
            <ItemDescription>{values.lastName}</ItemDescription>
          </ItemContent>
        </Item>
      )}
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
      {!allIsFamily && values.familyMember && <Item className="p-0 col-span-1 sm:col-span-2">
          <ItemMedia>
              <Check/>
          </ItemMedia>
          <ItemContent>
              <ItemTitle>{t('public.Forms.Labels.IsFamilyMember')}</ItemTitle>
          </ItemContent>
      </Item>}
    </AccordionContent>
  </AccordionItem>
)}