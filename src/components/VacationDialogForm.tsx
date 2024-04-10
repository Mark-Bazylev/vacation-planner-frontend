import {
  Dialog,
  DialogActions,
  DialogTitle,
  FormHelperText,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";

//Date Range Imports
import { DateRange, RangeKeyDict } from "react-date-range";
import type { Range } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file

import { SubmitHandler, useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";

import { VacationDetails } from "../services/vacationService/vacation-service";
import FileInput from "../utils/FileInput";
import { addVacation, editVacation } from "../redux/vacation/vacationSlice";
import { useAppDispatch } from "../redux/hooks";
import { LoadingButton } from "@mui/lab";

export interface VacationDialogProps {
  open: boolean;
  onClose: (value: string) => void;
  vacation?: VacationDetails;
}
export default function VacationDialogForm(props: VacationDialogProps) {
  const dispatch = useAppDispatch();
  const { open, onClose, vacation } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [dateRangeArray, setDateRangeArray] = useState<Range[]>([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VacationDetails & { imageFile: FileList }>({ defaultValues: vacation });
  useEffect(() => {
    if (vacation) {
      setDateRangeArray([
        {
          startDate: new Date(vacation.checkIn),
          endDate: new Date(vacation.checkOut),
          key: "selection",
        },
      ]);
    }
  }, [vacation]);

  const onFormSubmit: SubmitHandler<VacationDetails & { imageFile: FileList }> = async (
    credentials,
  ) => {
    try {
      setIsLoading(true);
      credentials.checkIn = dateRangeArray[0].startDate as Date;
      credentials.checkOut = dateRangeArray[0].endDate as Date;
      if (vacation) {
        credentials._id = vacation._id;
        await dispatch(editVacation(credentials));
      } else {
        await dispatch(addVacation(credentials));
      }
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

  const handleDateRange = (item: RangeKeyDict) => {
    setDateRangeArray([item.selection]);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit(onFormSubmit),
      }}
    >
      <DialogTitle sx={{ display: "flex", justifyContent: "center" }}>
        {vacation ? "Edit" : "Add"} Vacation
      </DialogTitle>
      <Stack px={6}>
        <TextField
          type="text"
          label="Destination"
          {...register("destination", {
            required: "Destination must be provided",
          })}
          error={!!errors.destination}
          helperText={errors.destination?.message || " "}
        />
        <TextField
          type="text"
          label="Description"
          {...register("description", {
            required: "Description must be provided",
          })}
          error={!!errors.description}
          helperText={errors.description?.message || " "}
        />
        <TextField
          type="number"
          label="Price"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          {...register("price", {
            required: "Price must be provided",
            max: { value: 10000, message: "Price must be below 10000$" },
            min: { value: 1, message: "Price must be at least 1$" },
          })}
          error={!!errors.price}
          helperText={errors.price?.message || " "}
        />
        <FileInput
          vacationImage={vacation?.imageName}
          {...register("imageFile", {
            required: {
              value: !vacation?.imageName,
              message: "Image must be provided",
            },
          })}
        />
        <FormHelperText error>{errors.imageFile?.message}</FormHelperText>
        <DateRange
          editableDateInputs={true}
          onChange={handleDateRange}
          moveRangeOnFirstSelection={false}
          ranges={dateRangeArray}
        />
      </Stack>
      <DialogActions>
        <LoadingButton variant={"contained"} loading={isLoading} type="submit">
          Submit
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
