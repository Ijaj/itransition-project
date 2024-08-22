import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTheme } from '@mui/material/styles';
import { Box, Link, Grid, Card, Avatar, Typography, Button, Tabs, Tab, TableCell, TableRow, TableContainer, Paper, Table, TableBody, } from "@mui/material";
import { styled } from '@mui/system';
import { truncateText } from "../../../helper/helper";
import NoImage from '../../../assets/images/no-image.png';
import { customScrollbar } from "../../../helper/constants";
import parse from 'html-react-parser';

const ItemCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.action.hover,
  padding: theme.spacing(2),
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
  },
}));

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </Box>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function ItemList({ items, selectedCollection, openNewItemModal }) {
  const [visibleItems, setVisibleItems] = useState(items.slice(0, 10)); // Start with 10 items
  const observerRef = useRef(null);
  const loadMoreRef = useRef(null);
  const dialogContentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);
  const [currentTab, setCurrentTab] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

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
  }, [items.length, currentTab]);

  const loadMoreItems = useCallback(() => {
    // TODO: make api calls to load more here
    setVisibleItems((prevItems) => [
      ...prevItems,
      ...items.slice(prevItems.length, prevItems.length + 10),
    ]);
  }, [items]);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && visibleItems.length < items.length) {
          loadMoreItems();
        }
      },
      { rootMargin: '200px' }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => observerRef.current.disconnect();
  }, [loadMoreItems, visibleItems.length, items.length]);

  useEffect(() => {
    if (items.length > 0) {
      setVisibleItems(items.slice(0, 10));
      setIsLoading(false);
    }
    else {
      setVisibleItems([]);
      setIsLoading(false);
    }
  }, [items, selectedCollection]);

  const handleChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  if (!selectedCollection) {
    return (
      <Box>
        <Typography textAlign={'center'} variant="h2">Please create a collection first</Typography>
      </Box>
    );
  }
  else return (
    <Box>
      <Tabs value={currentTab} onChange={handleChange} aria-label="basic tabs example" variant="fullWidth">
        <Tab label="Collection Details" {...a11yProps(0)} />
        <Tab label="Items" {...a11yProps(1)} />
      </Tabs>
      <CustomTabPanel value={currentTab} index={0}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableBody>
              <TableRow key={selectedCollection.image}>
                <TableCell component="th" scope="row">Image</TableCell>
                <TableCell>
                  <Box sx={{ p: 2 }}>
                    <Avatar variant="rounded" src={selectedCollection.image ?? NoImage} sx={{ width: '200px', height: '200px' }} />
                  </Box>
                </TableCell>
              </TableRow>
              <TableRow key={selectedCollection.name}>
                <TableCell component="th" scope="row">Name</TableCell>
                <TableCell align="left">{selectedCollection.name}</TableCell>
              </TableRow>
              <TableRow key={selectedCollection.description}>
                <TableCell component="th" scope="row">Description</TableCell>
                <TableCell align="left">{parse(selectedCollection.description)}</TableCell>
              </TableRow>
              <TableRow key={selectedCollection.category}>
                <TableCell component="th" scope="row">Category</TableCell>
                <TableCell align="left">{selectedCollection.category.value}</TableCell>
              </TableRow>
              {selectedCollection.customFields.map((field, i) => (
                <TableRow
                  key={i}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {field.name}
                  </TableCell>
                  <TableCell align="left">{field.type} - {field.isRequired ? 'Required' : 'Not Required'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CustomTabPanel>
      <CustomTabPanel value={currentTab} index={1}>
        <Box
          sx={{
            pr: 3,
            width: '100%',
            marginBottom: 1,
            display: 'flex',
            justifyContent: 'flex-end'
          }}
        >
          <Button variant='contained' onClick={openNewItemModal}>+ Add a new item</Button>
        </Box>
        <Box
          height={contentHeight}
          ref={dialogContentRef}
          sx={customScrollbar(isDarkMode)}
        >
          <Grid container spacing={2}>
            {
              isLoading ? (<Typography>Loading...</Typography>) :
                visibleItems.length === 0 ? (
                  <Grid item xs={12} key={0}>
                    <ItemCard>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                          alt={''}
                          src={NoImage}
                          sx={{ width: 56, height: 56, mr: 2 }}
                        />
                        <Box>
                          <Typography variant="h4" textAlign={'center'}>No items in this collection</Typography>
                        </Box>
                      </Box>
                    </ItemCard>
                  </Grid>
                ) :
                  visibleItems.map((item) => (
                    <Grid item xs={12} key={item.id}>
                      <ItemCard>
                        <Link
                          underline="none"
                          href={`/collection/${selectedCollection.id}/item/${item.id}`}
                          color={'inherit'}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar
                              alt={item.name}
                              src={item.images.length > 0 ? item.images[0] : NoImage}
                              sx={{ width: 56, height: 56, mr: 2 }}
                            />
                            <Box>
                              <Typography variant="h6">{item.name}</Typography>
                              <Typography variant="body2">{truncateText(item.description, 80)}</Typography>
                              <Typography variant="caption">Likes: {item.likes}</Typography>
                            </Box>
                          </Box>
                        </Link>
                      </ItemCard>
                    </Grid>))
            }
            <Grid item xs={12} ref={loadMoreRef} />
          </Grid>
        </Box>
      </CustomTabPanel>
    </Box>
  );
}
