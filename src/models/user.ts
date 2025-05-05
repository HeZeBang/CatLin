import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  account_id: String,
  level: Number,
  exp: Number,
  food: Number,
  money: Number,
  badges: Array<Number>,
  current_badge: Number
});

export default mongoose.models.User || mongoose.model("User", userSchema);

export interface UserType {
    _id: string;
    account_id: string;
    name: string;
    level: number;
    exp: number;
    food: number;
    money: number;
    badges: number[];
    current_badge: number;
}
