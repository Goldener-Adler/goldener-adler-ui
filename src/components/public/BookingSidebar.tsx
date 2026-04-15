import {type FunctionComponent, useEffect} from "react";
import {
  Sidebar, SidebarContent,
  SidebarFooter,
  SidebarGroup, SidebarGroupContent,
  SidebarHeader, SidebarMenu, SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {useNewBooking} from "@/contexts/NewBookingContext";
import {useNavigate} from "react-router";
import {ChevronRight, Users} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import {BookingSelectionSidebarGroup} from "@/components/public/BookingSelectionSidebarGroup";
import {Button} from "@/components/ui/button";

export const BookingSidebar: FunctionComponent = () => {
  const { state, dispatch } = useNewBooking();
  const navigate = useNavigate();

  // Universal Guard for Booking Components
  useEffect(() => {
    if (state.step === "request") {
      navigate("/", { replace: true });
    }
  }, [state.step, navigate]);

  if (state.step === "request") {
    return;
  }

  const onRemoveSelection = (index: number) => {
    dispatch({
      type: 'REMOVE_SELECTED_ROOM',
      index: index
    })
  }

  return (
    <Sidebar side="right" variant="floating">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="h-fit flex flex-col hover:cursor-pointer items-stretch group-data-[collapsible=icon]:!h-auto">
              <div className="grid grid-cols-3 items-center">
                <div className="flex flex-col items-center justify-center">
                  <span className="text-xs block">Check-In</span>
                  <span className="text-2xl">{state.checkIn.toLocaleDateString("de", {day: "numeric"})}</span>
                  <span className="font-medium text-xs block">
                    {`${state.checkIn.toLocaleDateString("de", {month: "short"})} ${state.checkIn.toLocaleDateString("de", {year: "numeric"})}`}
                  </span>
                </div>
                <span className="flex justify-center">
                  <ChevronRight className="text-sidebar-foreground opacity-50" />
                </span>

                <div className="flex flex-col items-center justify-center">
                  <span className="text-xs block">Check-Out</span>
                  <span className="text-2xl">{state.checkOut.toLocaleDateString("de", {day: "numeric"})}</span>
                  <span className="font-medium text-xs block">
                    {`${state.checkOut.toLocaleDateString("de", {month: "short"})} ${state.checkOut.toLocaleDateString("de", {year: "numeric"})}`}
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
                      <p>Zimmer {index + 1}</p>
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
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <Separator/>
      <SidebarContent className="no-scrollbar py-4">
        {state.requestedRooms.map((_, index) => {
          const selectedRoom = state.selectedRooms[index];
          return (
            <BookingSelectionSidebarGroup
              key={`${index}-${selectedRoom ? selectedRoom.type : 'no-selection' }`}
              recordKey={index}
              selectedRoom={selectedRoom}
              onRemoveSelection={onRemoveSelection}
            />)
        })}
      </SidebarContent>
      <Separator/>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Button size="lg" className="w-full" disabled={Object.keys(state.selectedRooms).length !== state.requestedRooms.length} onClick={() => navigate("/new-booking/guests")}>
              Nächster Schritt
              <ChevronRight />
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}