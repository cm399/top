import {
    Container,
    Alert,
    AlertTitle,
  } from '@mui/material';
  import ResponsiveAppBar from '../../../layouts/Header';

function ErrorAlert (props){
return (
    <Container>
        <ResponsiveAppBar />
        <Container style={{ marginTop: '100px', backgroundColor: '#FCFAFB' }}>
          <div className="container">
            <div
              className="row"
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <Alert
                style={{ margin: '50px', padding: '50px' }}
                severity="error"
              >
                <AlertTitle style={{ fontWeight: 'bold' }}>Error</AlertTitle>
                <strong>{props.UserFoods.errorMessage}</strong>
              </Alert>
            </div>
          </div>
        </Container>
      </Container>
)
}

export default ErrorAlert