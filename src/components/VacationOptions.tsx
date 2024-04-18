import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import React, { useRef, useState, FC } from "react";
import { DateRangePicker } from "rsuite";
import { DateRange } from "rsuite/DateRangePicker";
import { endOfMonth, endOfWeek, endOfYear, startOfMonth, startOfWeek, startOfYear } from "date-fns";
import { PageQuery } from "../services/vacationService/vacation-service";

interface VacationOptionProps {
  onOptionSelect: (query: Omit<PageQuery, "pageIndex" | "isFollowed">) => void;
}

export const VacationOptions: FC<VacationOptionProps> = ({ onOptionSelect }) => {
  type Options = "custom" | "thisWeek" | "thisMonth" | "thisYear" | "upcoming" | "ongoing";
  const [option, setOption] = useState<Options>("custom");
  const dateRange = useRef<DateRange | null>(null);

  function handleToggle(newValue: Options) {
    const currentDate = new Date();
    let dates: DateRange | null = null;
    switch (newValue) {
      case "custom":
        dates = dateRange.current;
        break;
      case "thisWeek":
        dates = [startOfWeek(currentDate), endOfWeek(currentDate)];
        break;
      case "thisMonth":
        dates = [startOfMonth(currentDate), endOfMonth(currentDate)];
        break;
      case "thisYear":
        dates = [startOfYear(currentDate), endOfYear(currentDate)];
        break;
      case "upcoming":
      case "ongoing":
        dates = null;
        break;
    }
    if (dates) {
      onOptionSelect({
        isActiveVacation: false,
        isCheckInNotStarted: false,
        startingDate: dates[0].toDateString(),
        endingDate: dates[1].toDateString(),
      });
    } else {
      onOptionSelect({
        isActiveVacation: newValue === "ongoing",
        isCheckInNotStarted: newValue === "upcoming",
        startingDate: "",
        endingDate: "",
      });
    }
    setOption(newValue);
  }
  return (
    <Box gap={1} sx={{ display: "flex", flexDirection: "row" }}>
      <DateRangePicker
        onChange={(value) => (dateRange.current = value)}
        onOk={() => handleToggle("custom")}
        showOneCalendar
        ranges={[]}
      />
      <ToggleButtonGroup
        color="primary"
        value={option}
        exclusive
        onChange={(event, value) => handleToggle(value)}
        aria-label="text alignment"
        size="small"
      >
        <ToggleButton value="custom" aria-label="left aligned">
          Custom
        </ToggleButton>
        <ToggleButton value="thisWeek" aria-label="centered">
          This Week
        </ToggleButton>
        <ToggleButton value="thisMonth" aria-label="right aligned">
          This Month
        </ToggleButton>
        <ToggleButton value="thisYear" aria-label="justified">
          This Year
        </ToggleButton>
        <ToggleButton value="upcoming" aria-label="justified">
          Upcoming
        </ToggleButton>
        <ToggleButton value="ongoing" aria-label="justified">
          Ongoing
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};
