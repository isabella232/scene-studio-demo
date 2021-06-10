import React from "react";

interface Props {
  children?: React.ReactNode;
}

export function Header({ children }: Props): JSX.Element {
  return (
    <div className="flex-center h-full w-full px-4 bg-neutral-100 shadow-sm	 z-overlay relative border-b border-neutral-400">
      <div className="flex-center w-full">{children}</div>
    </div>
  );
}
