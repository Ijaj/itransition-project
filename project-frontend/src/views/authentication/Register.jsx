import { Box, Button, TextField } from "@mui/material";
import { useState, useEffect } from "react";

export default function Register({ onSubmit }) {
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [formData, setFormData] = useState({
    password: '',
    re_password: ''
  });

  useEffect(() => {
    setPasswordMatch(formData.password === formData.re_password);
  }, [formData.password, formData.re_password]);

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  }

  function handleRegister(e) {
    e.preventDefault();
    const formDataObj = new FormData(e.currentTarget);

    const payload = {
      name: formDataObj.get('name'),
      email: formDataObj.get('email'),
      username: formDataObj.get('username'),
      password: formDataObj.get('password'),
    }

    onSubmit(payload);
  };

  return (
    <Box component="form" onSubmit={handleRegister} sx={{ mt: 1 }}>
      <TextField
        margin="dense"
        required
        fullWidth
        id="name"
        label="Full Name"
        name="name"
        autoComplete="name"
        autoFocus
      />
      <TextField
        margin="dense"
        required
        fullWidth
        id="username"
        label="Username"
        name="username"
        autoComplete="username"
      />
      <TextField
        margin="dense"
        required
        fullWidth
        id="email"
        label="E-mail"
        name="email"
        autoComplete="email"
      />
      <TextField
        margin="dense"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="new-password"
        onChange={handleInputChange}
        value={formData.password}
      />
      <TextField
        margin="dense"
        required
        fullWidth
        name="re_password"
        label="Re-enter Password"
        type="password"
        id="re_password"
        onChange={handleInputChange}
        value={formData.re_password}
        error={!passwordMatch}
        helperText={!passwordMatch ? "Passwords do not match" : ""}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 1, mb: 0 }}
        disabled={!passwordMatch}
      >
        Register
      </Button>
    </Box>
  );
}