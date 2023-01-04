import { AuthorizationError } from 'remix-auth'
import {
    Form,
    Link,
    useActionData,
    useTransition
} from '@remix-run/react'
import { json, redirect } from '@remix-run/node'
import { z } from 'zod'

import prisma from '~/utils/prisma.server'
import authenticator from '~/utils/auth.server'
import { passwordValidator } from '~/utils/validator'
import { MakaraIcon } from '~/components/icons/MakaraIcon'
import { EmailField, PasswordField, Field } from '~/components/Field'
import { Button } from '~/components/Button'


export const loader = async ({ request }) => {
    return await authenticator.isAuthenticated(request, {
        successRedirect: "/tasks"
    });
};

export async function action({ request }) {
    let formData = await request.formData()

    let values = Object.fromEntries(formData)

    const validator = z.object({
        email: z.string().email(),
        password: passwordValidator,
        displayName: z.string().min(2),
    })

    let result = validator.safeParse(values)
    if (!result.success) {
        // console.log(result)

        let errors = new Object

        let issues = result.error.issues
        issues.forEach(function (issue) {
            errors[issue.path[0]] = issue.message
        });

        // console.log({ errors })
        return json({ error: errors })
    }

    let player = await prisma.player.findUnique({
        where: {
            email: values.email,
        },
    })

    if (player) {
        return json({ error: { email: 'This email is already in use. Please try another one.' } })
    } else {
        let newPlayer = await prisma.player.create({
            data: {
                ...values,
            }
        })
        if (!newPlayer) {
            return json({ error: { message: 'Internal error. Please try again later.' } })
        }
    }

    return redirect('/sign-in')
}


export default function SignUp() {
    const transition = useTransition();
    let actionData = useActionData();

    console.log({ actionData })

    return (
        <div className='container max-w-sm mx-auto '>
            <Form
                method="post"
                className='px-6 pb-8 grid grid-cols-1 gap-10'
            >
                <div className='flex justify-center items-center p-6'>
                    <MakaraIcon className={'w-56 h-56'} />
                </div>

                <div className='grid grid-cols-1 gap-4'>
                    <EmailField error={actionData?.error.email} />
                    <PasswordField error={actionData?.error.password} />
                    <Field
                        label='Display name'
                        name='displayName'
                        placeholder='Nickname or real name'
                        error={actionData?.error.displayName}
                    />
                </div>
                <div>
                    {
                        actionData?.error?.message ? (
                            <div className='h-16 -mt-4 text-sm text-red-500 flex items-center justify-center'>
                                <p>{actionData.error.message}</p>
                            </div>
                        ) : null
                    }
                    <Button
                        full
                        text='Create account'
                        disabled={transition.submission}
                    />
                    <div className="h-16 flex items-center place-content-center">
                        Already have an account?
                        <Link to="/sign-in" className="pl-3 text-blue-600">Sign in</Link>
                    </div>
                </div>
            </Form>
        </div>
    )
}