import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import EventIcon from "@mui/icons-material/Event";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { VacationDetails } from "../services/vacationService/vacation-service";
import { format } from "date-fns";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { followVacation } from "../redux/vacation/vacationSlice";
import { useState } from "react";
import VacationDialogForm from "./VacationDialogForm";
import VacationDialogDeleteWarning from "./VacationDialogDeleteWarning";
import { ConfirmDialog } from "./ConfirmDialog";

export default function VacationCard({ vacation: vacationDetails }: { vacation: VacationDetails }) {
  const user = useAppSelector((state) => state.auth.user);
  const isFollowed = vacationDetails.followers.includes(user?._id || "");
  const dispatch = useAppDispatch();
  const formattedDate = {
    checkIn: format(vacationDetails.checkIn, "dd/LL/yyyy"),
    checkOut: format(vacationDetails.checkOut, "dd/LL/yyyy"),
  };
  const [isLoadingFollow, setIsLoadingFollow] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  console.log(vacationDetails.bookings);
  const alreadyBooked = vacationDetails.bookings.find((booking) => user?._id === booking.userId);
  function handleCloseDialog() {
    setOpenDialog(false);
  }
  function handleCloseDeleteDialog() {
    setOpenDeleteDialog(false);
  }
  function handleCloseConfirmDialog() {
    setOpenConfirmDialog(false);
  }

  async function handleFollow() {
    try {
      setIsLoadingFollow(true);
      await dispatch(followVacation({ vacationId: vacationDetails._id, userId: user?._id || "" }));
    } catch (e) {
      console.log("Failed to follow vacation", e);
    } finally {
      setIsLoadingFollow(false);
    }
  }
  return (
    <Card
      sx={{
        width: { sm: "500px", md: "400px", lg: "300px" },
        m: 4,
      }}
    >
      <CardMedia
        component={Box}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          p: 1,
          backgroundImage: `url(${vacationDetails.imageName})`,
          backgroundRepeat: "no-repeat",
          backgroundColor: (theme) =>
            theme.palette.mode === "light" ? theme.palette.grey[50] : theme.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "200px",
          maxWidth: "inherit",
        }}
      >
        {user?.role === "user" ? (
          <>
            <Chip
              sx={{ maxWidth: "90px" }}
              icon={
                isLoadingFollow ? (
                  <CircularProgress size={"24px"} />
                ) : (
                  <FavoriteIcon color={isFollowed ? "error" : "success"} />
                )
              }
              variant={"filled"}
              color={isFollowed ? "warning" : "info"}
              label={`Like ${vacationDetails.followers.length}`}
              onClick={handleFollow}
              disabled={isLoadingFollow}
            />
          </>
        ) : (
          <Box>
            <Chip
              sx={{ maxWidth: "90px", mr: 1 }}
              icon={<EditIcon />}
              variant={"filled"}
              color={"primary"}
              label={`Edit`}
              onClick={() => setOpenDialog(true)}
            />
            <Chip
              sx={{ maxWidth: "90px" }}
              icon={<DeleteIcon />}
              variant={"filled"}
              color={"primary"}
              label={`Delete`}
              onClick={() => setOpenDeleteDialog(true)}
            />
          </Box>
        )}

        <Typography variant={"h5"} sx={{ color: "white", pb: 1 }}>
          {vacationDetails.destination}
        </Typography>
      </CardMedia>
      <CardContent
        sx={{
          position: "relative",
          top: -10,
          bgcolor: "secondary.main",
          borderRadius: 2,
          display: "flex",
        }}
      >
        <EventIcon />
        <Typography sx={{ ml: 1, pb: 1 }}>
          {formattedDate.checkIn}-{formattedDate.checkOut}
        </Typography>
      </CardContent>
      <CardContent
        sx={{
          position: "relative",
          top: -20,
          borderRadius: 2,
          bgcolor: "white",
          height: "100px",
          overflow: "auto",
        }}
      >
        <Typography>{vacationDetails.description}</Typography>
      </CardContent>
      <Stack sx={{ display: "flex", alignItems: "center", mt: -3, px: 1, py: 2 }}>
        <Button
          disabled={!!alreadyBooked}
          variant={"contained"}
          sx={{ width: "80%" }}
          onClick={() => setOpenConfirmDialog(true)}
        >
          {`${alreadyBooked ? alreadyBooked.bookingStatus : vacationDetails.price + "$"}`}
        </Button>
      </Stack>
      {openDialog && (
        <VacationDialogForm
          vacation={vacationDetails}
          open={openDialog}
          onClose={handleCloseDialog}
        />
      )}
      <VacationDialogDeleteWarning
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        vacationId={vacationDetails._id}
      />
      {openConfirmDialog && (
        <ConfirmDialog
          vacationId={vacationDetails._id}
          open={openConfirmDialog}
          onClose={handleCloseConfirmDialog}
        />
      )}
    </Card>
  );
}
