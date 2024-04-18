import { httpService } from "../http-service";
import { User } from "../authService/auth-service";

export interface PageQuery {
  pageIndex: number;
  isFollowed?: boolean;
  isCheckInNotStarted?: boolean;
  isActiveVacation?: boolean;
  startingDate: string;
  endingDate: string;
}
export interface VacationDetails {
  _id: string;
  destination: string;
  description: string;
  checkIn: Date;
  checkOut: Date;
  price: string;
  imageName: string;
  allocations: number;
  followers: string[];
  bookings: Booking[];
}

export interface Booking {
  _id: string;
  vacationId: string;
  userId: string;
  bookingStatus: BookingStatus;
  user: User;
  createdAt: string;
}
export enum BookingStatus {
  approved = "approved",
  pending = "pending",
  rejected = "rejected",
}

class VacationService {
  async getVacation(id: string) {
    const res = await httpService.get("vacations/get/", { params: id });
    return res.data;
  }
  async getVacationByPage(pageQuery: PageQuery) {
    const res = await httpService.get("vacations/byPage/", { params: pageQuery });
    return res.data;
  }

  async getBookedVacations(pageQuery: { pageIndex: number }) {
    const res = await httpService.get("vacations/bookedVacations/", { params: pageQuery });
    return res.data;
  }

  async getVacationsReport() {
    const res = await httpService.get("vacations/report");
    return res.data;
  }
  async followVacation(id: string) {
    await httpService.post(`vacations/follow/${id}`);
  }
  async addVacation(vacation: VacationDetails & { imageFile: FileList }) {
    URL.revokeObjectURL(vacation.imageName);

    const res = await httpService.post<{ vacation: VacationDetails }>(
      "vacations/add",
      { ...vacation, imageFile: vacation.imageFile[0] },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return res.data;
  }

  async editVacation(vacation: VacationDetails & { imageFile: FileList }) {
    URL.revokeObjectURL(vacation.imageName);

    const res = await httpService.patch(
      `vacations/edit/${vacation._id}`,
      { ...vacation, imageFile: vacation.imageFile[0] },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return res.data;
  }
  async deleteVacation(vacationId: string) {
    const res = await httpService.delete(`vacations/delete/${vacationId}`);
    return res.data;
  }

  async bookVacation(vacationId: string) {
    const res = await httpService.post(`vacations/book/${vacationId}`);
    return res.data;
  }

  async setBookingsStatus(bookingId: string, status: BookingStatus) {
    const res = await httpService.post(`vacations/setBookingStatus/${bookingId}`, { status });
    return res.data;
  }
}

export const vacationService = new VacationService();
