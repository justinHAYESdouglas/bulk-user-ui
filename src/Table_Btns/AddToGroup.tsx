import { useState } from 'react';
import { Button, Box } from '@mui/material';
import Modal from '../Components/Modal';
import GroupsIcon from '@mui/icons-material/Groups';

export default function AddToGroup() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const updateUser = () =>{
    console.log("hi")
    handleClose();
  } 

  return (
    <>
      <Button onClick={handleOpen}  startIcon={<GroupsIcon />}>Add to Group</Button>
      <Modal 
      open={open} 
      handleClose={handleClose} 
      onConfirm={updateUser}
      modalIcon= {<GroupsIcon />}
      title="Add to Group"
      confirmLabel='Add To Group'>
        <p>Form goes here</p>
      </Modal>
    </>
  );
}
