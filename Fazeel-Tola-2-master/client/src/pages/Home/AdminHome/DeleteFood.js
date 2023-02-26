import * as React from 'react';
import {
  Button,
  Slide,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from '@mui/material';

function DeleteFood(props) {
  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  return (
    <>
      {props.selectedFood && (
        <Dialog
          open={props.deleteDialog}
          TransitionComponent={Transition}
          //keepMounted
          onClose={props.handleCloseDialog}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{'Remove Item?'}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Do you really want to remove this item?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={props.handleCloseDialog}>CANCEL</Button>
            <Button
              onClick={() => {
                props.deleteFood(props.selectedFood._id);
                props.handleCloseDialog();
              }}
            >
              REMOVE
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}

export default DeleteFood;
