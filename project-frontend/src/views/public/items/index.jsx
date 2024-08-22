import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Grid,
  Container,
  Typography,
  Box,
  Breadcrumbs,
  Link,
} from '@mui/material';

import { generateCollections } from '../../../Data';
import ItemList from './items-list';
import NewItem from './new-item';
import ItemsCustomFilter from '../../../components/ItemFIlter';

const collections = generateCollections(2, 20);

export default function Items() {
  const [selectedCollection, setSelectedCollection] = useState(collections.length > 0 ? collections[0] : null);
  const [newItemOpen, setNewItemOpen] = useState(false);
  const [updateData, setUpdateData] = useState(null);

  useEffect(() => {
    setSelectedCollection(collections[0]);
  }, []);

  function openNewItemModal() {
    setNewItemOpen(true);
  }

  function closeNewItemModal() {
    setNewItemOpen(false);
  }

  function handleApplyFilters(filters) {
    console.log(filters);
  }

  // if the session storage has the same user id as the logged in user, then show add buttons
  // if using this collections page to display all collection, then do not show add buttons
  // if no user id is specified in session storage, then display all collections

  // filter 

  return (
    <Container maxWidth='xl'>
      {/* modals */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link component={RouterLink} to="/">Home</Link>
        <Link component={RouterLink} to="/collections">Collections</Link>
        <Typography color="text.primary">{selectedCollection.name}</Typography>
      </Breadcrumbs>

      <NewItem
        open={newItemOpen}
        handleClose={closeNewItemModal}
        collection={selectedCollection}
      />

      <Box
        sx={{ mb: 2 }}
      >
        <Typography variant='h4' fontWeight={300}>Your Collections</Typography>
      </Box>
      <Grid container spacing={1}>
        <Grid item xs={3}>
          <ItemsCustomFilter fields={selectedCollection.customFields} onApplyFilters={(handleApplyFilters)} />
        </Grid>
        <Grid item xs={9}>
          <ItemList
            items={selectedCollection ? selectedCollection.items : []}
            selectedCollection={selectedCollection}
            openNewItemModal={openNewItemModal}
          />
        </Grid>
      </Grid>
    </Container>

  );
}
