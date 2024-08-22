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
import NoImage from '../../assets/images/no-image.png';


export default function DisplayCollections({ collections }) {
  return (
    <Container maxWidth='xl' sx={{ my: 4 }}>
      <Typography textAlign={'center'} variant="h3" fontWeight={300}>Top 5 Largest Collections</Typography>
      <Grid container spacing={2} sx={{ marginTop: 2 }}>
        {collections.map((collection) => (
          <Grid item xs={12} sm={6} md={4} lg={2.4} key={collection.id}>
            <Card>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="180"
                  image={collection.image && collection.image.length > 0 ? collection.image : NoImage}
                  alt={collection.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {collection.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {collection.description.substring(0, 60)}...
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
