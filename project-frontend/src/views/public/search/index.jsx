import React, { useEffect, useState } from 'react';

import { useSearchParams } from 'react-router-dom';

import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  FormControl,
  Select,
  MenuItem,
  Pagination,
  ToggleButton,
  ToggleButtonGroup,
  Badge,
  Box,
  Paper,
  CardHeader
} from '@mui/material';

import { generateSearchDatas } from '../../../Data';
import NoImage from '../../../assets/images/no-image.png';
import { ViewList, ViewModule } from '@mui/icons-material';
import parse from 'html-react-parser';
import { getSearchFilter, getSearchIPP, getSearchLayout, setSearchFilter, setSearchIPP, setSearchLayout } from '../../../helper/helper';

export default function SearchPage(){
  const [searchParams, setSearchParams] = useSearchParams();
  const [view, setView] = useState(getSearchLayout() ?? 'card');
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(getSearchIPP() ?? 20);
  const [totalItems, setTotalItems] = useState(-1);
  const [data, setData] = useState([]);
  const [activeFilter, setActiveFilter] = useState(getSearchFilter() ?? 0);

  const search = searchParams.get('q');
  const tag = searchParams.get('t');

  console.log(search, tag);

  useEffect(() => {
    // in prod, send total count from backend
    const res = generateSearchDatas(100);
    setTotalItems(res.length);
    setData(res);
  }, []);

  function handleChangePagination(event, newPage) {
    setPage(newPage);
  };

  function handleChangeItemsPerPage(e) {
    setItemsPerPage(e.target.value);
    setSearchIPP(e.target.value);
  }

  function handleChangeView(event, newView) {
    if (newView !== null) {
      setView(newView);
      setSearchLayout(newView);
    }
  };

  function changeFilter(newFilter) {
    // also reset the current page to 1
    setActiveFilter(newFilter);
    setSearchFilter(newFilter);
  }

  const paginatedItems = data.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth='xl' sx={{ maxHeight: '200px' }}>
        <Paper elevation={2}>
          <Container maxWidth="xl" sx={{ p: 1, display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography>Show </Typography>
              <Box sx={{ width: '20px' }} />
              <Chip
                variant={activeFilter === 0 ? 'filled' : 'outlined'}
                label="All"
                onClick={() => changeFilter(0)}
              />
              <Box sx={{ width: '10px' }} />
              <Chip
                label="Collections only"
                variant={activeFilter === 1 ? 'filled' : 'outlined'}
                onClick={() => changeFilter(1)}
              />
              <Box sx={{ width: '10px' }} />
              <Chip
                label="Items only"
                variant={activeFilter === 2 ? 'filled' : 'outlined'}
                onClick={() => changeFilter(2)}
              />
            </Box>

            <Box>
              <ToggleButtonGroup value={view} exclusive onChange={handleChangeView}>
                <ToggleButton value="card">
                  <ViewModule />
                </ToggleButton>
                <ToggleButton value="list">
                  <ViewList />
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Container>
        </Paper>
      </Container>
      <Container maxWidth="xl">
        <Box sx={{ width: '100%', my: 1 }}>
          <Card elevation={2}>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant='body1'>Search Results for: {search}</Typography>
                  <Box display={'flex'}>
                    <Typography>show</Typography>
                    <Box sx={{ width: '10px' }} />
                    <FormControl variant='standard' size='small'>
                      <Select
                        id="demo-simple-select"
                        value={itemsPerPage}
                        onChange={handleChangeItemsPerPage}
                      >
                        <MenuItem value={20}>20</MenuItem>
                        <MenuItem value={40}>40</MenuItem>
                        <MenuItem value={100}>100</MenuItem>
                      </Select>
                    </FormControl>
                    <Box sx={{ width: '10px' }} />
                    <Typography>items</Typography>
                  </Box>
                </Box>
              }
            />
          </Card>
        </Box>
        <Box sx={{ width: '100%' }}>
          {view === 'card' && (
            <Grid container spacing={3}>
              {paginatedItems.map((item) => (
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={item.id}>
                  <Badge
                    sx={{ width: '100%' }}
                    badgeContent={item.type.toUpperCase()}
                    color={item.type === 'collection' ? 'primary' : 'secondary'}
                    overlap="circular"
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                  >
                    <Card sx={{ height: 350, display: 'flex', flexDirection: 'column', width: '100%' }}>
                      <img src={item.image ?? NoImage} alt={item.name} style={{ width: '100%', height: 150, objectFit: 'cover' }} />
                      <CardContent sx={{ flexGrow: 1, overflow: 'auto' }}>
                        <Typography variant="h6" gutterBottom>{item.name}</Typography>
                        {item.type === 'collection' ? (
                          <>
                            <Typography variant="body2"
                              sx={{ mb: 1, maxHeight: 100, overflow: 'auto' }}
                            >
                              {parse(
                                item.description.length <= 20 ?
                                  item.description :
                                  item.description.slice(0, 20) + '...'
                              )}
                            </Typography>
                            <Typography variant="caption">By {item.userName}</Typography>
                          </>
                        ) : (
                          <>
                            <Typography variant="body2">Likes: {item.likes}</Typography>
                            <Typography variant="caption" display="block" sx={{ mb: 1 }}>Collection: {item.collectionName}</Typography>
                            <div>
                              {item.tags.map((tag) => (
                                <Chip key={tag} label={tag} size="small" sx={{ mr: 0.5, mt: 0.5 }} />
                              ))}
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </Badge>
                </Grid>
              ))}
            </Grid>
          )}
          {view === 'list' && (
            <List>
              {paginatedItems.map((item) => (
                <ListItem
                  key={item.id}
                  sx={{ px: .5 }}
                  divider
                >
                  <img
                    src={item.image ?? NoImage}
                    alt={item.name}
                    style={{ width: 100, height: 100, objectFit: 'cover' }}
                  />
                  <Box sx={{ width: '20px' }} />
                  <ListItemText
                    primary={item.name}
                    secondary={
                      <>
                        {item.type === 'collection' ? (
                          <>
                            <Typography variant="body2" dangerouslySetInnerHTML={{ __html: item.description }} />
                            <Typography variant="caption">By {item.userName}</Typography>
                          </>
                        ) : (
                          <>
                            <Typography variant="body2">Likes: {item.likes}</Typography>
                            <Typography variant="caption">Collection: {item.collectionName}</Typography>
                            <div>
                              {item.tags.map((tag) => (
                                <Chip key={tag} label={tag} size="small" sx={{ mr: 0.5, mt: 0.5 }} />
                              ))}
                            </div>
                          </>
                        )}
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
          {/* Pagination component */}
          <Pagination
            count={Math.ceil(totalItems / itemsPerPage)}
            page={page}
            onChange={handleChangePagination}
            sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
          />
        </Box>
      </Container>
    </Box>
  );
};
