import React from "react";
import { currencyFormatter, unitFormatter } from "../../../utils/formatters";
import { Unit } from "../../../api";

export interface Props {
  value: string | number | undefined;
  format?: "currency" | "unit";
  unit?: Unit;
  position?: "left" | "right";
}

const NumberText: React.FC<Props> = ({ value, format, unit, position }) => {
  if (format == "currency") {
    return (
      <span className="numbers">{currencyFormatter(value, position)}</span>
    );
  }
  if (format == "unit") {
    return (
      <span className="numbers whitespace-pre">
        {unitFormatter(Number(value), unit, position)}
      </span>
    );
  }
  return <span className="numbers">{value}</span>;
};

export default NumberText;
