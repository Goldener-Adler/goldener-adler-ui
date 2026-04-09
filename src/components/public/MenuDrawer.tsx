import {type FunctionComponent, useState} from "react";
import type { MenuItem } from "@/assets/types.ts";
import {LuMenu, LuX} from "react-icons/lu";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
} from "@/components/ui/drawer.tsx";
import {Link, useLocation} from "react-router";
import {DialogTitle} from "@radix-ui/react-dialog";

interface MenuSidebarProps {
  items: MenuItem[],
  isTransparent: boolean,
}

export const MenuDrawer: FunctionComponent<MenuSidebarProps> = ({items, isTransparent}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const location = useLocation();
  
  return (
    <>
      <LuMenu
        size={36}
        className={`ml-2 text-md ${isTransparent ? "text-background" : ""}`}
        onClick={() => setIsOpen(true)}
      />
      <Drawer open={isOpen} direction="left" onClose={() => setIsOpen(false)}>
        <DrawerContent className="!max-w-xs">
          <DialogTitle className="sr-only">Menu</DialogTitle>
          <DrawerHeader>
            <DrawerDescription>
              <DrawerClose>
                <LuX className="text-black" size={40}/>
              </DrawerClose>
            </DrawerDescription>
          </DrawerHeader>
          <section className="p-2 w-full flex flex-col">
            {items.map((item, index) => (
              <Link
                className={`text-lg py-2 px-4 rounded-sm hover:bg-gray-100 ${location.pathname.endsWith(item.path) ? 'bg-gray-100' : 'bg-inherit'}`}
                key={index}
                onClick={() => setIsOpen(false)}
                to={item.path}>{item.label}
              </Link>
            ))}
          </section>
        </DrawerContent>
      </Drawer>
    </>
  )
}
