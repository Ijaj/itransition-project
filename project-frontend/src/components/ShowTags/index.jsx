import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Chip, useTheme, useMediaQuery, Container } from '@mui/material';
import { styled } from '@mui/system';

const TagsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  justifyContent: 'center',
  margin: theme.spacing(2, 0),
}));

export default function DisplayPopularTags({ tags }){
  const nav = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container maxWidth='xl' sx={{ my: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom align="left">
        Popular Tags
      </Typography>
      <TagsContainer justifyContent={'flex-start !important'}>
        {tags.map((tag) => (
          <Chip
            key={tag.id}
            label={tag.value}
            clickable
            variant={isMobile ? "outlined" : "filled"}
            size={isMobile ? "small" : "medium"}
            onClick={() => nav('/search?t=' + tag.value)}
          />
        ))}
      </TagsContainer>
    </Container>
  );
};
