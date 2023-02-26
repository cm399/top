import * as React from 'react';
import './App.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
import { __store__ } from './redux/configure_store';
import Router from './routes/Routes';

const theme = createTheme({
  palette: {
    primary: {
      main: '#003366',
    },
  },
});

const store = __store__();

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <div className="App">
          <Router />
        </div>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
