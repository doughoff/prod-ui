import React from "react";

type Props = {
  children: JSX.Element | JSX.Element[];
};

export const Card: React.FC<Props> = (props) => {
  return (
    <div className="bg-white mx-6 mb-6 px-6 pt-6 rounded-lg">
      {props.children}
    </div>
  );
};
