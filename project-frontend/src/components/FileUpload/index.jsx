// ImageUpload.js
import React, { useState, useCallback } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { convertFileToBase64 } from '../../helper/helper';

export default function ImageUpload({ initialImages = [], onImagesChange, singleFile = false }){
  const [images, setImages] = useState(initialImages);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (singleFile && acceptedFiles.length > 1) return;
    // replace
    // else if(singleFile && images.length === 1) return;

    const newImages = await Promise.all(acceptedFiles.map(async (file) => {
      const base64 = await convertFileToBase64(file);
      return {
        fileName: file.name,
        type: file.type,
        size: file.size,
        base64: base64,
        preview: URL.createObjectURL(file)
      };
    }));

    if (singleFile && images.length === 1) {
      // at this point, only one image in acceptedFiles, replace the first one
      setImages(newImages);
      onImagesChange(newImages);
    }
    else {
      setImages(prevImages => [...prevImages, ...newImages]);
      onImagesChange([...images, ...newImages]);
    }
  }, [images, onImagesChange, singleFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*'
  });

  function removeImage(index){
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onImagesChange(newImages);
  };

  console.log(images);

  return (
    <Box>
      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed #ccc',
          borderRadius: 2,
          p: 2,
          textAlign: 'center',
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          }
        }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <Typography>Drop the images here ...</Typography>
        ) : (
          <Typography>
            Drag 'n' drop some images here, or click to select files
          </Typography>
        )}
        <CloudUploadIcon sx={{ fontSize: 48, color: '#999', mt: 2 }} />
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 2 }}>
        {images.map((file, index) => (
          <Box key={index} sx={{ position: 'relative', m: 1 }}>
            <img
              src={file.preview || file}
              alt={`preview ${index}`}
              style={{ width: 100, height: 100, objectFit: 'cover' }}
            />
            <IconButton
              size="small"
              onClick={() => removeImage(index)}
              sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'rgba(255,255,255,0.7)' }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
