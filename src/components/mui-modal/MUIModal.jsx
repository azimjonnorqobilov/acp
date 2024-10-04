import { Modal } from "@mui/material";

function MUIModal({ children, ...args }) {
  return (
    <Modal {...args} className="flex justify-center items-center outline-none border-none">
      <>{children}</>
    </Modal>
  );
}

export default MUIModal;
