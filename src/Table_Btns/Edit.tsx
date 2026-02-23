import { useState } from 'react';
import { Button, Box } from '@mui/material';
import Modal from '../Components/Modal';
import EditSquareIcon from '@mui/icons-material/EditSquare';

export default function Edit() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const updateUser = () =>{
    console.log("hi")
    handleClose();
  } 

  return (
    <>
      <Button 
      startIcon={<EditSquareIcon />}
      onClick={handleOpen}>
        Edit
      </Button>
      <Modal 
      open={open} 
      handleClose={handleClose} 
      onConfirm={updateUser}
      modalIcon= {<EditSquareIcon />}
      title="Edit User"
      confirmLabel='Update'>
        <p>Form goes here</p>
      </Modal>
    </>
  );
}
