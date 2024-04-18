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
  Table,
  TableBody,
  TableCell,
  TableHead,
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
                <Table sx={{ width: "100%", bgcolor: "background.paper" }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell align="center">Message</TableCell>
                      <TableCell align="right">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {vacation.bookings?.map((booking) => (
                      <BookingTableRow key={booking._id} booking={booking} />
                    ))}
                  </TableBody>
                </Table>
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

function BookingTableRow({ booking }: { booking: Booking }) {
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
      <TableRow>
        <TableCell>{`${booking.user?.firstName} ${booking.user?.lastName}`} </TableCell>

        {loading ? (
          <TableCell sx={{ mr: 6 }}>
            <CircularProgress />
          </TableCell>
        ) : (
          <>
            {statusDecided || booking.bookingStatus !== BookingStatus.pending ? (
              <>
                <TableCell align="center" />
                <TableCell align="right">{statusDecided || booking.bookingStatus} </TableCell>
              </>
            ) : (
              <>
                <TableCell align="center">Request will expire in {timeLeft} hours </TableCell>
                <TableCell align="right" sx={{ display: "flex" }}>
                  <IconButton
                    color="success"
                    sx={{ display: "flex", flexDirection: "column" }}
                    onClick={() => handleStatus(booking._id, BookingStatus.approved)}
                  >
                    <CheckCircleOutlineIcon />
                    <Typography>Approve</Typography>
                  </IconButton>

                  <IconButton
                    color="error"
                    sx={{ display: "flex", flexDirection: "column" }}
                    onClick={() => handleStatus(booking._id, BookingStatus.rejected)}
                  >
                    <BlockOutlinedIcon />
                    <Typography>Reject</Typography>
                  </IconButton>
                </TableCell>
              </>
            )}
          </>
        )}
      </TableRow>
    </>
  );
}
