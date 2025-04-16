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
