import { useState } from 'react';
import { Button, Box } from '@mui/material';
import Modal from '../Components/Modal';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
export default function Add() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const updateUser = () =>{
    console.log("hi")
    handleClose();
  } 

  return (
    <>
      <Button onClick={handleOpen} startIcon={<PersonAddIcon />}>Add User</Button>
      <Modal 
      open={open} 
      handleClose={handleClose} 
      onConfirm={updateUser}
      modalIcon= {<PersonAddIcon />}
      title="Add User"
      confirmLabel='Add'>
        <p>Form goes here</p>
      </Modal>
    </>
  );
}
