import React, { useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import { Box, ClickAwayListener, IconButton, InputAdornment, List, ListItemButton, ListItemText, TextField } from "@mui/material";

export default function Search({ width = '50%' }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  function searchFunction(query){
    // Implement your search logic here
    return ['Result 1', 'Result 2', 'Result 3', 'Result 4', 'Result 5', 'Result 6'];
  };

  function handleInputChange(event){
    const value = event.target.value;
    setQuery(value);
    if (value) {
      const searchResults = searchFunction(value).slice(0, 5); // Limit results to 5
      setResults(searchResults);
    } else {
      setResults([]);
    }
  };

  function handleKeyDown(event){
    if (event.key === 'Enter') {
      navigate(`/search?q=${query}`);
    }
  };

  function handleSearchIconClick(){
    if (query) {
      navigate(`/search?q=${query}`);
    }
  };

  function handleClickAway(){
    setResults([]);
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box ref={searchRef} style={{ position: 'relative', width: width }}>
        <TextField
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Search..."
          variant="outlined"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton onClick={handleSearchIconClick}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            backgroundColor: 'background.paper',
            color: 'text.primary',
            borderRadius: 1,
          }}
        />
        {results.length > 0 && (
          <List sx={{ position: 'absolute', top: 56, width: '100%', bgcolor: 'background.paper', border: '1px solid #ccc', zIndex: '10' }}>
            {results.map((result, index) => (
              <ListItemButton key={index} onClick={() => navigate(`/search?q=${result}`)}>
                <ListItemText primary={result} />
              </ListItemButton>
            ))}
          </List>
        )}
      </Box>
    </ClickAwayListener>
  );
}