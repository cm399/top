import { Container, Alert, AlertTitle } from '@mui/material';
import ResponsiveAppBar from '../../../layouts/Header';

function NoItemAleart() {
  return (
    <Container>
      <ResponsiveAppBar />
      <Container style={{ marginTop: '100px', backgroundColor: '#FCFAFB' }}>
        <div className="container">
          <div
            className="row"
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <Alert style={{ margin: '50px', padding: '50px' }} severity="info">
              <AlertTitle style={{ fontWeight: 'bold' }}>Oops!</AlertTitle>
              <strong>No Food Entries Found!</strong>
            </Alert>
          </div>
        </div>
      </Container>
    </Container>
  );
}

export default NoItemAleart;
