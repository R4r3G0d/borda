import { z } from "zod";

export const passwordValidator = z.string().nonempty({ message: "Can't be empty!" }).min(6, { message: "Password must be at least 6 characters!" })