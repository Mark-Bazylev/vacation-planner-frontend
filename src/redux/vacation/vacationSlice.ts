import { createAppSlice } from "../createAppSlice";
import {
  PageQuery,
  VacationDetails,
  vacationService,
} from "../../services/vacationService/vacation-service";

interface VacationSliceState {
  vacation: VacationDetails | null;
  vacations: VacationDetails[] | null;
}

const initialState: VacationSliceState = {
  vacation: null,
  vacations: null,
};
const vacationSlice = createAppSlice({
  name: "vacation",
  initialState,
  reducers: (create) => ({
    getVacation: create.asyncThunk(
      async (id: string) => {
        return await vacationService.getVacation(id);
      },
      {
        fulfilled(state, action) {
          state.vacation = action.payload.vacation;
        },
      },
    ),
    getVacationsByPage: create.asyncThunk(
      async (pageQuery: PageQuery) => {
        return await vacationService.getVacationByPage(pageQuery);
      },
      {
        fulfilled(state, action) {
          state.vacations = action.payload.vacations;
        },
      },
    ),
    followVacation: create.asyncThunk(
      async (id: string) => {
        return await vacationService.followVacation(id);
      },
      {
        fulfilled(state, action) {},
      },
    ),
  }),
});
export const { getVacation, getVacationsByPage, followVacation } = vacationSlice.actions;

export default vacationSlice.reducer;
