import React, { useState, memo } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Breadcrumbs,
  Typography,
  Link,
  Button,
  Card,
  CardContent,
  Modal,
  IconButton,
  Container,
  TextField,
  CircularProgress,
  CardHeader,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Chip,
} from '@mui/material';
import Carousel from 'react-material-ui-carousel';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

import parse from 'html-react-parser';

import ImageUpload from '../../../components/FileUpload';
import TextEditor from '../../../components/TextEditor';
import { customFieldOnChange } from '../../../helper/constants';
import getInputComponent, { parseValueOfType } from './../../../helper/types';
import { generateCollections } from '../../../Data';
import CommentSection from './comments';

const __item = generateCollections(1, 10)[0].items[0];

export default function ItemDetailPage() {
  const TextEditMemo = memo(TextEditor);
  const nav = useNavigate();
  const { itemId } = useParams();
  const [item, setItem] = useState(__item);
  const [isEditing, setIsEditing] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editedItem, setEditedItem] = useState(__item);

  function handleImageClick(image) {
    setZoomedImage(image);
  };

  function handleCloseZoom() {
    setZoomedImage(null);
  };

  function handleEdit() {
    setIsEditing(true);
  };

  function handleCancel() {
    setIsEditing(false);
    // Reset any changes
    setEditedItem(item);
  };

  function fetchItem() {

  }

  async function handleSave() {
    setIsEditing(false);
    setItem(editedItem);
  };

  function handleNameChange(event) {
    setEditedItem(old => ({ ...old, name: event.target.value }));
  };

  function handleDescriptionChange(content) {
    setEditedItem(old => ({ ...old, description: content }));
  };

  function handleImagesChange(newImages) {
    setEditedItem(old => ({ ...old, images: newImages }));
  };

  function handleCustomColumnChange(value, index) {
    setEditedItem(old => {
      const oldFields = Array.from(old.customFields);
      oldFields[index].value = value;
      return { ...old, customFields: oldFields };
    });
  }

  if (isLoading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!item) {
    return (
      <Container maxWidth="md">
        <Typography variant='h4'>Item not found by this id: {itemId}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 0 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link component={RouterLink} to="/">Home</Link>
          <Link component={RouterLink} to="/collections">Collections</Link>
          <Link component={RouterLink} to={`/collections/${1}`}>{item.collectionName}</Link>
          <Typography color="text.primary">{item.name}</Typography>
        </Breadcrumbs>

        <Card>
          <CardHeader title={
            <Box display={'flex'}>
              {/* Item name */}
              {isEditing ? (
                <TextField
                  variant="outlined"
                  value={item.name}
                  onChange={handleNameChange}
                  sx={{ mb: 2 }}
                />
              ) : (
                <Typography variant="h4" component="h1" gutterBottom>
                  {item.name}
                </Typography>
              )}

              <Box sx={{ flexGrow: 1 }} />
              <Box>
                {isEditing ? (
                  <>
                    <Button startIcon={<SaveIcon />} variant="contained" color="primary" onClick={handleSave} sx={{ mr: 1 }}>
                      Save
                    </Button>
                    <Button startIcon={<CancelIcon />} variant="outlined" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button startIcon={<EditIcon />} variant="outlined" onClick={handleEdit} sx={{ mr: 1 }}>
                      Edit
                    </Button>
                    <Button startIcon={<DeleteIcon />} variant="outlined" color="error">
                      Delete
                    </Button>
                  </>
                )}
              </Box>
            </Box>
          } />
          <CardContent>
            {/* Item images */}
            {isEditing ? (
              <ImageUpload
                initialImages={item.images}
                onImagesChange={handleImagesChange}
              />
            ) : item.images && item.images.length > 0 && (
              <Box sx={{ mb: 2, maxWidth: '500px', margin: 'auto' }}>
                <Carousel>
                  {item.images.map((image, index) => (
                    <Box
                      key={index}
                      sx={{
                        height: '300px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleImageClick(image)}
                    >
                      <img
                        src={typeof image === 'string' ? image : image.preview}
                        alt={`${item.name} ${index + 1}`}
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain',
                        }}
                      />
                    </Box>
                  ))}
                </Carousel>
              </Box>
            )}

            <Box>
              <Typography variant='h4' fontWeight={700}>Description</Typography>
              <hr />
            </Box>

            {/* Item description */}
            <Box sx={{ mb: 3 }}>
              {isEditing ? (
                <TextEditMemo
                  initialContent={editedItem.description}
                  onContentChange={handleDescriptionChange}
                  placeholder='Description'
                />
              ) : (
                // <Typography variant="body1" paragraph dangerouslySetInnerHTML={{ __html: item.description }} />
                <Typography>{parse(item.description)}</Typography>
              )}
            </Box>

            <Box>
              <Typography variant='h4' fontWeight={700}>Tags</Typography>
              <hr />
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
              {
                item.tags.map(tag => (
                  <Box sx={{ p: 1 }}>
                    <Chip
                      key={tag.id}
                      label={tag.value}
                      clickable
                      onClick={() => nav('/search?t=' + tag.value)}
                    />
                  </Box>
                ))
              }
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant='h4' fontWeight={700}>Custom Attributes</Typography>
              <hr />
            </Box>

            <Box>
              {isEditing ? (
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell component="th" align="left">Attribute Name</TableCell>
                        <TableCell align="left">Attribute Value</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {editedItem.customFields.map((field, index) => (
                        <TableRow
                          key={index}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell component="th" scope="row">{field.name}</TableCell>
                          <TableCell align="left">{getInputComponent(
                            {
                              type: field.type,
                              value: field.value,
                              onChange: (newValue) => {
                                const parsed = customFieldOnChange(newValue, field.type);
                                handleCustomColumnChange(parsed, index);
                              },
                              label: field.name
                            }
                          )}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )
                : (
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell component="th" align="left">Attribute Name</TableCell>
                          <TableCell align="left">Attribute Value</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {item.customFields.map((field, i) => (
                          <TableRow
                            key={i}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell component="th" scope="row">{field.name}</TableCell>
                            <TableCell align="left">{parseValueOfType({ type: field.type, value: field.value })}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )
              }
            </Box>

          </CardContent>
        </Card>

        {/* Image Zoom Modal */}
        <Modal
          open={Boolean(zoomedImage)}
          onClose={handleCloseZoom}
          aria-labelledby="zoom-modal"
          aria-describedby="zoom-modal-description"
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '95vw',
            height: '95vh',
            bgcolor: 'transparent',
            backdropFilter: 'blur(25px)',
            border: '2px solid #000',
            boxShadow: 24,
            p: 0,
            display: 'flex',
            flexDirection: 'column',
          }}>
            <Box sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              p: 1,
              bgcolor: 'rgba(0, 0, 0, 0.03)',
            }}>
              <IconButton
                aria-label="close"
                onClick={handleCloseZoom}
                sx={{ color: (theme) => theme.palette.grey[500] }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <Box sx={{
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}>
              <img
                src={zoomedImage}
                alt="Zoomed view"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                }}
              />
            </Box>
          </Box>
        </Modal>
      </Box>
      <CommentSection itemId={itemId} />
    </Container>
  );
};
