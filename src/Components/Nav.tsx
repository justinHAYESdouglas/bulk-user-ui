import * as React from 'react';
import { Box, Button } from '@mui/material';

export default function Nav() {
  const [, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
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
          >
            Super Admin (Org 0)
          </Button>
        </Box>
      </Box>
    </>
  );
}
