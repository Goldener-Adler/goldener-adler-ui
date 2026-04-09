import type {FunctionComponent, PropsWithChildren} from "react";

interface ContentProps extends PropsWithChildren {
  id?: string;
  maxWidth?: string;
  className?: string;
}

export const Content: FunctionComponent<ContentProps> = ({ children, id, maxWidth, className }) => {
  return (
    <section id={id} className={`${className ?? ""}`}>
      <div className={`${maxWidth ?? "max-w-6xl"} m-auto px-5`}>
        {children}
      </div>
    </section>
  )
}
