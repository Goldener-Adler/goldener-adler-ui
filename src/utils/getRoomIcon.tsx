import {Armchair, BedDouble, BedSingle} from "lucide-react";
import type {SelectedRoom} from "@/assets/bookingTypes";

export function getRoomIcon(selectedRoom: SelectedRoom) {
  switch (selectedRoom.type) {
    case "single": return <BedSingle size="16px"/>;
    case "double": return <BedDouble size="16px"/>;
    case "apartment": return <Armchair size="16px"/>;
    default: return;
  }
}