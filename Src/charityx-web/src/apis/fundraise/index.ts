import { http, PaginationResp } from "@/apis/core";
import { ApplicationRegisteredResponse } from "../admin";
import { SysUserVo } from "../user";

export interface FundraisingResponse {
  styleValue: FundraisingStyle
  paymentValue: FundraisingPayment
  formValue: FundraisingForm
  allocationValue: FundraisingAllocation
  publishValue: FundraisingPublish
  fundraisingTemplateCode: string
  publishStatusDraft: number
  publishStatus: number // -1: no, 0: wait, 1: ready
}

export interface FundraisingStyle {
  organizationName: string
  organizationLogo: string
  chooseColor: string;
  mainTitle: string;
  subtitle: string;
}

export interface FundraisingPayment {
  chainList: Array<string>
  tokenList: Array<string>
  chainWalletList: Array<FundraisingPaymentWallet>
}

export interface FundraisingPaymentWallet {
  chain: string
  wallet: string
}

export interface FundraisingForm {
  amountList: Array<string>
  defaultAmount: string
}

export interface FundraisingAllocation {
  purposeList: Array<FundraisingAllocationItem>
}

export interface FundraisingPublish {
  site: string
  nftImage: string
  ein: string
  metaTitle: string
  metaDescription: string
  metaKeywords: string
}

export interface FundraisingAllocationItem {
  name: string
  percent: string
}

export const fundraisingStyleDefault: FundraisingStyle  = {
  organizationName: "",
  organizationLogo: "",
  chooseColor: "#2777FF",
  mainTitle: "Donate in Crypto, Empower Every Cause",
  subtitle: "With just a tap, your kindness reaches instantly. Let every crypto coin become a force for change. Each click from you is a seed of love, together lighting hope in the lives of those in need.",
}
export const fundraisingPaymentDefault: FundraisingPayment = {
  chainList: ["SOLANA"],
  tokenList: ["USDT", "USDC", "SOL"],
  chainWalletList: [],
}
export const fundraisingAllocationDefault: FundraisingAllocation  = {
  purposeList: [
    {name: "", percent: ""},
    {name: "", percent: ""}
  ]
}

export const fundraisingFormDefault: FundraisingForm  = {
  amountList: ["300", "150", "60", "30", "15"],
  defaultAmount: "30"
}

export interface FundraisingAllocationSelectItem {
  value: string;
  label: string;
  min: string;
  max: string;
}
export const toSelectAmount = (amountList: Array<string>): FundraisingAllocationSelectItem[] =>  {
  const arr = amountList.map(Number).sort((a, b) => a - b);
  const ranges: FundraisingAllocationSelectItem[] = [];
  ranges.push({
    value: "all",
    label: `Amount Range`,
    min: "",
    max: ``,
  });
  if (arr.length <= 0) {
    return ranges;
  }
  ranges.push({
    value: "0",
    label: `$ 0 ~ ${arr[0]}`,
    min: "0",
    max: `${arr[0]}`,
  });

  for (let i = 0; i < arr.length - 1; i++) {
    ranges.push({
      value: `${arr[i]}`,
      label: `$ ${arr[i]} ~${arr[i + 1]}`,
      min: `${arr[i]}`,
      max: `${arr[i + 1]}`,
    });
  }

  const last = arr[arr.length - 1];
  ranges.push({
    value: `${last}`,
    label: `$ ${last}+`,
    min: `${last}`,
    max: ``,
  });

  return ranges;
}
export const fundraisingPublishDefault: FundraisingPublish  = {
  site: "",
  nftImage: "",
  ein: "",
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
}

export interface DonorSummaryResponse {
  donors: number
  totalDonations: number
  donationCount: number
}
export const donorSummaryResponseDefault: DonorSummaryResponse  = {
  donors: 0,
  totalDonations: 0,
  donationCount: 0
}

export interface Donor {
    donorWallet: string;
    chain: string;
    totalDonations: number;
    donationCount: number;
    lastDonation: number;
    lastAmount: number
}
export const donorDefault: Donor  = {
  donorWallet: "",
  chain: "",
  totalDonations: 0,
  donationCount: 0,
  lastDonation: 0,
  lastAmount: 0
}

export type RiskLevel = "low" | "medium" | "high";

// risk level text mapping
export const riskLevelText = {
  low: "Low - Safe Donation",
  medium: "Medium - Review Required",
  high: "High - Suspicious Activity"
}

export const riskLevelColor = {
  low: "bg-[#00B140]",
  medium: "bg-[#FAAD14]",
  high: "bg-[#F5222D]",
}

export interface DonorRecord {
    day: string;
    chain: string;
    donorWallet: string;
    foundationWallet: string;
    txHash: string;
    token: string;
    value: number;
    amount: number;
    aiAmlRisk: RiskLevel;
    payTime: number;
    payStatus: number;
    nftId: string;

}
export interface DonorNote {
  note: string;
  createTime: number;
}

export interface DonorInfo {
  user: SysUserVo | null;
  summary: Donor;
  recordList: DonorRecord[];
  noteList: DonorNote[]
}

