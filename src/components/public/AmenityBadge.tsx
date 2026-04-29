import {useTranslation} from "react-i18next";
import {Badge} from "@/components/ui/badge";
import {AMENITIES} from "@/assets/consts";
import type {AmenityKey} from "@/assets/types";

export function AmenityBadge({ amenityKey }: { amenityKey: AmenityKey }) {
  const { t } = useTranslation();
  const { icon: Icon, label, variant } = AMENITIES[amenityKey];
  return (
    <Badge variant={variant}>
      <Icon />
      {t(label)}
    </Badge>
  );
}