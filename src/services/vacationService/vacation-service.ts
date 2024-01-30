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
  async followVacation(id: string) {
    const res = await httpService.post("vacations/follow/", {}, { params: id });
    return res.data;
  }
  async addVacation(vacation: VacationDetails) {
    const res = await httpService.post("vacations/add", vacation);
    return res.data;
  }
}

export const vacationService = new VacationService();
