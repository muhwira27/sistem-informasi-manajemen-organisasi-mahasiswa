import { useEffect, useMemo, useState } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { IonButton, IonIcon, IonImg, IonText } from '@ionic/react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  MRT_Row,
} from 'material-react-table';
import { addCircle, createOutline, trashOutline } from 'ionicons/icons';
import { deleteData, getAllData, getDataById } from '../../../firebase/firestoreService';
import OrganizationForm from '../OrganizationForm/OrganizationForm';
import DeleteModal from '../DeleteModal/DeleteModal';
import './OrganizationsTable.css';
import EditOfficerForm from '../EditOfficerForm/EditOfficerForm';

interface Organization {
  id: string;
  name: string;
  logo_url: string;
  description: string;
  socmed: Socmed;
  members: Members;
}

interface Socmed {
  instagram: string;
  facebook: string;
  youtube: string;
  tiktok: string;
  x: string;
}

interface Members {
  lead: string;
  secretary: string;
  treasurer: string;
}

interface Member {
  id: string,
  nim: string,
  name: string,
  role: string
}

const OrganizationsTable = () => {
  const [organizationList, setOrganizationList] = useState<Organization[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOrganization, setEditingOrganization] = useState<Organization | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deletingOrganizationId, setDeletingOrganizationId] = useState<string | null>(null);
  const [shouldRefetch, setShouldRefetch] = useState(true);
  const [organizationName, setOrganizationName] = useState('');
  const [isEditOfficer, setIsEditOfficer] = useState(false);
  const [organizationId, setOrganizationId] = useState('');
  const [roleToEdit, setRoleToEdit] = useState('');
  const socmedOrder = ['instagram', 'facebook', 'youtube', 'tiktok', 'x'];

  useEffect(() => {
    if (shouldRefetch) {
      fetchOrganizations();
    }
  }, [shouldRefetch]);

  const fetchOrganizations = async () => {
    const data = await getAllData('organizations');
    setOrganizationList(data);
    setShouldRefetch(false);
  };

  const handleAddOrganization = () => {
    setIsFormOpen(true);
    setEditingOrganization(null);
  };

  const handleEditOrganization = (organization: Organization) => {
    setEditingOrganization(organization);
    setIsEditModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deletingOrganizationId) {
      await deleteData(deletingOrganizationId, 'organizations');
      onOrganizationChange();
    }
    setIsDeleteModalOpen(false);
    setDeletingOrganizationId(null);
  };

  const handleEditOfficer = (role: string, id: string) => {
    setRoleToEdit(role);
    setOrganizationId(id);
    setIsEditOfficer(true);
  };

  const openDeleteModal = (id: string, name: string) => {
    setDeletingOrganizationId(id);
    setOrganizationName(name);
    setIsDeleteModalOpen(true);
  };

  const onOrganizationChange = async () => {
    setShouldRefetch(true);
  };

  const getLogoURL = (logoURL: string) => {
    const parts = logoURL.split("/");
    const idLogoUrl = parts[5];
    return `https://drive.google.com/thumbnail?id=${idLogoUrl}`;
  };

  const truncateDescription = (description: string) => {
    return description.length > 100 ? `${description.substring(0, 100)}...` : description;
  };

  const renderSocmed = (socmed: Socmed) => {
    return socmedOrder.map((key) => {
      const value = socmed[key as keyof Socmed];
      if (value) {
        return (
          <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <IonImg
              src={`/src/assets/icons/${key}.svg`}
              style={{ height: '22px', marginBottom: '2px' }}
              alt={key}
            />
            {value}
          </Box>
        );
      }
      return null;
    });
  };

  const columns = useMemo<MRT_ColumnDef<Organization>[]>(
    () => [
      {
        accessorKey: 'id',
        id: 'id',
        header: 'ID',
        Cell: ({ row }) => (
          <Box sx={{ maxWidth: '16px' }}>
            {parseInt(row.original.id)}
          </Box>
        ),
        size: 40
      },
      {
        id: 'logo',
        header: 'Logo',
        Cell: ({ row }) => (
          <IonImg
            src={getLogoURL(row.original.logo_url)}
            style={{ height: 50 }}
            alt={row.original.name}
          />
        ),
        size: 30
      },
      {
        accessorKey: 'name',
        id: 'name',
        header: 'Name',
        size: 220
      },
      {
        accessorKey: 'description',
        id: 'description',
        header: 'Description',
        Cell: ({ row }) => truncateDescription(row.original.description),
        size: 300
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
              <IconButton onClick={() => {
                handleEditOrganization(row.original)
              }}>
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
        size: 90,
        enableClickToCopy: false
      },
    ],
    [],
  );

  const renderDetailPanel = ({ row }: { row: MRT_Row<Organization> }) => {
    const [membersName, setMembersName] = useState({ lead: '', secretary: '', treasurer: '' });
    const [membersNim, setMembersNim] = useState({ lead: '', secretary: '', treasurer: '' });

    useEffect(() => {
      const fetchMemberNames = async () => {
        const data: Member[] = await getAllData(`/organizations/${row.original.id}/members`);

        const lead = data.find(member => member.role === "Ketua Umum");
        const secretary = data.find(member => member.role === "Sekretaris");
        const treasurer = data.find(member => member.role === "Bendahara");

        setMembersName({
          lead: lead?.name || '',
          secretary: secretary?.name || '',
          treasurer: treasurer?.name || '',
        });

        setMembersNim({
          lead: lead?.nim || '',
          secretary: secretary?.nim || '',
          treasurer: treasurer?.nim || '',
        });
      };

      fetchMemberNames();
    }, [shouldRefetch]);

    return (
      <Box className="detail-panel-organization" sx={{ padding: '1rem' }}>
        <IonText className='detail-panel-header'>Organization Officer</IonText>
        <Box sx={{ marginBottom: '20px' }}>
          <div className='edit-officer-container'>
            <IonText>Ketua Umum: {`${membersName.lead} (${membersNim.lead})\n`}</IonText>
            <IconButton
              className='edit-officer-button'
              onClick={() => {
                handleEditOfficer('Ketua Umum', row.original.id);
              }}
            >
              <IonIcon className='edit-officer-icon' icon={createOutline}></IonIcon>
            </IconButton>
          </div>
          <div className='edit-officer-container'>
            <IonText>Sekretaris:  {`${membersName.secretary} (${membersNim.secretary})\n`}</IonText>
            <IconButton
              className='edit-officer-button'
              onClick={() => {
                handleEditOfficer('Sekretaris', row.original.id);
              }}
            >
              <IonIcon className='edit-officer-icon' icon={createOutline}></IonIcon>
            </IconButton>
          </div>
          <div className='edit-officer-container'>
            <IonText>Bendahara : {`${membersName.treasurer} (${membersNim.treasurer})`}</IonText>
            <IconButton
              className='edit-officer-button'
              onClick={() => {
                handleEditOfficer('Bendahara', row.original.id);
              }}
            >
              <IonIcon className='edit-officer-icon' icon={createOutline}></IonIcon>
            </IconButton>
          </div>
        </Box>
        <IonText className='detail-panel-header'>Description</IonText>
        <Box sx={{ marginBottom: '1.5rem' }}>{row.original.description}</Box>
        <IonText className='detail-panel-header'>Social Media</IonText>
        {renderSocmed(row.original.socmed)}
      </Box>
    );
  };

  const table = useMaterialReactTable({
    columns,
    data: organizationList.sort((a, b) => parseInt(a.id) - parseInt(b.id)),
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
    renderTopToolbarCustomActions: () => (
      <IonButton
        className='add-organization'
        color={'medium'}
        onClick={handleAddOrganization}
      >
        <IonIcon icon={addCircle}></IonIcon>
        &nbsp; Add &nbsp;
        <IonText className='add-organization-text'>Organization</IonText>
      </IonButton>
    ),
    renderDetailPanel: renderDetailPanel
  });

  return (
    <>
      <MaterialReactTable table={table} />
      <OrganizationForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onOrganizationAdded={onOrganizationChange}
      />
      <OrganizationForm
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onOrganizationAdded={onOrganizationChange}
        organization={editingOrganization}
      />
      <DeleteModal
        title={organizationName}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        handleDelete={handleDeleteConfirm}
      />

      <EditOfficerForm
        isOpen={isEditOfficer}
        onClose={() => setIsEditOfficer(false)}
        onMemberChange={onOrganizationChange}
        organizationId={organizationId}
        roleToEdit={roleToEdit}
      />
    </>
  );
};

export default OrganizationsTable;
