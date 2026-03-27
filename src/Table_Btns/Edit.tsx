import { useState } from 'react';
import { Box, Button, Checkbox, FormControlLabel, Switch, TextField, Radio, RadioGroup } from '@mui/material';
import Modal from '../Components/Modal';
import DropdownAutocomplete from '../Components/DropdownAutocomplete';
import PasswordReset from '../Components/PasswordReset';
import ArchiveUser from '../Components/ArchiveUser';
import EditSquareIcon from '@mui/icons-material/EditSquare';
import rolesData from '../data/roles.json';
import groupsData from '../data/groups.json';
import type { User } from '../App';

interface EditProps {
  users: User[];
  onEditUsers: (updatedUsers: User[]) => void;
}

export default function Edit({ users, onEditUsers }: EditProps) {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [resetPassword, setResetPassword] = useState(false);
  const [toEdit, setToEdit] = useState<number[]>([]);
  const [accountStatus, setAccountStatus] = useState<'none' | 'archived' | null>('none');

  const isSingle = users.length === 1;

  const handleOpen = () => {
    if (users.length > 0) {
      if (isSingle) {
        const user = users[0];
        setUsername(user.username);
        setSelectedRoles(user.role ? user.role.split(', ').filter(Boolean) : []);
        setSelectedGroups(user.group ? user.group.split(', ').filter(Boolean) : []);
        setResetPassword(false);
        setAccountStatus(user.activity === 'Archived' ? 'archived' : 'none');
      } else {
        setSelectedRoles([]);
        setSelectedGroups([]);
        setResetPassword(false);
        setToEdit(users.map((u) => u.id));
        const allArchived = users.every((u) => u.activity === 'Archived');
        const noneArchived = users.every((u) => u.activity !== 'Archived');
        setAccountStatus(allArchived ? 'archived' : noneArchived ? 'none' : null);
      }
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const toggleUser = (id: number) => {
    setToEdit((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  

  const mergeValues = (existing: string, additions: string[]): string => {
    const current = existing ? existing.split(', ').filter(Boolean) : [];
    const merged = Array.from(new Set([...current, ...additions]));
    return merged.join(', ');
  };

  const updateUsers = () => {
    if (isSingle) {
      const u = users[0];
      const prev = (u as any).previousActivity as string | undefined;
      if (accountStatus === 'archived') {
        const prevActivity = u.activity === 'Archived' ? prev : u.activity;
        onEditUsers([{
          ...u,
          username,
          role: mergeValues(u.role, selectedRoles),
          group: mergeValues(u.group, selectedGroups),
          activity: 'Archived',
          previousActivity: prevActivity,
        } as User]);
      } else {
        const restored = u.activity === 'Archived' ? (prev ?? 'Offline') : u.activity;
        onEditUsers([{
          ...u,
          username,
          role: mergeValues(u.role, selectedRoles),
          group: mergeValues(u.group, selectedGroups),
          activity: restored,
          previousActivity: undefined,
        } as User]);
      }
    } else {
      onEditUsers(
        users
          .filter((u) => toEdit.includes(u.id))
          .map((u) => {
            const prev = (u as any).previousActivity as string | undefined;
            if (accountStatus === 'archived') {
              const prevActivity = u.activity === 'Archived' ? prev : u.activity;
              return {
                ...u,
                role: mergeValues(u.role, selectedRoles),
                group: mergeValues(u.group, selectedGroups),
                activity: 'Archived',
                previousActivity: prevActivity,
              };
            }

            if (accountStatus === 'none') {
              // restore archived users only
              if (u.activity === 'Archived') {
                return {
                  ...u,
                  role: mergeValues(u.role, selectedRoles),
                  group: mergeValues(u.group, selectedGroups),
                  activity: prev ?? 'Offline',
                  previousActivity: undefined,
                };
              }
              return {
                ...u,
                role: mergeValues(u.role, selectedRoles),
                group: mergeValues(u.group, selectedGroups),
              };
            }

            // accountStatus === null -> do not change activity
            return {
              ...u,
              role: mergeValues(u.role, selectedRoles),
              group: mergeValues(u.group, selectedGroups),
            };
          })
      );
    }
    handleClose();
  };

  return (
    <>
      <Button
        startIcon={<EditSquareIcon />}
        onClick={handleOpen}
      >
        Edit
      </Button>
      <Modal
        open={open}
        handleClose={handleClose}
        onConfirm={updateUsers}
        modalIcon={<EditSquareIcon />}
        title={users.length === 0 ? 'Edit User' : isSingle ? `Edit "${users[0].username}"` : `Editing... ${users.length} Users`}
        confirmLabel="Update"
        emptyContent={users.length === 0}
      >
        {users.length === 0 ? (
          <Box sx={{ color: 'var(--bg-color-lightest)', fontSize: 14, p: 4, textAlign: 'center' }}>No users selected.</Box>
        ) : (
          <>
        {isSingle && (
          <TextField
            id="edit-username"
            required
            label="Username"
            variant="standard"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        )}

        <DropdownAutocomplete
          id="edit-roles"
          label="Roles"
          options={rolesData.map((r) => r.name)}
          value={selectedRoles}
          onChange={setSelectedRoles}
        />

        <DropdownAutocomplete
          id="edit-groups"
          label="Groups"
          options={groupsData.map((g) => g.name)}
          value={selectedGroups}
          onChange={setSelectedGroups}
        />

        {isSingle && (
          <ArchiveUser />
        )}

        {isSingle && (
          <PasswordReset
            username={users[0].username}
            email={(users[0] as any).email}
            checked={resetPassword}
            onToggle={(v: boolean) => setResetPassword(v)}
          />
        )}
        

        {!isSingle && (
          <>
            <ArchiveUser />
            <PasswordReset
            username={users[0].username}
            email={(users[0] as any).email}
            checked={resetPassword}
            onToggle={(v: boolean) => setResetPassword(v)}
          />
            {/* <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                maxHeight: '250px',
                m: 'auto',
                overflowY: 'scroll',
              }}
            >
              {users.map((user) => (
                    <FormControlLabel
                      key={user.id}
                      label={user.username}
                      labelPlacement="start"
                      sx={{
                        width: '98%',
                        justifyContent: 'space-between',
                        ml: 0,
                        p: '4px',
                        '&:hover': { background: 'var(--bg-color-light)' },
                      }}
                      control={
                        <Checkbox
                          checked={toEdit.includes(user.id)}
                          onChange={() => toggleUser(user.id)}
                        />
                      }
                    />
              ))}
            </Box> */}
          </>
        )}
          </>
        )}
      </Modal>
    </>
  );
}
