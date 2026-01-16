import type {
    AxiosError,
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from "axios";

import Axios from "axios";
import { toast } from "sonner"
// import { getI18n } from "@/utils/locales";
import { isDebugEnvironment, log } from "@/lib/utils";
import { token } from "@/store/userStore";

/**
 * @description: ContentType
 */
export enum ContentTypeEnum {
    // form-data qs
    FORM_URLENCODED = "application/x-www-form-urlencoded;charset=UTF-8",
    // form-data upload
    FORM_DATA = "multipart/form-data;charset=UTF-8",
    // json
    JSON = "application/json;charset=UTF-8",
}

export enum HeaderParamsEnum {
    // token key
    ACCESS_TOKEN = "Access-Token",
}

/**
 * @description: code
 */
export enum ResultEnum {
    SUCCESS = 200,
}

// default axios instance config
const configDefault = {
    headers: {
        "Content-Type": ContentTypeEnum.JSON,
    },
    timeout: 0,
    baseURL: process.env.NEXT_PUBLIC_BASE_API,
    data: {},
    withCredentials: true,
};

// path white list
const whiteList = ["/health-check"];
const logIgnore = ["/position/list"];

class Http {
    private static axiosInstance: AxiosInstance;
    private static axiosConfigDefault: AxiosRequestConfig;

    private getHeader(): Record<string, string> {
        const tokenVal = token();
        if (tokenVal) {
            return {
                Authorization: "Bearer " + tokenVal,
            };
        } else {
            return {};
        }
    }

    private httpInterceptorsRequest(): void {
        Http.axiosInstance.interceptors.request.use(
            (config) => {
                const header = this.getHeader();
                for (const [key, value] of Object.entries(header)) {
                    config.headers[key] = value;
                }
                // this.signAndEncrypted(config);
                return config;
            },
            (error: AxiosError) => {
                // showToast("error", error.message, TOAST_TIME)
                checkShowToast(error.message);
                return Promise.reject(error);
            },
        );
    }

    private httpInterceptorsResponse(): void {
        Http.axiosInstance.interceptors.response.use(
            (response: AxiosResponse) => {
                // const toast = getToastInstance();
                const { code } = response.data;
                const isSuccess = Reflect.has(response.data, "code") && code === ResultEnum.SUCCESS;
                if (isSuccess) {
                    const serverTime = response.headers.date;
                    if (serverTime) {
                        const serverTimeStamp = Date.parse(serverTime);
                        const clientTimeStamp = Date.now();
                        // console.log("server",serverTimeStamp,clientTimeStamp)
                        // window.localStorage.setItem(time_difference, `${clientTimeStamp - serverTimeStamp}`);
                    }
                    if (response.data.timeStamp) {
                        // window.localStorage.setItem(server_time_key, `${response.data.timeStamp}`);
                    }
                    if (!response.data.data || response.data.data === "") {
                        return { data: "", code: response.data.code, message: response.data.message };
                    }
                    // if (response.config.headers.has("aesKey")) {
                    //     const key = response.config.headers.aesKey;
                    //     const aesKey = this.keys.get(key) || "";
                    //     this.keys.delete(key);
                    //     const data = JSON.parse(aesDecrypted(aesKey, response.data.data));
                    //     if (isDebugEnvironment() && !logIgnore.includes(response.config.url || "")) {
                    //         log("response", response.config.url);
                    //         log(data);
                    //     }
                    //     return { data, code: response.data.code, message: response.data.message };
                    // }
                    // log("response", response.config.url);
                    // log(response.data);
                    return response.data;
                } else {
                    if (code === 401) {
                        // showToast("error", "Wallet connection has been terminated. This wallet has been logged in elsewhere!", TOAST_TIME);
                        // checkShowToast(getI18n().t("home.kick_out_toast"));
                        // setKickOut(true);
                    } else if (code === 406) {
                        // window.location.href = `/auth?redirectUrl=${encodeURIComponent(window.location.href)}`;
                    } else if (code === 499) {
                        // checkShowToast("An unknown error occurred with this transaction. Please initiate the transaction again");
                    } else if (code >= 7000 && code < 8000) {
                        // nothing
                    } else {
                        // showToast("error", `${response.data.message}`, TOAST_TIME);
                        checkShowToast(`${response.data.message}`);
                    }
                    return Promise.reject(response.data);
                }
            },
            (error: AxiosError) => {
                let message = "";
                // HTTP status code
                const status = error.response?.status;
                switch (status) {
                    case 400:
                        message = "Request error";
                        break;
                    case 403:
                        message = "Access denied";
                        break;
                    case 404:
                        message = `Not Found: ${error.response?.config.url}`;
                        break;
                    case 500:
                        message = "Server internal error";
                        break;
                    default:
                        message = "Network connection failure";
                }
                // showToast("error", message, TOAST_TIME);
                checkShowToast(message);
                log(message);
                return Promise.reject(error);
            },
        );
    }

    constructor(config: AxiosRequestConfig) {
        Http.axiosConfigDefault = config;
        Http.axiosInstance = Axios.create(config);
        this.httpInterceptorsRequest();
        this.httpInterceptorsResponse();
    }

    private keys: Map<string, string> = new Map<string, string>();

    // common request method
    public request<T>(paramConfig: AxiosRequestConfig): Promise<T> {
        const config = { ...Http.axiosConfigDefault, ...paramConfig };
        return new Promise((resolve, reject) => {
            Http.axiosInstance
                .request(config)
                .then((response: unknown) => {
                    resolve(response as T);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    public requestObject<T>(paramConfig: AxiosRequestConfig): Promise<T> {
        const config = { ...Http.axiosConfigDefault, ...paramConfig };
        return new Promise((resolve, reject) => {
            Http.axiosInstance
                .request(config)
                .then((response: unknown) => {
                    resolve((response as ObjectResult<T>).data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    public requestPage<T>(paramConfig: AxiosRequestConfig): Promise<PageResult<T>> {
        const config = { ...Http.axiosConfigDefault, ...paramConfig };
        return new Promise((resolve, reject) => {
            Http.axiosInstance
                .request(config)
                .then((response: unknown) => {
                    resolve((response as PageResultInner<T>).data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    public requestList<T>(paramConfig: AxiosRequestConfig): Promise<Array<T>> {
        const config = { ...Http.axiosConfigDefault, ...paramConfig };
        return new Promise((resolve, reject) => {
            Http.axiosInstance
                .request(config)
                .then((response: unknown) => {
                    resolve((response as ListResult<T>).data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
}


const hasWhiteList = (url: string) => {
    return whiteList.includes(url);
};

let lastToastTime = 0;
let lastMessage = "";
const checkShowToast = (message: string) => {
    toast.error(message)
};

export const http = new Http(configDefault);


export interface ListResult<T> {
    code: number
    message: string
    data: Array<T>
}

interface PageResultInner<T> {
    code: number
    message: string
    data: {
        list: Array<T>
        total: number
        pageNum: number
        pageSize: number
        pages: number
    }
}

export interface PageRequest {
    pageNum: number
    pageSize: number
}

export interface PageResult<T> {
    list: Array<T>
    total: number
    pageNum: number
    pageSize: number
    pages: number
}
export interface ObjectResult<T> {
    code: number
    message: string
    data: T
}

export interface PaginationResp<T> {
    total: number;
    pageNum: number;
    pageSize: number;
    list: T[];
}

export const paginationRespDefault: PaginationResp<any>  = {
  total: 0,
  pageNum: 1,
  pageSize: 10,
  list: []
}