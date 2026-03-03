import * as React from 'react';
import { Box, Menu, Button, MenuItem } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export default function Nav() {
  const [anchorEL, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEL);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <Box component="header">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: '10px',
            background: 'var(--bg-color-dark)',
          }}
          component="nav"
        >
          <Button 
          onClick={handleClick} 
          endIcon={<ArrowDropDownIcon />}
          >
            Super Admin (Org 0)
          </Button>

          <Menu anchorEl={anchorEL} open={open} onClose={handleClose}>
            <MenuItem>Super Admin (Org1)</MenuItem>
            <MenuItem>Super Admin (Org2)</MenuItem>
            <MenuItem>Super Admin (Org3)</MenuItem>
          </Menu>
        </Box>
      </Box>
    </>
  );
}
