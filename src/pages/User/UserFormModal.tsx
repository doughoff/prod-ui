import { Modal } from "antd";
import React from "react";
import { CreateUserForm } from "./CreateUserForm";

interface UserFormModalProps {
  isModalOpen: boolean;
  handleOk: () => void;
  handleCancel: () => void;
}
const CreateUserFormModal: React.FC<UserFormModalProps> = ({
  isModalOpen,
  handleOk,
  handleCancel,
}) => {
  return (
    <Modal
      okText="Crear"
      title="Basic Modal"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      width="39rem"
    >
      <CreateUserForm />
    </Modal>
  );
};
export default CreateUserFormModal;