export const donorInfoDefault: DonorInfo  = {
  user: null,
  recordList: [],
  summary: donorDefault,
  noteList: []
}

export interface DonorEditRequest {
    chain: string;
    wallet: string;
    firstName: string;
    lastName: string;
    email: string;
    gender: number;
    age: string;
    phone: string;
    country: string;
    city: string;
    occupation: string;
}

export interface ReportSummary {
  donors: number;
  totalDonations: number;
  donationCount: number;
  donationPerCapita: number;
}

export const reportSummaryDefault: ReportSummary = {
  donors: 0,
  totalDonations: 0,
  donationCount: 0,
  donationPerCapita: 0,
}

export interface ReportTrend {
  trendList: ReportTrendItem[]
}

export const reportTrendDefault: ReportTrend = {
  trendList: [],
}

export interface ReportTrendItem {
  day: string;
  amount: number;
  donors: number;
}


export interface ReportDistribution {
  chain: ReportDistributionChain[]
  token: ReportDistributionToken[]
  donationFrequency: ReportDistributionDonationFrequency[]
  donationAmount: ReportAmountDistribution[]
}

export const reportDistributionDefault: ReportDistribution = {
  chain: [],
  token: [],
  donationFrequency: [],
  donationAmount: [],
}

export interface ReportDistributionChain {
  name: string;
  donors: number;
  donationAmount: number;
  calculateAmount: number;
  percent: number;
  [key: string]: string | number // index signature, compatible with recharts type
}
export interface ReportDistributionToken {
  name: string;
  donors: number;
  donationAmount: number;
  calculateAmount: number;
  percent: number;
  [key: string]: string | number // index signature, compatible with recharts type
}

export interface ReportAmountDistribution {
  name: string;
  donors: number;
  donationAmount: number;
  calculateAmount: number;
  percent: number;
  [key: string]: string | number // index signature, compatible with recharts type
}
export interface ReportDistributionDonationFrequency {
  name: string;
  donors: number;
  donationAmount: number;
  calculateAmount: number;
  percent: number;
  [key: string]: string | number // index signature, compatible with recharts type
}

export function getTemplate(): Promise<string> {
    return http.requestObject({
        url: "/user/fundraising/template",
        method: "get",
    });
}

export function getFundraise(): Promise<FundraisingResponse> {
    return http.requestObject({
        url: "/user/fundraising",
        method: "get",
    });
}
export function submitFundraiseSite(data?: object): Promise<boolean> {
    return http.requestObject({
        url: "/user/fundraising/site/submit",
        method: "post",
        data
    });
}
export function saveFundraise(data?: object): Promise<string> {
    return http.requestObject({
        url: "/user/fundraising",
        method: "post",
        data
    });
}
export function publishFundraise(data?: object): Promise<string> {
    return http.requestObject({
        url: "/user/fundraising/publish",
        method: "post",
        data
    });
}

export function getDonorSummary(): Promise<DonorSummaryResponse> {
    return http.requestObject({
        url: "/user/donors/summary",
        method: "get",
    });
}

export function getDonorList(pageNum: number, walletAddress: string, minAmount: string, maxAmount: string): Promise<PaginationResp<Donor>> {
    return http.requestObject({
        url: "/user/donors/list",
        method: "get",
        params: {
            pageNum,
            pageSize: 10,
            donorWallet: walletAddress,
            minAmount,
            maxAmount,
        }
    });
}

export function getDonorRecordList(pageNum: number, walletAddress: string, token: string, minAmount: string, maxAmount: string, startDay: string, endDay: string): Promise<PaginationResp<DonorRecord>> {
    return http.requestObject({
        url: "/user/donors/record",
        method: "get",
        params: {
            pageNum,
            pageSize: 10,
            donorWallet: walletAddress,
            token,
            minAmount,
            maxAmount,
            startDay,
            endDay,
        }
    });
}

export function getDonorRecordWithAddress(params: object): Promise<DonorInfo> {
    return http.requestObject({
        url: "/user/donors/wallet",
        method: "get",
        params
    });
}

export function updateDonorUser(data: object): Promise<string> {
    return http.requestObject({
        url: "/user/donors/wallet/complete",
        method: "post",
        data
    });
}


export function addDonorNote(data: object): Promise<string> {
    return http.requestObject({
        url: "/user/donors/note",
        method: "post",
        data
    });
}

export function getReportSummary(params: object): Promise<ReportSummary> {
    return http.requestObject({
        url: "/user/reports/summary",
        method: "get",
        params
    });
}

export function getReportTrend(params: object): Promise<ReportTrend> {
    return http.requestObject({
        url: "/user/reports/trend",
        method: "get",
        params
    });
}

export function getReportDistribution(params: object): Promise<ReportDistribution> {
    return http.requestObject({
        url: "/user/reports/distribution",
        method: "get",
        params
    });
}

export function getReportAmountDistribution(): Promise<ReportDistribution> {
    return http.requestObject({
        url: "/user/reports/amount/distribution",
        method: "get"
    });
}



