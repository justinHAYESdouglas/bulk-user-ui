import { Box, Switch, Typography } from '@mui/material';

interface Props {
  username: string;
  email?: string;
  checked: boolean;
  onToggle: (v: boolean) => void;
}

export default function PasswordReset({ checked, onToggle }: Props) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%',}}>
      <Box sx={{
         display: 'flex',
         justifyContent: 'space-between',
         alignItems: 'center',
         background: 'var(--bg-color-light)',
         borderRadius: '8px',
         border: '2px solid var(--bg-color-lighter)',
         p: 2 
         }}>
        <div>
          <Typography sx ={{fontSize: '18px'}}>Send Password Reset</Typography>
        </div>
        <div>
          <Switch checked={checked} onChange={(e) => onToggle((e.target as HTMLInputElement).checked)} />
        </div>
      </Box>
    </Box>
  );
}
