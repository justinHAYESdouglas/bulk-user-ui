import { Box, Button } from '@mui/material';

export default function ArchiveUser() {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      background: 'var(--bg-color-light)',
      borderRadius: '8px',
      border: '1px solid var(--bg-color-lightest)',
      p: 2
    }}>
      <span>Status</span>
      <Box sx={{ display: 'flex', ml: 'auto', gap: 2 }}>
        <Button>No change</Button>
        <Button>Active</Button>
        <Button>Archive</Button>
      </Box>
    </Box>
  );
}
