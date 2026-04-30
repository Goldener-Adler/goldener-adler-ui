import {Badge} from "@/components/ui/badge";
import type {NewAmenity} from "@/assets/types";
import {useLocalizedValue} from "@/hooks/useLocalizedValue";
import {ICON_MAP} from "@/assets/consts";

export function AmenityBadge({ amenity }: { amenity: NewAmenity }) {
  const localize = useLocalizedValue();
  const Icon = ICON_MAP[amenity.icon];
  return (
    <Badge variant={amenity.highlight ? "default" : "secondary"}>
      <Icon />
      {localize(amenity.label)}
    </Badge>
  );
}