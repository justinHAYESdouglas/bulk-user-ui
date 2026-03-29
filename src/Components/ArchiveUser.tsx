import { Box, Button, Typography } from '@mui/material';

type AccountStatus = 'none' | 'archived' | null;

interface Props {
  value: AccountStatus;
  onChange: (v: AccountStatus) => void;
}

export default function ArchiveUser({ value, onChange }: Props) {
  const btnSx = (active: boolean) => ({
    background: active ? 'var(--bg-color-lighter) !important' : 'transparent',
    border: active ? '1px solid var(--bg-color-lightest)' : 'none',
    '&:hover': { opacity: 0.9 },
  });

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      background: 'var(--bg-color-light)',
      borderRadius: '8px',
      border: '2px solid var(--bg-color-lighter)',
      p: 2
    }}>
      <Typography sx={{ fontSize: '18px' }}>Status</Typography>
      <Box sx={{ display: 'flex', ml: 'auto', gap: 2 }}>
        <Button sx={btnSx(value === null)} onClick={() => onChange(null)}>No change</Button>
        <Button sx={btnSx(value === 'none')} onClick={() => onChange('none')}>Active</Button>
        <Button sx={btnSx(value === 'archived')} onClick={() => onChange('archived')}>Archive</Button>
      </Box>
    </Box>
  );
}
