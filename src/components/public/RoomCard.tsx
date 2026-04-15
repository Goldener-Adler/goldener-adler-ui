import {type FunctionComponent} from "react";
import {Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {AMENITIES} from "@/mocks/mockData";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {useTranslation} from "react-i18next";
import type {RoomType} from "@/assets/types";
import {titleKeyMap} from "@/assets/i18n/i18nConsts";

interface RoomCardProps {
  room: RoomType,
  onButtonClick: () => void,
  isSelected: boolean,
  // TODO: pass full room object
}

export const RoomCard: FunctionComponent<RoomCardProps> = ({room, onButtonClick, isSelected}) => {
  const { t } = useTranslation();
  return (
      <Card className="relative pt-0">
        <div className="absolute rounded-t-xl inset-0 z-30 aspect-video bg-black/35" />
        <img
          src="https://avatar.vercel.sh/shadcn1"
          alt="Event cover"
          className="rounded-t-xl relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
        />
        <CardHeader>
          <CardTitle>{t(titleKeyMap[room.type])}</CardTitle>
          <CardDescription>Beschreibung</CardDescription>
          <CardAction>
            <b>{`${room.price} €`}</b>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            {AMENITIES.map((amenity) => (
              <Badge key={amenity.id} variant={amenity.variant}>
                <amenity.icon />
                {t(amenity.label)}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex-row gap-2 justify-end">
          <Button onClick={onButtonClick} variant={isSelected ? 'outline' : 'default'}>
            {isSelected ? 'Bearbeiten' : 'Auswählen'}
          </Button>
        </CardFooter>
      </Card>
  )
}