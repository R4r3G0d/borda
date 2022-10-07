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

        let player = null

        try {
            await validator.parseAsync(signInInput)

            player = await prisma.player.findUniqueOrThrow({ where: { email: signInInput.email } })
            console.log({ player })

            let match = await bcrypt.compare(signInInput.password, player.password)

            if (match) {
                return await Promise.resolve({ id: player.id })
            } else {
                throw new AuthorizationError("That email and password combination is incorrect.")
            }
        } catch (err) {
            console.log(err)
            if (err instanceof NotFoundError) {
                throw new AuthorizationError("Email is not not found.")
            } else if (err instanceof ZodError) {
                throw new AuthorizationError("That email or password is invalid format.")
            } else {
                throw new AuthorizationError("Internal error. Please try again later.")
            }
        }

    }),
);

export default authenticator