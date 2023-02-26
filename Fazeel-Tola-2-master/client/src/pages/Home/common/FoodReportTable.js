import {
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import React from 'react';

const FoodReportTable = ({
  data,
  showAction = false,
  onClickDelete,
  onClickUpdate,
  onDetails,
}) => {
  let foodData = data.slice(0).reverse();
  return (
    <TableContainer component={Paper}>
      <Table size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell align="left">No</TableCell>
            <TableCell align="center">User</TableCell>
            <TableCell align="center">Food</TableCell>
            <TableCell align="center">Calories</TableCell>
            <TableCell align="center">Date and Time</TableCell>
            {showAction && <TableCell>Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {foodData.map((food, index) => (
            <TableRow
              key={index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell align="center" component="th" scope="row">
                {index + 1}
              </TableCell>
              <TableCell align="center" component="th" scope="row">
                {food.user.name}
              </TableCell>
              <TableCell align="center" component="th" scope="row">
                {food.name}
              </TableCell>
              <TableCell align="center">{food.calorie}</TableCell>
              <TableCell align="center">
                {new Date(food.createdAt).toUTCString()}
              </TableCell>
              {showAction && (
                <TableCell>
                  <Grid container spacing={6} alignItems="center">
                    <Grid item xs={4}>
                      <Button
                        onClick={() => {
                          onClickUpdate(food);
                        }}
                        variant="contained"
                        color="primary"
                      >
                        Update
                      </Button>
                    </Grid>
                    <Grid item xs={4}>
                      <Button
                        onClick={() => {
                          onClickDelete(food);
                        }}
                        variant="contained"
                        color="secondary"
                      >
                        Delete
                      </Button>
                    </Grid>
                  </Grid>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FoodReportTable;
