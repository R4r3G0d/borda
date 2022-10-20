import { Authenticator, AuthorizationError } from 'remix-auth'
import { FormStrategy } from 'remix-auth-form'
import { z } from 'zod'
import * as bcrypt from 'bcrypt'

import prisma from './prisma.server'
import { sessionStorage } from './session.server'

const authenticator = new Authenticator(sessionStorage, {
    sessionKey: "sessionKey",
    sessionErrorKey: "sessionErrorKey",
})

authenticator.use(
    new FormStrategy(async function ({ form }) {
		let values = Object.fromEntries(form)

        const validator = z.object({
            email: z.string().email('Invalid email format.'),
            password: z.string().min(5),
        })

        await validator.parseAsync(values)

        let player = await prisma.player.findUniqueOrThrow({
            where: { email: values.email },
            include: { team: { select: { id: true, name: true } } }
        })

        let match = await bcrypt.compare(values.password, player.password)

        if (match) {
            delete player.password
            return await Promise.resolve({ ...player })
        } else {
            throw new AuthorizationError("That email and password combination is incorrect.")
        }
    })
)

async function validatePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword)
}

function hashPassword(password) {
    return bcrypt.hash(password, 10)
}

export default authenticator
export { hashPassword, validatePassword }
