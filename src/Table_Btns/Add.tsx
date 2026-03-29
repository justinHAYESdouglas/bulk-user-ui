import { useState } from 'react';
import { Box, Button, IconButton, TextField } from '@mui/material';
import Modal from '../Components/Modal';
import DropdownAutocomplete from '../Components/DropdownAutocomplete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import rolesData from '../data/roles.json';
import groupsData from '../data/groups.json';
import type { User } from '../App';

interface AddProps {
  onAddUser: (user: User) => void;
  users: User[];
}

interface NewUserForm {
  username: string;
  email: string;
  roles: string[];
  groups: string[];
}

const emptyUserForm = (): NewUserForm => ({
  username: '',
  email: '',
  roles: [],
  groups: [],
});

export default function Add({ onAddUser, users }: AddProps) {
  const [open, setOpen] = useState(false);
  const [forms, setForms] = useState<NewUserForm[]>([emptyUserForm()]);

  const resetForm = () => {
    setForms([emptyUserForm()]);
  };

  const validate = () => {
    const errs: string[] = [];

    const existingUsernames = new Set(users.map((u) => u.username.toLowerCase()));
    const existingEmails = new Set(users.map((u) => u.email.toLowerCase()));
    const modalUsernames = new Set<string>();
    const modalEmails = new Set<string>();

    forms.forEach((f, i) => {
      const row = i + 1;
      const username = f.username.trim();
      const email = f.email.trim();

      if (!username) {
        errs.push(`Row ${row}: Username is required.`);
      } else {
        const uname = username.toLowerCase();
        if (existingUsernames.has(uname)) errs.push(`Row ${row}: Username is already taken.`);
        if (modalUsernames.has(uname)) errs.push(`Row ${row}: Username is duplicated in this modal.`);
        modalUsernames.add(uname);
      }

      if (!email) {
        errs.push(`Row ${row}: Email is required.`);
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errs.push(`Row ${row}: Email must be a valid address.`);
      } else {
        const em = email.toLowerCase();
        if (existingEmails.has(em)) errs.push(`Row ${row}: Email is already in use.`);
        if (modalEmails.has(em)) errs.push(`Row ${row}: Email is duplicated in this modal.`);
        modalEmails.add(em);
      }
    });

    return errs;
  };

  const handleAddModalOpen = () => {
    resetForm();
    setOpen(true);
  };
  const handleAddModalClose = () => setOpen(false);

  const addUser = () => {
    const today = new Date().toISOString().split('T')[0];
    forms.forEach((f, idx) => {
      onAddUser({
        id: Date.now() + idx,
        username: f.username.trim(),
        email: f.email.trim(),
        role: f.roles.join(', '),
        group: f.groups.join(', '),
        activity: 'Active',
        dateCreated: today,
      });
    });
    setOpen(false);
  };

  const updateForm = (index: number, patch: Partial<NewUserForm>) => {
    setForms((prev) => prev.map((f, i) => (i === index ? { ...f, ...patch } : f)));
  };

  const addAnotherUser = () => {
    setForms((prev) => [...prev, emptyUserForm()]);
  };

  const removeAddedUser = (index: number) => {
    setForms((prev) => prev.filter((_, i) => i !== index));
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
        modalWidth={683}
        modalSx={{ '@media screen and (max-width: 720px)': { width: 450 } }}
        modalIcon={<PersonAddIcon />}
        title="Add User"
        confirmLabel="Add"
      >
        {forms.map((form, index) => (
          <Box
            key={index}
            sx={{
              position: 'relative',
              display: 'grid',
              gridTemplateColumns: 'auto auto',
              gridGap: '20px',
              justifyContent: 'space-between',
              pt: index > 0 ? '20px' : 0,
              pb: '32px',
              borderBottom: '2px dashed var(--bg-color-lightest)',

              '@media screen and (max-width: 720px)': {
                  gridTemplateColumns: 'auto',
                  justifyContent: 'space-around',
              },
            }}
          >
            {index > 0 && (
              <IconButton
                size="small"
                aria-label="Remove added user"
                onClick={() => removeAddedUser(index)}
                sx={{ position: 'absolute', top: 0, right: 0, p: '2px' }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            )}

            <TextField
              id={`add-username-${index}`}
              required
              label="Username"
              variant="standard"
              value={form.username}
              onChange={(e) => updateForm(index, { username: e.target.value })}
              sx={{ width: 330 }}
            />
            <TextField
              id={`add-email-${index}`}
              required
              label="Email"
              variant="standard"
              value={form.email}
              onChange={(e) => updateForm(index, { email: e.target.value })}
              sx={{ width: 330 }}
            />

            <Box sx={{ width: 330 }}>
              <DropdownAutocomplete
                id={`add-roles-${index}`}
                label="Roles"
                options={rolesData.map((r) => r.name)}
                value={form.roles}
                onChange={(newValue) => updateForm(index, { roles: newValue })}
              />
            </Box>

            <Box sx={{ width: 330 }}>
              <DropdownAutocomplete
                id={`add-groups-${index}`}
                label="Groups"
                options={groupsData.map((g) => g.name)}
                value={form.groups}
                onChange={(newValue) => updateForm(index, { groups: newValue })}
              />
            </Box>
          </Box>
        ))}

        <Box>
          <Button onClick={addAnotherUser} startIcon={<AddIcon />} sx={{
            ml: '1px'
          }}>Add another user</Button>
        </Box>
      </Modal>
    </>
  );
}
