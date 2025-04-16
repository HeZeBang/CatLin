export interface UserType {
    _id: string;
    googleid: string;
    name: string;
    level: number;
    exp: number;
    badges: number[];
    currentBadge: number;
}