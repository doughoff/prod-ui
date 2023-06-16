import React from "react";
import { Tag } from "antd";
import { Units } from "../../../api";

export interface Props {
  unit: Units;
  className?: string;
}

const UnitTag: React.FC<Props> = ({ unit, className }) => {
  if (unit === "UNITS") {
    return (
      <Tag className={className} color="default">
        <strong>UNIDAD</strong>
      </Tag>
    );
  } else if (unit === "KG") {
    return (
      <Tag className={className} color="default">
        <strong>KG</strong>
      </Tag>
    );
  } else if (unit === "L") {
    return (
      <Tag className={className} color="default">
        <strong>L</strong>
      </Tag>
    );
  } else if (unit === "OTHER") {
    return (
      <Tag className={className} color="default">
        <strong>OTRO</strong>
      </Tag>
    );
  } else {
    return (
      <Tag className={className} color="default">
        No Identificado
      </Tag>
    );
  }
};

export default UnitTag;
