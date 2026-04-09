import {type FunctionComponent, useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router";

export const RoomCarousel: FunctionComponent = () => {
  const {t} = useTranslation();
  const navigate = useNavigate();
  
  const [activeType, setActiveType] = useState<'rooms' | 'apartment'>("rooms");
  
  const handleTypeSelect = (type: typeof activeType) => {
    setActiveType(prevState => prevState !== type ? type : prevState);
  }
  
  return (
    <div style={{height: 'calc(100dvh - 50px)'}} className={`relative w-full`}>
      <div className="w-full h-full relative">
        <img
          className={`absolute w-full h-full transition-opacity object-cover ${activeType === 'rooms' ? 'z-0 opacity-100' : '-z-10 opacity-0'}`}
          src="https://www.gasthof-goldener-adler.de/images/adler/zimmer.jpg" alt="rooms"/>
        <img
          className={`absolute w-full h-full transition-opacity object-cover ${activeType === 'apartment' ? 'z-0 opacity-100' : '-z-10 opacity-0'}`}
          src="https://www.gasthof-goldener-adler.de/images/pension/ferienwohnung_06.JPG" alt="apartment"/>
      </div>
      <div className="absolute top-0 w-full h-full bg-gray-800 opacity-20"></div>
      <div className="absolute top-0 w-full h-full p-5 flex flex-col gap-4 justify-center items-center">
        <h2 className="text-4xl text-white font-semibold">
          {t('public.Home.Headings.Rooms')}
        </h2>
        <p className="max-w-lg text-center text-white">
          {t('public.Home.Information.Rooms')}
        </p>
        <Button onClick={() => navigate('/rooms')} variant="outline" className="text-white">
          {t('public.Buttons.More')}
        </Button>
      </div>
      <div className="absolute bottom-3 w-full flex justify-center h-9">
        <div className="w-40 flex justify-end">
          <Button onClick={() => handleTypeSelect('rooms')} onMouseEnter={() => handleTypeSelect('rooms')} className="text-white" variant="link">{t('public.General.Rooms')}</Button>
        </div>
        <Separator orientation="vertical"/>
        <div className="w-40 flex justify-start">
          <Button onClick={() => handleTypeSelect('apartment')} onMouseEnter={() => handleTypeSelect('apartment')} className="text-white" variant="link">{t('public.General.Apartment')}</Button>
        </div>
      </div>
    </div>
  )
}
