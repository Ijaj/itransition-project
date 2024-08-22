import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import CustomFieldFilter from '../CustomFieldFilter';

export default function ItemsCustomFilter({ fields, onApplyFilters }){
  const [filters, setFilters] = useState({});

  function handleFilterChange(fieldId, fieldType, mode, value){
    setFilters((prevFilters) => ({
      ...prevFilters,
      [fieldId]: { fieldType, mode, value },
    }));
  };

  function handleApplyFilters(){
    onApplyFilters(filters);
  };

  return (
    <Box>
      <Typography>Available Filters</Typography>
      {fields.map((field) => (
        <Box sx={{ p: 1, m: 1 }}>
          <Typography variant='body2'>{field.name}</Typography>
          <CustomFieldFilter
            key={field.id}
            field={field}
            onFilterChange={handleFilterChange}
          />
          <hr />
        </Box>
      ))}
      <Button variant="contained" onClick={handleApplyFilters} sx={{ mt: 2 }}>
        Apply Filters
      </Button>
    </Box>
  );
};
