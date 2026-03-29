import { useState } from 'react';
import { Box, Checkbox, FormControlLabel, InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import type { User } from '../App';

interface SelectedUserListProps {
  users: User[];
  selected: number[];
  onToggle: (id: number) => void;
}

export default function SelectedUserList({ users, selected, onToggle }: SelectedUserListProps) {
  const [search, setSearch] = useState('');

  const filtered = users.filter((u) =>
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {users.length > 5 && (
        <TextField
          size="small"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
            mb: 1,
            '& fieldset, & fieldset:hover, & fieldset:focus': {
              borderColor: 'var(--bg-color-lightest) !important',
            },
          }}
        />
      )}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxHeight: '250px',
          m: 'auto',
          overflowY: 'scroll',
          overflowX: 'hidden'
        }}
      >
        {filtered.length === 0 ? (
          <Box sx={{ color: 'var(--bg-color-lightest)', fontSize: 14 }}>
            No users match your search.
          </Box>
        ) : (
          filtered.map((user) => (
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
                  checked={selected.includes(user.id)}
                  onChange={() => onToggle(user.id)}
                  sx={{
                    color: 'var(--bg-color-lightest) !important',
                    '& .MuiSvgIcon-root': {
                      fill: 'var(--bg-color-lightest) !important',
                    },
                    '&.Mui-checked, &.MuiCheckbox-indeterminate': {
                      color: 'var(--highlight-color) !important',
                    },
                    '&.Mui-checked .MuiSvgIcon-root, &.MuiCheckbox-indeterminate .MuiSvgIcon-root': {
                      fill: 'var(--highlight-color) !important',
                    },
                  }}
                />
              }
            />
          ))
        )}
      </Box>
    </>
  );
}
