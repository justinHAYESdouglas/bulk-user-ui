import Nav from './Components/Nav';
import Edit from './Table_Btns/Edit';
import Add from './Table_Btns/Add';
import AddToGroup from './Table_Btns/AddToGroup';
import Lock from './Table_Btns/Lock';
import Unlock from './Table_Btns/Unlock';
import Export from './Table_Btns/Export';
import Delete from './Table_Btns/Delete';
import SearchFilter from './Table_Btns/SearchFilter';
import DataTable from './Tables/DataTable';
import { Box, Typography } from '@mui/material';
import { useGridApiRef } from '@mui/x-data-grid';
import './App.css';

function App() {
  const apiRef = useGridApiRef();

  return (
    <>
      <Nav />

      <main>
        <Typography variant="h1"
          sx={{
            fontWeight:'unset',
            fontSize: '34px',
            transform: 'scaleY(1.2)',
            letterSpacing: 1
          }}
        >
          Users
          
          </Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <Box
            id="table-btn-wrapper"
            sx={{
              display: 'flex',
              gap: '8px',
              padding: '12px 0 12px 0',
              borderTop: '2px solid var(--primary-text-color)',
            }}
          >
            <Edit />
            <Add />
            <AddToGroup />
            <Lock />
            <Unlock />
            <Export />
            <Delete />
          </Box>

          <Box
            sx={{
              display: 'flex',
              marginLeft: 'auto',
              alignItems: 'center',
            }}
          >
            <SearchFilter apiRef={apiRef} />
          </Box>
        </Box>

        <Box>
          <DataTable apiRef={apiRef} />
        </Box>
      </main>
    </>
  );
}

export default App;
