import { Autocomplete, FormControl, TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import { defaultCategory } from "../../helper/constants";
import axios from "axios";

export default function CategorySelection({ onChange, value = defaultCategory, isError = false, size = 'medium' }) {
  const [categories, setCategories] = useState([defaultCategory]);
  const [_value, setValue] = useState(value);

  useEffect(() => {
    const host = process.env.REACT_APP_HOST;
    const url = `${host}/category`
    axios.get(url)
      .then(({ data }) => {
        setCategories(
          data.map(cat => ({ id: cat.id, label: cat.name }))
        );
      })
  }, []);

  useEffect(() => {
    setValue(value);
  }, [value]);

  useEffect(() => {
    if (categories && value && value > 0) setValue(categories.find(cat => cat.Id === value));
  }, [categories, value]);

  function _onChange(newValue) {
    setValue(newValue);
    onChange(newValue.id);
  }

  return (
    <FormControl fullWidth>
      <Autocomplete
        size={size}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => <TextField {...params} label="Category" error={isError} />}
        options={categories}
        value={_value}
        onChange={(_, newValue) => _onChange(newValue)}
        disableClearable
      />
    </FormControl>
  );
}