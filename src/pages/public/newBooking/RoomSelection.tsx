import {type FunctionComponent, useState} from "react";
import {Page} from "@/layouts/Page";
import {SidebarPageContentSpacing} from "@/layouts/SidebarPageContentSpacing";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {RoomCard} from "@/components/public/RoomCard";
import {useNewBooking} from "@/contexts/NewBookingContext";
import {RoomExtrasDialog} from "@/components/public/RoomExtrasDialog";
import type {ExtrasFormValues} from "@/assets/bookingTypes";
import type {RoomCategory} from "@/assets/types";
import {useCheckAvailability} from "@/hooks/useCheckAvailability";
import {useUpdateRoomSelection} from "@/hooks/useUpdateRoomSelection";
import {useTranslation} from "react-i18next";
import {Button} from "@/components/ui/button";
import {useNavigate} from "react-router";

export const RoomSelection: FunctionComponent = () => {
  const { t } = useTranslation();
  const { state } = useNewBooking();
  const { isLoading, data } = useCheckAvailability();
  const { mutate: updateRoomSelection } = useUpdateRoomSelection();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeRoomCategory, setActiveRoomCategory] = useState<RoomCategory | null>(null);
  const navigate = useNavigate();

  if (state.status === 'uninitialized') {
    return;
  }

  const openDialog = (room: RoomCategory, index: number) => {
    setActiveRoomCategory(room);
    setActiveIndex(index);
    setIsDialogOpen(true);
  };

  const onSaveRoom = (extras: ExtrasFormValues) => {
    if (activeRoomCategory !== null && activeIndex !== null && data) {
      console.log("ExtrasFormValues: ", extras);
      updateRoomSelection({
        roomIndex: activeIndex,
        room: activeRoomCategory,
        selectedExtras: extras
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
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 items-start">
              {data.map((room) =>
                <RoomCard
                  key={`${room.id}`}
                  room={room}
                  isSelected={state.roomHoldings[requestedRoomIndex]?.id === room.id}
                  onButtonClick={() => openDialog(room, requestedRoomIndex)}
                />
              )}
              <Button className="mt-4 col-span-1 sm:col-span-2 xl:col-span-3 w-fit justify-self-end" onClick={() => navigate('/new-booking/guests')}>
                {t('public.Buttons.ToGuestForm')}
              </Button>
            </div>
            </SidebarPageContentSpacing>
          </TabsContent>
        ))}
      </Tabs>
        {data && activeRoomCategory && activeIndex !== null && (
          <RoomExtrasDialog
            isOpen={isDialogOpen}
            roomCategory={activeRoomCategory}
            existing={state.roomHoldings[activeIndex]?.id === activeRoomCategory.id
              ? state.roomHoldings[activeIndex]?.extrasFormValues
              : undefined
            }
            isSelected={state.roomHoldings[activeIndex]?.id === activeRoomCategory.id}
            onClose={() => setIsDialogOpen(false)}
            onSubmit={onSaveRoom}
          />
        )}
    </Page>
  )
}