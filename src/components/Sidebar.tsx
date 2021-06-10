import React from "react";

interface Props {
  children: React.ReactNode;
}

export function Sidebar({ children }: Props): JSX.Element {
  return (
    <div className="flex flex-col items-center h-full w-full relative border-neutral-300 border-r border-l py-2">
      {children}
    </div>
  );
}
