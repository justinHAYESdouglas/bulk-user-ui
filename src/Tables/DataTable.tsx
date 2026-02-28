import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import type { GridApiCommunity } from '@mui/x-data-grid/internals';

interface DataTableProps {
  apiRef?: React.RefObject<GridApiCommunity | null>;
}

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'firstName', headerName: 'First name', width: 130 },
  { field: 'lastName', headerName: 'Last name', width: 130 },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 90,
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    valueGetter: (_value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
  },
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

const paginationModel = { page: 0, pageSize: 10 };

export default function DataTable({ apiRef }: DataTableProps) {

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%' }}>
        <DataGrid
          apiRef={apiRef}
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[10, 25, 50]}
          checkboxSelection
          disableColumnFilter={false}
          slotProps={{}}
          sx={{
            background: 'var(--bg-color-darkest)',
            color: 'var(--primary-text-color)',
            border: 0,
            '& .MuiDataGrid-columnHeader': {
              background: 'var(--bg-color-light)',
            },
            '& .MuiDataGrid-columnHeader .MuiDataGrid-menuIcon': {
              display: 'none',
            },
            '& .MuiDataGrid-columnHeader:hover .MuiDataGrid-menuIcon': {
              display: 'none',
            },
            '.MuiDataGrid-filler': {
              background: 'var(--bg-color-light) !important',
            },
            '.MuiTablePagination-root': {
              height: '45px',
              color: 'var(--primary-text-color)',
              background: 'var(--bg-color-light) !important',
              overflowY: 'hidden !important',
            }
          }}
        />
      </Paper>
    </Box>
  );
}
