import type {FunctionComponent} from "react";
import {Hero} from "@/components/public/Hero.tsx";
import { Content } from "@/layouts/Content.tsx";
import { LuBedSingle, LuBedDouble, LuCookingPot } from 'react-icons/lu';
import {Badge} from "@/components/ui/badge.tsx";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useNavigate} from "react-router";
import {useTranslation} from "react-i18next";
import {Page} from "@/layouts/Page.tsx";

import BikeLg from "/images/bike-lg.jpg?url";
import BikeXs from "/images/bike-xs.jpg?url";
import {AMENITIES} from "@/mocks/mockData";

export const Rooms: FunctionComponent = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  return (
    <Page title={t('public.Rooms.Title')}>
      <Hero arrow scrollTargetId="rooms" image={BikeLg} imageSmall={BikeXs}>
        <h1 className="text-4xl text-center sm:text-6xl text-white font-semibold">{t('public.Rooms.Hero.Title')}</h1>
      </Hero>
      <Content className="pt-12 pb-6">
        <div className="flex flex-col items-center sm:flex-row gap-8 sm:gap-4 w-full justify-evenly">
          <div className="flex flex-col gap-2 items-center w-16">
            <div className="bg-gray-200 rounded-full w-12 h-12 flex items-center justify-center">
              <LuBedSingle size={28} />
            </div>
            <h3 className="text-xl font-medium whitespace-nowrap">3 {t('public.Rooms.General.SingleBedroom', {count: 3})}</h3>
          </div>
          <div className="flex flex-col gap-2 items-center w-16">
            <div className="bg-gray-200 rounded-full w-12 h-12 flex items-center justify-center">
              <LuBedDouble size={28} />
            </div>
            <h3 className="text-xl font-medium whitespace-nowrap">7 {t('public.Rooms.General.DoubleBedroom', {count: 7})}</h3>
          </div>
          <div className="flex flex-col gap-2 items-center w-16">
            <div className="bg-gray-200 rounded-full w-12 h-12 flex items-center justify-center">
              <LuCookingPot size={28} />
            </div>
            <h3 className="text-xl font-medium whitespace-nowrap">1 {t('public.General.Apartment')}</h3>
          </div>
        </div>
      </Content>
      <Content id="rooms" className="py-12">
        <section className="flex flex-col-reverse lg:flex-row gap-8 full-w items-center">
          <div className="col-span-2 max-w-xl">
            <h2 className="text-4xl font-semibold pb-5">{t('public.Rooms.Headings.SingleAndDouble')}</h2>
            <div>
              {t('public.Rooms.Information.SingleAndDouble')}
            </div>
            <h3 className="mt-4 text-md font-semibold">{t('public.Rooms.Headings.Amenities')}</h3>
            <div className="flex gap-2 mt-2 flex-wrap">
              {AMENITIES.filter(amenity => amenity.id !== "kitchen").map((amenity) => (
                <Badge key={amenity.id} variant={amenity.variant}>
                  <amenity.icon />
                  {t(amenity.label)}
                </Badge>
              ))}
            </div>
          </div>
          <img className="flex-1 min-w-0 w-full max-w-[100dvw] sm:max-w-xl" src="https://www.gasthof-goldener-adler.de/images/adler/zimmer.jpg" alt="" />
        </section>
      </Content>
      <Content className="pt-6 pb-12">
        <section className="flex flex-col lg:flex-row gap-8 full-w items-center lg:text-right">
          <img className="flex-1 min-w-0 w-full max-w-[100dvw] sm:max-w-xl" src="https://www.gasthof-goldener-adler.de/images/pension/ferienwohnung_06.JPG" alt="" />
          <div className="col-span-2 max-w-xl">
            <h2 className="text-4xl font-semibold pb-5">{t('public.Rooms.Headings.Apartment')}</h2>
            <div>
              {t('public.Rooms.Information.Apartment')}
            </div>
            <h3 className="mt-4 text-md font-semibold">{t('public.Rooms.Headings.Amenities')}</h3>
            <div className="flex gap-2 mt-2 flex-wrap lg:justify-end">
              {AMENITIES.map((amenity) => (
                <Badge key={amenity.id} variant={amenity.variant}>
                  <amenity.icon />
                  {t(amenity.label)}
                </Badge>
              ))}
            </div>
          </div>
        </section>
      </Content>
      <Content className="pt-6 pb-12">
        <div className="m-auto flex flex-col max-w-xl">
        <h2 className="text-4xl font-semibold pb-5">{t('public.Rooms.Headings.PriceOverview')}</h2>
        <Table>
          <TableCaption>{t('public.Rooms.Information.MinRentApartment')}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>{t('public.General.Rooms')}</TableHead>
              <TableHead className="w-fit text-center">{t('public.Rooms.Labels.People')}</TableHead>
              <TableHead className="text-right w-28">{t('public.Rooms.Labels.Price')} <small>{t('public.Rooms.Labels.PerNight')}</small></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">{t('public.Rooms.General.SingleBedroom_one')}</TableCell>
              <TableCell className="text-center">1</TableCell>
              <TableCell className="text-right">45€</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">{t('public.Rooms.General.DoubleBedroom_one')}</TableCell>
              <TableCell className="text-center">2</TableCell>
              <TableCell className="text-right">60€</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium"><div>{t('public.Rooms.General.DoubleBedroom_one')}</div><small>+ {t('public.Rooms.Labels.AdditionalBed')}</small></TableCell>
              <TableCell className="text-center">3</TableCell>
              <TableCell className="text-right">70€</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">{t('public.General.Apartment')}</TableCell>
              <TableCell className="text-center">3</TableCell>
              <TableCell className="text-right">60€</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium"><small>+ {t('public.Rooms.Labels.Breakfast')}</small></TableCell>
              <TableCell className="text-center"></TableCell>
              <TableCell className="text-right">+ 8€ p.P.</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        </div>
      </Content>
      <Content className="pb-12">
        <div className="text-center flex flex-col gap-3 items-center">
          <h3 className="text-2xl font-semibold">{t('public.General.BookingCTA')}</h3>
          <Button onClick={() => navigate("/booking")} className="w-fit text-md">{t('public.Buttons.BookNow')}</Button>
        </div>
      </Content>
    </Page>
  )
}
