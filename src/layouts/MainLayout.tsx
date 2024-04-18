import { NavLink, Outlet } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  styled,
  Toolbar,
  Typography,
} from "@mui/material";
import HolidayVillageIcon from "@mui/icons-material/HolidayVillage";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import BarChartIcon from "@mui/icons-material/BarChart";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useState } from "react";
import VacationDialogForm from "../components/VacationDialogForm";
import { signOut } from "../redux/authentication/authSlice";
import { grey } from "@mui/material/colors";
import BookIcon from "@mui/icons-material/Book";
const StyledGrid = styled(Grid)({
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
});
export default function MainLayout() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [openDialog, setOpenDialog] = useState(false);

  function handleCloseDialog() {
    setOpenDialog(false);
  }
  function handleSignOut() {
    dispatch(signOut());
  }
  return (
    <Box>
      <AppBar position={"sticky"} sx={{ height: "64px" }}>
        <Toolbar>
          <Grid container direction="row" justifyContent="center" alignItems="center" flexGrow={1}>
            <StyledGrid item sx={{ justifyContent: "start" }} xs={3}>
              <HolidayVillageIcon sx={{ mr: 1, fontSize: "40px" }} />
              <Typography
                variant="h6"
                component="div"
                sx={{ whiteSpace: "nowrap", display: { xs: "none", sm: "block" } }}
              >
                Vacation Planner
              </Typography>
            </StyledGrid>
            <StyledGrid item xs={6}>
              <>
                <IconButton
                  component={NavLink}
                  to={"/home"}
                  sx={{ display: "flex", flexDirection: "column", color: "inherit" }}
                >
                  <CalendarMonthIcon />
                  <Typography variant={"caption"}>Vacations</Typography>
                </IconButton>
                {user?.role === "admin" ? (
                  <>
                    <IconButton color="inherit" onClick={() => setOpenDialog(true)}>
                      <AddCircleIcon sx={{ fontSize: "40px" }} />
                    </IconButton>
                    <IconButton
                      component={NavLink}
                      to={"/vacationsReport"}
                      sx={{ display: "flex", flexDirection: "column", color: "inherit" }}
                    >
                      <BarChartIcon />
                      <Typography variant={"caption"}>Stats</Typography>
                    </IconButton>

                    <IconButton
                      component={NavLink}
                      to={"/manageBookings"}
                      sx={{ display: "flex", flexDirection: "column", color: "inherit" }}
                    >
                      <BookIcon />
                      <Typography variant={"caption"}>Manage Bookings</Typography>
                    </IconButton>
                  </>
                ) : (
                  <IconButton
                    component={NavLink}
                    to={"/myBookings"}
                    sx={{ display: "flex", flexDirection: "column", color: "inherit" }}
                  >
                    <BookIcon />
                    <Typography variant={"caption"}>My Bookings</Typography>
                  </IconButton>
                )}
              </>
            </StyledGrid>
            <StyledGrid item sx={{ justifyContent: "end" }} xs={2}>
              <Typography>
                Welcome {user?.firstName} {user?.lastName}
              </Typography>
            </StyledGrid>
            <StyledGrid item sx={{ justifyContent: "end" }} xs={1}>
              <Button color="inherit" onClick={handleSignOut}>
                Sign Out
              </Button>
            </StyledGrid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Box sx={{ bgcolor: grey[100] }}>
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: "transparent",
          }}
        >
          <Outlet />
        </Container>
      </Box>
      {openDialog && <VacationDialogForm open={openDialog} onClose={handleCloseDialog} />}
    </Box>
  );
}
