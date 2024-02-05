import React, { useState } from "react";
import Modal from "react-modal";

const customStyles = {
  content: {
    with: "100vw",
    heigth: "100vh",
    top: "50%",
    left: "53%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const LayoutModal = ({ children, button: IconButton, icon }) => {
  const [isOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div className={"w-1/2"}>
      <IconButton icon={icon} onClick={openModal} />
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        {children}
      </Modal>
    </div>
  );
};

export default LayoutModal;
