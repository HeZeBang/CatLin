import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  googleid: String,
  level: Number,
  exp: Number,
  badges: Array<Number>,
  current_badge: Number
});

export default mongoose.models.User || mongoose.model("User", userSchema);

export interface UserType {
    _id: string;
    googleid: string;
    name: string;
    level: number;
    exp: number;
    badges: number[];
    current_badge: number;
}
