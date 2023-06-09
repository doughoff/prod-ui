import React from "react";

interface Props {
  title: string;
  description: string;
  inputs: JSX.Element;
}

const FormItemGroup: React.FunctionComponent<Props> = ({
  title,
  description,
  inputs,
}) => {
  return (
    <div className="flex ">
      <div className="flex flex-col flex-1">
        <span className="text-sm">
          <strong>{title}</strong>
        </span>
        <span className="text-sm text-gray-600">{description}</span>
      </div>
      <div className="flex-1">{inputs}</div>
    </div>
  );
};

export default FormItemGroup;
