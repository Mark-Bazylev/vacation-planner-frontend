import React, { ChangeEvent, useEffect, useState } from "react";
import { getBookedVacations } from "../redux/vacation/vacationSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  Backdrop,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { BookingStatus, VacationDetails } from "../services/vacationService/vacation-service";
import { timeUntilDeadline } from "../utils/dateManager";
import { format } from "date-fns";

export function MyBookings() {
  const dispatch = useAppDispatch();
  const { bookedVacations, bookedVacationsCount } = useAppSelector((state) => state.vacations);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);

  function handlePage(event: ChangeEvent<unknown>, pageNumber: number) {
    setPage(pageNumber);
  }

  useEffect(() => {
    async function getVacations() {
      try {
        setIsLoading(true);
        await dispatch(getBookedVacations({ pageIndex: page })).unwrap();
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    }
    getVacations();
  }, [page]);
  return (
    <>
      <Pagination
        count={Math.ceil(bookedVacationsCount / 10)}
        page={page}
        onChange={handlePage}
        color={"secondary"}
        sx={{ my: 2 }}
      />

      <List
        sx={{
          width: "100%",
          bgcolor: "background.paper",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {bookedVacations?.map((vacation) => (
          <VacationListItem key={vacation._id} vacation={vacation} />
        ))}
      </List>
      <Backdrop
        sx={{
          bgcolor: "rgba(255, 255, 255, 0.7)",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={isLoading}
      >
        <Stack spacing={2}>
          <CircularProgress color="primary" size={64} />
          <Typography sx={{ fontWeight: "bold" }} fontSize={18} color={grey[500]}>
            Loading...
          </Typography>
        </Stack>
      </Backdrop>
    </>
  );
}

function VacationListItem({ vacation }: { vacation: VacationDetails }) {
  const timeLeft = timeUntilDeadline(new Date(vacation.bookings[0].createdAt));
  const formattedDate = {
    checkIn: format(new Date(vacation.checkIn), "dd/LL/yyyy"),
    checkOut: format(new Date(vacation.checkOut), "dd/LL/yyyy"),
  };

  return (
    <ListItem>
      <Grid container spacing={2}>
        <Grid item xs={2}>
          <ListItemAvatar>
            <img width="100px" src={vacation.imageName} alt="" />
          </ListItemAvatar>
        </Grid>
        <Grid item xs={6}>
          <ListItemText
            primary={vacation.destination}
            secondary={`${formattedDate.checkIn} - ${formattedDate.checkOut}`}
          />
        </Grid>
        <Grid item xs={2}>
          <ListItemText primary={`$ ${vacation.price}`} />
        </Grid>
        <Grid item xs={2}>
          {timeLeft <= 0 && vacation.bookings[0].bookingStatus === BookingStatus.pending ? (
            <ListItemText
              primary={BookingStatus.rejected}
              secondary={`expired ${-timeLeft} hours ago`}
            />
          ) : (
            <ListItemText
              primary={vacation.bookings[0].bookingStatus}
              secondary={
                vacation.bookings[0].bookingStatus === BookingStatus.pending &&
                `expires in ${timeLeft} hours`
              }
            />
          )}
        </Grid>
      </Grid>
    </ListItem>
  );
}
