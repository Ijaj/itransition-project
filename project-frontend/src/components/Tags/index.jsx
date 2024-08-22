import React, { useState, useEffect, useCallback } from 'react';
import { Autocomplete, TextField, Chip, CircularProgress } from '@mui/material';

const TagSelector = ({ options: initialOptions, onChange, fetchSelectedTags }) => {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState(initialOptions);
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(!fetchSelectedTags) return;

    async function loadSelectedTags(){
      setLoading(true);
      try {
        const fetchedTags = await fetchSelectedTags();
        setSelectedTags(fetchedTags);
        setOptions((prevOptions) => [...new Set([...prevOptions, ...fetchedTags])]);
      } catch (error) {
        console.error('Error fetching selected tags:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSelectedTags();
  }, [fetchSelectedTags]);

  function handleInputChange(event, newInputValue){
    setInputValue(newInputValue.replace(/\s/g, ''));
  };

  function handleChange(event, newValue){
    setSelectedTags(newValue);
    onChange(newValue);
  };

  const handleKeyDown = useCallback((event) => {
    if (event.key === ' ' && inputValue.trim() !== '') {
      event.preventDefault();
      const newTag = inputValue.trim();
      if (!options.includes(newTag)) {
        setOptions((prevOptions) => [...prevOptions, newTag]);
      }
      setSelectedTags((prevTags) => [...prevTags, newTag]);
      onChange([...selectedTags, newTag]);
      setInputValue('');
    }
  }, [inputValue, options, onChange, selectedTags]);

  const handlePaste = useCallback((event) => {
    event.preventDefault();
    const pastedText = event.clipboardData.getData('text');
    const newTags = pastedText.split(/\s+/).filter(tag => tag.trim() !== '');
    
    setOptions((prevOptions) => [
      ...prevOptions,
      ...newTags.filter(tag => !prevOptions.includes(tag))
    ]);
    
    const updatedTags = [...selectedTags, ...newTags];
    setSelectedTags(updatedTags);
    onChange(updatedTags);
  }, [onChange, selectedTags]);

  if (fetchSelectedTags && loading) {
    return <CircularProgress />;
  }

  return (
    <Autocomplete
      multiple
      options={options}
      freeSolo
      filterSelectedOptions
      value={selectedTags}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip variant="outlined" label={option} {...getTagProps({ index })} />
        ))
      }
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label="Tags"
          placeholder="Add tags"
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
        />
      )}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      onChange={handleChange}
    />
  );
};

export default TagSelector;