import type {FunctionComponent} from "react";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";
import {Separator} from "@/components/ui/separator";
import {Skeleton} from "@/components/ui/skeleton";

export const RoomCardSkeleton: FunctionComponent = () => {
  return (
    <Card className={`relative p-0 gap-0`}>
      <div className="absolute rounded-t-xl inset-0 z-30 aspect-video bg-black/35" />
      <Skeleton
        className="rounded-t-xl relative z-20 aspect-video w-full object-cover"
      />
      <CardHeader className="px-4 pt-4">
        <Skeleton className="h-5 w-2/3" />
      </CardHeader>
      <CardContent className="flex-1 px-4 pb-4 pt-0">
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
      <Separator/>
      <CardFooter className="p-4 flex-row gap-2 justify-between">
        <Skeleton className="w-28 h-10" />
        <Skeleton className="w-18 h-12"/>
      </CardFooter>
    </Card>
  )
}