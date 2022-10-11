import { Authenticator, AuthorizationError } from 'remix-auth'
import { FormStrategy } from 'remix-auth-form'
import { NotFoundError } from '@prisma/client/runtime'
import { z, ZodError } from 'zod'
import * as bcrypt from 'bcrypt'

import prisma from './prisma.server'
import { sessionStorage } from './session.server'

const authenticator = new Authenticator(sessionStorage, {
    sessionKey: "sessionKey",
    sessionErrorKey: "sessionErrorKey",
})

authenticator.use(
    new FormStrategy(async function ({ form }) {
        let signInInput = {
            email: form.get('email'),
            password: form.get('password'),
        }

        const validator = z.object({
            email: z.string().email(),
            password: z.string().min(5),
        })

        try {
            await validator.parseAsync(signInInput)

            let player = await prisma.player.findUniqueOrThrow({
                where: { email: signInInput.email },
                include: { team: { select: { id: true, name: true } } }
            })

            let match = await bcrypt.compare(signInInput.password, player.password)

            if (match) {
                delete player.password
                return await Promise.resolve({ ...player })
            } else {
                throw new AuthorizationError("That email and password combination is incorrect.")
            }
        } catch (err) {
            console.log(err)
            if (err instanceof NotFoundError) {
                throw new AuthorizationError("Couldn't find your account.")
            } else if (err instanceof ZodError) {
                throw new AuthorizationError("Incorrect password or email format.")
            } else {
                throw new AuthorizationError("Internal error. Please try again later.")
            }
        }

    }),
);

async function validatePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword)
}

function hashPassword(password) {
    return bcrypt.hash(password, 10)
};

export default authenticator
export { hashPassword, validatePassword }
