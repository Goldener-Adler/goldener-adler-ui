import {type FunctionComponent, useState} from "react";
import {Page} from "@/layouts/Page";
import {SidebarPageContentSpacing} from "@/layouts/SidebarPageContentSpacing";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {RoomCard} from "@/components/public/RoomCard";
import {useNewBooking} from "@/contexts/NewBookingContext";
import type {RoomType} from "@/assets/types";
import {RoomExtrasDialog} from "@/components/public/RoomExtrasDialog";
import type {RoomExtrasForm} from "@/assets/bookingTypes";

export const NewBooking: FunctionComponent = () => {
  const { state, dispatch } = useNewBooking();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeRoom, setActiveRoom] = useState<RoomType | null>(null);

  if (state.step === 'request') {
    return;
  }

  const openDialog = (room: RoomType, index: number) => {
    setActiveRoom(room);
    setActiveIndex(index);
    setIsDialogOpen(true);
  };

  const onSaveRoom = (data: RoomExtrasForm) => {
    dispatch({
      type: "ADD_OR_UPDATE_SELECTED_ROOM",
      room: {
        id: `${activeIndex}-${activeRoom?.type}`,
        type: activeRoom!.type,
        extras: data,
      },
      index: activeIndex!,
    });

    setIsDialogOpen(false);
  }

  return (
    <Page>
      <Tabs defaultValue="0">
        <TabsList variant="line" className="w-full px-4 overflow-y-hidden overflow-x-auto justify-start no-scrollbar">
          {state.requestedRooms.map((_, index) => (
            <TabsTrigger key={`room-tab-trigger-${index + 1}`} className="flex-initial" value={`${index}`}>Zimmer {index + 1}</TabsTrigger>
          ))}
        </TabsList>
        {state.requestedRooms.map((_, requestedRoomIndex) => (
          <TabsContent key={`room-tab-content-${requestedRoomIndex + 1}`} value={`${requestedRoomIndex}`}>
            <SidebarPageContentSpacing>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {state.availableRooms.map((room) =>
                <RoomCard
                  key={`${requestedRoomIndex}-${room.type}-${requestedRoomIndex}`}
                  room={room}
                  isSelected={state.selectedRooms[requestedRoomIndex]?.type === room.type}
                  onButtonClick={() => openDialog(room, requestedRoomIndex)}
                />
              )}
            </div>
            </SidebarPageContentSpacing>
          </TabsContent>
        ))}
      </Tabs>
        {activeRoom && activeIndex !== null && (
          <RoomExtrasDialog
            isOpen={isDialogOpen}
            type={activeRoom.type}
            existing={state.selectedRooms[activeIndex]?.type === activeRoom.type
              ? state.selectedRooms[activeIndex]?.extras
              : undefined
            }
            isSelected={!!state.selectedRooms[activeIndex]?.extras}
            onClose={() => setIsDialogOpen(false)}
            onSubmit={onSaveRoom}
          />
        )}
    </Page>
  )
}