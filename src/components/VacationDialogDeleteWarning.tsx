import { Button, Dialog, DialogActions, DialogTitle, DialogContent } from "@mui/material";

import { useAppDispatch } from "../redux/hooks";
import { deleteVacation } from "../redux/vacation/vacationSlice";
import { LoadingButton } from "@mui/lab";
import { useState } from "react";

export interface VacationDialogProps {
  open: boolean;
  onClose: (value: string) => void;
  vacationId: string;
}
export default function VacationDialogDeleteWarning(props: VacationDialogProps) {
  const dispatch = useAppDispatch();
  const { open, onClose, vacationId } = props;
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await dispatch(deleteVacation(vacationId));
      handleClose();
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose("closed");
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle sx={{ color: "red" }}>Delete Vacation</DialogTitle>
      <DialogContent>Are you sure you want to delete this vacation?</DialogContent>
      <DialogActions>
        <LoadingButton
          variant={"contained"}
          color={"error"}
          loading={isLoading}
          onClick={handleDelete}
        >
          Delete
        </LoadingButton>
        <Button onClick={handleClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
