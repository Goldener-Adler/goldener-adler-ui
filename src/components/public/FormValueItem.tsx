import type {FunctionComponent} from "react";
import type {IconType} from "react-icons";

interface FormItemProps {
  label: string;
  value?: string;
  icon?: IconType;
  slot?: 'start' | 'end';
  className?: string;
}

export const FormValueItem: FunctionComponent<FormItemProps> = ({label, value, icon: Icon, slot, className}) => {
  return (
    <div className={`flex items-center gap-3 flex-nowrap ${className ? className : ''}`}>
      {Icon && slot === 'start' && (
        <Icon size="2rem" />
      )}
      <div>
        <div className="text-sm text-gray-600">{label}</div>
        <p className="font-semibold">{value || ""}</p>
      </div>
      {Icon && slot === 'end' && (
        <Icon />
      )}
    </div>
  )
}
