import React from "react";

type Props = {
  children: JSX.Element | JSX.Element[];
};

export const PageDetails: React.FC<Props> = (props) => {
  return <div className="bg-white mx-6 rounded-lg">{props.children}</div>;
};
