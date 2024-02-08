import VacationCard from "../components/VacationCard";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { ChangeEvent, useEffect, useState } from "react";
import { getVacation, getVacationsByPage } from "../redux/vacation/vacationSlice";
import { PageQuery } from "../services/vacationService/vacation-service";
import {
  AppBar,
  Box,
  Container,
  FormControlLabel,
  FormGroup,
  Pagination,
  Stack,
  Switch,
} from "@mui/material";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { vacations, vacationsCount, currentVacation } = useAppSelector((state) => state.vacations);
  const user = useAppSelector((state) => state.auth.user);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<PageQuery>({
    pageIndex: 1,
    isFollowed: false,
    isCheckInNotStarted: false,
    isActiveVacation: false,
  });

  const handleFilter = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.name === "isFollowed") {
      setFilter({
        pageIndex: 1,
        isActiveVacation: filter.isActiveVacation,
        isCheckInNotStarted: filter.isCheckInNotStarted,
        isFollowed: event.target.checked,
      });
    } else {
      setFilter({
        pageIndex: 1,
        isActiveVacation: false,
        isCheckInNotStarted: false,
        isFollowed: filter.isFollowed,
        [event.target.name]: event.target.checked,
      });
    }
    setPage(1);
  };

  useEffect(() => {
    async function getVacations() {
      try {
        await dispatch(getVacationsByPage(filter)).unwrap();
      } catch (e) {
        console.log(e);
      }
    }
    getVacations();
  }, [filter, currentVacation]);
  async function handlePage(event: ChangeEvent<unknown>, pageNumber: number) {
    try {
      setFilter({ ...filter, pageIndex: pageNumber });
    } catch (e) {
    } finally {
      setPage(pageNumber);
    }
  }

  return (
    <>
      <AppBar
        color="transparent"
        position="fixed"
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          mt: 8,
          boxShadow: "none",
        }}
      >
        <Stack
          sx={{
            display: "flex",
            alignItems: "center",
            pb: 2,
            px: 3,
            bgcolor: "primary.main",
            borderRadius: " 0% 0% 40% 40% / 0% 0% 80% 80%;",
          }}
        >
          <FormGroup sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
            {user?.role === "user" && (
              <FormControlLabel
                control={
                  <Switch
                    color={"secondary"}
                    name={"isFollowed"}
                    checked={filter.isFollowed}
                    onChange={handleFilter}
                  />
                }
                label="My Vacations"
              />
            )}
            <FormControlLabel
              control={
                <Switch
                  color={"secondary"}
                  name={"isCheckInNotStarted"}
                  checked={filter.isCheckInNotStarted}
                  onChange={handleFilter}
                />
              }
              label="Future Vacations"
            />
            <FormControlLabel
              control={
                <Switch
                  color={"secondary"}
                  name={"isActiveVacation"}
                  checked={filter.isActiveVacation}
                  onChange={handleFilter}
                />
              }
              label="Ongoing"
            />
          </FormGroup>
          <Pagination
            count={Math.ceil(vacationsCount / 10)}
            page={page}
            onChange={handlePage}
            color={"secondary"}
          />
        </Stack>
      </AppBar>

      <Box
        sx={{
          mt: { xs: 16, sm: 12 },
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {vacations?.map((vacation) => {
          return <VacationCard key={vacation._id} vacation={vacation} />;
        })}
      </Box>
    </>
  );
}
