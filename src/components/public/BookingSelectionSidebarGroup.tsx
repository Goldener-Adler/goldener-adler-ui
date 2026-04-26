import type {FunctionComponent} from "react";
import type {RoomExtrasForm, SelectedRoom} from "@/assets/bookingTypes";
import {Trash} from "lucide-react";
import {extrasTranslationMap, titleKeyMap} from "@/assets/i18n/i18nConsts";
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
import {getTypedEntries} from "@/utils/getTypedEntries";

interface BookingSidebarSelectionMenuItemProps {
  recordKey: number,
  selectedRoom?: SelectedRoom;
  onRemoveSelection: (index: number) => void;
}

export const BookingSelectionSidebarGroup: FunctionComponent<BookingSidebarSelectionMenuItemProps> = ({recordKey, selectedRoom, onRemoveSelection}) => {
  const { t } = useTranslation();

  function translateExtra(key: keyof RoomExtrasForm, value: string | boolean) {
    const map = extrasTranslationMap[key];
    const valueKey = typeof value === "string" ? map.values?.[value] : undefined;
    return valueKey ? `${t(map.label)}: ${t(valueKey)}` : t(map.label);
  }

  return (
    <SidebarGroup className="py-0">
      <SidebarGroupLabel>Zimmer {recordKey + 1}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem className="py-1 px-2 flex flex-col gap-1">
            <div className="flex gap-2 items-center">
              {selectedRoom && getRoomIcon(selectedRoom)}
              <p className={!selectedRoom ? "opacity-50" : ""}>{selectedRoom ? t(titleKeyMap[selectedRoom.type]) : 'Keine Auswahl'}</p>
            </div>
            {selectedRoom && <SidebarMenuAction onClick={() => onRemoveSelection(recordKey)} className="text-destructive hover:cursor-pointer hover:text-destructive">
              <Trash />
            </SidebarMenuAction>}
              <SidebarMenuSub className="mx-2">
                {selectedRoom &&
                  getTypedEntries(selectedRoom.extras)
                    .filter(([, value]) => value !== false && value !== "none")
                    .map(([key, value]) => (
                      <SidebarMenuSubItem key={key} className="px-2 py-1">
                        {translateExtra(key, value)}
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