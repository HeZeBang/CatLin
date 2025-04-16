import * as z from "zod";
import mongoose from "mongoose";

const homeworkSchema = new mongoose.Schema({
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  platform: String,
  course: String,
  title: String,
  due: Date,
  url: String,
  ratingSum: Number,
  ratingNumber: Number,
  rating: Number,
  catType: String,
});

export default mongoose.models.Homework || mongoose.model("Homework", homeworkSchema);

export const HomeworkSchema = z.object({
    "catType": z.number(),
    "course": z.string(),
    "due": z.number(),
    "platform": z.string(),
    "ratingNumber": z.number(),
    "ratingSum": z.number(),
    "title": z.string(),
    "url": z.string(),
    "users": z.array(z.string()),
});
export type Homework = z.infer<typeof HomeworkSchema>;