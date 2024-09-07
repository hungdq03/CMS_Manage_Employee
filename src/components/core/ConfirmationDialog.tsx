import React, { useState } from "react";
import { Button, Dialog, DialogActions, IconButton } from "@mui/material";
import { Trash } from "@phosphor-icons/react";

interface Props {
  iconName: 'Trash',
  btnColor: 'inherit' | 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning',
  text: string,
  title: string,
  onYesClick: () => void,
  Yes: string,
  No: string
}

const ConfirmationDialog: React.FC<Props> = ({
  iconName,
  btnColor,
  text,
  title,
  onYesClick,
  Yes,
  No,
}) => {
  const [isOpenDialog, setOpenDialog] = useState<boolean>(false);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleClickYes = () => {
    onYesClick();
    setOpenDialog(false);
  }
  return (
    <>
      <IconButton
        color={btnColor}
        onClick={() => setOpenDialog(true)}
        size='small'
      >
        {iconName === 'Trash' && <Trash />}
      </IconButton>
      <Dialog
        maxWidth="xs"
        fullWidth={true}
        open={isOpenDialog}
        onClose={handleCloseDialog}
      >
        <div className="bg-[#645aff] text-white py-4 px-8 rounded-t-lg">
          <h4 className="text-lg font-semibold text-center capitalize">
            {title}
          </h4>
        </div>
        <div className="px-8 py-6 bg-white rounded-b-lg shadow-md">
          <p className="text-base text-gray-600 text-center mb-6">
            {text}
          </p>
          <DialogActions className="justify-center">
            <div className="flex space-x-4">
              <Button
                onClick={handleClickYes}
                className="px-6 py-2"
                variant="contained"
                color="primary"
              >
                {Yes}
              </Button>
              {No && (
                <Button
                  onClick={handleCloseDialog}
                  className="px-6 py-2"
                  variant="contained"
                  color="secondary"
                >
                  {No}
                </Button>
              )}
            </div>
          </DialogActions>
        </div>
      </Dialog>

    </>
  );
};

export default ConfirmationDialog;
