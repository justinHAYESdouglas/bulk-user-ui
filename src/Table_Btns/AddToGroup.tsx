import { useState } from 'react';
import { Button, Box, Menu, MenuItem, Divider, TextField, InputAdornment } from '@mui/material';
import Modal from '../Components/Modal';
import GroupsIcon from '@mui/icons-material/Groups';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SearchIcon from '@mui/icons-material/Search';
import React from 'react';

type ModalType = 'manage' | 'create' | null;

export default function AddToGroup() {
  const [openModal, setOpenModal] = useState<ModalType>(null);
  const [anchorEL, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const openGroupDropdown = Boolean(anchorEL);

  const groups = ['Group 1', 'Group 2', 'Group 3', 'Group 4'];

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
    setOpenModal('manage');
    handleGroupDropdownClose();
  };

  const handleCreateGroupModalOpen = () => {
    setOpenModal('create');
    handleGroupDropdownClose();
  };

  const handleClose = () => setOpenModal(null);

  const updateGroup = () => {
    console.log('hi');
    handleClose();
  };

  const createGroup = () => {
    console.log('hi');
    handleClose();
  };

  // Filter groups based on search query
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
        <MenuItem sx={{ pt: 1, pb: 1, cursor: 'default',  }} disableRipple>
          <TextField
            sx={{
            '& .MuiInputAdornment-root .MuiSvgIcon-root, input': {
                color: 'var(--primary-text-color)',
              },
              '& fieldset':{
                borderColor: 'var(--bg-color-lightest)'
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
        
        <Divider sx={{
          background: 'var(--bg-color-lightest) !important',
        }} />

        {filteredGroups.length > 0 ? (
          filteredGroups.map((group, index) => (
            <MenuItem key={index}>{group}</MenuItem>
          ))
        ) : (
          <MenuItem disabled>No groups found</MenuItem>
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
        <p>Manage Group Form goes here</p>
      </Modal>

      <Modal
        open={openModal === 'create'}
        handleClose={handleClose}
        onConfirm={createGroup}
        modalIcon={<GroupsIcon />}
        title="Create Group"
        confirmLabel="Create"
      >
        <p>Create Group Form goes here</p>
      </Modal>
    </>
  );
}