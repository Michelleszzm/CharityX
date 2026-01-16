import { http } from "@/apis/core";
import { SysUserVo } from "../user";

export enum ApplicationStatus {
  NONE = 0,
  PENDING = 1,
  ACTIVE = 2,
  REVOKED = 3,
  REJECTED = 4,
  DELETED = 10
}

export interface Application {
    userId: number;
    email: string;
    firstName: string;
    lastName: string;
    nonprofitName: string;
    proofImage: string;
    status: number;
    mergeDate: number;
    type: number;
}


export interface ApplicationEditRequest {
    userId: string;
    firstName: string;
    lastName: string;
    gender: number;
    age: string;
    phone: string;
    country: string;
    city: string;
    occupation: string;
}
export const defaultEditData: ApplicationEditRequest = {
  userId: "",
  firstName: "",
  lastName: "",
  gender: 0,
  age: "",
  phone: "",
  country: "",
  city: "",
  occupation: "",
};


export interface ApplicationRegisteredResponse {
    total: number;
    pageNum: number;
    pageSize: number;
    list: Application[];
}

export interface ApplicationManagerResponse {
    sysUserVo: SysUserVo;
    checkRecordVoList: CheckRecordResponse[];
}

export interface CheckRecordResponse {
    targetStatus: number;
    checkTime: number;
    reason: string;
}

export function delApplication(data: object): Promise<ApplicationRegisteredResponse> {
    return http.requestObject({
        url: "/admin/application/delete",
        method: "post",
        data
    });
}
export function getApplicationPending(pageNum: number, email: string, nonprofitName: string): Promise<ApplicationRegisteredResponse> {
    return http.requestObject({
        url: "/admin/application/pending",
        method: "get",
        params: {
            pageNum,
            pageSize: 10,
            email,
            nonprofitName
        }
    });
}

export function getApplicationApproved(pageNum: number, email: string, nonprofitName: string): Promise<ApplicationRegisteredResponse> {
    return http.requestObject({
        url: "/admin/application/approved",
        method: "get",
        params: {
            pageNum,
            pageSize: 10,
            email,
            nonprofitName
        }
    });
}

export function getApplicationApprovedManager(params: object): Promise<ApplicationManagerResponse> {
    return http.requestObject({
        url: "/admin/application/approved/manager",
        method: "get",
        params
    });
}

export function getApplicationRejected(pageNum: number, email: string, nonprofitName: string): Promise<ApplicationRegisteredResponse> {
    return http.requestObject({
        url: "/admin/application/rejected",
        method: "get",
        params: {
            pageNum,
            pageSize: 10,
            email,
            nonprofitName
        }
    });
}

export function getApplicationRegistered(pageNum: number, email: string): Promise<ApplicationRegisteredResponse> {
    return http.requestObject({
        url: "/admin/application/registered",
        method: "get",
        params: {
            pageNum,
            pageSize: 10,
            email,
        }
    });
}

export function updateApplicationAction(params: object): Promise<ApplicationRegisteredResponse> {
    return http.requestObject({
        url: "/admin/application/action",
        method: "get",
        params
    });
}

export function updateApplicationUser(data: object): Promise<ApplicationRegisteredResponse> {
    return http.requestObject({
        url: "/admin/application/complete/user",
        method: "post",
        data
    });
}
