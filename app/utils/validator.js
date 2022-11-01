import { z } from "zod";
import { Category } from "@prisma/client";

export const passwordValidator = z.string().min(6, { message: "Password must be at least 6 characters!" })

export const taskValidator = z.object({
    name: z.string(),
    category: z.nativeEnum(Category),
    labels: z.string().optional(),
    points: z.number().int().positive(),
    flag: z.string().regex(new RegExp('[A-Za-z]+{[0-9A-Za-z_]+}$', 'm')),
    content: z.string()
})

export function formatZodError(error) {
    let err = new Object

    let issues = error.issues
    issues.forEach(function (issue) {
        err[issue.path[0]] = issue.message
    });

    return err
}