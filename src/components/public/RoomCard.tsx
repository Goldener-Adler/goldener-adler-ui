import {type FunctionComponent} from "react";
import {Card, CardAction, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {useTranslation} from "react-i18next";
import {titleKeyMap} from "@/assets/i18n/i18nConsts";
import type {AvailableRoomDetails, RoomTypeKey} from "@/assets/types";
import type {TranslationKey} from "@/assets/i18n/i18n";
import {Separator} from "@/components/ui/separator";

interface RoomCardProps {
  type: RoomTypeKey,
  room: AvailableRoomDetails,
  onButtonClick: () => void,
  isSelected: boolean,
}

export const RoomCard: FunctionComponent<RoomCardProps> = ({type, room, onButtonClick, isSelected}) => {
  const { t } = useTranslation();

  // TODO: Fix Card Styling

  const isUnavailable = room.available === 0;

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
      <Card className={`relative pt-0 ${isUnavailable && 'opacity-75'}`}>
        <div className="absolute rounded-t-xl inset-0 z-30 aspect-video bg-black/35" />
        <img
          src="https://avatar.vercel.sh/shadcn1"
          alt="Event cover"
          className="rounded-t-xl relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
        />
        <CardHeader>
          <CardTitle>{t(titleKeyMap[type])}</CardTitle>
          <CardAction className="flex flex-col items-end">
            <b className="text-xl leading-7">{`${room.price} €`}</b>
            <small>{t('public.Rooms.Extras.Per.Night')}</small>
          </CardAction>
        </CardHeader>
        <Separator/>
        <CardFooter className="flex-row gap-2 justify-end">
          <Button
            disabled={isUnavailable}
            onClick={onButtonClick}
            variant={buttonVariant}>
            {t(buttonLabel)}
          </Button>
        </CardFooter>
      </Card>
  )
}