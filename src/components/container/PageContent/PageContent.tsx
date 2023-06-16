import React from "react";

type Props = {
  children: JSX.Element | JSX.Element[];
};

export const PageContent: React.FC<Props> = (props) => {
  return (
    <div className="mx-6 p-4 bg-white h-full rounded-t-lg">
      {props.children}
    </div>
  );
};
