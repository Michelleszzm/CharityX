import { FundraisingResponse, getFundraise } from "@/apis/fundraise";
import { loginWithCode, loginWithPassword, syncUserInfo, User } from "@/apis/user";
import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

const USER_KEY = "user_store";

let tokenValue = "";

export const token = () => {
    return tokenValue;
};

interface FundraisingStore {
  fundraising: FundraisingResponse | undefined
}

export const loadFundraising = async () => {
    let fundraisingResponse = await getFundraise();
    console.log("fundraisingResponse", fundraisingResponse)
    useFundraisingStore.setState({fundraising: fundraisingResponse});
};

const initialState = () => {
    if (typeof window === "undefined") {
        return {
            fundraising: undefined,
        };
    }
    return {
        fundraising: undefined,
    };
};

const useFundraisingStore = create<FundraisingStore>(() => ({
    ...initialState(),
}));

export default useFundraisingStore
