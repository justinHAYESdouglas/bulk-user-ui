import { useState } from 'react';
import { Button, Box } from '@mui/material';
import Modal from '../Components/Modal';
import DeleteIcon from '@mui/icons-material/Delete';
import SelectedUserList from '../Components/SelectedUserList';
import type { User } from '../App';

interface DeleteProps {
  selectedUsers: User[];
  onDeleteUsers: (ids: number[], users: User[]) => void;
}

export default function Delete({ selectedUsers, onDeleteUsers }: DeleteProps) {
  const [open, setOpen] = useState(false);
  const [toDelete, setToDelete] = useState<number[]>([]);

  const handleOpen = () => {
    setToDelete(selectedUsers.map((u) => u.id));
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const toggleUser = (id: number) => {
    setToDelete((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const deleteUsers = () => {
    const deletedUsers = selectedUsers.filter((u) => toDelete.includes(u.id));
    onDeleteUsers(toDelete, deletedUsers);
    handleClose();
  };

  return (
    <>
      <Button onClick={handleOpen} startIcon={<DeleteIcon />}>Delete</Button>
      <Modal
        open={open}
        handleClose={handleClose}
        onConfirm={deleteUsers}
        modalIcon={<DeleteIcon />}
        title={toDelete.length === 1
          ? `Deleting... ${selectedUsers.find((u) => u.id === toDelete[0])?.username ?? ''}`
          : `Deleting... ${toDelete.length} users`}
        confirmLabel="Hold to Delete"
        holdToConfirm
        emptyContent={selectedUsers.length === 0}
      >
        {selectedUsers.length === 0 ? (
          <Box sx={{ color: 'var(--bg-color-lightest)', fontSize: 14, p: 4, textAlign: 'center' }}>No users selected.</Box>
        ) : (
          <SelectedUserList
            users={selectedUsers}
            selected={toDelete}
            onToggle={toggleUser}
          />
        )}
      </Modal>
    </>
  );
}
