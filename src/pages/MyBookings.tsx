import React, { useEffect, useState } from "react";
import { getBookedVacations } from "../redux/vacation/vacationSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  Backdrop,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { BookingStatus, VacationDetails } from "../services/vacationService/vacation-service";
import { timeUntilDeadline } from "../utils/dateManager";
import { format } from "date-fns";

export function MyBookings() {
  const dispatch = useAppDispatch();
  const { bookedVacations } = useAppSelector((state) => state.vacations);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState({ pageIndex: 1 });
  useEffect(() => {
    async function getVacations() {
      try {
        setIsLoading(true);
        const res = await dispatch(getBookedVacations(filter)).unwrap();
        console.log(res);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    }
    getVacations();
  }, [filter]);
  return (
    <>
      <div>Pagination section here {filter.pageIndex}</div>

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
    <ListItem sx={{ display: "flex", gap: 2 }}>
      <ListItemAvatar>
        <img width="100px" src={vacation.imageName} alt="" />
      </ListItemAvatar>
      <ListItemText
        primary={vacation.destination}
        secondary={`${formattedDate.checkIn} - ${formattedDate.checkOut}`}
      />

      <ListItemText primary={`$ ${vacation.price}`} />

      <ListItemText
        primary={vacation.bookings[0].bookingStatus}
        secondary={
          vacation.bookings[0].bookingStatus === BookingStatus.pending &&
          `expires in ${timeLeft} hours`
        }
      />
    </ListItem>
  );
}
