import {type FunctionComponent, type PropsWithChildren, useEffect, useRef, useState} from "react";
import { PiArrowDown } from 'react-icons/pi';

interface HeroProps extends PropsWithChildren {
  image: string,
  imageSmall?: string,
  height?: string,
  arrow?: boolean,
  scrollTargetId?: string,
}

export const Hero: FunctionComponent<HeroProps> = ({children, image, imageSmall, height, arrow, scrollTargetId}: HeroProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);
  
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setIsImageLoaded(true);
    }
  }, [image]);

  const handleScrollDownClick = () => {
    if (!scrollTargetId) return;
    const target = document.getElementById(scrollTargetId);
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }

  return (
    <div style={{height: height ?? '100vh'}} className="relative w-full">
      <div
        className="absolute inset-0 h-full w-full"
        style={{
          backgroundImage: imageSmall ? `url(${imageSmall})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <img
          ref={imgRef}
          src={image}
          alt="header image"
          className={`h-full w-full object-cover transition-opacity duration-700 ${isImageLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setIsImageLoaded(true)}
        />
      </div>
      <div id="overlay" className="absolute inset-0 h-full w-full bg-slate-800 opacity-40"></div>
      <div className="relative z-10 flex text-center p-5 items-center justify-center h-full">
        {children}
      </div>
      {arrow && <div className="absolute z-10 bottom-3 w-full flex justify-center">
        <button className="p-3 cursor-pointer animate-bounce" onClick={handleScrollDownClick}>
          <PiArrowDown className="text-white" size={40}/>
        </button>
      </div>}
    </div>
  )
}
