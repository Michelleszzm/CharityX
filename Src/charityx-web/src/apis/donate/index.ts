import { http, PaginationResp } from "@/apis/core";
import { RiskLevel } from "../fundraise";

export interface ReceiptData {
  donorWallet: string;
  foundationWallet: string;
  txHash: string;
  chain: string;
  token: string;
  amount: number;
  value: number;
  payTime: number;
  nftId: string;
  nftImage: string;
  aiAmlRisk: RiskLevel;
}

export interface TransactionResult {
  payStatus: number;
  donorWallet: string;
  foundationWallet: string;
  txHash: string;
  chain: string;
  token: string;
  amount: number;
  value: number;
  payTime: number;
  nftId: string;
  nftImage: string;
  aiAmlRisk: RiskLevel;
}

export const receiptDataDefault: ReceiptData = {
  donorWallet: "",
  foundationWallet: "",
  txHash: "",
  chain: "",
  token: "",
  amount: 0,
  value: 0,
  payTime: 0,
  nftId: "",
  nftImage: "",
  aiAmlRisk: "low"
}

export interface TokenPrice {
  token: string;
  price: number;
}

export function getDonorConfig(site: string): Promise<string> {
    return http.requestObject({
        url: "/customer/donors/config",
        method: "get",
        headers: {
          "site": site
        }
    });
}

export function getDonationOverview(site: string, pageNum: number, token: string, minAmount: string, maxAmount: string): Promise<PaginationResp<ReceiptData>> {
    return http.requestObject({
        url: "/customer/donation/overview",
        method: "get",
        headers: {
          "site": site
        },
        params: {
            pageNum,
            pageSize: 10,
            token,
            minAmount,
            maxAmount,
        }
    });
}

export function getLatestBlockHash(site: string, params: object): Promise<string> {
    return http.requestObject({
        url: "/customer/chain/latestBlockHash",
        method: "get",
        headers: {
          "site": site
        },
        params
    });
}

export function getPrice(site: string): Promise<TokenPrice[]> {
    return http.requestObject({
        url: "/customer/chain/price",
        method: "get",
        headers: {
          "site": site
        }
    });
}
export function sendTransaction(site: string, data: object): Promise<string> {
    return http.requestObject({
        url: "/customer/donors",
        method: "post",
        headers: {
          "site": site
        },
        data
    });
}

export function getTransaction(site: string, params: object): Promise<TransactionResult> {
    return http.requestObject({
        url: "/customer/chain/transaction",
        method: "get",
        headers: {
          "site": site
        },
        params
    });
}
export function getReceiptNFT(site: string, params: object): Promise<ReceiptData[]> {
    return http.requestObject({
        url: "/customer/receipt/with/nft",
        method: "get",
        headers: {
          "site": site
        },
        params
    });
}
