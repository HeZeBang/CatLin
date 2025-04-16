import * as z from "zod";


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