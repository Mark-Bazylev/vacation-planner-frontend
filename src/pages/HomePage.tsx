import VacationCard from "../components/VacationCard";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { ChangeEvent, useEffect, useState } from "react";
import { getVacationsByPage } from "../redux/vacation/vacationSlice";
import { PageQuery } from "../services/vacationService/vacation-service";
import { Box, Container, FormControlLabel, FormGroup, Switch } from "@mui/material";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const vacations = useAppSelector((state) => state.vacations.vacations);
  const [filter, setFilter] = useState<PageQuery>({
    pageIndex: 1,
    isFollowed: false,
    isCheckInNotStarted: false,
    isActiveVacation: false,
  });

  const handleFilter = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.name === "isFollowed") {
      setFilter({
        pageIndex: filter.pageIndex,
        isActiveVacation: filter.isActiveVacation,
        isCheckInNotStarted: filter.isCheckInNotStarted,
        isFollowed: event.target.checked,
      });
    } else {
      setFilter({
        pageIndex: filter.pageIndex,
        isActiveVacation: false,
        isCheckInNotStarted: false,
        isFollowed: filter.isFollowed,
        [event.target.name]: event.target.checked,
      });
    }
  };

  useEffect(() => {
    console.log("hi");

    async function getVacations() {
      await dispatch(getVacationsByPage(filter)).unwrap();
    }
    getVacations();
  }, [filter]);
  return (
    <Container>
      Welcome to home page
      <FormGroup>
        <FormControlLabel
          control={
            <Switch name={"isFollowed"} checked={filter.isFollowed} onChange={handleFilter} />
          }
          label="My Vacations"
        />
        <FormControlLabel
          control={
            <Switch
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
              name={"isActiveVacation"}
              checked={filter.isActiveVacation}
              onChange={handleFilter}
            />
          }
          label="Ongoing"
        />
      </FormGroup>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        {vacations?.map((vacation) => {
          return <VacationCard key={vacation._id} vacation={vacation} />;
        })}
      </Box>
    </Container>
  );
}
