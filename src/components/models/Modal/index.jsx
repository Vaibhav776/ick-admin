import React, { useState } from "react";
import { Modal, Button } from "antd";

const ModalForInfo = ({ visible, setvisible, data }) => {
  const handleOk = () => {
    setvisible(false);
  };

  const handleCancel = () => {
    setvisible(false);
  };
//   console.log(data["BrandName"], "hey data");

  return (
    <>
      <Modal
        title="Basic Info"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <img src={data?.BrandLogo} alt="hey" className="logos" />
        <p>
          {data["BodyType"]
            ? `Body Type :- ${data?.BodyType}`
            : `Brand Name :- ${data?.BrandName}`}
        </p>
        <p>Description :- {data?.Description}</p>
        <p>Is Active :- {`${data?.isActive}`}</p>
        <p>Is Deleted :- {`${data?.isDeleted}`}</p>
      </Modal>
    </>
  );
};

export default ModalForInfo;
