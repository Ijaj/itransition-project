import React from 'react';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Container
} from '@mui/material';
import { useNavigate } from 'react-router';
import NoImage from '../../assets/images/no-image.png';

export default function DisplayItems({ items }) {
  const navigate = useNavigate();
  return (
    <Container maxWidth={'xl'} sx={{ my: 4 }}>
      <Typography textAlign={'center'} variant="h3" fontWeight={300}>Recently Added Items</Typography>
      <Grid container spacing={2} sx={{ marginTop: 2 }}>
        {items.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={2.4} key={item.id}>
            <Card>
              <CardActionArea onClick={() => {navigate(`/collection/${item.collectionId}/item/${item.id}`, { replace: true })}}>
                <CardMedia
                  component="img"
                  height="180"
                  image={item.images && item.images.length > 0 ? item.images[0] : NoImage}
                  alt={item.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {item.name}
                  </Typography>
                  <Typography gutterBottom variant="h6" component="div">
                    By {item.author}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.collection}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
