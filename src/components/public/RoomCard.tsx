import {type FunctionComponent} from "react";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {useTranslation} from "react-i18next";
import type {RoomCategory} from "@/assets/types";
import type {TranslationKey} from "@/assets/i18n/i18n";
import {Separator} from "@/components/ui/separator";
import {AmenityBadge} from "@/components/public/AmenityBadge";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import { useLocalizedValue } from "@/hooks/useLocalizedValue";
import {useFormatPrice} from "@/hooks/useFormatPrice";

interface RoomCardProps {
  room: RoomCategory,
  onButtonClick: () => void,
  isSelected: boolean,
}

export const RoomCard: FunctionComponent<RoomCardProps> = ({room, onButtonClick, isSelected}) => {
  const { t } = useTranslation();
  const localize = useLocalizedValue();
  const formatPrice = useFormatPrice();

  // TODO: Show Price Info based on Per definition of price

  const isUnavailable = room.amount === 0;

  const buttonLabel: TranslationKey = isUnavailable
    ? "public.Buttons.NotAvailable"
    : isSelected
      ? "public.Buttons.Edit"
      : "public.Buttons.Select";

  const buttonVariant = isUnavailable
    ? "default"
    : isSelected
      ? "outline"
      : "default";

  return (
      <Card className={`relative p-0 gap-0 ${isUnavailable && 'opacity-75'}`}>
        <div className="absolute rounded-t-xl inset-0 z-30 aspect-video bg-black/35" />
        <img
          src="https://avatar.vercel.sh/shadcn1"
          alt="Event cover"
          className="rounded-t-xl relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
        />
        <CardHeader className="px-4 pt-4">
          <CardTitle>{localize(room.title)}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 px-4 pb-4 pt-0">
          <Accordion type="single" collapsible>
            <AccordionItem value="details">
              <AccordionTrigger className="py-0 text-muted-foreground">
                {t('public.Rooms.Labels.ShowDetails')}
              </AccordionTrigger>
              <AccordionContent className="flex pt-4 pb-0 flex-wrap gap-2">
                {room.amenities.map((amenity, index) => <AmenityBadge key={index} amenity={amenity} />)}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
        <Separator/>
        <CardFooter className="p-4 flex-row gap-2 justify-between">
          <Button
            disabled={isUnavailable}
            onClick={onButtonClick}
            variant={buttonVariant}
          >
            {t(buttonLabel)}
          </Button>
          <div className="flex flex-col items-end">
            <b className="text-xl leading-7">{formatPrice(room.price.amount)}</b>
            <small>{t('public.Rooms.Extras.Per.Night')}</small>
          </div>
        </CardFooter>
      </Card>
  )
}