import { useState } from 'react';
import { Button, Menu, MenuItem, Divider, TextField, InputAdornment, Box, IconButton, Typography } from '@mui/material';
import Modal from '../Components/Modal';
import GroupsIcon from '@mui/icons-material/Groups';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import React from 'react';
import groupsData from '../data/groups.json';

type ModalType = 'manage' | 'create' | null;

interface AddToGroupProps {
  onGroupCreated?: (name: string) => void;
  onDeleteGroup?: (name: string) => void;
  onRenameGroup?: (oldName: string, newName: string) => void;
  onGroupsUpdated?: (message: string) => void;
  selectedCount?: number;
}

export default function AddToGroup({ onGroupCreated, onDeleteGroup, onRenameGroup, onGroupsUpdated, selectedCount = 0 }: AddToGroupProps) {
  const [openModal, setOpenModal] = useState<ModalType>(null);
  const [anchorEL, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [groups, setGroups] = useState(groupsData.map((g) => g.name));
  const [newGroupName, setNewGroupName] = useState('');
  const [manageSearch, setManageSearch] = useState('');
  const [pendingDeletes, setPendingDeletes] = useState<Set<string>>(new Set());
  const [pendingRenames, setPendingRenames] = useState<Map<string, string>>(new Map());
  const [editingGroup, setEditingGroup] = useState<string | null>(null);
  const openGroupDropdown = Boolean(anchorEL);

  const handleGroupDropdownClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleGroupDropdownClose = () => {
    setAnchorEl(null);
    setSearchQuery(''); // Reset search when closing
  };

  const handleManageGroupModalOpen = () => {
    setManageSearch('');
    setPendingDeletes(new Set());
    setPendingRenames(new Map());
    setEditingGroup(null);
    setOpenModal('manage');
    handleGroupDropdownClose();
  };

  const handleCreateGroupModalOpen = () => {
    setOpenModal('create');
    handleGroupDropdownClose();
  };

  const handleClose = () => { setManageSearch(''); setPendingDeletes(new Set()); setPendingRenames(new Map()); setEditingGroup(null); setOpenModal(null); };

  const updateGroup = () => {
    const actualRenames = new Map(
      [...pendingRenames.entries()].filter(([oldName, newName]) => oldName !== newName && newName.trim() !== '')
    );
    pendingDeletes.forEach((name) => onDeleteGroup?.(name));
    actualRenames.forEach((newName, oldName) => onRenameGroup?.(oldName, newName));
    setGroups((prev) =>
      prev
        .filter((g) => !pendingDeletes.has(g))
        .map((g) => actualRenames.get(g) ?? g)
    );
    const parts: string[] = [];
    if (pendingDeletes.size === 1) parts.push(`"${[...pendingDeletes][0]}" deleted`);
    else if (pendingDeletes.size > 1) parts.push(`${pendingDeletes.size} groups deleted`);
    if (actualRenames.size === 1) {
      const [[oldName, newName]] = [...actualRenames.entries()];
      parts.push(`"${oldName}" renamed to "${newName}"`);
    } else if (actualRenames.size > 1) parts.push(`${actualRenames.size} groups renamed`);
    if (parts.length > 0) onGroupsUpdated?.(parts.join(' · '));
    setPendingDeletes(new Set());
    setPendingRenames(new Map());
    setEditingGroup(null);
    handleClose();
  };

  const validateNewGroup = () => {
    const errs: string[] = [];
    if (!newGroupName.trim()) errs.push('Group name is required.');
    else if (groups.some((g) => g.toLowerCase() === newGroupName.trim().toLowerCase())) errs.push('A group with that name already exists.');
    return errs;
  };

  const createGroup = () => {
    const trimmed = newGroupName.trim();
    if (trimmed) {
      setGroups((prev) => [trimmed, ...prev]);
      onGroupCreated?.(trimmed);
    }
    setNewGroupName('');
    handleClose();
  };

  const filteredGroups = groups.filter(group =>
    group.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Button
        onClick={handleGroupDropdownClick}
        startIcon={<GroupsIcon />}
        endIcon={<ArrowDropDownIcon />}
      >
        Add to Group
      </Button>

      <Menu
        anchorEl={anchorEL}
        open={openGroupDropdown}
        onClose={handleGroupDropdownClose}
      >
        {selectedCount > 0 && (
          <MenuItem sx={{ pt: 1, pb: 1, cursor: 'default' }} disableRipple>
            <TextField
              sx={{
              '& .MuiInputAdornment-root .MuiSvgIcon-root, input': {
                  color: 'var(--primary-text-color)',
                },
                 '& fieldset, & fieldset:hover, & fieldset:focus, ':{
                  borderColor: 'var(--bg-color-lightest) !important'
                }
              }}
              size="small"
              placeholder="Search groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </MenuItem>
        )}

        {selectedCount > 0 && <Divider sx={{
          background: 'var(--bg-color-lightest) !important',
        }} />}

        {selectedCount === 0 ? (
          <MenuItem disabled sx={{ whiteSpace: 'normal', maxWidth: 260 }}>Select users to add to a group</MenuItem>
        ) : (
          <>
            <Box
              sx={{
                maxHeight: '150px',
                overflowY: 'scroll',
              }}>
              {filteredGroups.length > 0 ? (
                filteredGroups.map((group, index) => (
                  <MenuItem key={index}>{group}</MenuItem>
                ))
              ) : (
                <MenuItem disabled>No groups found</MenuItem>
              )}
            </Box>
          </>
        )}
        

        <Divider sx={{
          background: 'var(--bg-color-lightest) !important',
        }} />
        
        <MenuItem onClick={handleManageGroupModalOpen}>Manage Groups</MenuItem>
        <MenuItem onClick={handleCreateGroupModalOpen}>Create Groups</MenuItem>
      </Menu>

      <Modal
        open={openModal === 'manage'}
        handleClose={handleClose}
        onConfirm={updateGroup}
        modalIcon={<GroupsIcon />}
        title="Manage Groups"
        confirmLabel="Update"
      >
        {groups.length > 0 && (
          <TextField
            size="small"
            placeholder="Search groups..."
            value={manageSearch}
            onChange={(e) => setManageSearch(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              width: '100%',
              mt: 2,
              '& fieldset, & fieldset:hover, & fieldset:focus,': {
                borderColor: 'var(--bg-color-lightest) !important',
              },
            }}
          />
        )}
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', maxHeight: '250px', overflowY: 'auto' }}>
          {(() => {
            const filtered = groups.filter((g) =>
              g.toLowerCase().includes(manageSearch.toLowerCase())
            );
            return filtered.length === 0 ? (
              <Box sx={{ color: 'var(--bg-color-lightest)', fontSize: 14 }}>
                No groups match your search.
              </Box>
            ) : (
              filtered.map((group) => (
                <Box
                  key={group}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    p: '4px 0',
                    '&:hover': { background: 'var(--bg-color-light)' },
                  }}
                >
                  {editingGroup === group ? (
                    <TextField
                      size="small"
                      autoFocus
                      value={pendingRenames.get(group) ?? group}
                      onChange={(e) => setPendingRenames((prev) => new Map(prev).set(group, e.target.value))}
                      onBlur={() => setEditingGroup(null)}
                      onClick={(e) => e.stopPropagation()}
                      sx={{
                        pl: 1, flex: 1,
                        '& fieldset, & fieldset:hover, & fieldset:focus,': {
                          borderColor: 'var(--bg-color-lightest) !important',
                        },
                      }}
                    />
                  ) : (
                    <Typography sx={{ pl: 1, flex: 1, textDecoration: pendingDeletes.has(group) ? 'line-through' : 'none', opacity: pendingDeletes.has(group) ? 0.4 : 1 }}>
                      {pendingRenames.get(group) ?? group}
                    </Typography>
                  )}
                  <Box>
                    <IconButton size="small" onClick={() => setEditingGroup(editingGroup === group ? null : group)}><EditIcon fontSize="small" /></IconButton>
                    <IconButton
                      size="small"
                      color={pendingDeletes.has(group) ? 'error' : 'default'}
                      onClick={() => setPendingDeletes((prev) => {
                        const next = new Set(prev);
                        next.has(group) ? next.delete(group) : next.add(group);
                        return next;
                      })}
                    ><DeleteIcon fontSize="small" /></IconButton>
                  </Box>
                </Box>
              ))
            );
          })()}
        </Box>
      </Modal>

      <Modal
        open={openModal === 'create'}
        handleClose={handleClose}
        onConfirm={createGroup}
        modalIcon={<GroupsIcon />}
        title="Create Group"
        confirmLabel="Create"
        validate={validateNewGroup}
        contentSx={{ gap: 0 }}
      >
        <TextField
          label="Group Name"
          variant="standard"
          value={newGroupName}
          required
          onChange={(e) => setNewGroupName(e.target.value)}
          fullWidth
        />
      </Modal>
    </>
  );
}