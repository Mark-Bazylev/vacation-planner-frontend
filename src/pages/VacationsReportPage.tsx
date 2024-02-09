import { Button, Container, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import React, { useEffect, useMemo } from "react";
import { getVacationsReport } from "../redux/vacation/vacationSlice";
import { handleDownloadCsv } from "../utils/handleDownloadCsv";

export function VacationsReportPage() {
  const { vacationsReport } = useAppSelector((state) => state.vacations);
  const dispatch = useAppDispatch();
  useEffect(() => {
    async function getVacations() {
      await dispatch(getVacationsReport(undefined));
    }
    getVacations();
  }, []);

  const destinationArray = useMemo(() => {
    if (vacationsReport.length !== 0) {
      return vacationsReport.map((vacation) => vacation.destination);
    } else {
      return [""];
    }
  }, [vacationsReport]);
  const followersCountArray = useMemo(() => {
    if (vacationsReport.length !== 0) {
      return vacationsReport.map((vacation) => vacation.followers.length);
    } else {
      return [0];
    }
  }, [vacationsReport]);

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant={"h2"}>Vacations Report</Typography>
      <BarChart
        xAxis={[{ scaleType: "band", data: destinationArray }]}
        series={[{ data: followersCountArray }]}
        width={800}
        height={400}
      />
      <Button variant="contained" color="primary" onClick={handleDownloadCsv(vacationsReport)}>
        Download CSV
      </Button>{" "}
    </Container>
  );
}
