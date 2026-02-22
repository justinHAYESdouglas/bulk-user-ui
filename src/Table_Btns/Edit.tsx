import { useState } from 'react';
import { Button } from '@mui/material';
import Modal from '../Components/Modal';

export default function Edit() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button onClick={handleOpen}>Edit</Button>
      <Modal open={open} handleClose={handleClose} title="Edit User">
        <p>Edit form goes here</p>
      </Modal>
    </>
  );
}
