import { useMemo, useState, useEffect } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { IonButton, IonIcon, IonText } from '@ionic/react';
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { addCircle, createOutline, trashOutline } from 'ionicons/icons';
import { deleteData, getAllData } from '../../../firebase/firestoreService';
import UserForm from '../UserForm';
import DeleteModal from '../DeleteModal/DeleteModal';
import './UsersTable.css';

interface User {
  id: string;
  name: string;
  nim: string;
  email: string;
  phone: string;
  role: number;
}

const UsersTable = () => {
  const [userList, setUserList] = useState<User[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [shouldRefetch, setShouldRefetch] = useState(true);

  useEffect(() => {
    if (shouldRefetch) {
      fetchUsers();
    }
  }, [shouldRefetch]);

  const fetchUsers = async () => {
    const data = await getAllData('users');
    // Filter out users with role == 1
    const filteredData = data.filter(user => user.role !== 1);
    setUserList(filteredData);
    setShouldRefetch(false);
  };

  const handleAddUser = () => {
    setIsFormOpen(true);
    setEditingUser(null);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deletingUserId) {
      await deleteData(deletingUserId, 'users');
      onUserChange();
    }
    setIsDeleteModalOpen(false);
    setDeletingUserId(null);
  };

  const openDeleteModal = (id: string, name: string) => {
    setDeletingUserId(id);
    setUserName(name);
    setIsDeleteModalOpen(true);
  };

  const onUserChange = async () => {
    setShouldRefetch(true);
  };

  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      {
        accessorKey: 'id',
        id: 'id',
        header: 'ID',
        size: 50,
        Header:
          <Box sx={{ paddingLeft: '16px' }}>
            ID
          </Box>,
        Cell: ({ row }) => (
          <Box sx={{ paddingLeft: '16px', width: '96px' }}>
            {row.original.id.substring(0, 8) + ".."}
          </Box>
        ),
      },
      {
        accessorKey: 'nim',
        id: 'nim',
        header: 'NIM',
        size: 90,
      },
      {
        accessorKey: 'name',
        id: 'name',
        header: 'Name',
        size: 200,
      },
      {
        accessorKey: 'email',
        id: 'email',
        header: 'Email',
        size: 200,
      },
      {
        accessorKey: 'phone',
        id: 'phone',
        header: 'Phone',
        size: 200,
      },
      {
        id: 'actions',
        header: 'Actions',
        Header:
          <Box sx={{ paddingLeft: '16px' }}>
            Actions
          </Box>,
        Cell: ({ row }) => (
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Tooltip title="Edit">
              <IconButton onClick={() => handleEditUser(row.original)}>
                <IonIcon icon={createOutline}></IonIcon>
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton color="error" onClick={() => {
                openDeleteModal(row.original.id, row.original.name)
              }}>
                <IonIcon icon={trashOutline}></IonIcon>
              </IconButton>
            </Tooltip>
          </Box>
        ),
        size: 100,
        enableClickToCopy: false,
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: userList,
    enableFullScreenToggle: false,
    enableColumnActions: false,
    enableClickToCopy: true,
    muiPaginationProps: {
      color: 'primary',
      shape: 'rounded',
      variant: 'outlined',
    },
    paginationDisplayMode: 'pages',
    muiTableHeadCellProps: {
      sx: { fontSize: '1rem' },
    },
    renderTopToolbarCustomActions: ({ table }) => (
      <IonButton
        className='add-user'
        color={'medium'}
        onClick={handleAddUser}
      >
        <IonIcon icon={addCircle}></IonIcon>
        &nbsp; Add &nbsp;
        <IonText className='add-user-text'>User</IonText>
      </IonButton>
    ),
  });

  return (
    <>
      <MaterialReactTable table={table} />
      <UserForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onUserChange={onUserChange}
      />
      <UserForm
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUserChange={onUserChange}
        user={editingUser}
      />
      {isDeleteModalOpen && (
        <DeleteModal
          title={userName}
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          handleDelete={handleDeleteConfirm}
        />
      )}
    </>
  );
};

export default UsersTable;


