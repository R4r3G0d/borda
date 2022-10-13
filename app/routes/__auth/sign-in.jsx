import {
    Form,
    Link,
    useActionData,
    useTransition
} from '@remix-run/react'
import { json } from '@remix-run/node'
import { z } from 'zod'

import authenticator from '~/utils/auth.server'
import { sessionStorage } from '~/utils/session.server'
import { passwordValidator } from '~/utils/validator'
import { MakaraIcon } from '~/components/icons/MakaraIcon'
import { EmailField, PasswordField } from '~/components/Field'
import { Button } from '~/components/Button'

export async function loader({ request }) {
    await authenticator.isAuthenticated(request, {
        successRedirect: "/tasks"
    });

    const session = await sessionStorage.getSession(
        request.headers.get("Cookie")
    );

    const error = session.get("sessionErrorKey");
    return json({ error });
};

export async function action({ request, context }) {
    return await authenticator.authenticate("form", request, {
        successRedirect: "/tasks",
        failureRedirect: "/sign-in",
        throwOnError: true,
        context,
    });

    // let session = await getSession(request.headers.get("cookie"));
    // let error = session.get(authenticator.sessionErrorKey);
    // return json({ error });
};

export default function SignIn() {
    const actionData = useActionData();
    const transition = useTransition();

    return (
        <div className='container max-w-sm mx-auto '>
            <Form
                method='post'
                className='px-6'
            >
                <div className='p-4 flex justify-center'>
                    <MakaraIcon className={'w-56 h-56'} />
                </div>
                <div className='min-h-8'>
                    {actionData?.error ? <p>{actionData?.error?.message}</p> : null}
                </div>

                <EmailField error={actionData?.error.email} />
                <PasswordField error={actionData?.error.password} />

                <Button
                    className={'w-full h-12 mt-4'}
                    text='Sign in'
                    disabled={transition.submission}
                />

                <div className="h-16 flex items-center place-content-center">
                    No account?
                    <Link to="/sign-up" className="pl-3 text-indigo-700">Create new one</Link>
                </div>
            </Form>
        </div>
    )
}