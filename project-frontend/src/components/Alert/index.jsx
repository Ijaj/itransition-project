import React, { createContext, useState, useContext, useCallback } from 'react';
import { Snackbar, Alert, AlertTitle, Slide } from '@mui/material';

const AlertContext = createContext();

function SlideTransition(props){
  return <Slide {...props} direction="left" />;
};

export function AlertProvider({ children }){
  const [alerts, setAlerts] = useState([]);

  const showAlert = useCallback(({ msg, type = 'success', onCloseCallback, duration = 5 }) => {
    const id = new Date().getTime(); // Unique ID for each alert
    setAlerts((prevAlerts) => [
      ...prevAlerts,
      { id, msg, type, onCloseCallback, duration: duration * 1000 }
    ]);
  }, []);

  function handleClose(id){
    setAlerts((prevAlerts) => prevAlerts.filter(alert => alert.id !== id));
    const alert = alerts.find(alert => alert.id === id);
    if (alert && alert.onCloseCallback) {
      alert.onCloseCallback();
    }
  };
  const capitalize = s => s && s[0].toUpperCase() + s.slice(1)
  return (
    <AlertContext.Provider value={showAlert}>
      {children}
      {alerts.map((alert) => (
        <Snackbar
          key={alert.id}
          open={true}
          autoHideDuration={alert.duration}
          onClose={() => handleClose(alert.id)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          TransitionComponent={SlideTransition}
        >
          <Alert
            variant='filled'
            onClose={() => handleClose(alert.id)}
            severity={alert.type}
            sx={{ width: '100%' }}
          >
            <AlertTitle>{capitalize(alert.type)}</AlertTitle>
            {alert.msg}
          </Alert>
        </Snackbar>
      ))}
    </AlertContext.Provider>
  );
};

export function useAlert(){
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};