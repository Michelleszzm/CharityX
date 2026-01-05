import { http } from "@/apis/core";

export interface User {
    token: string
    sysUserVo: SysUserVo
    charityNonprofitMergeVo: UserCharityNonprofit | undefined
}

export interface SysUserVo {
    id: string
    provider: string
    providerId: string
    firstName: string
    lastName: string
    email: string
    gender: number
    age: number
    phone: string
    country: string
    city: string
    occupation: string
    roles: string[]
}

export const sysUserVoDefault: SysUserVo = {
    id: "",
    provider: "",
    providerId: "",
    firstName: "",
    lastName: "",
    email: "",
    gender: 0,
    age: 0,
    phone: "",
    country: "",
    city: "",
    occupation: "",
    roles: []
}

export interface UserCharityNonprofit {
    id: number
    nonprofitName: string
    proofImage: string
    status: number
    isActive: boolean
}

export interface WalletInfo {
    chain: string
    address: string
    depositFee: number
    depositMinAmount: number
    withdrawFee: number
    withdrawMinAmount: number
}

export interface NonceInfo {
    uId: string
}


export interface LatestBlockhashInfo {
    blockhash: string
    lastValidBlockHeight: number
}

export interface S3UploadResponse {
    url: string
    fileUrl: string
}
export function sendCode(data?: object): Promise<User> {
    return http.requestObject({
        url: "/unAuth/send",
        method: "post",
        data,
    });
}
export function resetPasswordCode(data?: object): Promise<string> {
    return http.requestObject({
        url: "/unAuth/resetPasswrd/code",
        method: "post",
        data,
    });
}
export function resetPasswordConfirm(data?: object): Promise<User> {
    return http.requestObject({
        url: "/unAuth/resetPasswrd/confirm",
        method: "post",
        data,
    });
}



export function loginWithCode(data?: object): Promise<User> {
    return http.requestObject({
        url: "/unAuth/codeLogin",
        method: "post",
        data,
    });
}

export function loginWithPassword(data?: object): Promise<User> {
    return http.requestObject({
        url: "/unAuth/passwordLogin",
        method: "post",
        data,
    });
}

export function completeUserInfo(data?: object): Promise<User> {
    return http.requestObject({
        url: "/user/complete",
        method: "post",
        data,
    });
}


export function syncUserInfo(): Promise<User> {
    return http.requestObject({
        url: "/user/info",
        method: "get",
    });
}


export function getS3UploadUrl(params: object): Promise<S3UploadResponse> {
    return http.requestObject({
        url: "/user/s3/preSigned/url",
        method: "get",
        params
    });
}
