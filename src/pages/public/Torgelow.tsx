import type {FunctionComponent} from "react";
import {Hero} from "@/components/public/Hero.tsx";
import {Page} from "@/layouts/Page.tsx";
import SeaLg from "/images/sea-lg.jpg?url";
import SeaXs from "/images/sea-xs.jpg?url";

export const Torgelow: FunctionComponent = () => {
  return (
    <Page>
      <Hero arrow image={SeaLg} imageSmall={SeaXs}>
        <h1 className="text-white font-bold text-6xl">Entdecke Torgelow</h1>
      </Hero>
    </Page>
  )
}
