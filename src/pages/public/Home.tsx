import {type FunctionComponent} from "react";
import {Content} from "@/layouts/Content.tsx";
import {Hero} from "@/components/public/Hero.tsx";
import { PiAt, PiMapPin, PiPhone, PiCar, PiForkKnife, PiHandshake } from 'react-icons/pi';
import {Separator} from "@/components/ui/separator.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Trans, useTranslation} from "react-i18next";
import {useNavigate} from "react-router";
import {Page} from "@/layouts/Page.tsx";
import TownLg from "/images/town-lg.jpg?url";
import TownXs from "/images/town-xs.jpg?url";
import DoorsLg from "/images/doors-lg.jpg?url";
import {RoomCarousel} from "@/components/public/RoomCarousel.tsx";
import {METADATA} from "@/assets/consts.ts";

export const Home: FunctionComponent = () => {
  const {t} = useTranslation();
  const navigate = useNavigate();
  
  return (
    <Page>
      <Hero arrow scrollTargetId="welcome" image={TownLg} imageSmall={TownXs}>
        <h1 className="text-6xl font-bold text-white">
          {t('public.Home.Hero.Title')}
        </h1>
      </Hero>
      <Content id="welcome" className="mt-6 py-6 md:py-12">
        <div className="flex flex-col lg:flex-row items-center lg:h-64 lg:space-x-10 space-y-6 lg:space-y-0">
          <div>
            <h2 className="text-4xl pb-5 font-semibold">
              {t('public.Home.Headings.Welcome')}
            </h2>
            <p className="pb-3 max-w-lg lg:max-w-none">
              {t('public.Home.Information.About')}
            </p>
          </div>
          <Separator className="hidden lg:block" orientation="vertical" />
          <Separator className="block lg:hidden" orientation="horizontal" />
          <div className="justify-self-center flex-none">
            <ul>
              <li className="flex my-3 gap-2 items-center"><PiPhone size={24}/><a className="hover:underline" href={`tel:${METADATA.OWNER_PHONE}`}>{METADATA.OWNER_PHONE_DISPLAY}</a></li>
              <li className="flex my-3 gap-2 items-center"><PiAt size={24} /><a className="hover:underline" href={`mailto:${METADATA.OWNER_MAIL}`}>{METADATA.OWNER_MAIL}</a></li>
              <li className="flex my-3 gap-2 items-center"><PiMapPin size={24} /><a className="hover:underline" target="_blank" href="https://maps.app.goo.gl/YFw9wBuvBfhBQnni7">
                {t('public.Home.Information.Location')}
              </a></li>
            </ul>
          </div>
        </div>
      </Content>
      <Content className="py-6 md:py-12">
        <RoomCarousel />
      </Content>
      <Content maxWidth="max-w-2xl" className="py-12">
        <h2 className="text-4xl font-semibold pb-5">
          {t('public.Home.Headings.Service')}
        </h2>
        <div className="pl-3 flex space-x-12 md:flex-row justify-items-center items-center">
          <div className="relative h-72 sm:h-52">
            <Separator orientation="vertical" />
            <div className="border-white border-4 absolute top-1/3 -translate-x-1/2 w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <PiHandshake size={24}/>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-3xl font-semibold pb-3">{t('public.Home.Headings.GuestService')}</h3>
            <p>{t('public.Home.Information.GuestService')}</p>
          </div>
        </div>
        <div className="pl-3 flex space-x-12 md:flex-row justify-items-center items-center">
          <div className="relative h-72 sm:h-52">
            <Separator orientation="vertical" />
            <div className="absolute top-1/3 -translate-x-1/2 border-white border-4 w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <PiForkKnife size={24}/>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-3xl font-semibold pb-3">{t('public.Home.Headings.Pension')}</h3>
            <p>{t('public.Home.Information.Pension')}</p>
          </div>
        </div>
        <div className="pl-3 flex space-x-12 md:flex-row justify-items-center items-center">
          <div className="relative h-72 sm:h-52">
            <Separator orientation="vertical" />
            <div className="absolute top-1/3 -translate-x-1/2 border-white border-4 w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <PiCar size={24}/>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-3xl font-semibold pb-3">{t('public.Home.Headings.Parking')}</h3>
            <p>{t('public.Home.Information.Parking')}</p>
          </div>
        </div>
      </Content>
      <Content className="pb-6 sm:pb-12">
        <div className="text-center flex flex-col gap-3 items-center">
          <h3 className="text-2xl font-semibold">{t('public.General.BookingCTA')}</h3>
          <Button onClick={() => navigate('/booking')} className="w-fit text-md">{t('public.Buttons.BookNow')}</Button>
        </div>
      </Content>
      <Content className="py-6 md:py-12 bg-orange-50">
        <div className="flex flex-col md:flex-row items-center md:space-x-10 space-y-6 md:space-y-0">
          <div className="relative justify-self-center flex-1 w-full">
            <img className="w-full max-h-96 object-cover" src={DoorsLg} alt="Torgelow Früher" />
          </div>
          <div className="md:h-96">
            <Separator className="hidden md:block" orientation="vertical" />
          </div>
          <div className="flex-1">
            <h2 className="text-4xl pb-5 font-semibold">{t('public.Home.Headings.History')}</h2>
            <Trans className="max-w-lg md:max-w-none" i18nKey='public.Home.Information.History'></Trans>
          </div>
        </div>
      </Content>
    </Page>
  )
}
