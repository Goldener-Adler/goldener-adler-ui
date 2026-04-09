import type {ColumnDef} from "@tanstack/react-table"
import type {Booking} from "@/assets/types.ts";

export type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

export const bookingColumns: ColumnDef<Booking>[] = [
  {
    id: "name",
    header: "Name",
    accessorFn: (row) => `${row.lastName}, ${row.firstName}`,
  },
  {
    accessorKey: "from",
    header: "Check-In",
    cell: ({getValue}) => {
      return getValue<Date>().toLocaleDateString();
    },
  },
  {
    accessorKey: "to",
    header: "Check-Out",
    cell: ({getValue}) => {
      return getValue<Date>().toLocaleDateString();
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
]