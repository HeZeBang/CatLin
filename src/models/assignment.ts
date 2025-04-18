import * as z from "zod";
import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  platform: String,
  course: String,
  title: String,
  due: Number,
  submitted: Boolean,
  url: String,
  create: Number,
  rating: Number,
  cat_type: Number,
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "Homework" },
});

export default mongoose.models.Assignment || mongoose.model("Assignment", assignmentSchema);

export const AssignmentTSchema = z.object({
    "__v": z.number(),
    "_id": z.string(),
    "cat_type": z.number(),
    "course": z.string(),
    "create": z.number(),
    "due": z.number(),
    "parent": z.string(),
    "platform": z.string(),
    "rating": z.number(),
    "submitted": z.boolean(),
    "title": z.string(),
    "url": z.string(),
    "user_id": z.string(),
});
export type AssignmentT = z.infer<typeof AssignmentTSchema>; // TODO: replace with *T

export const HomeworkCommentSchema = z.object({
    "content": z.string(),
    "creator_badge": z.number(),
    "creator_id": z.string(),
    "creator_name": z.string(),
    "is_annonymous": z.boolean(),
    "parent": z.string(),
    "rating": z.number(),
    "created_at": z.number(),
});

export type HomeworkComment = z.infer<typeof HomeworkCommentSchema>;
