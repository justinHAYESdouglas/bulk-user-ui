import { useState, useRef } from 'react';
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  Checkbox,
  ListItemText,
  Input,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import Modal from '../Components/Modal';
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
  const [roleSearch, setRoleSearch] = useState('');
  const [groupSearch, setGroupSearch] = useState('');
  const roleSearchRef = useRef<HTMLInputElement>(null);
  const groupSearchRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setUsername('');
    setEmail('');
    setSelectedRoles([]);
    setSelectedGroups([]);
    setRoleSearch('');
    setGroupSearch('');
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

  const handleRoleChange = (event: SelectChangeEvent<string[]>) => {
    setSelectedRoles(event.target.value as string[]);
  };

  const handleGroupChange = (event: SelectChangeEvent<string[]>) => {
    setSelectedGroups(event.target.value as string[]);
  };

  const removeRole = (role: string) => {
    setSelectedRoles((prev) => prev.filter((r) => r !== role));
  };

  const removeGroup = (group: string) => {
    setSelectedGroups((prev) => prev.filter((g) => g !== group));
  };

  const filteredRoles = rolesData.filter((r) =>
    r.name.toLowerCase().includes(roleSearch.toLowerCase())
  );

  const filteredGroups = groupsData.filter((g) =>
    g.name.toLowerCase().includes(groupSearch.toLowerCase())
  );

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

        <FormControl variant="standard" size="small">
          <InputLabel id="add-roles-label">Roles</InputLabel>
          <Select
            labelId="add-roles-label"
            id="add-roles"
            multiple
            value={selectedRoles}
            onChange={handleRoleChange}
            input={<Input />}
            onClose={() => setRoleSearch('')}
            MenuProps={{ PaperProps: { style: { height: 300 } } }}
            renderValue={(selected) => (
              <Box 
              sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 0.5
                  }}>
                {selected.map((value) => (
                  <Chip
                    key={value}
                    label={value}
                    size="small"
                    deleteIcon={
                      <CancelIcon onMouseDown={(e) => e.stopPropagation()} />
                    }
                    onDelete={() => removeRole(value)}
                  />
                ))}
              </Box>
            )}
          >
            <MenuItem disableRipple onKeyDown={(e) => e.stopPropagation()}>
              <TextField
                inputRef={roleSearchRef}
                size="small"
                placeholder="Search roles..."
                value={roleSearch}
                onChange={(e) => setRoleSearch(e.target.value)}
                autoFocus
                fullWidth
                variant="standard"
              />
            </MenuItem>
            {filteredRoles.map((role) => (
              <MenuItem key={role.id} value={role.name}>
                <Checkbox checked={selectedRoles.includes(role.name)} />
                <ListItemText primary={role.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl variant="standard" size="small">
          <InputLabel id="add-groups-label">Groups</InputLabel>
          <Select
            labelId="add-groups-label"
            id="add-groups"
            multiple
            value={selectedGroups}
            onChange={handleGroupChange}
            input={<Input />}
            onClose={() => setGroupSearch('')}
            MenuProps={{ PaperProps: { style: { height: 300 } } }}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip
                    key={value}
                    label={value}
                    deleteIcon={
                      <CancelIcon onMouseDown={(e) => e.stopPropagation()} />
                    }
                    onDelete={() => removeGroup(value)}
                  />
                ))}
              </Box>
            )}
          >
            <MenuItem disableRipple onKeyDown={(e) => e.stopPropagation()}>
              <TextField
                inputRef={groupSearchRef}
                placeholder="Search groups..."
                value={groupSearch}
                onChange={(e) => setGroupSearch(e.target.value)}
                autoFocus
                fullWidth
                variant="standard"
              />
            </MenuItem>
            {filteredGroups.map((group) => (
              <MenuItem key={group.id} value={group.name}>
                <Checkbox checked={selectedGroups.includes(group.name)} />
                <ListItemText primary={group.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Modal>
    </>
  );
}
