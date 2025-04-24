import { UserType } from "@/models/user";
import { SWRResponse } from "swr";

export interface UserContextType {
    userId: string | undefined;
    userName?: string;
    user: UserType | undefined;
    isLoggedIn: boolean;
    useUser: () => SWRResponse<UserType, any, boolean>; //TODO: fix this type
    handleLogin: (credentialResponse: { credential?: any }) => void;
    handleLogout: () => void;
}