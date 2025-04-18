import * as z from "zod";
import mongoose from "mongoose";

const homeworkSchema = new mongoose.Schema({
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  platform: String,
  course: String,
  title: String,
  due: Number,
  url: String,
  ratingSum: Number,
  ratingNumber: Number,
  rating: Number,
  cat_type: String,
});

export default mongoose.models.Homework || mongoose.model("Homework", homeworkSchema);

export const HomeworkTSchema = z.object({
    "_id": z.string(),
    // "cat_type": z.number(),
    "course": z.string(),
    "due": z.number(),
    "platform": z.string(),
    "ratingNumber": z.number(),
    "ratingSum": z.number(),
    "title": z.string(),
    "url": z.string(),
    "users": z.array(z.string()),
});
export type HomeworkT = z.infer<typeof HomeworkTSchema>;