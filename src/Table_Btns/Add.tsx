import { useState } from 'react';
import { Button, Box } from '@mui/material';
import Modal from '../Components/Modal';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
export default function Add() {
  const [open, setOpen] = useState(false);

  const handleAddModalOpen = () => setOpen(true);
  const handleAddModalClose = () => setOpen(false);
  const updateUser = () => {
    console.log('hi');
    handleAddModalClose();
  };

  return (
    <>
      <Button onClick={handleAddModalOpen} startIcon={<PersonAddIcon />}>
        Add User(s)
      </Button>
      
      <Modal
        open={open}
        handleClose={handleAddModalClose}
        onConfirm={updateUser}
        modalIcon={<PersonAddIcon />}
        title="Add User"
        confirmLabel="Add"
      >
        <p>Form goes here</p>
      </Modal>
    </>
  );
}
