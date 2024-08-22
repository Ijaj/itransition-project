import { Box, Button, TextField } from "@mui/material";

export default function Login({ onSubmit }) {
  const handleLogin = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const payload = {
      username: formData.get('username'),
      password: formData.get('password'),
    }
    onSubmit(payload);
  };

  return (
    <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
      <TextField
        margin="dense"
        required
        fullWidth
        id="username"
        label="username"
        name="username"
        autoComplete="username"
        autoFocus
      />
      <TextField
        margin="dense"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="password"
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 1, mb: 0 }}
      >
        Sign In
      </Button>
    </Box>
  );
}