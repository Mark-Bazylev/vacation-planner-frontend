import { createAppSlice } from "../createAppSlice";
import {
  BookingStatus,
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
  bookedVacations: VacationDetails[];
  bookedVacationsCount: number;
}
const initialState: VacationSliceState = {
  currentVacation: null,
  vacations: [],
  vacationsCount: 1,
  vacationsReport: [],
  bookedVacations: [],
  bookedVacationsCount: 1,
};
const vacationSlice = createAppSlice({
  name: "vacation",
  initialState,
  reducers: (create) => ({
    addVacation: create.asyncThunk(
      async (vacation: VacationDetails & { imageFile: FileList }) => {
        return await vacationService.addVacation(vacation);
      },
      {
        fulfilled(state, action) {
          state.currentVacation = action.payload.vacation;
        },
      },
    ),
    editVacation: create.asyncThunk(
      async (vacation: VacationDetails & { imageFile: FileList }) => {
        return await vacationService.editVacation(vacation);
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

    bookVacation: create.asyncThunk(
      async (vacationId: string) => {
        return await vacationService.bookVacation(vacationId);
      },
      {
        fulfilled(state, action) {
          const vacation = state.vacations.find(
            (vacation) => vacation._id === action.payload.vacationId,
          );
          vacation?.bookings.push(action.payload);
        },
      },
    ),

    setBookingStatus: create.asyncThunk(
      async ({ bookingId, status }: { bookingId: string; status: BookingStatus }) => {
        return await vacationService.setBookingsStatus(bookingId, status);
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
        },
      },
    ),
    getBookedVacations: create.asyncThunk(
      async (pageQuery: { pageIndex: number }) => {
        return await vacationService.getBookedVacations(pageQuery);
      },
      {
        fulfilled(state, action) {
          state.bookedVacations = action.payload.vacations;
          state.bookedVacationsCount = action.payload.count;
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
  getVacationsByPage,
  getVacationsReport,
  getBookedVacations,
  followVacation,
  addVacation,
  editVacation,
  deleteVacation,
  bookVacation,
  setBookingStatus,
} = vacationSlice.actions;

export default vacationSlice.reducer;
