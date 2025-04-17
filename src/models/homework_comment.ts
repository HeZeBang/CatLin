import * as z from "zod";
import mongoose from "mongoose";

const homeworkCommentSchema = new mongoose.Schema({
  creator_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  creator_name: String,
  creator_badge: Number,
  is_annonymous: Boolean,
  content: String,
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "Homework" },
  rating: Number,
  created_at: Number,
});

export default mongoose.models.homework_comments || mongoose.model("homework_comments", homeworkCommentSchema);

export const HomeworkCommentTSchema = z.object({
    "_id": z.string(),
    "content": z.string(),
    "create_at": z.number(),
    "creator_badge": z.number(),
    "creator_id": z.string(),
    "creator_name": z.string(),
    "is_annonymous": z.boolean(),
    "parent": z.string(),
    "rating": z.number(),
});
export type HomeworkCommentT = z.infer<typeof HomeworkCommentTSchema>;

export const HomeworkCommentPostTSchema = z.object({
    "content": z.string(),
    "creator_badge": z.number(),
    "creator_name": z.string(),
    "is_annonymous": z.boolean(),
    "rating": z.number(),
});
export type HomeworkCommentPostT = z.infer<typeof HomeworkCommentPostTSchema>;
