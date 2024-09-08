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
import { deleteData, getAllData } from '../../../firebase/firestoreService';
import DeleteModal from '../DeleteModal/DeleteModal';
import { Timestamp } from 'firebase/firestore';
import NewsForm from '../NewsForm/NewsForm';
import './NewsTable.css';

interface News {
  id: string;
  title: string;
  content: string;
  image_url: string;
  date: Timestamp;
}

const NewsTable = () => {
  const [newsList, setNewsList] = useState<News[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingNewsId, setDeletingNewsId] = useState<string | null>(null);
  const [shouldRefetch, setShouldRefetch] = useState(true);
  const [newsTitle, setNewsTitle] = useState('');

  useEffect(() => {
    if (shouldRefetch) {
      fetchNews();
    }
  }, [shouldRefetch]);

  const fetchNews = async () => {
    const data = await getAllData('news');
    setNewsList(data);
    setShouldRefetch(false);
  };

  const handleAddNews = () => {
    setEditingNews(null);
    setIsFormOpen(true);
  };

  const handleEditNews = (news: News) => {
    setEditingNews(news);
    setIsFormOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deletingNewsId) {
      await deleteData(deletingNewsId, 'news');
      onNewsChange();
    }
    setIsDeleteModalOpen(false);
    setDeletingNewsId(null);
  };

  const openDeleteModal = (id: string, name: string) => {
    setDeletingNewsId(id);
    setNewsTitle(name);
    setIsDeleteModalOpen(true);
  };

  const onNewsChange = async () => {
    setShouldRefetch(true);
  };

  const getLogoURL = (logoURL: string) => {
    const parts = logoURL.split("/");
    const idLogoUrl = parts[5];
    return `https://drive.google.com/uc?export=view&id=${idLogoUrl}`;
  };

  const truncateDescription = (description: string) => {
    return description.length > 100 ? `${description.substring(0, 110)}...` : description;
  };

  const getDate = (timestamp: Timestamp) => {
    if (timestamp instanceof Timestamp) {
      const date = timestamp.toDate();

      // List of month names
      const monthNames = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
      ];

      // Gets day, month, and year from a date
      const day = date.getDate();
      const monthIndex = date.getMonth();
      const year = date.getFullYear();

      // Create a date with the format "dd Month yyyy"
      const formattedDate = `${day} ${monthNames[monthIndex]} ${year}`;

      return formattedDate;
    }
    return '';
  }

  const columns = useMemo<MRT_ColumnDef<News>[]>(
    () => [
      {
        accessorKey: 'id',
        id: 'id',
        header: 'ID',
        Cell: ({ row }) => (
          <Box sx={{ width: '60px', paddingRight: '0px' }}>
            {row.original.id.substring(0, 6) + ".."}
          </Box>
        ),
        size: 0,
      },
      {
        accessorKey: 'date',
        id: 'date',
        header: 'Date',
        Cell: ({ row }) => (
          <Box>
            {getDate(row.original.date)}
          </Box>
        ),
        size: 120
      },
      {
        accessorKey: 'title',
        id: 'title',
        header: 'Title',
        size: 280
      },
      {
        accessorKey: 'content',
        id: 'content',
        header: 'Content',
        Cell: ({ row }) => truncateDescription(row.original.content),
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
                handleEditNews(row.original)
              }}>
                <IonIcon icon={createOutline}></IonIcon>
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton color="error" onClick={() => {
                openDeleteModal(row.original.id, row.original.title)
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

  const renderDetailPanel = ({ row }: { row: MRT_Row<News> }) => {
    return (
      <>
        <div className="news-image-container">
          <IonText className='news-image-text'>Image</IonText>
          <IonImg
            className='news-image-table'
            src={getLogoURL(row.original.image_url)}
            alt={row.original.title}
          ></IonImg>
        </div>
        <Box className="detail-panel-news" sx={{ padding: '1rem' }}>
          <IonText className='detail-panel-header'>Content</IonText>
          <Box sx={{ marginBottom: '1rem' }}>{row.original.content}</Box>
        </Box>
      </>
    );
  };

  const table = useMaterialReactTable({
    columns,
    data: newsList,
    initialState: {
      sorting: [
        {
          id: 'date',
          desc: true,
        }
      ]
    },
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
        className='add-news'
        color={'medium'}
        onClick={handleAddNews}
        style={{ marginLeft: '16px' }}
      >
        <IonIcon icon={addCircle}></IonIcon>
        &nbsp; Add &nbsp;
        <IonText className='add-news-text'>News</IonText>
      </IonButton>
    ),
    renderDetailPanel: renderDetailPanel
  });

  return (
    <>
      <MaterialReactTable table={table} />
      <NewsForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onNewsChange={onNewsChange}
        news={editingNews}
      />
      {isDeleteModalOpen && (
        <DeleteModal
          title={newsTitle}
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          handleDelete={handleDeleteConfirm}
        />
      )}
    </>
  );
};

export default NewsTable;
