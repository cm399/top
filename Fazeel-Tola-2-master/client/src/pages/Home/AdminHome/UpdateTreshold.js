import {
    Box,
    Button,
    Modal,
    Paper,
    TextField,
    Typography,
  } from '@mui/material';
  
  import React, { useState } from 'react';
  import { baseUrl } from '../../../constants/base_url';
  
  const style = {
    root: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: '#FFF',
      border: '2px solid #000',
      padding: '20px',
    },
    buttonBox: {
      display: 'flex',
      gap: '20px',
    },
    textfield: {
      width: '250px',
    },
  };
  
  const UpdateTreshold = ({ userId, open, updateModal }) => {
    const [value, setValue] = useState('');
  
    const onUpdateTreshold = (e) => {
      e.preventDefault();
      return fetch(baseUrl + 'treshold/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          limit: value || '',
        }),
      })
        .then(
          (response) => {
            if (response.ok) {
              return response;
            } else {
              const error = new Error(
                'Error ' + response.status + ': ' + response.statusText
              );
              error.response = response;
              throw error;
            }
          },
          (error) => {
            throw error;
          }
        )
        .then((response) => response.json())
        .then((response) => {
          setValue('');
        })
        .catch((error) => {
          console.log(error.message);
        });
    };
  
    return (
      <Modal
        open={open}
        onClose={() => updateModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Paper style={style.root}>
          <Box>
            <Box>
              <Typography variant="h6">Update Treshold</Typography>
            </Box>
            <Box>
              <Typography variant="body1">Daily Treshold</Typography>
              <TextField
                margin="normal"
                required
                fullWidth
                variant="outlined"
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </Box>
            <Box style={style.buttonBox}>
              <Button
                onClick={(e) => onUpdateTreshold(e)}
                fullWidth
                variant="contained"
              >
                Update
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={() => updateModal(false)}
              >
                CLOSE
              </Button>
            </Box>
          </Box>
        </Paper>
      </Modal>
    );
  };
  
  export default UpdateTreshold;
  