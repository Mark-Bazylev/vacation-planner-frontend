import { Button, Dialog, DialogActions, DialogTitle, DialogContent } from "@mui/material";

import { useAppDispatch } from "../redux/hooks";
import { deleteVacation } from "../redux/vacation/vacationSlice";

export interface VacationDialogProps {
  open: boolean;
  onClose: (value: string) => void;
  vacationId: string;
}
export default function VacationDialogDeleteWarning(props: VacationDialogProps) {
  const dispatch = useAppDispatch();
  const { open, onClose, vacationId } = props;

  const handleDelete = async () => {
    try {
      await dispatch(deleteVacation(vacationId));
      handleClose();
    } catch (e) {
      console.log(e);
    } finally {
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
        <Button variant={"contained"} color={"error"} onClick={handleDelete}>
          Delete
        </Button>
        <Button onClick={handleClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
