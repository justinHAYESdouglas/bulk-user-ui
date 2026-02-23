import MuiModal from '@mui/material/Modal';
import { Box, Button, Typography } from '@mui/material';

interface ModalProps {
  open: boolean;
  handleClose: () => void;
  modalIcon?: React.ReactNode;
  title?: string;
  children?: React.ReactNode;
  confirmLabel?: string;
  onConfirm: () => void;
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function Modal({ open, handleClose, onConfirm , modalIcon, title, children, confirmLabel }: ModalProps) {
  return (
    <MuiModal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Box className="modal-title-wrapper">
          {modalIcon}
         <Typography variant="h6">{title}</Typography>
        </Box>
        <Box className="modal-content-wrapper">
          {children}
        </Box>
        <Box className="modal-btn-wrapper">
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={onConfirm}>{confirmLabel}</Button>
        </Box>
      </Box>
    </MuiModal>
  );
}
