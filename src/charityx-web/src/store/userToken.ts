import { getPrice } from "@/apis/donate";
import { loginWithCode, loginWithPassword, syncUserInfo, User } from "@/apis/user";
import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

const USER_KEY = "user_store";

let tokenPrice: Map<string, number> = new Map();

interface TokenStore {
}

export const loadTokenPrice =  (site: string) => {
    getPrice(site).then((res) => {
        tokenPrice = new Map(res.map(d => [d.token, d.price]));
    })
};

export const convertUsdToToken = (token: string, usdAmount: number): number => {
    if (Number.isNaN(usdAmount)) {
        return 0;
    }
    const price = tokenPrice.get(token) ?? 1;
    const tokenAmount = usdAmount / price
    return Number(tokenAmount.toFixed(9))
};

const initialState = () => {
    if (typeof window === "undefined") {
        return {
        };
    }
    return {
    };
};

const useTokenStore = create<TokenStore>(() => ({
    ...initialState(),
}));

export default useTokenStore
