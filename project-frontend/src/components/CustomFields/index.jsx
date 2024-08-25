import React, { useState } from 'react';
import {
  Box,
  Typography,
  FormControl,
  TextField,
  Autocomplete,
  FormControlLabel,
  Checkbox,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  useTheme
} from '@mui/material';

import { Add, Delete } from '@mui/icons-material';
import { mysqlDataTypes, getTypeWithLabel } from '../../helper/constants';

export default function CustomFields({ onChange, customFields, onDelete }) {
  const theme = useTheme();
  const _customFIelds = customFields.map(cf => ({ name: cf.name, type: getTypeWithLabel(cf.type), isRequired: cf.isRequired }));
  console.log(customFields);
  console.log(_customFIelds);
  const [newField, setNewField] = useState({
    name: '',
    type: {
      label: 'Text',
      value: 'VARCHAR',
    },
    isRequired: false,
  });
  const [errors, setErrors] = useState({ name: false, type: false });

  function handleNameChange(newValue) {
    setNewField(old => ({ ...old, name: newValue }));
    setErrors(old => ({ ...old, name: false }));
  }

  function handleTypeChange(newValue) {
    setNewField(old => ({ ...old, type: newValue }));
    setErrors(old => ({ ...old, type: false }));
  }

  function handleRequiredChange() {
    setNewField(old => ({ ...old, isRequired: !old.isRequired }));
  }

  function addNewField() {
    let error = false;
    if (newField.name === '') {
      setErrors(old => ({ ...old, name: true }));
      error = true;
    }
    if (newField.type.value === '') {
      setErrors(old => ({ ...old, type: true }));
      error = true;
    }

    if (error) return;
    onChange({
      name: newField.name,
      type: newField.type.value,
      isRequired: newField.isRequired,
    });
  }

  return (<Box sx={{ width: '100%' }}>
    <Typography>Add Custom Fields</Typography>
    <Box sx={{ height: 17 }} />
    <Box sx={{ display: 'flex' }}>
      <FormControl fullWidth>
        <TextField
          error={errors.name}
          placeholder='Field Name'
          value={newField.name}
          onChange={(e) => handleNameChange(e.target.value)}
        />
      </FormControl>
      &nbsp;&nbsp;
      <FormControl fullWidth>
        <Autocomplete
          getOptionLabel={(option) => option.label}
          renderInput={(params) => <TextField {...params} label="Select A Type" error={errors.type} />}
          options={mysqlDataTypes}
          value={newField.type}
          onChange={(_, newValue) => handleTypeChange(newValue)}
          disableClearable
        />
      </FormControl>
      &nbsp;&nbsp;
      <FormControl fullWidth>
        <FormControlLabel
          checked={newField.isRequired}
          onChange={handleRequiredChange}
          control={<Checkbox />}
          label="Required?"
          sx={{ '& .MuiSvgIcon-root': { fontSize: 38 } }}
        />
      </FormControl>
      &nbsp;&nbsp;
      <Button onClick={addNewField} variant='contained'><Add /></Button>
    </Box>
    <Paper
      elevation={3}
      sx={{
        mt: 2,
        borderRadius: 2,
        backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#f5f5f5',
      }}
    >
      <List sx={{
        py: _customFIelds.length === 0 ? 0 : 1,
        px: 2,
      }}>
        {_customFIelds.length === 0 && (
          <ListItem
            key={0}
          >
            <ListItemText primary={`No Custom Fields Added`} secondary={` `} />
          </ListItem>
        )}
        {_customFIelds.map((field, index) => (
          <ListItem
            key={index}
            secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={() => onDelete(index)}>
                <Delete />
              </IconButton>
            }
          >
            <ListItemText
              primary={`Field Name:  ${field.name}`}
              secondary={`Value Type: ${field.type.label} - ${field.isRequired ? 'Required' : 'Not Required'}`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  </Box>);
}