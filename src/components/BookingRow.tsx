import {
  Box,
  CircularProgress,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import React, { useState } from "react";
import {
  Booking,
  BookingStatus,
  VacationDetails,
} from "../services/vacationService/vacation-service";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import { useAppDispatch } from "../redux/hooks";
import { setBookingStatus } from "../redux/vacation/vacationSlice";
import { timeUntilDeadline } from "../utils/dateManager";
import { format } from "date-fns";

export function BookingRow({ vacation }: { vacation: VacationDetails }) {
  const [open, setOpen] = useState(false);
  const approvedBookings = vacation.bookings.filter(
    (booking) => booking.bookingStatus === BookingStatus.approved,
  );
  const formattedDate = {
    checkIn: format(new Date(vacation.checkIn), "dd/LL/yyyy"),
    checkOut: format(new Date(vacation.checkOut), "dd/LL/yyyy"),
  };
  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>
          <img width="100px" src={vacation.imageName} alt="" />
        </TableCell>
        <TableCell>
          <Stack>
            <Typography>{vacation.destination}</Typography>
            <Typography>
              {formattedDate.checkIn} - {formattedDate.checkOut}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell>
          {approvedBookings.length}/ {vacation.allocations}
        </TableCell>
        <TableCell> {`$ ${vacation.price}`} </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                  {vacation.bookings?.map((booking) => (
                    <BookingList key={booking._id} booking={booking} />
                  ))}
                </List>
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

function BookingList({ booking }: { booking: Booking }) {
  const dispatch = useAppDispatch();
  const [statusDecided, setStatusDecided] = useState<BookingStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const timeLeft = timeUntilDeadline(new Date(booking.createdAt));
  async function handleStatus(bookingId: string, status: BookingStatus) {
    try {
      setLoading(true);
      await dispatch(setBookingStatus({ bookingId, status }));
      setStatusDecided(status);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <ListItem>
        <ListItemText primary={`${booking.user?.firstName} ${booking.user?.lastName}`} />
        {loading ? (
          <ListItemIcon sx={{ mr: 6 }}>
            <CircularProgress />
          </ListItemIcon>
        ) : (
          <>
            {statusDecided || booking.bookingStatus !== BookingStatus.pending ? (
              <ListItemIcon>{statusDecided || booking.bookingStatus} </ListItemIcon>
            ) : (
              <>
                <ListItemIcon>Request will expire in {timeLeft} hours </ListItemIcon>
                <ListItemIcon>
                  <IconButton
                    color="success"
                    sx={{ display: "flex", flexDirection: "column" }}
                    onClick={() => handleStatus(booking._id, BookingStatus.approved)}
                  >
                    <CheckCircleOutlineIcon />
                    <Typography>Approve</Typography>
                  </IconButton>
                </ListItemIcon>
                <ListItemIcon sx={{ mr: 2 }}>
                  <IconButton
                    color="error"
                    sx={{ display: "flex", flexDirection: "column" }}
                    onClick={() => handleStatus(booking._id, BookingStatus.rejected)}
                  >
                    <BlockOutlinedIcon />
                    <Typography>Reject</Typography>
                  </IconButton>
                </ListItemIcon>
              </>
            )}
          </>
        )}
      </ListItem>
    </>
  );
}
