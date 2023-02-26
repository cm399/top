import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { connect } from 'react-redux';
import { loginUser } from '../redux/actions/auth';
import CircularProgress from '@mui/material/CircularProgress';
import { Navigate } from 'react-router-dom';
import { Link } from '@mui/material';
import jwtDecode from 'jwt-decode';

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = (dispatch) => ({
  loginUser: (creds) => dispatch(loginUser(creds)),
});

function SignIn(props) {
  const decodedToken = props.auth.token
    ? jwtDecode(props.auth.token)
    : { admin: '', _id: '' };
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // eslint-disable-next-line no-console
    console.log({
      email: data.get('username'),
      password: data.get('password'),
    });
    props.loginUser({
      username: data.get('username'),
      password: data.get('password'),
    });
  };
  console.log(decodedToken);
  if (props.auth.isAuthenticated && decodedToken.admin === true) {
    return <Navigate to="/admin" />;
  } else if (props.auth.isAuthenticated) {
    return <Navigate to="/home" />;
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="current-username"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {props.auth.isLoading === true ? (
              <CircularProgress
                color="inherit"
                size={'28px'}
              ></CircularProgress>
            ) : (
              'Sign In'
            )}
          </Button>
          <Link href="/signup">Don't have an account? Sign up</Link>
        </Box>
      </Box>
    </Container>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
