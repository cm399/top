import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import FormControlLabel from '@mui/material/FormControlLabel';
import { connect } from 'react-redux';
import { loginUser } from '../redux/actions/auth';
import CircularProgress from '@mui/material/CircularProgress';
import { Navigate } from 'react-router-dom';
import Link from '@mui/material/Link';
import { registerUser } from '../redux/actions/signup';
const mapStateToProps = (state) => {
  return {
    Signup: state.Signup,
  };
};

const mapDispatchToProps = (dispatch) => ({
  loginUser: (creds) => dispatch(loginUser(creds)),
  registerUser: (profile) => dispatch(registerUser(profile)),
});

function SignUp(props) {
  const [checked, setChecked] = React.useState(false);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // eslint-disable-next-line no-console
    console.log({
      name: data.get('name'),
      username: data.get('username'),
      password: data.get('password'),
    });
    props.registerUser({
      name: data.get('name'),
      username: data.get('username'),
      password: data.get('password'),
      admin: checked,
    });
  };

  if (props.Signup.success) {
    return <Navigate to="/" />;
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
          <PersonAddAltIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            name="name"
            label="Name"
            type="text"
            id="name"
            autoComplete="current-name"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="current-username"
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
          <FormControlLabel
            label="Admin?"
            control={
              <Checkbox
                checked={checked}
                onChange={handleChange}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            }
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {props.Signup.isLoading === true ? (
              <CircularProgress
                color="inherit"
                size={'28px'}
              ></CircularProgress>
            ) : (
              'Sign Up'
            )}
          </Button>
          <Link href="/">Already have an account? Sign in</Link>
        </Box>
      </Box>
    </Container>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
