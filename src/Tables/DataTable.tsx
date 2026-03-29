import { DataGrid, type GridColDef, type GridRowId, type GridRowSelectionModel, type GridRowsProp } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import type { GridApiCommunity } from '@mui/x-data-grid/internals';
import { useEffect, useRef } from 'react';
import ArchiveIcon from '@mui/icons-material/Archive';

interface DataTableProps {
  apiRef?: React.RefObject<GridApiCommunity | null>;
  rows: GridRowsProp;
  selectedRows: GridRowSelectionModel;
  onSelectionChange: (model: GridRowSelectionModel) => void;
}

const columns: GridColDef[] = [
  { field: 'username', headerName: 'Username', width: 275},
  { field: 'email', headerName: 'Email', width: 275},
  { field: 'role', headerName: 'Role', width: 275},
  { field: 'group', headerName: 'Group', width: 275},
  {
    field: 'activity',
    headerName: 'Activity',
    width: 275,
    renderCell: (params) => (
      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {params.value === 'Online' && (
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: 'var(--active-user-color)',
            display: 'inline-block',
            flexShrink: 0,
          }} />
        )}
        {params.value === 'Archived' && (
          <ArchiveIcon style={{ fontSize: '16px', flexShrink: 0, color: 'var(--bg-color-lightest)' }} />
        )}
        {params.value === 'Offline' || params.value === 'Archived'
          ? <span style={{ color: 'var(--bg-color-lightest)' }}>{params.value}</span>
          : params.value
        }
      </span>
    ),
  },
  { field: 'dateCreated', headerName: 'Date Created', width: 275},
];


const paginationModel = { page: 0, pageSize: 10 };

export default function DataTable({ apiRef, rows, selectedRows, onSelectionChange }: DataTableProps) {
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = boxRef.current;
    if (!container) return;

    const fixA11y = () => {
      container.querySelectorAll('.MuiDataGrid-cell[title]').forEach((cell) => {
        cell.removeAttribute('title');
      });
      const nativeInput = container.querySelector<HTMLInputElement>('.MuiSelect-nativeInput');
      if (nativeInput) {
        nativeInput.setAttribute('aria-label', 'Rows per page');
      }
      container.querySelectorAll<HTMLInputElement>('input[name="select_row"]').forEach((cb) => {
        cb.removeAttribute('name');
      });
    };

    fixA11y();

    const observer = new MutationObserver(fixA11y);
    observer.observe(container, { subtree: true, childList: true, attributes: true, attributeFilter: ['title'] });

    return () => observer.disconnect();
  }, []);
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
        onSelectionChange({ type: 'include', ids: new Set<GridRowId>() });
      } else {
        onSelectionChange({ type: 'include', ids: new Set<GridRowId>(visibleIds) });
      }
    } else {
      onSelectionChange(newSelection);
    }
  };

  return (
    <Box ref={boxRef}>
      <DataGrid
        apiRef={apiRef}
        rows={rows}
        rowHeight={64}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[10, 25, 50, { value: rows.length, label: 'All' }]}
        checkboxSelection
        disableColumnFilter={false}
        disableColumnMenu
        rowSelectionModel={selectedRows}
        onRowSelectionModelChange={handleSelectionChange}
        slotProps={{
          pagination: {
            SelectProps: {
              inputProps: {
                'aria-label': 'rows per page',
                'aria-labelledby': 'rowsPage',
              },
              id: 'rowsPage',
              native: true,
            },
          },
        }}
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
          '& .MuiDataGrid-cellCheckbox .MuiCheckbox-root, & .MuiDataGrid-columnHeaderCheckbox .MuiCheckbox-root': {
            color: 'var(--bg-color-lightest) !important',
          },
          '& .MuiDataGrid-cellCheckbox .MuiCheckbox-root .MuiSvgIcon-root, & .MuiDataGrid-columnHeaderCheckbox .MuiCheckbox-root .MuiSvgIcon-root': {
            fill: 'var(--bg-color-lightest) !important',
          },
          '& .MuiDataGrid-cellCheckbox .MuiCheckbox-root.Mui-checked, & .MuiDataGrid-cellCheckbox .MuiCheckbox-root.MuiCheckbox-indeterminate, & .MuiDataGrid-columnHeaderCheckbox .MuiCheckbox-root.Mui-checked, & .MuiDataGrid-columnHeaderCheckbox .MuiCheckbox-root.MuiCheckbox-indeterminate': {
            color: 'var(--highlight-color) !important',
          },
          '& .MuiDataGrid-cellCheckbox .MuiCheckbox-root.Mui-checked .MuiSvgIcon-root, & .MuiDataGrid-cellCheckbox .MuiCheckbox-root.MuiCheckbox-indeterminate .MuiSvgIcon-root, & .MuiDataGrid-columnHeaderCheckbox .MuiCheckbox-root.Mui-checked .MuiSvgIcon-root, & .MuiDataGrid-columnHeaderCheckbox .MuiCheckbox-root.MuiCheckbox-indeterminate .MuiSvgIcon-root': {
            fill: 'var(--highlight-color) !important',
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
          '& .MuiSelect-nativeInput': {
            display: 'none',
          },
        }}
      />
    </Box>
  );
}