import { Tag } from "antd";
import type { Role } from "../../../api";
import React from "react";

export interface Props {
  role: Role;
  className?: string;
}

const RoleTag: React.FC<Props> = ({ role, className }) => {
  if (role === "ADMIN") {
    return (
      <Tag className={className} color="blue">
        Administrador
      </Tag>
    );
  } else if (role === "OPERATOR") {
    return (
      <Tag className={className} color="cyan">
        Operador
      </Tag>
    );
  } else {
    return (
      <Tag className={className} color="gray">
        No Identificado
      </Tag>
    );
  }
};

export default RoleTag;
