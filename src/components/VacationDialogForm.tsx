import { Button, Dialog, DialogActions, DialogTitle, Stack, TextField } from "@mui/material";

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

export interface VacationDialogProps {
  open: boolean;
  onClose: (value: string) => void;
  vacation?: VacationDetails;
}
export default function VacationDialogForm(props: VacationDialogProps) {
  const dispatch = useAppDispatch();
  const { open, onClose, vacation } = props;
  const [imageFile, setImageFile] = useState<File | null>(null);
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
  } = useForm<VacationDetails>();
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

  const onFormSubmit: SubmitHandler<VacationDetails> = async (credentials) => {
    try {
      credentials.checkIn = dateRangeArray[0].startDate as Date;
      credentials.checkOut = dateRangeArray[0].endDate as Date;
      credentials.imageName = "";
      console.log("Hi man", credentials);
      if (vacation) {
        credentials._id = vacation._id;
        await dispatch(editVacation({ vacation: credentials, imageFile }));
      } else {
        await dispatch(addVacation({ vacation: credentials, imageFile }));
      }
      handleClose();
    } catch (e) {
      console.log(e);
    } finally {
    }
  };

  const handleClose = () => {
    onClose("closed");
  };

  const handleDateRange = (item: RangeKeyDict) => {
    setDateRangeArray([item.selection]);
  };
  function handleFileInput(imageFile: File) {
    setImageFile(imageFile);
  }
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
          defaultValue={vacation?.destination}
          {...register("destination", {
            required: "Destination must be provided",
          })}
          error={!!errors.destination}
          helperText={errors.destination?.message || " "}
        />
        <TextField
          type="text"
          label="Description"
          defaultValue={vacation?.description}
          {...register("description", {
            required: "Description must be provided",
          })}
          error={!!errors.description}
          helperText={errors.description?.message || " "}
        />
        <TextField
          type="number"
          label="Price"
          defaultValue={vacation?.price}
          {...register("price", {
            required: "Price must be provided",
            max: 10000,
            min: 0,
          })}
          error={!!errors.price}
          helperText={errors.price?.message || " "}
        />

        <FileInput vacationImage={vacation?.imageName} onFileInput={handleFileInput} />
        <DateRange
          editableDateInputs={true}
          onChange={handleDateRange}
          moveRangeOnFirstSelection={false}
          ranges={dateRangeArray}
        />
      </Stack>
      <DialogActions>
        <Button type="submit">Submit</Button>
      </DialogActions>
    </Dialog>
  );
}
