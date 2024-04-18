import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";

import { LoadingButton } from "@mui/lab";
import React, { useState } from "react";
import { useAppDispatch } from "../redux/hooks";
import { bookVacation } from "../redux/vacation/vacationSlice";

export interface ConfirmDialogProps {
  open: boolean;
  vacationId: string;
  onClose: () => void;
}

export function ConfirmDialog(props: ConfirmDialogProps) {
  const { open, onClose, vacationId } = props;
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  async function handleConfirm() {
    try {
      setIsLoading(true);
      await dispatch(bookVacation(vacationId)).unwrap();
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
      onClose();
    }
  }
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ display: "flex", justifyContent: "center" }}>
        Book This Vacation?
      </DialogTitle>
      <DialogActions sx={{ display: "flex", justifyContent: "space-around" }}>
        <LoadingButton variant={"contained"} loading={isLoading} onClick={handleConfirm}>
          Confirm
        </LoadingButton>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
