import { useState } from 'react';
import { Button, TextField } from '@mui/material';
import Modal from '../Components/Modal';
import DropdownAutocomplete from '../Components/DropdownAutocomplete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import rolesData from '../data/roles.json';
import groupsData from '../data/groups.json';
import type { User } from '../App';

interface AddProps {
  onAddUser: (user: User) => void;
  users: User[];
}

export default function Add({ onAddUser, users }: AddProps) {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  const resetForm = () => {
    setUsername('');
    setEmail('');
    setSelectedRoles([]);
    setSelectedGroups([]);
  };

  const validate = () => {
    const errs: string[] = [];
    if (!username.trim()) errs.push('Username is required.');
    else if (users.some((u) => u.username.toLowerCase() === username.trim().toLowerCase())) errs.push('Username is already taken.');
    if (!email.trim()) errs.push('Email is required.');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.push('Email must be a valid address.');
    else if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) errs.push('Email is already in use.');
    return errs;
  };

  const handleAddModalOpen = () => setOpen(true);
  const handleAddModalClose = () => setOpen(false);
  const addUser = () => {
    onAddUser({
      id: Date.now(),
      username,
      email,
      role: selectedRoles.join(', '),
      group: selectedGroups.join(', '),
      activity: 'Active',
      dateCreated: new Date().toISOString().split('T')[0],
    });
    setOpen(false);
  };

  const handleRoleChange = (newValue: string[]) => {
    setSelectedRoles(newValue);
  };

  const handleGroupChange = (newValue: string[]) => {
    setSelectedGroups(newValue);
  };

  return (
    <>
      <Button onClick={handleAddModalOpen} startIcon={<PersonAddIcon />}>
        Add User
      </Button>

      <Modal
        open={open}
        handleClose={handleAddModalClose}
        onConfirm={addUser}
        onReset={resetForm}
        validate={validate}
        modalIcon={<PersonAddIcon />}
        title="Add User"
        confirmLabel="Add"
      >
        <TextField id="add-username" required label="Username" variant="standard" value={username} onChange={(e) => setUsername(e.target.value)} />
        <TextField id="add-email" required label="Email" variant="standard" value={email} onChange={(e) => setEmail(e.target.value)} />

        <DropdownAutocomplete
          id="add-roles"
          label="Roles"
          options={rolesData.map((r) => r.name)}
          value={selectedRoles}
          onChange={handleRoleChange}
        />

        <DropdownAutocomplete
          id="add-groups"
          label="Groups"
          options={groupsData.map((g) => g.name)}
          value={selectedGroups}
          onChange={handleGroupChange}
        />
      </Modal>
    </>
  );
}
