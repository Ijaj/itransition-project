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
  FormControl,

} from '@mui/material';
import { CloseRounded, Delete } from '@mui/icons-material';

import TextEditor from '../../../components/TextEditor';
import ImageUpload from '../../../components/FileUpload';
import { customScrollbar } from '../../../helper/constants';
import CustomFields from '../../../components/CustomFields';
import parse from 'html-react-parser';
import CategorySelection from '../../../components/CategorySelection';

const steps = ['Required', 'Fields', 'Review'];
const emptyForm = {
  name: '',
  description: '',
  image: [],
  customFields: [],
  category: '',
};

export default function NewCollection({ open, handleClose, onSave, isUpdate, collection }) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const dialogContentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  const [slideDirection, setSlideDirection] = useState('left');
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(emptyForm);

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
    setFormData(collection ?? emptyForm);
    // setCustomFields(collection ? collection.customFields : []);
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

  function handleDeleteNewField(index) {
    setFormData(old => ({ ...old, customFields: old.customFields.filter((_, i) => i !== index) }))
    // setCustomFields(old => old.filter((_, i) => i !== index));
  }

  function handleNewField(newField) {
    setFormData(old => ({ ...old, customFields: [...old.customFields, newField] }));
    // setCustomFields(old => [...old, newField]);
  }

  function handleImageChange(newImages) {
    if (typeof newImages === 'number') {
      setFormData(old => ({ ...old, image: old.image.filter((_, index) => index !== newImages) }));
    }
    else setFormData(old => ({ ...old, image: newImages }));
  }

  function handleCategoryChange(newValue) {
    setFormData(old => ({ ...old, category: newValue }));
  }

  function firstStepFinished() {
    return (formData.name === '' || formData.name.length === 0)
  }

  function closeModal() {
    setActiveStep(0);
    setFormData(emptyForm);
    handleClose();
  }

  function getStepContent(step){
    switch (step) {
      case 0:
        return (
          <Grid container spacing={1}>
            <Grid item lg={6}>
              <FormControl margin='normal' fullWidth>
                <TextField
                  fullWidth
                  required
                  label="Collection Name"
                  name="Name"
                  value={formData.name}
                  onChange={e => handleInputChange(e.target.value, 'name')}
                />
              </FormControl>
            </Grid>
            <Grid item lg={6}>
              <FormControl margin='normal' fullWidth>
                <CategorySelection onChange={handleCategoryChange} />
              </FormControl>
            </Grid>
            <Grid item lg={6}>
              Description (Optional)
              <TextEditor
                initialContent={formData.description}
                onContentChange={newValue => handleInputChange(newValue, 'description')}
                placeholder='Description'
              />
            </Grid>
            <Grid item lg={6}>
              Cover Image (Optional)
              <ImageUpload
                singleFile
                initialImages={formData.image}
                onImagesChange={handleImageChange}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <CustomFields
            customFields={formData.customFields}
            onChange={handleNewField}
            onDelete={handleDeleteNewField}
          />
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
                    key={1}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>Description</TableCell>
                    <TableCell>{parse(formData.description)}</TableCell>
                  </TableRow>

                  <TableRow
                    key={2}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>Image</TableCell>
                    <TableCell>
                      {formData.image.length === 0 && ('No Image Selected')}
                      {formData.image.length === 1 && (
                        <img src={typeof formData.image[0] === 'string' ? formData.image[0] : formData.image[0].preview} alt='...' />
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow
                    key={3}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>Custom Fields</TableCell>
                    <TableCell>
                      {formData.customFields.length === 0 && ('No Custom Fields')}
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
            <Typography variant='h4'>Add a new Collection</Typography>
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
