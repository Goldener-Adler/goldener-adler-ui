import type {FunctionComponent, PropsWithChildren} from "react";

interface DashboardSpacingProps extends PropsWithChildren {}

export const DashboardSpacing: FunctionComponent<DashboardSpacingProps> = ({children}) => {
  return <div className="p-4 pt-0">{children}</div>
}
