import MuiModal from '@mui/material/Modal';
import { Box } from '@mui/material';

interface ModalProps {
  open: boolean;
  handleClose: () => void;
  title?: string;
  children?: React.ReactNode;
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

export default function Modal({ open, handleClose, title, children }: ModalProps) {
  return (
    <MuiModal open={open} onClose={handleClose}>
      <Box sx={style}>
        {title && <h2>{title}</h2>}
        {children}
      </Box>
    </MuiModal>
  );
}
