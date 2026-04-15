import { useState } from 'react';
import { Box, Button, Divider, TextField, Typography } from '@mui/material';
import Modal from '../Components/Modal';
import DropdownAutocomplete from '../Components/DropdownAutocomplete';
import PasswordReset from '../Components/PasswordReset';
import ArchiveUser from '../Components/ArchiveUser';
import SelectedUserList from '../Components/SelectedUserList';
import EditSquareIcon from '@mui/icons-material/EditSquare';
import rolesData from '../data/roles.json';
import groupsData from '../data/groups.json';
import type { User } from '../App';

type FieldMode = 'no-change' | 'add' | 'replace' | 'remove';

interface EditProps {
  users: User[];
  onEditUsers: (updatedUsers: User[]) => void;
}

const modeButtonSx = (active: boolean) => ({
  background: active ? 'var(--highlight-color) !important' : 'transparent',
});

const MODE_LABELS: { value: FieldMode; label: string }[] = [
  { value: 'no-change', label: 'No change' },
  { value: 'add',       label: 'Add' },
  { value: 'replace',   label: 'Replace' },
  { value: 'remove',    label: 'Remove' },
];

interface ModeButtonGroupProps {
  mode: FieldMode;
  onChange: (m: FieldMode) => void;
}

function ModeButtonGroup({ mode, onChange }: ModeButtonGroupProps) {
  return (
    <Box sx={{ display: 'flex', ml: 'auto', gap: 1, '@media screen and (max-width: 446px)': { display: 'grid', gridTemplateColumns: 'auto auto' } }}>
      {MODE_LABELS.map(({ value, label }) => (
        <Button
          key={value}
          size="small"
          sx={modeButtonSx(mode === value)}
          onClick={() => onChange(value)}
        >
          {label}
        </Button>
      ))}
    </Box>
  );
}

