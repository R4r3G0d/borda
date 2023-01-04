import {
    Form,
    Link,
    useActionData,
    useTransition
} from '@remix-run/react'
import { json } from '@remix-run/node'
import { AuthorizationError } from 'remix-auth'


import authenticator from '~/utils/auth.server'
import { MakaraIcon } from '~/components/icons/MakaraIcon'
import { EmailField, PasswordField } from '~/components/Field'
import { Button } from '~/components/Button'

export async function loader({ request }) {
    return await authenticator.isAuthenticated(request, { successRedirect: "/tasks" })
}

export async function action({ request, context }) {
    try {
        return await authenticator.authenticate("form", request, {
            successRedirect: "/tasks",
            throwOnError: true,
            context,
        })

    } catch (error) {
        console.log(error)

        switch (true) {
            case error instanceof Response: return error
            case error instanceof AuthorizationError:
                let errors = {}

                try {
                    let issues = JSON.parse(error.message)
                    console.log(issues)
                    issues.forEach(function (issue) {
                        errors[issue.path[0]] = issue.message
                    });

                } catch (e) {
                    errors.message = error.message
                }

                return json({ error: { ...errors } })
            default:
                throw error
        }
    }
}

export default function SignIn() {
    const actionData = useActionData()
    const transition = useTransition()

    console.log({ actionData })

    return (
        <div className='container max-w-sm mx-auto '>
            <Form
                method='post'
                className='px-6 pb-8 grid grid-cols-1 gap-10'
            >
                <div className='p-4 flex justify-center'>
                    <MakaraIcon className={'w-56 h-56'} />
                </div>

                <div className='grid grid-cols-1 gap-4'>
                    <EmailField error={actionData?.error?.email} />
                    <PasswordField error={actionData?.error?.password} />
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
                        text='Sign in'
                        full
                        disabled={transition.submission}
                    />

                    <div className="h-16 flex items-center place-content-center">
                        No account?
                        <Link to="/sign-up" className="pl-3 text-blue-600">Create new one</Link>
                    </div>

                </div>

            </Form>
        </div>
    )
}