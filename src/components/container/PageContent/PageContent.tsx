import React from "react";

type Props = {
  children: JSX.Element | JSX.Element[];
  className?: string;
  style?: React.CSSProperties;
};

export const PageContent: React.FC<Props> = (props) => {
  const { children, className, style } = props;

  return (
    <div
      className={`mx-6 p-4 bg-white flex-grow rounded-t-lg ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};
