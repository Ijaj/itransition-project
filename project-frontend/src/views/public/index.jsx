import { Box, Container, Typography } from "@mui/material";
import DisplayItems from "../../components/ShowItems";
import DisplayCollections from "../../components/ShowCollections";
import DisplayPopularTags from "../../components/ShowTags";
import { generateCollections } from "../../Data";

const collections = generateCollections(5, 30);

const items = [];

collections.forEach(collection => {
  if(collection.items.length > 5 && items.length === 0){
    const five = collection.items.slice(0, 5);
    five.forEach(i => {
      items.push(i);
    });
    return ;
  }
});

const tags = Array.from({ length: 80 }, (_, i) => ({ id: i + 1, value: `tag${i + 1}` }));

export default function Public() {
  return (
    <Box sx={{ width: '100%' }}>
      {/* header */}
      <Container>
        <Typography textAlign='center' variant="h2" fontWeight={700}>Welcome to The Collectors</Typography>
        <Typography textAlign='center' variant="h6" fontWeight={300}>Showcase, connect, and explore unique treasures from passionate collectors worldwide</Typography>
      </Container>
      <Box
      >
        <DisplayItems items={items} />
        <Box sx={{ height: '30px' }} />
        <DisplayCollections collections={collections} />
        <Box sx={{ height: '30px' }} />
        <DisplayPopularTags tags={tags} />
      </Box>
    </Box>
  );
}