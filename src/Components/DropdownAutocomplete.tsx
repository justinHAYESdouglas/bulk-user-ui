import { Autocomplete, Checkbox, Chip, TextField } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';

interface DropdownAutocompleteProps {
  id: string;
  label: string;
  options: string[];
  value: string[];
  onChange: (newValue: string[]) => void;
  disabled?: boolean;
}

export default function DropdownAutocomplete({
  id,
  label,
  options,
  value,
  onChange,
  disabled,
}: DropdownAutocompleteProps) {
  return (
    <Autocomplete
      multiple
      disableClearable
      disableCloseOnSelect
      id={id}
      options={options}
      value={value}
      disabled={disabled}
      sx={{
        '& input':{
            border: 'none !important',
        },
        '& .MuiAutocomplete-popupIndicator, & .MuiAutocomplete-endAdornment button': {
          background: 'none !important',
          '&:hover':{
             background: 'none !important', 
            },
        },
        '& .MuiAutocomplete-inputRoot': {
          paddingRight: '0 !important',
          borderBottom: '2px solid var(--bg-color-lighter)',
        },
      }}
      slotProps={{
        paper: {
          sx: {
            background: 'var(--bg-color-dark) !important',
            color: 'var(--primary-text-color)',
            '& .MuiAutocomplete-option:hover, & .MuiAutocomplete-option.Mui-focused, & li:focus, & li[aria-selected="true"], & li.Mui-focusVisible': {
              background: 'var(--bg-color-lighter) !important',
            },
          },
        },
      }}
      onChange={(_: unknown, newValue: string[]) => onChange(newValue)}
      renderOption={({ key, ...props }, option, { selected }) => (
        <li key={key} {...props}>
          <Checkbox checked={selected}/>
          {option}
        </li>
      )}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => (
          <Chip
            {...getTagProps({ index })}
            key={option}
            label={option}
            size="small"
            deleteIcon={<CancelIcon />}
          />
        ))
      }
      renderInput={(params) => (
        <TextField {...params} label={label} variant="standard" />
      )}
    />
  );
}
