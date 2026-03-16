import MuiModal from '@mui/material/Modal';
import { Box, Button, Collapse, Typography } from '@mui/material';
import { useState } from 'react';

interface ModalProps {
  open: boolean;
  handleClose: () => void;
  modalIcon?: React.ReactNode;
  title?: string;
  children?: React.ReactNode;
  confirmLabel?: string;
  onConfirm: () => void;
  onReset?: () => void;
  validate?: () => string[];
}

const style = {
  position: 'absolute',
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 407,
  bgcolor: 'var(--bg-color-darker)',
  boxShadow: 24,
  p: 2,
  gap: 8,
  borderRadius: '8px',
};

export default function Modal({ open, handleClose, onConfirm, onReset, validate, modalIcon, title, children, confirmLabel }: ModalProps) {
  const [errors, setErrors] = useState<string[]>([]);
  const handleCancel = () => { setErrors([]); handleClose(); onReset?.(); };
  const handleConfirm = () => {
    if (validate) {
      const errs = validate();
      if (errs.length > 0) { setErrors(errs); return; }
    }
    setErrors([]);
    onConfirm();
    onReset?.();
  };
  return (
    <MuiModal open={open} onClose={handleCancel}>
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
        <Box className="modal-content-wrapper"
         sx={{
            display: 'flex',
            flexDirection:'column',
            gap: 4,
            pt: 1,
            pb: 4,
         }}>
          
          {children}
          <Collapse in={errors.length > 0} timeout={250}>
            <Box sx={{ color: 'var(--error-text-color)', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {errors.map((err, i) => <Typography key={i} variant="body2">{err}</Typography>)}
            </Box>
          </Collapse>
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
          <Button onClick={handleCancel}
            sx={{
              background: 'none !important',
              outline: '0px !important',
              '&:hover' :{
                background: 'none !important',
                opacity: '1',
                transition: '.3s ease'
              }
            }}>
            Cancel
            </Button>
          <Button onClick={handleConfirm}
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
