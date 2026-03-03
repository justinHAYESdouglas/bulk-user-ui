import { DataGrid, type GridColDef } from '@mui/x-data-grid';
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
  { id: 19, lastName: '3Roxie', firstName: 'Harvey', age: 65 },
  { id: 29, lastName: 'R2oxie', firstName: 'Harvey', age: 65 },
  { id: 39, lastName: 'R4oxie', firstName: 'Harvey', age: 65 },
  { id: 329, lastName: 'R4oxie', firstName: 'Harvey', age: 65 },
  { id: 319, lastName: 'R43oxie', firstName: 'H4arvey', age: 65 },
  { id: 339, lastName: 'R4ox4ie', firstName: 'Harve2y', age: 645 },
];

const paginationModel = { page: 0, pageSize: 10 };

export default function DataTable({ apiRef }: DataTableProps) {

  return (
    <Box>
        <DataGrid
          apiRef={apiRef}
          rows={rows}
          rowHeight={64}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[10, 25, 50]}
          checkboxSelection
          disableColumnFilter={false}
          sx={{
            minHeight : 754,
            maxHeight : 755,
             //This small difference in height keeps the scroll bar hidden at the lowest value of cells per page 
            background: 'var(--bg-color-darkest)',
            color: 'var(--primary-text-color)',
            border: '2px solid var(--border-color) !important',
            fontSize: 14,
            '.MuiDataGrid-row--borderBottom' : {
            background: 'var(--bg-color-light) !important',
            },
            '.MuiDataGrid-scrollbarFiller, & .MuiDataGrid-filler ' :{
              display: 'none',
            },
            '& .MuiDataGrid-columnHeader': {
              background: 'var(--bg-color-light)',
              border: 'none'
            },
            '& .MuiDataGrid-columnHeader .MuiDataGrid-menuIcon': {
              display: 'none',
            },
            '& .MuiDataGrid-columnHeader:hover .MuiDataGrid-menuIcon': {
              display: 'none',
            },
            '&': {
              '--DataGrid-rowBorderColor': 'transparent !important',
            },
            '.MuiDataGrid-filler': {
              background: 'var(--bg-color-light) !important',
              border: 'none'
            },
            '& .MuiSvgIcon-root': {
              fill: 'var(--bg-color-lightest)'
            },
            '.MuiDataGrid-cell' :{
              border: 'none',
              borderTop: '1px solid var(--border-color) !important',
            },
            
            '.MuiDataGrid-row:hover, .Mui-selected': {
              background: 'var(--bg-color-light) !important',
              cursor: 'pointer'
            },
            '.MuiDataGrid-footerContainer' :{
              border: 'none',
            },
            '.MuiTablePagination-root': {
              color: 'var(--primary-text-color)',
              background: 'var(--bg-color-dark) !important',
            }
          }}
        />
    </Box>
  );
}
