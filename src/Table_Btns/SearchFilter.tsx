import { Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
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
      startIcon={<SearchIcon />}
      onClick={handleFilterClick}
    >
      Search/Filter
    </Button>
  );
}
