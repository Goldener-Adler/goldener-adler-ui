import {type FunctionComponent, useState} from "react";
import {Page} from "@/layouts/Page";
import {SidebarPageContentSpacing} from "@/layouts/SidebarPageContentSpacing";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {RoomCard} from "@/components/public/RoomCard";
import {useNewBooking} from "@/contexts/NewBookingContext";
import {RoomExtrasDialog} from "@/components/public/RoomExtrasDialog";
import type {RoomExtrasForm} from "@/assets/bookingTypes";
import type {RoomTypeKey} from "@/assets/types";
import {getTypedEntries} from "@/utils/getTypedEntries";
import {useCheckAvailability} from "@/hooks/useCheckAvailability";
import {useUpdateRoomSelection} from "@/hooks/useUpdateRoomSelection";
import {useTranslation} from "react-i18next";

export const RoomSelection: FunctionComponent = () => {
  const { t } = useTranslation();
  const { state } = useNewBooking();
  const { isLoading, data } = useCheckAvailability();
  const { mutate: updateRoomSelection } = useUpdateRoomSelection();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeRoom, setActiveRoom] = useState<RoomTypeKey | null>(null);

  if (state.status === 'uninitialized') {
    return;
  }

  const openDialog = (room: RoomTypeKey, index: number) => {
    setActiveRoom(room);
    setActiveIndex(index);
    setIsDialogOpen(true);
  };

  const onSaveRoom = (extras: RoomExtrasForm) => {
    if (activeRoom !== null && activeIndex !== null && data) {
      updateRoomSelection({
        roomIndex: activeIndex,
        roomType: activeRoom,
        extras: extras,
        extraPrices: data[activeRoom].extraPrices,
        pricePerNight: data[activeRoom].price
      })
    }
    setIsDialogOpen(false);
  }

  return (
    <Page>
      <Tabs defaultValue="0">
        <TabsList variant="line" className="w-full px-4 overflow-y-hidden overflow-x-auto justify-start no-scrollbar">
          {state.requestedRooms.map((_, index) => (
            <TabsTrigger key={`room-tab-trigger-${index + 1}`} className="flex-initial" value={`${index}`}>{t('public.Booking.Options.Rooms_one')} {index + 1}</TabsTrigger>
          ))}
        </TabsList>
        {!isLoading && data && state.requestedRooms.map((_, requestedRoomIndex) => (
          <TabsContent key={`room-tab-content-${requestedRoomIndex + 1}`} value={`${requestedRoomIndex}`}>
            <SidebarPageContentSpacing>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {getTypedEntries(data).map(([type, room]) =>
                <RoomCard
                  key={`${requestedRoomIndex}-${type}-${requestedRoomIndex}`}
                  type={type}
                  room={room}
                  isSelected={state.selectedRooms[requestedRoomIndex]?.type === type}
                  onButtonClick={() => openDialog(type, requestedRoomIndex)}
                />
              )}
            </div>
            </SidebarPageContentSpacing>
          </TabsContent>
        ))}
      </Tabs>
        {data && activeRoom && activeIndex !== null && (
          <RoomExtrasDialog
            isOpen={isDialogOpen}
            type={activeRoom}
            existing={state.selectedRooms[activeIndex]?.type === activeRoom
              ? state.selectedRooms[activeIndex]?.extras
              : undefined
            }
            prices={data[activeRoom].extraPrices}
            isSelected={state.selectedRooms[activeIndex]?.type === activeRoom}
            onClose={() => setIsDialogOpen(false)}
            onSubmit={onSaveRoom}
          />
        )}
    </Page>
  )
}