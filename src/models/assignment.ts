import * as z from "zod";
import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  platform: String,
  course: String,
  title: String,
  due: Date,
  submitted: Boolean,
  url: String,
  create: Number,
  rating: Number,
  catType: String,
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "Homework" },
});

export default mongoose.models.Assignment || mongoose.model("Assignment", assignmentSchema);

export const AssignmentSchema = z.object({
    "__v": z.number(),
    "_id": z.string(),
    "catType": z.number(),
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
export type Assignment = z.infer<typeof AssignmentSchema>;

export const AssignmentCommentSchema = z.object({
    "content": z.string(),
    "creator_badge": z.number(),
    "creator_id": z.string(),
    "creator_name": z.string(),
    "is_annonymous": z.boolean(),
    "parent": z.string(),
    "rating": z.number(),
    "created_at": z.number(),
});

export type AssignmentComment = z.infer<typeof AssignmentCommentSchema>;

export type AssignmentCommentArray = AssignmentComment[];