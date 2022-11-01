import { z } from "zod";
import { Category } from "@prisma/client";

export const passwordValidator = z.string().min(6, { message: "Password must be at least 6 characters!" })

export const flagValidator = z.string().regex(new RegExp('[A-Za-z]+{[\u0401\u0451\u0410-\u044f0-9A-Za-z_]+}$', 'm'))

export const taskValidator = z.object({
    name: z.string(),
    category: z.nativeEnum(Category),
    labels: z.string().optional(),
    points: z.number().int().positive(),
    flag: flagValidator,
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