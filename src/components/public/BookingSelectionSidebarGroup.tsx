import type {FunctionComponent} from "react";
import type {SelectedRoom} from "@/assets/bookingTypes";
import {Armchair, BedDouble, BedSingle, Trash} from "lucide-react";
import {titleKeyMap} from "@/assets/i18n/i18nConsts";
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

interface BookingSidebarSelectionMenuItemProps {
  recordKey: number,
  selectedRoom?: SelectedRoom;
  onRemoveSelection: (index: number) => void;
}

export const BookingSelectionSidebarGroup: FunctionComponent<BookingSidebarSelectionMenuItemProps> = ({recordKey, selectedRoom, onRemoveSelection}) => {
  const { t } = useTranslation();

  const getIcon = () => {
    if (selectedRoom) {
      switch (selectedRoom.type) {
        case "single": return <BedSingle size="16px"/>;
        case "double": return <BedDouble size="16px"/>;
        case "apartment": return <Armchair size="16px"/>;
        default: return;
      }
    }
    return;
  }

  return (
    <SidebarGroup className="py-0">
      <SidebarGroupLabel>Zimmer {recordKey + 1}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem className="py-1 px-2 flex flex-col gap-1">
            <div className="flex gap-2 items-center">
              {getIcon()}
              <p className={!selectedRoom ? "opacity-50" : ""}>{selectedRoom ? t(titleKeyMap[selectedRoom.type]) : 'Keine Auswahl'}</p>
            </div>
            {selectedRoom && <SidebarMenuAction onClick={() => onRemoveSelection(recordKey)} className="text-destructive hover:cursor-pointer hover:text-destructive">
              <Trash />
            </SidebarMenuAction>}
            {selectedRoom && Object.values(selectedRoom.extras)
              .filter((value) => value !== false && value !== "none").length > 0 &&
                <SidebarMenuSub className="mx-2">
                  {Object.entries(selectedRoom.extras)
                    .filter(([, value]) => value !== false && value !== "none")
                    .map(([key, value]) => (
                      <SidebarMenuSubItem key={key} className="px-2 py-1">{key}: {String(value)}</SidebarMenuSubItem>
                    ))}
                </SidebarMenuSub>
            }
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}