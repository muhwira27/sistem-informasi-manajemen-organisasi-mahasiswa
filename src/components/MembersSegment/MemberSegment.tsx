import { useContext, useEffect, useMemo, useState } from 'react';
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { deleteData, getAllData, getDataById, updateData } from '../../firebase/firestoreService';
import { useParams } from 'react-router-dom';
import { IconButton, Tooltip } from '@mui/material';
import { IonButton, IonIcon, IonText } from '@ionic/react';
import { AuthContext } from '../../context/authContext';
import { addCircle, trashOutline } from 'ionicons/icons';
import { readCookieItems } from '../../utils/cookieFunctions';
import MemberForm from '../MemberForm/MemberForm';
import DeleteConfirm from '../DeleteConfirm/DeleteConfirm';
import './MembersSegment.css';

type Params = {
  id: string;
};

type Member = {
  id: string;
  name: string;
  nim: string;
  role: string;
};

const MembersSegment = () => {
  const { id } = useParams<Params>();
  const { currentUser } = useContext(AuthContext);
  const [members, setMembers] = useState<Member[]>([]);
  const [memberToDelete, setMemberToDelete] = useState<Member>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [shouldRefetch, setShouldRefetch] = useState(true);
  const [isDelete, setIsDelete] = useState(false);
  const roleOrder = ['Ketua Umum', 'Sekretaris', 'Bendahara', 'Anggota'];

  useEffect(() => {
    if (shouldRefetch) {
      fetchMembers();
      setShouldRefetch(false);
    }
  }, [id, currentUser, shouldRefetch])

  useEffect(() => {
    verifyAdminStatus();
  }, [id, currentUser])

  useEffect(() => {
    return () => {
      setMembers([]);
      setShouldRefetch(true);
      setIsAdmin(false);
    };
  }, [id]);

  const verifyAdminStatus = async () => {
    const user = readCookieItems('user');
    if (user) {
      const userData = await getDataById(user.uid, 'users');
      const organization = userData?.organizations?.find((org: Record<string, string>) =>
        org.id === id
      );
      const role = organization ? organization.role : null;
      const adminRole = [
        'Ketua Umum',
        'Sekretaris',
      ]
      setIsAdmin(adminRole.includes(role));
    } else {
      setIsAdmin(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const membersData = await getAllData(`/organizations/${id}/members`);

      const sortedMembers = membersData.sort((a, b) => {
        const roleIndexA = roleOrder.indexOf(a.role);
        const roleIndexB = roleOrder.indexOf(b.role);
        return roleIndexA - roleIndexB;
      });

      setMembers(sortedMembers);
    } catch (error) {
      console.error("Error fetching members data:", error);
    }
  };

  const handleAddMember = () => {
    setIsFormOpen(true);
  };

  const onMemberChange = async () => {
    setShouldRefetch(true);
  };

  const onDelete = (member: Member) => {
    setMemberToDelete(member);
    setIsDelete(true);
  };

  const handleDelete = async () => {
    try {
      if (memberToDelete) {
        // Get member Data
        const userData = await getDataById(memberToDelete.id, 'users');

        if (!userData) {
          throw new Error("User not found");
        }

        // Filter out the organization with the specific id
        const updatedOrganizations = userData.organizations?.filter((org: Record<string, string>) => org.id !== id);

        // Update the user data with the new organizations array
        await updateData(memberToDelete.id, { organizations: updatedOrganizations }, 'users');

        // Delete Member From Organization and Member lisy
        await deleteData(memberToDelete.id, `/organizations/${id}/members`);
        await deleteData(memberToDelete.id, 'member_list');

        await onMemberChange();
      }
    } catch (error) {
      console.log('Error deleting member: ', error)
    }
  };

  const columns = useMemo<MRT_ColumnDef<Member>[]>(
    () => [
      {
        accessorKey: 'nim',
        header: 'NIM',
        size: 90,
      },
      {
        accessorKey: 'name',
        header: 'Name',
        size: 300,
      },
      {
        accessorKey: 'role',
        header: 'Role',
        size: 300,
      },
    ],
    [],
  );

  const columnsAdmin = useMemo<MRT_ColumnDef<Member>[]>(
    () => [
      {
        accessorKey: 'nim',
        header: 'NIM',
        size: 90,
      },
      {
        accessorKey: 'name',
        header: 'Name',
        size: 300,
      },
      {
        accessorKey: 'role',
        header: 'Role',
        size: 300,
      },
      {
        id: 'actions',
        header: 'Actions',
        Cell: ({ row }) => {
          if (row.original.role === 'Anggota') {
            return (
              <Tooltip title="Delete" style={{ paddingLeft: '16px' }}>
                <IconButton color="error" onClick={() => { onDelete(row.original) }}>
                  <IonIcon icon={trashOutline}></IonIcon>
                </IconButton>
              </Tooltip>
            );
          }
          return null;
        },
        size: 100,
        enableClickToCopy: false,
      },
    ],
    [],
  );


  const table = useMaterialReactTable({
    columns: isAdmin ? columnsAdmin : columns,
    data: members,
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
    renderTopToolbarCustomActions: ({ table }) => {
      return isAdmin ?
        <IonButton
          className='add-member'
          color={'medium'}
          onClick={handleAddMember}
        >
          <IonIcon icon={addCircle}></IonIcon>
          &nbsp; Add &nbsp;
          <IonText className='add-member-text'>Member</IonText>
        </IonButton>
        : <div></div>
    },
  });

  return (
    <div>
      <MaterialReactTable table={table} />

      <MemberForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onMemberChange={onMemberChange}
        organizationId={id}
      />

      <DeleteConfirm
        segment='Member'
        title={memberToDelete.name}
        isOpen={isDelete}
        onClose={() => setIsDelete(false)}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default MembersSegment;
