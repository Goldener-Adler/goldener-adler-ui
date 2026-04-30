import type {FunctionComponent} from "react";
import type {RoomHolding} from "@/assets/bookingTypes";
import {Trash} from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem
} from "@/components/ui/sidebar";
import {useTranslation} from "react-i18next";
import {getRoomIcon} from "@/utils/getRoomIcon";
import {useLocalizedValue} from "@/hooks/useLocalizedValue";

interface BookingSidebarSelectionMenuItemProps {
  requestedRoomIndex: number,
  roomHolding?: RoomHolding;
  onRemoveSelection: () => void;
}

export const BookingSelectionSidebarGroup: FunctionComponent<BookingSidebarSelectionMenuItemProps> = ({requestedRoomIndex, roomHolding, onRemoveSelection}) => {
  const { t } = useTranslation();
  const localize = useLocalizedValue();

  return (
    <SidebarGroup className="py-0">
      <SidebarGroupLabel>{t('public.Booking.Options.Rooms_one')} {requestedRoomIndex + 1}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem className="py-1 px-2 flex flex-col gap-1">
            <div className="flex gap-2 items-center">
              {roomHolding && getRoomIcon(roomHolding)}
              <p className={!roomHolding ? "opacity-50" : ""}>{roomHolding ? localize(roomHolding.title) : t('public.Booking.Options.NoSelection')}</p>
            </div>
            {roomHolding && <SidebarMenuAction onClick={onRemoveSelection} className="text-destructive hover:cursor-pointer hover:text-destructive">
              <Trash />
            </SidebarMenuAction>}
              <SidebarMenuSub className="mx-2">
                {roomHolding && roomHolding.extrasSnapshot
                  .filter(extra => extra.value !== false)
                  .map((extra) => (
                      <SidebarMenuSubItem key={`${roomHolding.id}-${extra.extraLabel.en}`} className="px-2 py-1">
                        <span>{localize(extra.extraLabel)}</span>
                        {extra.optionLabel && <span>: {localize(extra.optionLabel)}</span>}
                      </SidebarMenuSubItem>
                    ))
                  }
              </SidebarMenuSub>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}