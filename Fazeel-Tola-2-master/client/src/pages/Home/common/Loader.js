import { Container, CircularProgress } from '@mui/material';
import ResponsiveAppBar from '../../../layouts/Header';

function Loader() {
  return (
    <Container>
      <ResponsiveAppBar />
      <Container style={{ marginTop: '100px', backgroundColor: '#FCFAFB' }}>
        <div className="container">
          <div className="row">
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '100px',
                marginBottom: '75px',
              }}
            >
              <CircularProgress size={'50px'} />
            </div>
          </div>
        </div>
      </Container>
    </Container>
  );
}

export default Loader;
