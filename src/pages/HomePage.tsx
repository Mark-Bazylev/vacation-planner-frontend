import VacationCard from "../components/VacationCard";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { getVacationsByPage } from "../redux/vacation/vacationSlice";
import { PageQuery } from "../services/vacationService/vacation-service";
import {
  AppBar,
  Box,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  Pagination,
  Slider,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { Backdrop } from "@mui/material";
import { grey } from "@mui/material/colors";
import "rsuite/dist/rsuite.min.css";
import { VacationOptions } from "../components/VacationOptions";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { vacations, vacationsCount } = useAppSelector((state) => state.vacations);
  const user = useAppSelector((state) => state.auth.user);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<PageQuery>({
    pageIndex: 1,
    isFollowed: false,
    isCheckInNotStarted: false,
    isActiveVacation: false,
    startingDate: "",
    endingDate: "",
  });

  useEffect(() => {
    async function getVacations() {
      try {
        setIsLoading(true);
        await dispatch(getVacationsByPage(filter)).unwrap();
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    }
    getVacations();
  }, [filter]);
  function handlePage(event: ChangeEvent<unknown>, pageNumber: number) {
    setFilter({ ...filter, pageIndex: pageNumber });
    setPage(pageNumber);
  }
  function handleSelect(query: Omit<PageQuery, "pageIndex" | "isFollowed">) {
    setPage(1);
    setFilter({
      ...query,
      pageIndex: 1,
      isFollowed: filter.isFollowed,
    });
  }
  function handleLikedVacations() {
    setPage(1);
    setFilter({
      ...filter,
      pageIndex: 1,
      isFollowed: !filter.isFollowed,
    });
  }

  const [sliderValue, setSliderValue] = useState(2);

  return (
    <>
      <Stack mt={2} gap={2} sx={{ display: "flex", alignItems: "center" }}>
        <Box gap={2} sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
          <VacationOptions onOptionSelect={handleSelect} />

          {user?.role === "user" && (
            <FormControlLabel
              control={
                <Switch
                  color={"secondary"}
                  name={"isFollowed"}
                  checked={filter.isFollowed}
                  onChange={handleLikedVacations}
                />
              }
              label="Liked Vacations"
            />
          )}
        </Box>

        <Pagination
          count={Math.ceil(vacationsCount / 10)}
          page={page}
          onChange={handlePage}
          color={"secondary"}
        />
      </Stack>

      <Box
        sx={{
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
