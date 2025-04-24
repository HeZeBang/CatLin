import { UserType } from "./user";

export interface UserContextType {
    userId: string | undefined;
    userName?: string;
    user: UserType | undefined;
    isLoggedIn: boolean;
    addBadge: (task_id: string) => Promise<void>;
    handleLogin: (credentialResponse: { credential?: any }) => void;
    handleLogout: () => void;
}