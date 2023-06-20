import React from "react";
import { Modal } from "antd";

const ModalForInfo = ({ visible, setvisible }) => {
  const handleModal = () => {
    setvisible(!visible);
  };

  return (
    <>
      <Modal
        cancelButtonProps={false}
        title="How to check ..."
        visible={visible}
        onOk={handleModal}
        onCancel={handleModal}
      >
        <p>
          null
        </p>
        <p>Description :- </p>
        <p>Is Active :- {`$`}</p>
        <p>Is Deleted :- {`$`}</p>
      </Modal>
    </>
  );
};

export default ModalForInfo;
