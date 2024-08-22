import { Autocomplete, FormControl, TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import { defaultCategory } from "../../helper/constants";

const cats = [
  { id: -1, label: 'Select One' },
  { id: 1, label: 'cat 1' },
  { id: 3, label: 'cat 3' },
  { id: 2, label: 'cat 2' },
];

export default function CategorySelection({ onChange, value = -1, isError = false, size = 'medium' }){
  const [categories, setCategories] = useState([defaultCategory]);
  const [_value, setValue] = useState(categories.length > 1 ? value : defaultCategory);

  useEffect(() => {
    let timer;
    // fetch from db
    if(categories.length > 1){
      setValue(cats.find(cat => cat.id === value));
    }
    else{
      timer = setTimeout(() => {
        setValue(cats.find(cat => cat.id === value));
        setCategories(
          [...cats]
        );
      }, 2000);
  
    }

    return () => clearTimeout(timer);
  }, [value]);

  function _onChange(newValue) {
    setValue(newValue);
    onChange(newValue.id);
  }

  return (
    <FormControl fullWidth>
      <Autocomplete
        size={size}
        getOptionLabel={(option) => option.label}
        renderInput={(params) => <TextField {...params} label="Category" error={isError} />}
        options={categories}
        value={_value}
        onChange={(_, newValue) => _onChange(newValue)}
        disableClearable
      />
    </FormControl>
  );
}