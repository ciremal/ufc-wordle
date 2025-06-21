import { ReactNode } from "react";

type InfoSectionProps = {
  children: ReactNode;
  title: string;
  expand: boolean;
};

const InfoSection = ({ title, expand, children }: InfoSectionProps) => {
  return (
    <div
      className={`transition-all duration-500 border px-10 md:w-[50%] overflow-hidden ${
        !expand ? "max-h-0 py-0 border-0" : "max-h-full py-5 border"
      } `}
    >
      <div className="flex flex-col gap-4">
        <div className="text-3xl text-center font-semibold">{title}</div>
        <div className="border border-black w-full"></div>
        {children}
      </div>
    </div>
  );
};

export default InfoSection;
