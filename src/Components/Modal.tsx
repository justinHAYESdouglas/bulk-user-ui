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
  top: '25%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 407,
  bgcolor: 'var(--bg-color-darker)',
  boxShadow: 24,
  p: 2,
  gap: 8,
};

export default function Modal({ open, handleClose, onConfirm , modalIcon, title, children, confirmLabel }: ModalProps) {
  return (
    <MuiModal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Box className="modal-title-wrapper"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}>
          {modalIcon}
         <Typography variant="h6">{title}</Typography>
        </Box>
        <Box className="modal-content-wrapper">
          {children}
        </Box>
        <Box className="modal-btn-wrapper"
          sx={{
            display: 'flex',
            width: '95%',
            m: 'auto',
            justifyContent: 'space-between',

            '& button' :{
              width: '138px',
              height: '37px',
              fontSize: '18px !important',
              fontWeight: 'unset !important',
              borderRadius: '24px',
              opacity: '0.5',

            }
          }}>
          <Button onClick={handleClose}
            sx={{
              background: 'none !important',
              outline: '0px !important',
              color: 'var',

              '&:hover' :{
                background: 'none !important',
              }
            }}>
            Cancel
            </Button>
          <Button onClick={onConfirm}
          sx={{
            '&:hover' :{
              opacity: '1',
            }
          }}>{confirmLabel}</Button>
        </Box>
      </Box>
    </MuiModal>
  );
}
