import { UserType } from "@/models/user";

export interface UserContextType {
    userId: string | undefined;
    userName?: string;
    user: UserType | undefined;
    isLoggedIn: boolean;
    handleLogin: (credentialResponse: { credential?: any }) => void;
    handleLogout: () => void;
}