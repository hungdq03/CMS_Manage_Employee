import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import React from "react";

interface Props {
  open: boolean;
  onConfirmDialogClose: () => void;
  text: string | React.ReactNode;
  title: string;
  cancel: string;
  onYesClick?: () => void;
}

const ShowDialog: React.FC<Props> = ({
  open,
  onConfirmDialogClose,
  text,
  title,
  cancel,
  onYesClick,
}) => {
  return (
    <Dialog fullWidth open={open} onClose={onConfirmDialogClose}>
      <div className="pt-6 px-5 pb-4">
        <DialogTitle>
          <h4>{title}</h4>
        </DialogTitle>

        <DialogContent dividers>
          <div>{text}</div>
        </DialogContent>

        <DialogActions className="mt-4 flex justify-center">
          <Button
            variant="contained"
            color="error"
            onClick={onConfirmDialogClose}
            sx={{ marginRight: "8px" }}
          >
            {cancel}
          </Button>
          {onYesClick && (
            <Button
              variant="contained"
              color="secondary"
              onClick={onYesClick}
            >
              Xác nhận
            </Button>
          )}
        </DialogActions>
      </div>
    </Dialog>
  );
};

export default ShowDialog;
