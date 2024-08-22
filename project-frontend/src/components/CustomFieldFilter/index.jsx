import React, { useState } from 'react';
import {
  Box,
} from '@mui/material';
import getInputComponent from '../../helper/types';

function CustomFieldFilter({ field, onFilterChange }){
  const [filterMode, setFilterMode] = useState('equals');
  const [filterValue, setFilterValue] = useState('');

  function handleFilterChange(value){
    setFilterValue(value);
    onFilterChange(field.id, filterMode, value);
  };

  function handleModeChange(event){
    setFilterMode(event.target.value);
    onFilterChange(field.id, event.target.value, filterValue);
  };

  return (
    <Box>
      {
        getInputComponent({
          value: filterValue,
          type: field.type,
          label: field.name,
          filter: {
            filterMode: filterMode,
            handleModeChange: handleModeChange,
          },
          onChange: handleFilterChange,
        })
      }
    </Box>
  );
};

export default CustomFieldFilter;
