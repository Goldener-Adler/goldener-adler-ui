import type {SelectedExtraSnapshot} from "@/assets/types";

export const isExtraSelected = (extra: SelectedExtraSnapshot) => {
  return (typeof extra.value === "boolean" && extra.value === true) || (typeof extra.value === "string" && extra.value !== "default") || (typeof extra.value === "number" && extra.value > 0);
}