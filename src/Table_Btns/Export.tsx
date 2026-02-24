import { Button, Menu, MenuItem} from '@mui/material';
import IosShareIcon from '@mui/icons-material/IosShare';
import React from 'react';

export default function Export() {
    const [anchorEL, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const openExportDropdown = Boolean(anchorEL);
  
    const handleExportDropdownClick = (
      event: React.MouseEvent<HTMLButtonElement>
    ) => {
      setAnchorEl(event.currentTarget);
    };
    const handleExportDropdownClose =()=>{
       setAnchorEl(null);
    }
  return (
     <>
     <Button startIcon={<IosShareIcon/>} onClick={handleExportDropdownClick}>Export</Button> 
       <Menu
          anchorEl={anchorEL}
          open={openExportDropdown}
          onClose={handleExportDropdownClose}
          >
            <MenuItem>CSV</MenuItem>
              <MenuItem>XLS</MenuItem>
              <MenuItem>JSON</MenuItem>
        </Menu>
    </>
  )
}
