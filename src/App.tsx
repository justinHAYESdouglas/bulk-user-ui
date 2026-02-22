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
import { Box } from '@mui/material';
import { useGridApiRef } from '@mui/x-data-grid';
import './App.css';

function App() {
  const apiRef = useGridApiRef();

  return (
    <>
      <Nav />
      <main>
        <h1>Users</h1>
        <Box
          id="table-btn-wrapper"
          sx={{
            display: 'flex',
            '& button:last-child': {
              marginLeft: 'auto',
            },
          }}
        >
          <Edit />
          <Add />
          <AddToGroup />
          <Lock />
          <Unlock />
          <Export />
          <Delete />
          <SearchFilter apiRef={apiRef} />
        </Box>

        <Box>
          <DataTable apiRef={apiRef} />
        </Box>
      </main>
    </>
  );
}

export default App;
