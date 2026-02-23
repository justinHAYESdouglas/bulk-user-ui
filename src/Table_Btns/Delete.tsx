import { useState } from 'react';
import { Button, Box } from '@mui/material';
import Modal from '../Components/Modal';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Delete() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const updateUser = () =>{
    console.log("hi")
    handleClose();
  } 

  return (
    <>
      <Button onClick={handleOpen}  startIcon={<DeleteIcon />}>Delete</Button>
      <Modal 
      open={open} 
      handleClose={handleClose} 
      onConfirm={updateUser}
      modalIcon= {<DeleteIcon />}
      title="Delete"
      confirmLabel='Delete'>

        <p>Form goes here</p>
      </Modal>
    </>
  );
}
