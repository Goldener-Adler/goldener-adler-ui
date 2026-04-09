import type {FunctionComponent} from "react";
import {BookingsToday} from "@/components/dashboard/BookingsToday.tsx";
import {BookingsWeek} from "@/components/dashboard/BookingsWeek.tsx";
import { Page } from "@/layouts/Page.tsx";

export const Dashboard: FunctionComponent = () => {
  return (
    <Page title="Dashboard">
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <BookingsToday />
          <BookingsWeek className="col-span-2"/>
          <div className="bg-muted/50 aspect-video rounded-xl" />
          <div className="bg-muted/50 aspect-video rounded-xl" />
          <div className="bg-muted/50 aspect-video rounded-xl" />
        </div>
        <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
      </div>
    </Page>
  )
}
