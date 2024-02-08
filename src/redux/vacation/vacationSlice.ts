import { createAppSlice } from "../createAppSlice";
import {
  PageQuery,
  VacationDetails,
  vacationService,
} from "../../services/vacationService/vacation-service";

export type VacationReport = Pick<VacationDetails, "destination" | "followers" | "_id">[];
interface VacationSliceState {
  currentVacation: VacationDetails | null;
  vacations: VacationDetails[];
  vacationsCount: number;
  vacationsReport: VacationReport;
}
const initialState: VacationSliceState = {
  currentVacation: null,
  vacations: [],
  vacationsCount: 1,
  vacationsReport: [],
};
const vacationSlice = createAppSlice({
  name: "vacation",
  initialState,
  reducers: (create) => ({
    addVacation: create.asyncThunk(
      async ({ vacation, imageFile }: { vacation: VacationDetails; imageFile: File | null }) => {
        return await vacationService.addVacation(vacation, imageFile);
      },
      {
        fulfilled(state, action) {
          state.currentVacation = action.payload.vacation;
          console.log(state.vacations);
        },
      },
    ),
    editVacation: create.asyncThunk(
      async ({ vacation, imageFile }: { vacation: VacationDetails; imageFile: File | null }) => {
        return await vacationService.editVacation(vacation, imageFile);
      },
      {
        fulfilled(state, action) {
          const vacationIndex = state.vacations.findIndex(
            (vacation) => vacation._id === action.payload._id,
          );
          if (vacationIndex !== -1) {
            state.vacations[vacationIndex] = action.payload;
          }
        },
      },
    ),
    deleteVacation: create.asyncThunk(
      async (vacationId: string) => {
        return await vacationService.deleteVacation(vacationId);
      },
      {
        fulfilled(state, action) {
          const vacationIndex = state.vacations.findIndex(
            (vacation) => vacation._id === action.payload._id,
          );
          if (vacationIndex !== -1) {
            state.vacations.splice(vacationIndex, 1);
          }
        },
      },
    ),
    getVacation: create.asyncThunk(
      async (id: string) => {
        return await vacationService.getVacation(id);
      },
      {
        fulfilled(state, action) {
          state.currentVacation = action.payload.vacation;
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
          state.vacationsCount = action.payload.count;
          console.log(state.vacations, state.currentVacation);
        },
      },
    ),
    getVacationsReport: create.asyncThunk(
      async () => {
        return await vacationService.getVacationsReport();
      },
      {
        fulfilled(state, action) {
          state.vacationsReport = action.payload;
        },
      },
    ),
    followVacation: create.asyncThunk(
      async ({ vacationId, userId }: { vacationId: string; userId: string }) => {
        await vacationService.followVacation(vacationId);
        return { vacationId, userId };
      },
      {
        fulfilled(state, action) {
          const { vacationId, userId } = action.payload;
          const vacation = state.vacations.find((vacation) => vacation._id === vacationId);
          if (vacation) {
            const followerIndex = vacation.followers.findIndex((id) => id === userId);
            if (followerIndex !== -1) {
              vacation?.followers.splice(followerIndex, 1);
            } else {
              vacation?.followers.push(userId);
            }
          }
        },
      },
    ),
  }),
});
export const {
  getVacation,
  getVacationsByPage,
  getVacationsReport,
  followVacation,
  addVacation,
  editVacation,
  deleteVacation,
} = vacationSlice.actions;

export default vacationSlice.reducer;
