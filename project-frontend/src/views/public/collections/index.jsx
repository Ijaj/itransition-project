import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Grid,
  Container,
  Typography,
  Box,
  Breadcrumbs,
  Link,
  Select,
  Divider,
  MenuItem,
  Slider,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  ButtonGroup
} from '@mui/material';

import CollectionList from './collections-list';
import NewCollection from './new-collection-modal';
import CategorySelection from '../../../components/CategorySelection';
import axios from 'axios';

const minMaxSx = {
  '& input[type=number]': {
    '-moz-appearance': 'textfield', // For Firefox
    '-webkit-appearance': 'none', // For Chrome, Safari, Edge, Opera
    appearance: 'none',
    margin: 0,
  },
  '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
    '-webkit-appearance': 'none',
  },
};

export default function Collections() {
  const [newCollectionOpen, setNewCollectionOpen] = useState(false);
  const [updateData, setUpdateData] = useState(null);

  const [sortOption, setSortOption] = useState('none');
  const [category, setCategory] = useState(-1);
  const [itemCountRange, setItemCountRange] = useState([0, 1000]);
  const [hasImage, setHasImage] = useState('all');

  function clearFilter() {
    setSortOption('none');
    setCategory(-1);
    setItemCountRange([0, 1000]);
    setHasImage('all')
  }

  const handleSortChange = (value) => setSortOption(value);
  const handleCategoryChange = (value) => setCategory(value);
  const handleItemCountChange = (e, newValue) => setItemCountRange(newValue);
  const handleHasImageChange = (value) => setHasImage(value);

  function onCraeteNewCollection(){
    console.log('do a server based reload');
  }

  // modal related functions

  function openNewCollectionModal(collection) {
    setUpdateData(collection);
    setNewCollectionOpen(true);
  }

  function closeNewCollectionModal() {
    setUpdateData(null);
    setNewCollectionOpen(false);
  }

  async function applyFilters(){
    try {
      const response = await axios.get('/api/items', {
        params: {
          sort: sortOption,
          category: category,
          minItemCount: itemCountRange[0],
          maxItemCount: itemCountRange[1],
          hasImage: hasImage,
        },
      });

      console.log('Filtered and Sorted Data:', response.data);
      // Handle the response data (e.g., update the state to display the data)
    } catch (error) {
      console.error('Error fetching filtered data:', error);
    }
  };

  // if the session storage has the same user id as the logged in user, then show add buttons
  // if using this collections page to display all collection, then do not show add buttons
  // if no user id is specified in session storage, then display all collections

  return (
    <Container maxWidth='xl'>
      {/* modals */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link component={RouterLink} to="/">Home</Link>
        <Link component={RouterLink} to="/collections">Collections</Link>
      </Breadcrumbs>

      <NewCollection
        open={newCollectionOpen}
        handleClose={closeNewCollectionModal}
        collection={updateData}
        onCreate={onCraeteNewCollection}
      />
      <Box
        sx={{ mb: 2 }}
      >
        <Typography variant='h4' fontWeight={300}>Your Collections</Typography>
      </Box>
      <Grid container spacing={0}>
        <Grid item xs={3}>
          <Grid container spacing={1} direction="column" paddingRight={1}>
            <Grid item>
              <Divider textAlign="left">Sort Options</Divider>
            </Grid>
            <Grid item>
              <Select size='small' value={sortOption} onChange={(e) => handleSortChange(e.target.value)} fullWidth displayEmpty>
                <MenuItem value="none">None</MenuItem>
                <MenuItem value="category">Category</MenuItem>
                <MenuItem value="htl">Items: Hight {'->'} Low</MenuItem>
                <MenuItem value="lth">Items: Low {'->'} High</MenuItem>
              </Select>
            </Grid>

            <Grid item>
              <Divider textAlign="left">Filter Options</Divider>
            </Grid>
            <Grid item>
              <CategorySelection value={category} onChange={handleCategoryChange} size='small' />
            </Grid>

            <Grid item>
              <Typography>Item Count</Typography>
              <Slider
                value={itemCountRange}
                onChange={handleItemCountChange}
                valueLabelDisplay="auto"
                min={0}
                max={1000}
              />
              <Box display={'flex'} alignItems={'center'}>
                <TextField
                  sx={minMaxSx}
                  type="number"
                  value={itemCountRange[0]}
                  onChange={(e) => setItemCountRange([Number(e.target.value), itemCountRange[1]])}
                  inputProps={{ min: 0, max: 1000 }}
                  fullWidth
                  margin="dense"
                  label="Min"
                  size='small'
                />
                <Box width={40} />
                <TextField
                  sx={minMaxSx}
                  type="number"
                  value={itemCountRange[1]}
                  onChange={(e) => setItemCountRange([itemCountRange[0], Number(e.target.value)])}
                  inputProps={{ min: 0, max: 1000 }}
                  fullWidth
                  margin="dense"
                  label="Max"
                  size='small'
                />
              </Box>
            </Grid>
            <Grid item>
              <Typography>Cover Image</Typography>
              <ButtonGroup fullWidth color='success'>
                <Button
                  variant={hasImage === 'all' ? 'contained' : 'outlined'}
                  onClick={() => handleHasImageChange('all')}
                >
                  All
                </Button>
                <Button
                  variant={hasImage === 'withImage' ? 'contained' : 'outlined'}
                  onClick={() => handleHasImageChange('withImage')}
                >
                  Yes
                </Button>
                <Button
                  variant={hasImage === 'noImage' ? 'contained' : 'outlined'}
                  onClick={() => handleHasImageChange('noImage')}
                >
                  No
                </Button>
              </ButtonGroup>
            </Grid>
            <Grid item>
              <Box sx={{ display: 'flex' }}>
                <Button color='secondary' variant="contained" onClick={clearFilter} fullWidth>
                  Clear
                </Button>
                <Box width={40} />
                <Button variant="contained" onClick={applyFilters} fullWidth>
                  Apply Filters
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={9}>
          <CollectionList
            openNewCollectionModal={openNewCollectionModal}
          />
        </Grid>
      </Grid>
    </Container>

  );
}
