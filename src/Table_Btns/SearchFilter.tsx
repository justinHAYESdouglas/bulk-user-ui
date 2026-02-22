import { Button } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { type GridApiCommon } from '@mui/x-data-grid';

interface SearchFilterProps {
  apiRef: React.RefObject<GridApiCommon | null>;
}

export default function SearchFilter({ apiRef }: SearchFilterProps) {
  const handleFilterClick = () => {
    apiRef.current?.showFilterPanel();
  };

  return (
    <Button
      startIcon={<FilterListIcon />}
      onClick={handleFilterClick}
    >
      Search/Filter
    </Button>
  );
}
