import { useState } from 'react';
import { Button, Checkbox, FormControlLabel, Box, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Modal from '../Components/Modal';
import DeleteIcon from '@mui/icons-material/Delete';
import type { User } from '../App';

interface DeleteProps {
  selectedUsers: User[];
  onDeleteUsers: (ids: number[], users: User[]) => void;
}

export default function Delete({ selectedUsers, onDeleteUsers }: DeleteProps) {
  const [open, setOpen] = useState(false);
  const [toDelete, setToDelete] = useState<number[]>([]);
  const [search, setSearch] = useState('');

  const handleOpen = () => {
    setToDelete(selectedUsers.map((u) => u.id));
    setSearch('');
    setOpen(true);
  };
  const handleClose = () => { setSearch(''); setOpen(false); };

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
      >
        {selectedUsers.length > 0 && <TextField
          size="small"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
          sx={{ width: '100%',
             mt: 2, 
            '& fieldset, & fieldset:hover, & fieldset:focus, ':{
                borderColor: 'var(--bg-color-lightest) !important'
              }
            }}
        />}
        <Box 
          sx={{   
                display: 'flex', 
                flexDirection: 'column',
                width: '100%', 
                maxHeight: '250px',
                m: 'auto',
                overflowY: 'scroll'
                }}>
          {selectedUsers.length === 0 ? (
            <Box sx={{ color: 'var(--bg-color-lightest)', fontSize: 14 }}>No users selected.</Box>
          ) : (() => {
            const filtered = selectedUsers.filter((user) =>
              user.username.toLowerCase().includes(search.toLowerCase())
            );
            return filtered.length === 0 ? (
              <Box sx={{ color: 'var(--bg-color-lightest)', fontSize: 14 }}>
                No users match your search.
              </Box>
            ) : (
              filtered.map((user) => (
              <FormControlLabel
                key={user.id}
                label={user.username}
                labelPlacement="start"
                sx={{  
                      width: '98%', 
                      justifyContent: 'space-between',
                      ml: 0,
                      p: '4px',
                      '&:hover': {
                        background: 'var(--bg-color-light)'
                      }
                    }}
                control={
                  <Checkbox
                    checked={toDelete.includes(user.id)}
                    onChange={() => toggleUser(user.id)}
                  />
                }
              />
            ))
            );
          })()}
        </Box>
      </Modal>
    </>
  );
}
