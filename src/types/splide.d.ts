declare module "@splidejs/react-splide" {
  import { ReactNode } from "react";
  import { Options } from "@splidejs/splide";

  export interface SplideInstance {
    splide?: {
      go(control: string | number): void;
      destroy(): void;
      mount(): void;
    };
  }

  export interface SplideProps {
    options?: Options;
    children?: ReactNode;
    className?: string;
    "aria-label"?: string;
    ref?: React.Ref<SplideInstance>;
  }

  export interface SplideSlideProps {
    children?: ReactNode;
    className?: string;
  }

  export const Splide: React.ForwardRefExoticComponent<
    SplideProps & React.RefAttributes<SplideInstance>
  >;

  export const SplideSlide: React.FC<SplideSlideProps>;
}
