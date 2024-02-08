import { httpService } from "../http-service";

export interface PageQuery {
  pageIndex: number;
  isFollowed?: boolean;
  isCheckInNotStarted?: boolean;
  isActiveVacation?: boolean;
}
export interface VacationDetails {
  _id: string;
  destination: string;
  description: string;
  checkIn: Date;
  checkOut: Date;
  price: string;
  imageName: string;
  followers: string[];
}
class VacationService {
  constructor() {}

  async getVacation(id: string) {
    const res = await httpService.get("vacations/get/", { params: id });
    return res.data;
  }
  async getVacationByPage(pageQuery: PageQuery) {
    const res = await httpService.get("vacations/byPage/", { params: pageQuery });
    return res.data;
  }

  async getVacationsReport() {
    const res = await httpService.get("vacations/report");
    return res.data;
  }
  async followVacation(id: string) {
    await httpService.post(`vacations/follow/${id}`);
  }
  async addVacation(vacation: VacationDetails, imageFile: File | null) {
    URL.revokeObjectURL(vacation.imageName);

    const res = await httpService.post(
      "vacations/add",
      { ...vacation, image: imageFile },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return res.data;
  }

  async editVacation(vacation: VacationDetails, imageFile: File | null) {
    URL.revokeObjectURL(vacation.imageName);

    const res = await httpService.patch(
      `vacations/edit/${vacation._id}`,
      { ...vacation, image: imageFile },
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

  async uploadVacationImage(imageFile: File) {
    const res = await httpService.post("vacations/image", imageFile, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
}

export const vacationService = new VacationService();
