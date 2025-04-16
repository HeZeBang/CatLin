import * as z from "zod";


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
});

export type AssignmentComment = z.infer<typeof AssignmentCommentSchema>;

export type AssignmentCommentArray = AssignmentComment[];