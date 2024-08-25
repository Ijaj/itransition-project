import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Tab,
  Tabs,
  Typography,
  Container,
} from '@mui/material';

import axios from 'axios';

import Login from './Login';
import Register from './Register';
import { useAlert } from '../../components/Alert/index';
import { setLogin } from '../../helper/helper';

function LoginPage() {
  const showAlert = useAlert();
  const navigate = useNavigate();
  const duration = 1000;
  const host = process.env.REACT_APP_HOST;

  const [tabValue, setTabValue] = useState(0);

  function handleTabChange(event, newValue) {
    setTabValue(newValue);
  };

  function onSubmitLogin(payload) {
    const url = `${host}/auth/login`;

    axios.post(url, payload)
      .then(result => {
        if (result.status === 200) {
          setLogin(result.data);
          //navigate('/', { replace: true });
          window.location.href = '/'
        }
        else {
          showAlert({
            msg: 'Login Failed',
            type: 'error',
            // onCloseCallback: () => console.log('First alert closed!'),
            duration: 5
          });
        }
      })
      .catch(error => {
        showAlert({
          msg: error.message,
          type: 'error',
          // onCloseCallback: () => console.log('First alert closed!'),
          duration: 5
        });
      });
  }

  function onSubmitRegistration(payload) {
    const url = `${host}/auth/register`;

    axios.post(url, payload)
      .then(result => {
        if (result.status === 201) {
          setLogin(result.data);
          // navigate('/', { replace: true });
          window.location.href = '/'
        }
        else {
          showAlert({
            msg: 'Registration Failed',
            type: 'error',
            // onCloseCallback: () => console.log('First alert closed!'),
            duration: 5
          });
        }
      })
      .catch(error => {
        showAlert({
          msg: error.message,
          type: 'error',
          // onCloseCallback: () => console.log('First alert closed!'),
          duration: 5
        });
      });
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: 6,
          borderRadius: 2,
          p: 3,
        }}
      >
        <Box>
          <Typography variant='h4' fontWeight={700} textAlign={'center'}>The Collectors</Typography>
        </Box>
        <Tabs value={tabValue} onChange={handleTabChange} centered variant="fullWidth" sx={{ width: '100%' }}>
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>

        {tabValue === 0 && (
          <Login onSubmit={onSubmitLogin} />
        )}

        {tabValue === 1 && (
          <Register onSubmit={onSubmitRegistration} />
        )}
      </Box>
    </Container>
  );
};

export default LoginPage;