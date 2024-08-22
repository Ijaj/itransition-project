import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Divider
} from '@mui/material';

export default function CommentSection({ itemId }) {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  function handleSubmit(e) {
    e.preventDefault();
    const newComment = {
      id: Date.now(),
      text: comment,
      user: 'Current User',
      timestamp: new Date().toLocaleString(),
    };
    setComments([newComment, ...comments]);
    setComment('');
  };

  return (
    <Box sx={{ width: '100%', margin: 'auto', padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        Comments
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 2 }}>
        <TextField
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          sx={{ mb: 1 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained" color="primary">
            Post Comment
          </Button>
        </Box>
      </Box>

      <List>
        {comments.map((comment) => (
          <React.Fragment key={comment.id}>
            <ListItem alignItems="flex-start">
              <Avatar sx={{ mr: 2 }}>{comment.user[0]}</Avatar>
              <ListItemText
                primary={comment.user}
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="text.primary">
                      {comment.text}
                    </Typography>
                    {` — ${comment.timestamp}`}
                  </>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};
