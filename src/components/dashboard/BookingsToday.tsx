import {type FunctionComponent} from "react";
import {type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent} from "@/components/ui/chart.tsx";
import {Pie, PieChart} from "recharts";
import { Card, CardDescription, CardTitle, CardHeader, CardContent } from "../ui/card";
import {useGetOccupancy} from "@/hooks/useGetOccupancy.ts";

const chartConfig = {
  rate: {
    label: "Rate in %",
  },
  occupied: {
    label: "Belegt",
    color: "var(--chart-1)",
  },
  available: {
    label: "Frei",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig


export const BookingsToday: FunctionComponent = () => {
  const {occupancy} = useGetOccupancy();

  const chartData = [
    { status: "available", rate: occupancy.free, fill: "var(--color-available)" },
    { status: "occupied", rate: occupancy.occupied, fill: "var(--color-occupied)" },
  ]

  return (
    <Card className="flex flex-col gap-0">
      <CardHeader className="items-center pb-0">
        <CardTitle>Belegung Heute</CardTitle>
        <CardDescription>{new Date().toLocaleDateString()}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="rate"
              nameKey="status"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