export default function Edit({ users, onEditUsers }: EditProps) {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [resetPassword, setResetPassword] = useState(false);
  const [toEdit, setToEdit] = useState<number[]>([]);
  const [accountStatus, setAccountStatus] = useState<'none' | 'archived' | null>(null);

  const [rolesMode, setRolesMode] = useState<FieldMode>('no-change');
  const [groupsMode, setGroupsMode] = useState<FieldMode>('no-change');

  const isSingle = users.length === 1;

  const handleOpen = () => {
    if (users.length > 0) {
      if (isSingle) {
        const user = users[0];
        setUsername(user.username);
        setSelectedRoles(user.role ? user.role.split(', ').filter(Boolean) : []);
        setSelectedGroups(user.group ? user.group.split(', ').filter(Boolean) : []);
        setResetPassword(false);
        setAccountStatus(null);
      } else {
        setSelectedRoles([]);
        setSelectedGroups([]);
        setResetPassword(false);
        setToEdit(users.map((u) => u.id));
        setAccountStatus(null);
        setRolesMode('no-change');
        setGroupsMode('no-change');
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
    return Array.from(new Set([...current, ...additions])).join(', ');
  };

  const replaceValues = (selections: string[]): string => selections.join(', ');

  const removeValues = (existing: string, toRemove: string[]): string => {
    const current = existing ? existing.split(', ').filter(Boolean) : [];
    return current.filter((v) => !toRemove.includes(v)).join(', ');
  };

  const applyMode = (existing: string, selections: string[], mode: FieldMode): string => {
    switch (mode) {
      case 'add':       return mergeValues(existing, selections);
      case 'replace':   return replaceValues(selections);
      case 'remove':    return removeValues(existing, selections);
      case 'no-change':
      default:          return existing;
    }
  };

  const updateUsers = () => {
    if (isSingle) {
      const u = users[0];
      const prev = (u as any).previousActivity as string | undefined;

      const updatedRole  = mergeValues(u.role, selectedRoles);   // single-edit keeps merge behaviour
      const updatedGroup = mergeValues(u.group, selectedGroups);

      if (accountStatus === 'archived') {
        const prevActivity = u.activity === 'Archived' ? prev : u.activity;
        onEditUsers([{ ...u, username, role: updatedRole, group: updatedGroup, activity: 'Archived', previousActivity: prevActivity } as User]);
      } else if (accountStatus === null) {
        onEditUsers([{ ...u, username, role: updatedRole, group: updatedGroup } as User]);
      } else {
        const restored = u.activity === 'Archived' ? (prev ?? 'Offline') : u.activity;
        onEditUsers([{ ...u, username, role: updatedRole, group: updatedGroup, activity: restored, previousActivity: undefined } as User]);
      }
    } else {
      onEditUsers(
        users
          .filter((u) => toEdit.includes(u.id))
          .map((u) => {
            const prev = (u as any).previousActivity as string | undefined;

            const updatedRole  = applyMode(u.role,  selectedRoles,  rolesMode);
            const updatedGroup = applyMode(u.group, selectedGroups, groupsMode);

            if (accountStatus === 'archived') {
              const prevActivity = u.activity === 'Archived' ? prev : u.activity;
              return { ...u, role: updatedRole, group: updatedGroup, activity: 'Archived', previousActivity: prevActivity };
            }

            if (accountStatus === 'none') {
              if (u.activity === 'Archived') {
                return { ...u, role: updatedRole, group: updatedGroup, activity: prev ?? 'Offline', previousActivity: undefined };
              }
              return { ...u, role: updatedRole, group: updatedGroup };
            }

            // accountStatus === null → no activity change
            return { ...u, role: updatedRole, group: updatedGroup };
          })
      );
    }
    handleClose();
  };

  return (
    <>
      <Button startIcon={<EditSquareIcon />} onClick={handleOpen}>
        Edit
      </Button>

      <Modal
        open={open}
        handleClose={handleClose}
        onConfirm={updateUsers}
        modalIcon={<EditSquareIcon />}
        title={
          users.length === 0
            ? 'Edit User'
            : isSingle
            ? `Edit "${users[0].username}"`
            : `Editing... ${toEdit.length} Users`
        }
        confirmLabel="Update"
        emptyContent={users.length === 0}
      >
        {users.length === 0 ? (
          <Box sx={{ color: 'var(--bg-color-lightest)', fontSize: 14, p: 4, textAlign: 'center' }}>
            No users selected.
          </Box>
        ) : (
          <>
            {/* ── Single-user fields ─────────────────────────────────────── */}
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

            {isSingle && (
              <>
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
              </>
            )}

            {isSingle && <ArchiveUser value={accountStatus} onChange={(v) => setAccountStatus(v)} />}

            {isSingle && (
              <PasswordReset
                username={users[0].username}
                email={(users[0] as any).email}
                checked={resetPassword}
                onToggle={(v: boolean) => setResetPassword(v)}
              />
            )}

            {/* ── Multi-user fields ──────────────────────────────────────── */}
            {!isSingle && (
              <>
                <Box
                  sx={{
                    position: 'absolute',
                    right: '-290px',
                    top: '0px',
                    width: '250px',
                    height: '320px',
                    p: '16px',
                    borderRadius: '4px',
                    background: 'var(--bg-color-darker)',

                    '@media screen and (max-width: 1028px)': {
                     display: 'none'
                    },
                  }}
                >
                <Typography sx={{fontSize: '18px'}}>Users Affected</Typography>
                  <SelectedUserList
                    users={users}
                    selected={toEdit}
                    onToggle={toggleUser}
                  />
                </Box>

                <Box>
                  <Box sx={{ display: 'flex', mt: 3, ml: 'auto', alignItems: 'center', gap: 2 }}>
                    <Typography sx={{ fontSize: '18px' }}>Roles</Typography>
                    <ModeButtonGroup mode={rolesMode} onChange={setRolesMode} />
                  </Box>
                  {rolesMode !== 'no-change' ? (
                    <DropdownAutocomplete
                      id="edit-roles"
                      label="Select Roles"
                      options={rolesData.map((r) => r.name)}
                      value={selectedRoles}
                      onChange={setSelectedRoles}
                    />
                  ) : (
                    <Divider sx={{ mt: 4, borderColor: 'var(--bg-color-lighter)' }} />
                  )}
                </Box>

                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography sx={{ fontSize: '18px' }}>Groups</Typography>
                    <ModeButtonGroup mode={groupsMode} onChange={setGroupsMode} />
                  </Box>
                  {groupsMode !== 'no-change' ? (
                    <DropdownAutocomplete
                      id="edit-groups"
                      label="Select Groups"
                      options={groupsData.map((g) => g.name)}
                      value={selectedGroups}
                      onChange={setSelectedGroups}
                    />
                  ) : (
                    <Divider sx={{ mt: 4, borderColor: 'var(--bg-color-lighter)' }} />
                  )}
                </Box>

                <ArchiveUser value={accountStatus} onChange={(v) => setAccountStatus(v)} />

                <PasswordReset
                  username={users[0].username}
                  email={(users[0] as any).email}
                  checked={resetPassword}
                  onToggle={(v: boolean) => setResetPassword(v)}
                />
              </>
            )}
          </>
        )}
      </Modal>
    </>
  );
}