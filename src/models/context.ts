import { UserType } from "@/models/user";
import { SWRResponse } from "swr";
import { ConfettiRef } from "@/components/magicui/confetti";
import { RefObject } from "react";

export interface UserContextType {
    userId: string | undefined;
    userName?: string;
    user: UserType | undefined;
    isLoggedIn: boolean;
    confettiRef: RefObject<ConfettiRef>;
    addBadge: (badge: string) => Promise<void>;
    useUser: () => SWRResponse<UserType, any, boolean>; //TODO: fix this type
    handleLogin: (credentialResponse: { credential?: any }) => void;
    handleLogout: () => void;
}