import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  List,
  ListItem,
  Card,
  Avatar,
  Typography,
  Box,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Button,
  Menu,
  MenuItem,
  MenuList,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { styled } from '@mui/system';
import { useTheme } from '@emotion/react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { SearchRounded } from '@mui/icons-material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import parse from 'html-react-parser';
import NoImage from '../../../assets/images/no-image.png';
import { generateCollections } from '../../../Data';

const CollectionCard = styled(Card)(({ theme, active }) => ({
  backgroundColor: active ? theme.palette.action.selected : theme.palette.background.paper,
  padding: theme.spacing(2),
  marginBottom: theme.spacing(1),
  width: '100%',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  elevation: 3,
}));

const collections = generateCollections(40, 20);

export default function CollectionList({ openNewCollectionModal }) {
  const [originalData, setOriginalData] = useState(collections ?? []);
  const [visibleItems, setVisibleItems] = useState(originalData.slice(0, 10) ?? []);
  const observerRef = useRef(null);
  const loadMoreRef = useRef(null);
  const dialogContentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);
  const [menuStates, setMenuStates] = useState({});
  const [searchText, setSearchText] = useState('');

  const navigate = useNavigate();

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

  const loadMoreItems = useCallback(() => {
    setVisibleItems((prevItems) => [
      ...prevItems,
      ...originalData.slice(prevItems.length, prevItems.length + 10),
    ]);
  }, [originalData]);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && visibleItems.length < originalData.length) {
          loadMoreItems();
        }
      },
      { rootMargin: '200px' }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => observerRef.current.disconnect();
  }, [
    loadMoreItems,
    originalData.length,
    visibleItems.length,
  ]);

  useEffect(() => {
    setVisibleItems(originalData.slice(0, 10));
  }, [originalData]);

  useEffect(() => {
    setOriginalData(
      collections.filter(item => {
        return (item.name.includes(searchText) || item.description.includes(searchText))
      })
    );

    // setVisibleItems()
  }, [collections, searchText]);

  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  function handleMenuOpen(event, itemId){
    event.stopPropagation();
    event.preventDefault();
    setMenuStates(prev => ({ ...prev, [itemId]: event.currentTarget }));
  };

  function handleMenuClose(itemId){
    setMenuStates(prev => ({ ...prev, [itemId]: null }));
  };

  function handleMenuItemClick(itemId){
    alert(`Clicked item ID: ${itemId}`);
    handleMenuClose(itemId);
  };

  function handleSearch(e) {
    e.preventDefault();
    setSearchText(e.target.value);
  }

  return (
    <Box>
      <Box sx={{ mb: 1 }}>
        <Box sx={{ mb: 1, width: '100%', display: 'flex', justifyContent: 'end' }}>
          <Button variant='contained' onClick={() => openNewCollectionModal()}>+ New collection</Button>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'} paddingLeft={1}>
          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="collection-search">Search</InputLabel>
            <OutlinedInput
              id="collection-search"
              type='text'
              endAdornment={
                <InputAdornment position="end">
                  <IconButton aria-label="collection-search">
                    <SearchRounded />
                  </IconButton>
                </InputAdornment>
              }
              label="Search"
              placeholder='Search Text'
              onChange={handleSearch}
            />
          </FormControl>

        </Box>
      </Box>
      <Box
        ref={dialogContentRef}
        sx={{
          height: '88vh',
          overflowY: 'auto',
          pr: 2,
          pl: 1,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: isDarkMode ? '#333' : '#f1f1f1',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: isDarkMode ? '#888' : '#888',
            borderRadius: '10px',
            '&:hover': {
              backgroundColor: isDarkMode ? '#555' : '#555',
            },
          },
          scrollbarColor: isDarkMode ? '#888 #333' : '#888 #f1f1f1',
          scrollbarWidth: 'thin',
        }}
      >
        <List sx={{ p: 0 }}>
          {visibleItems.map((collection) => (
            <ListItem
              disableGutters
              sx={{ py: .1 }}
              key={collection.id}
              // onClick={() => navigate(`/collection/${collection.id}`)}
            >
              <CollectionCard >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box display={'flex'} onClick={() => navigate(`/collection/${collection.id}`)}>
                    <Avatar src={collection.image ?? NoImage} sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="h4">{collection.name}</Typography>
                      <Typography variant="h6" fontWeight={300}>{parse(collection.description)}</Typography>
                      &nbsp;
                      <Typography variant="body2" color="text.secondary">
                        Total Items: {collection.items.length} <br /> Category: {collection.category.value}
                      </Typography>
                      &nbsp;
                      {
                        collection.customFields.length > 0 ? (
                          <Typography variant="body2">
                            Custom Fields: {collection.customFields.slice(0, 5).map(field => field.name).join(', ')}
                            {collection.customFields.length > 5 && ((` ...+${collection.customFields.length - 5} more.`))}
                          </Typography>
                        ) :
                          (<Typography variant="body2">This Collection Has No Custom Fields</Typography>)
                      }
                    </Box>
                  </Box>
                  <IconButton
                    edge="end"
                    aria-label="options"
                    onClick={(event) => handleMenuOpen(event, collection.id)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>
              </CollectionCard>
              <Menu
                anchorEl={menuStates[collection.id]}
                open={Boolean(menuStates[collection.id])}
                onClose={() => handleMenuClose(collection.id)}
              >
                <MenuList
                  anchorEl={menuStates[collection.id]}
                  open={Boolean(menuStates[collection.id])}
                  onClose={() => handleMenuClose(collection.id)}
                >
                  <MenuItem onClick={() => openNewCollectionModal(collection)}>
                    <ListItemIcon>
                      <EditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Edit</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={() => handleMenuItemClick(collection.id)}>
                    <ListItemIcon>
                      <DeleteIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                  </MenuItem>
                </MenuList>
              </Menu>
            </ListItem>
          ))}
          <ListItem width={'100%'} ref={loadMoreRef} />
        </List>
      </Box>
    </Box>
  );
}
