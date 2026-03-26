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
import { Box, Typography, Snackbar, Alert } from '@mui/material';
import { useGridApiRef } from '@mui/x-data-grid';
import { type GridRowId, type GridRowSelectionModel } from '@mui/x-data-grid';
import { useState } from 'react';
import usersData from './data/users.json';
import './App.css';

export type User = (typeof usersData[number]) & { previousActivity?: string };

// this is an enterprise bluk usermanagment frontend
function App() {
  const apiRef = useGridApiRef();
  const [users, setUsers] = useState<User[]>(usersData);
  const [snackbar, setSnackbar] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>(
    { type: 'include', ids: new Set<GridRowId>() }
  );

  const selectedUsers = users.filter((u) =>
    selectedRows.type === 'include' && (selectedRows.ids as Set<GridRowId>).has(u.id)
  );

  const handleAddUser = (user: User) => {
    setUsers((prev) => [user, ...prev]);
    setSnackbar(`${user.username} added successfully`);
  };

  const handleEditUsers = (updatedUsers: User[]) => {
    const updatedMap = new Map(updatedUsers.map((u) => [u.id, u]));
    setUsers((prev) => prev.map((u) => updatedMap.get(u.id) ?? u));
    const msg = updatedUsers.length === 1
      ? `${updatedUsers[0].username} updated successfully`
      : `${updatedUsers.length} users updated successfully`;
    setSnackbar(msg);
  };

  const handleAddToGroup = (groupName: string) => {
    setUsers((prev) => prev.map((u) => {
      if (!(selectedRows.ids as Set<number>).has(u.id)) return u;
      const existing = u.group ? u.group.split(', ').filter(Boolean) : [];
      if (existing.includes(groupName)) return u;
      return { ...u, group: [...existing, groupName].join(', ') };
    }));
    const msg = selectedUsers.length === 1
      ? `${selectedUsers[0].username} added to "${groupName}"`
      : `${selectedUsers.length} users added to "${groupName}"`;
    setSnackbar(msg);
  };

  const handleDeleteUsers = (ids: number[], deletedUsers: User[]) => {
    setUsers((prev) => prev.filter((u) => !ids.includes(u.id)));
    setSelectedRows({ type: 'include', ids: new Set() });
    const msg = deletedUsers.length === 1
      ? `${deletedUsers[0].username} has been deleted`
      : `${deletedUsers.length} users have been deleted`;
    setSnackbar(msg);
  };

  const handleDeleteGroup = (name: string) => {
    setUsers((prev) => prev.map((u) => u.group === name ? { ...u, group: '' } : u));
  };

  const handleRenameGroup = (oldName: string, newName: string) => {
    setUsers((prev) => prev.map((u) => u.group === oldName ? { ...u, group: newName } : u));
  };

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
            <Edit users={selectedUsers} onEditUsers={handleEditUsers} />
            <Add onAddUser={handleAddUser} users={users} />
            <AddToGroup onGroupCreated={(name) => setSnackbar(`"${name}" Group created`)} onDeleteGroup={handleDeleteGroup} onRenameGroup={handleRenameGroup} onGroupsUpdated={(msg) => setSnackbar(msg)} onAddToGroup={handleAddToGroup} selectedCount={selectedUsers.length} />
            <Export />
            <Delete selectedUsers={selectedUsers} onDeleteUsers={(ids, users) => handleDeleteUsers(ids, users)} />
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
          <DataTable apiRef={apiRef} rows={users} selectedRows={selectedRows} onSelectionChange={setSelectedRows} />
        </Box>
      </main>

      <Snackbar
        open={snackbar !== null}
        autoHideDuration={3500}
        onClose={() => setSnackbar(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        sx={{
          background: 'var(--bg-color-light)',
          borderLeft: '2px solid var(--primary-text-color)',
          borderRadius: '4px',
          marginBottom: '50px',
          padding: 1
        }}
      >
        <Alert onClose={() => setSnackbar(null)} severity="success" variant="filled">
          {snackbar}
        </Alert>
      </Snackbar>
    </>
  );
}

export default App;
