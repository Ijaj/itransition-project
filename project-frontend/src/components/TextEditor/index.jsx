import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Box, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { Paper } from '@mui/material';

const StyledQuillWrapper = styled(Paper)(({ theme }) => ({
  '& .ql-toolbar, & .ql-container': {
    borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[300],
  },
  '& .ql-toolbar': {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    borderTopLeftRadius: theme.shape.borderRadius,
    borderTopRightRadius: theme.shape.borderRadius,
  },
  '& .ql-container': {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    borderBottomLeftRadius: theme.shape.borderRadius,
    borderBottomRightRadius: theme.shape.borderRadius,
  },
  '& .ql-editor': {
    minHeight: 200,
  },
  '& .ql-snow .ql-stroke': {
    stroke: theme.palette.text.primary,
  },
  '& .ql-snow .ql-fill, & .ql-snow .ql-stroke.ql-fill': {
    fill: theme.palette.text.primary,
  },
  '& .ql-picker': {
    color: theme.palette.text.primary,
  },
  // Add more custom styles as needed
}));

export default function TextEditor({ initialContent = '', onContentChange, placeholder = '' }){
  const theme = useTheme();
  const modules = {
    toolbar: [
      [{ 'header': [false, 1, 2, 3, 4, 5, 6] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'blockquote'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link', 'blockquote'
  ];

  return (
    <Box>
      <StyledQuillWrapper sx={{ border: '1px solid #ccc', borderRadius: 1, overflow: 'hidden' }}>
        <ReactQuill
          theme="snow"
          modules={modules}
          formats={formats}
          value={initialContent}
          onChange={onContentChange}
          style={{ height: '300px' }}
          placeholder={placeholder}
        />
      </StyledQuillWrapper>
      <Typography variant="caption">
        Supported tags: p, h1-h6, a, i, b, u, s, ul, ol, li, blockquote
      </Typography>
    </Box>
  );
};
