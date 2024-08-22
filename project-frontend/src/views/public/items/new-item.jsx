import React, { useState, useRef, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {
  Box,
  Step,
  StepLabel,
  Stepper,
  Typography,
  Slide,
  IconButton,
  useTheme,
  TableContainer,
  Paper,
  Table,
  TableRow,
  TableCell,
  TableBody,
  List,
  ListItem,
  ListItemText,
  Grid,

} from '@mui/material';
import { CloseRounded } from '@mui/icons-material';

import ImageUpload from '../../../components/FileUpload';
import { customFieldOnChange, customScrollbar } from '../../../helper/constants';
import getInputComponent, { getDefaultValues } from '../../../helper/types';
import TagSelector from './../../../components/Tags/index';

const availableTags = ['tag1', 'tag2', 'tag3'];

const steps = ['Name and Image', 'Custom Fields', 'Review'];
const emptyForm = {
  name: '',
  description: '',
  tags: [],
  images: [],
  customFieldValues: [],
};

export default function NewItem({ open, handleClose, onSave, isUpdate, collection }) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const dialogContentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  const [slideDirection, setSlideDirection] = useState('left');
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    function updateHeight(){
      if (dialogContentRef.current) {
        const height = window.innerHeight * 0.8; // 80% of viewport height
        setContentHeight(height);
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  useEffect(() => {
    if (collection) {
      // TODO: this also needs itemId, which can only be assinged in the backend
      const defaultValues = collection.customFields.map(field => ({ customFieldId: field.id, value: getDefaultValues(field.type) }));
      setFormData({ ...emptyForm, customFieldValues: defaultValues });
    }
  }, [collection]);

  function handleNext(isSubmit) {
    if (isSubmit) {
      const payload = {
        ...formData //, customFields: customFields
      };
      // on parent, re-fetch using onSave
    }
    else {
      setSlideDirection('left');
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  }

  function handleBack() {
    setSlideDirection('right');
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }

  function handleInputChange(value, fieldName) {
    setFormData(old => ({ ...old, [fieldName]: value }));
  }

  function handleImageChange(newImages) {
    if (typeof newImages === 'number') {
      setFormData(old => ({ ...old, images: old.images.filter((_, index) => index !== newImages) }));
    }
    else setFormData(old => ({ ...old, images: newImages }));
  }

  function firstStepFinished() {
    if (!formData || typeof formData.name !== 'string') {
      return false;
    }
    return formData.name === '' || formData.name.length === 0;
  }

  function handleCustomFieldValueChange(value, index, id) {
    setFormData(old => {
      const oldValues = Array.from(old.customFieldValues);
      oldValues[index] = { customFieldId: id, value: value };
      return { ...old, customFieldValues: oldValues };
    });
  }

  function handleTagChange(newTag) {
    setFormData(old => ({ ...old, tags: newTag }))
  }

  function closeModal() {
    setActiveStep(0);
    setFormData({
      name: '',
      description: '',
      tags: [],
      images: [],
      customFieldValues: [],
    });
    handleClose();
  }

  const getStepContent = !formData ? () => { } : (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={1}>
            <Grid item sm={12}>
              <TextField
                fullWidth
                required
                margin="normal"
                label="Item Name"
                name="Name"
                value={formData.name}
                onChange={e => handleInputChange(e.target.value, 'name')}
              />
            </Grid>
            <Grid item sm={12}>
              <TagSelector onChange={handleTagChange} options={availableTags} />
              <Box sx={{ height: '10px' }} />
            </Grid>
            <Grid item sm={12}>
              <ImageUpload
                initialImages={formData.images}
                onImagesChange={handleImageChange}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableBody>
                {
                  collection.customFields.map((field, index) => (
                    <TableRow
                      key={index}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell>{field.name}</TableCell>
                      <TableCell>
                        {getInputComponent(
                          {
                            type: field.type,
                            value: formData.customFieldValues[index].value,
                            onChange: (newValue) => {
                              const parsed = customFieldOnChange(newValue, field.type);
                              handleCustomFieldValueChange(parsed, index, field.id);
                            },
                            label: field.name
                          }
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          </TableContainer>
        );
      case 2:
        return (
          <Box sx={{ mt: 1 }}>
            <Typography variant="h5">Review your information</Typography>
            <hr />

            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableBody>
                  <TableRow
                    key={0}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>Name</TableCell>
                    <TableCell>{formData.name}</TableCell>
                  </TableRow>

                  <TableRow
                    key={2}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>Images</TableCell>
                    <TableCell>
                      {formData.images.length === 0 && ('No Image Selected')}
                      {formData.images.map((image, index) => (
                        <img src={typeof image === 'string' ? image : image.preview} alt='...' height={200} />
                      ))}
                    </TableCell>
                  </TableRow>
                  <TableRow
                    key={3}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>Custom Fields</TableCell>
                    <TableCell>
                      {formData.images.length === 0 && ('No Custom Fields')}
                      <Paper
                        elevation={3}
                        sx={{
                          mt: 2,
                          borderRadius: 2,
                          backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#f5f5f5',
                        }}
                      >
                        <List sx={{
                          py: formData.customFields.length === 0 ? 0 : 1,
                          px: 2,
                        }}>
                          {formData.customFields.length === 0 && (
                            <ListItem
                              key={5}
                            >
                              <ListItemText primary={`No Custom Fields Added`} secondary={` `} />
                            </ListItem>
                          )}
                          {formData.customFields.map((field, index) => (
                            <ListItem
                              key={index}
                            >
                              <ListItemText
                                primary={`Field Name:  ${field.name}`}
                                secondary={`Value Type: ${field.type.value} - ${field.isRequired ? 'Required' : 'Not Required'}`}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Paper>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  if (formData === null) {
    <React.Fragment>
      Loading Dialog
    </React.Fragment>
  }

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={closeModal}
        PaperProps={{
          component: 'form',
          style: { height: '90vh', display: 'flex', flexDirection: 'column' } // Set dialog height to 90% of viewport
        }}
        fullWidth={true}
        maxWidth='xl'
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant='h4'>Add a new Item to {collection?.name} Collection</Typography>
            <IconButton onClick={handleClose}>
              <CloseRounded />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent ref={dialogContentRef} style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Stepper activeStep={activeStep}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <Box
              sx={{
                mt: 2,
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}
            >
              {activeStep === steps.length ? (
                <Typography>All steps completed - you're finished</Typography>
              ) : (
                <>
                  <Slide key={activeStep} direction={slideDirection} in={true} mountOnEnter unmountOnExit>
                    <Box sx={{ overflowY: 'auto', flex: 1, ...customScrollbar(isDarkMode) }}>
                      {getStepContent(activeStep)}
                    </Box>
                  </Slide>
                  <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, mt: 'auto' }}>
                    <Button
                      color="inherit"
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      sx={{ mr: 1 }}
                    >
                      Back
                    </Button>
                    <Box sx={{ flex: '1 1 auto' }} />
                    <Button
                      onClick={() => handleNext(activeStep === steps.length - 1)}
                      disabled={activeStep === 0 && firstStepFinished()}
                    >
                      {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
                    </Button>
                  </Box>
                </>
              )}
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
