import { loginWithCode, loginWithPassword, syncUserInfo, User } from "@/apis/user";
import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

const USER_KEY = "user_store";

let tokenValue = "";

export const token = () => {
    return tokenValue;
};

interface UserStore {
  userInfo: User | undefined
  isLogined: boolean
}

export const loginToService = async (email: string, code: string): Promise<User | null> => {
    let user = await loginWithCode({ email, code });
    console.log("loginToService", user);
    if (user) {
        tokenValue = user.token;
        useUserStore.setState({ userInfo: user, isLogined: true });
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        return user;
    }
    return null;
};

export const loginToServiceWithPassword = async (email: string, password: string): Promise<User | null> => {
    let user = await loginWithPassword({ email, password });
    console.log("loginToServiceWithPassword", user);
    if (user) {
        tokenValue = user.token;
        useUserStore.setState({ userInfo: user, isLogined: true });
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        return user;
    }
    return null;
};


export const refreshUserInfo = async () => {
    const user = await syncUserInfo();
    if (user) {
        // user.token = useUserStore.getState().userInfo?.token || "";
        const prevUser = useUserStore.getState().userInfo;
        user.token = prevUser?.token || "";
        const prevIsLogged = useUserStore.getState().isLogined;
        if (JSON.stringify(prevUser) !== JSON.stringify(user)) {
            useUserStore.setState({ userInfo: user });
        }
        if (!prevIsLogged) {
            useUserStore.setState({ isLogined: true });
        }
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
};

export const loginWithToken =  async (token: string | null): Promise<User | null> => {
    if (token && token !== "") {
        tokenValue = token
        const user = await syncUserInfo();
        user.token = token;
        useUserStore.setState({ userInfo: user, isLogined: true });
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        return user;
    } else {
        const userString = localStorage.getItem(USER_KEY);
        if (userString) {
            const user: User = JSON.parse(userString);
            tokenValue = user.token;

            useUserStore.setState({
                userInfo: user,
                isLogined: true,
            });
            refreshUserInfo()
            return user;
        }
        refreshUserInfo()
    }
    return null;
};

export const logout = async () => {
  tokenValue = "";
  useUserStore.setState({
      userInfo: undefined,
      isLogined: false,
  });
  localStorage.removeItem(USER_KEY);
}

export const loadState =  (token: string | null) => {
    const userString = localStorage.getItem(USER_KEY);
    if (userString) {
        const user: User = JSON.parse(userString);
        tokenValue = user.token;

        console.log("loadState",user)
        useUserStore.setState({
            userInfo: user,
            isLogined: true,
        });
    }
    refreshUserInfo()
};

const initialState = () => {
    if (typeof window === "undefined") {
        return {
            userInfo: undefined,
            isLogined: false,
        };
    }
    return {
        userInfo: undefined,
        isLogined: false,
    };

    // const userString = localStorage.getItem(USER_KEY);
    // if (userString) {
    //     const user: User = JSON.parse(userString);
    //     tokenValue = user.token;
    //     return {
    //         userInfo: user,
    //         isLogined: true,
    //     };
    // }
    // return {
    //     userInfo: undefined,
    //     isLogined: false,
    // };
};

const useUserStore = create<UserStore>(() => ({
    ...initialState(),
}));

export default useUserStore
