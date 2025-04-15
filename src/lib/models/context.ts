export interface UserContextType {
    userId: string | undefined;
    userName?: string;
    handleLogin: (credentialResponse: { credential?: any }) => void;
    handleLogout: () => void;
}