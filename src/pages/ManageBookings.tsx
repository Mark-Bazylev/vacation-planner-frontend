import React, { ChangeEvent, useEffect, useState } from "react";
import { getBookedVacations } from "../redux/vacation/vacationSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  Backdrop,
  CircularProgress,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";

import { BookingRow } from "../components/BookingRow";
export function ManageBookings() {
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

      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Vacation</TableCell>
              <TableCell>Destination</TableCell>
              <TableCell>Allocations</TableCell>
              <TableCell>Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookedVacations?.map((vacation) => (
              <BookingRow key={vacation._id} vacation={vacation} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
