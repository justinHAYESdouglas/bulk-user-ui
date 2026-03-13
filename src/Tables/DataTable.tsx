import { DataGrid, type GridColDef, type GridRowId, type GridRowSelectionModel, type GridRowsProp } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import type { GridApiCommunity } from '@mui/x-data-grid/internals';
import { useState } from 'react';

interface DataTableProps {
  apiRef?: React.RefObject<GridApiCommunity | null>;
  rows: GridRowsProp;
}

const columns: GridColDef[] = [
  { field: 'username', headerName: 'Username', width: 275},
  { field: 'email', headerName: 'Email', width: 275},
  { field: 'role', headerName: 'Role', width: 275},
  { field: 'group', headerName: 'Group', width: 275},
  { field: 'activity', headerName: 'Activity', width: 275},
  { field: 'dateCreated', headerName: 'Date Created', width: 275},
];


const paginationModel = { page: 0, pageSize: 10 };

export default function DataTable({ apiRef, rows }: DataTableProps) {
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>(
    { type: 'include', ids: new Set<GridRowId>() }
  );

  const handleSelectionChange = (newSelection: GridRowSelectionModel) => {
    // In v8, clicking "select all" passes { type: 'exclude', ids: new Set() }
    const isSelectAll = newSelection.type === 'exclude' && newSelection.ids.size === 0;

    if (isSelectAll && apiRef?.current) {
      const { page, pageSize } = apiRef.current.state.pagination.paginationModel;
      const visibleIds = rows
        .slice(page * pageSize, page * pageSize + pageSize)
        .map((r) => r.id);

      // If every visible row is already selected, deselect all (toggle off)
      const allVisibleSelected =
        selectedRows.type === 'include' &&
        visibleIds.every((id) => (selectedRows.ids as Set<GridRowId>).has(id)) &&
        (selectedRows.ids as Set<GridRowId>).size === visibleIds.length;

      if (allVisibleSelected) {
        setSelectedRows({ type: 'include', ids: new Set<GridRowId>() });
      } else {
        setSelectedRows({ type: 'include', ids: new Set<GridRowId>(visibleIds) });
      }
    } else {
      setSelectedRows(newSelection);
    }
  };

  return (
    <Box>
      <DataGrid
        apiRef={apiRef}
        rows={rows}
        rowHeight={64}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[10, 25, 50, { value: rows.length, label: 'All' }]}
        checkboxSelection
        disableColumnFilter={false}
        rowSelectionModel={selectedRows}
        onRowSelectionModelChange={handleSelectionChange}
        sx={{
          minHeight: 754,
          maxHeight: 755,
          background: 'var(--bg-color-darkest)',
          color: 'var(--primary-text-color)',
          border: '2px solid var(--border-color) !important',
          fontSize: 14,
          '.MuiDataGrid-row--borderBottom': {
            background: 'var(--bg-color-light) !important',
          },
          '.MuiDataGrid-scrollbarFiller, & .MuiDataGrid-filler': {
            display: 'none',
          },
          '& .MuiDataGrid-columnHeader': {
            background: 'var(--bg-color-light)',
            border: 'none',
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
            border: 'none',
          },
          '& .MuiSvgIcon-root': {
            fill: 'var(--bg-color-lightest)',
          },
          '.MuiDataGrid-cell': {
            border: 'none',
            borderTop: '1px solid var(--border-color) !important',
          },
          '.MuiDataGrid-row:hover, .Mui-selected': {
            background: 'var(--bg-color-light) !important',
            cursor: 'pointer',
          },
          '.MuiDataGrid-footerContainer': {
            border: 'none',
          },
          '.MuiTablePagination-root': {
            color: 'var(--primary-text-color)',
            background: 'var(--bg-color-dark) !important',
          },
        }}
      />
    </Box>
  );
}