import { TableCell } from '@mui/material';
import React from 'react';

const DaysReport = ({ calories, totalDays, hideAvg = false }) => {
  return (
    <>
      <TableCell align="center" component="th" scope="row">
        {totalDays}
      </TableCell>
      {!hideAvg && (
        <TableCell align="center" component="th" scope="row">
          {parseInt(calories / 7)}
        </TableCell>
      )}
    </>
  );
};

export default DaysReport;
