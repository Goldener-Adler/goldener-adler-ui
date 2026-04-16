import {type FunctionComponent, useEffect, useState} from "react";
import {Outlet, useNavigate} from "react-router";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar.tsx";
import { Separator } from "@/components/ui/separator";
import {BookingSidebar} from "@/components/public/BookingSidebar";
import {Footer} from "@/components/public/Footer";
import {LanguageSelect} from "@/components/public/LanguageSelect";
import {MenuDrawer} from "@/components/public/MenuDrawer";
import {MENU_ITEMS} from "@/assets/consts";
import {Button} from "@/components/ui/button";
import {useTranslation} from "react-i18next";
import {BookingBreadcrumbSteps} from "@/components/public/BookingBreadcrumbSteps";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {useIsMobile} from "@/hooks/use-mobile";

export const BookingLayout: FunctionComponent = () => {
  const navigate = useNavigate();
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile) return;

    setShowTooltip(true);

    const timeout = setTimeout(() => {
      setShowTooltip(false);
    }, 5000);

    return () => clearTimeout(timeout);
  }, [isMobile]);

  return (
    <SidebarProvider side="right">
      <BookingSidebar/>
      <SidebarInset>
        <div className="min-h-dvh">
          <header className="h-16 sticky top-0 z-50 flex justify-between items-center gap-3 pl-2 bg-background border-b-[1px] border-sidebar-border">
            <menu className="flex gap-3 items-center">
              <li className="lg:hidden block">
                <MenuDrawer items={MENU_ITEMS} isTransparent={false} />
              </li>
              {MENU_ITEMS.map((menuItem, index) => (
                <li key={index} className="hidden lg:block">
                  <Button onClick={() => navigate(menuItem.path)} size="sm" className="text-md" variant="link">{t(menuItem.label)}</Button>
                </li>
              ))}
            </menu>
            <div className="flex items-center gap-2 px-4">
              <LanguageSelect />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Tooltip open={showTooltip}>
                <TooltipTrigger asChild onClick={() => setShowTooltip(false)}>
                  <SidebarTrigger className="-ml-1" />
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Buchungsübersicht</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </header>
          <BookingBreadcrumbSteps />
          <Outlet />
        </div>
        <div className="mx-4">
          <Separator/>
          <Footer className="text-black bg-background"/>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
