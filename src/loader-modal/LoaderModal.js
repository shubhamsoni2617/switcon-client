import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import "./style.css";

const modal = document.getElementById("modal");

const Modal = ({ isLoading, children }) => {
  const el = document.createElement("div");
  useEffect(() => {
    modal.appendChild(el);
    return () => modal.removeChild(el);
  }, [el]);
  return isLoading
    ? createPortal(<div className="modal">{children}</div>, el)
    : null;
};

const LoaderModal = ({ isLoading }) => {
  return (
    <Modal isLoading={isLoading}>
      <img src={`${process.env.PUBLIC_URL}/loading.svg`} alt="loader" />
    </Modal>
  );
};

export default LoaderModal;
