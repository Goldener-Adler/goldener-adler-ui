import {type FunctionComponent, useState} from "react";
import {
  Sidebar, SidebarContent,
  SidebarFooter,
  SidebarGroup, SidebarGroupContent,
  SidebarHeader, SidebarMenu, SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {useNewBooking} from "@/contexts/NewBookingContext";
import {ChevronRight, Users} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import {BookingSelectionSidebarGroup} from "@/components/public/BookingSelectionSidebarGroup";
import {Button} from "@/components/ui/button";
import {BookingRequestDialog} from "@/components/public/BookingRequestDialog";
import {useRemoveRoomSelection} from "@/hooks/useRemoveRoomSelection";
import {useTranslation} from "react-i18next";
import {clearBookingSession} from "@/utils/bookingSession";

export const BookingSidebar: FunctionComponent = () => {
  const { t, i18n } = useTranslation();
  const { state, dispatch } = useNewBooking();
  const [openBookingDialog, setOpenBookingDialog] = useState(false);

  const { mutate: removeRoomSelection } = useRemoveRoomSelection();

  if (state.status !== "initialized") {
    return;
  }

  const handleCancelBooking = () => {
    clearBookingSession();
    dispatch({
      type: "RESET_BOOKING",
    })
  }

  return (
    <Sidebar side="right" variant="floating">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => setOpenBookingDialog(true)} size="lg" className="h-fit flex flex-col hover:cursor-pointer items-stretch group-data-[collapsible=icon]:h-auto!">
              <div className="grid grid-cols-3 items-center">
                <div className="flex flex-col items-center justify-center">
                  <span className="text-xs block">{t('public.Forms.Labels.CheckIn')}</span>
                  <span className="text-2xl">{state.checkIn.toLocaleDateString("de", {day: "numeric"})}</span>
                  <span className="font-medium text-xs block">
                    {`${state.checkIn.toLocaleDateString(i18n.language, {month: "short"})} ${state.checkIn.toLocaleDateString(i18n.language, {year: "numeric"})}`}
                  </span>
                </div>
                <span className="flex justify-center">
                  <ChevronRight className="text-sidebar-foreground opacity-50" />
                </span>

                <div className="flex flex-col items-center justify-center">
                  <span className="text-xs block">{t('public.Forms.Labels.CheckOut')}</span>
                  <span className="text-2xl">{state.checkOut.toLocaleDateString("de", {day: "numeric"})}</span>
                  <span className="font-medium text-xs block">
                    {`${state.checkOut.toLocaleDateString(i18n.language, {month: "short"})} ${state.checkOut.toLocaleDateString(i18n.language, {year: "numeric"})}`}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
              </div>
              <SidebarGroup className="px-0">
                <SidebarGroupContent className="px-0 flex flex-col gap-2.5">
                  {state.requestedRooms.map((room, index) =>
                    <SidebarMenuItem key={`requested-room-${index}-people-${room.people}`} className="px-0 flex gap-2 items-center justify-between">
                      <div className="flex gap-2 items-center">
                        <p>{t('public.Booking.Options.Rooms_one')} {index + 1}</p>
                      </div>
                      <div className="flex gap-2 items-center">
                        <Users size="16" />
                        {room.people}
                      </div>
                    </SidebarMenuItem>
                  )}
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarMenuButton>
            <BookingRequestDialog open={openBookingDialog} setOpen={setOpenBookingDialog} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <Separator/>
      <SidebarContent className="no-scrollbar py-4">
        {state.requestedRooms.map((requestedRoom, index) => {
          const roomHolding = state.roomHoldings[requestedRoom.id];
          return (
            <BookingSelectionSidebarGroup
              key={`${index}-${roomHolding ? roomHolding.id : 'no-selection' }`}
              requestedRoomIndex={index}
              roomHolding={roomHolding}
              onRemoveSelection={() => removeRoomSelection(requestedRoom.id)}
            />)
        })}
      </SidebarContent>
      <Separator/>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Button size="lg" variant="destructive-outline" className="w-full" onClick={handleCancelBooking}>
              {t('public.Buttons.CancelBooking')}
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}