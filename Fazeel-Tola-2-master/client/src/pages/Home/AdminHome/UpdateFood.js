import { Button, Typography, Grid, Modal, Box, TextField } from '@mui/material';
import { useState } from 'react';
import { baseUrl } from '../../../constants/base_url';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#FFF',
  border: '2px solid #000',
  p: 4,
};
function UpdateFood(props) {
  const [value, setValue] = useState('');

  const handleUpdate = (event) => {
    event.preventDefault();
    return fetch(baseUrl + 'foods/' + props.selectedFood._id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: value?.name,
        calorie: value?.calorie,
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
        props.addAllFoods(response);
        setValue('');
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const onInputChange = (value, fieldName) => {
    if (fieldName) {
      setValue((oldvalue) => {
        return {
          ...oldvalue,
          [fieldName]: value,
        };
      });
    }
  };

  return (
    <>
      {props.selectedFood && (
        <Modal
          open={props.showUpdate}
          onClose={() => props.setShowUpdate(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} component="form" onSubmit={handleUpdate} noValidate>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              gutterBottom
            >
              Update Food
            </Typography>
            <Typography variant="body1">Food</Typography>
            <TextField
              placeholder={props.selectedFood.name}
              margin="normal"
              required
              fullWidth
              id="update-food-name"
              name="update-food-name"
              autoComplete="current-food"
              autoFocus
              value={value?.name || ''}
              onChange={(e) => onInputChange(e.target.value, 'name')}
            />
            <Typography variant="body1">Calorie</Typography>
            <TextField
              placeholder={props.selectedFood.calorie}
              margin="normal"
              required
              fullWidth
              variant="outlined"
              name="update-calorie"
              type="number"
              id="update-calorie"
              autoComplete="current-calorie"
              value={value?.calorie || ''}
              onChange={(e) => onInputChange(e.target.value, 'calorie')}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Update
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  onClick={() => props.setShowUpdate(false)}
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  CLOSE
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Modal>
      )}
    </>
  );
}

export default UpdateFood;
