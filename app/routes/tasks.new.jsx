import { Form, useActionData, useLoaderData, useTransition } from '@remix-run/react';
import clsx from 'clsx'
import prisma from '../utils/prisma.server';
import { Task, Category } from '@prisma/client';
import authenticator from '~/utils/auth.server';
import { json, redirect } from '@remix-run/node';

export async function action({ request }) {
    const categories = new Map([
        ["WEB", Category.WEB],
        ["CRYPTO", Category.CRYPTO],
        ["FORENSICS", Category.FORENSICS],
        ["OSINT", Category.OSINT],
        ["REVERSE", Category.REVERSE],
        ["BINARY", Category.BINARY],
    ]);

    let player = await authenticator.isAuthenticated(request);

    const formData = await request.formData();
    let name = formData.get('name');
    let category = formData.get('category');
    let points = Number(formData.get('points'));
    let flag = formData.get('flag');
    let content = formData.get('content');

    try {
        let newTask = await prisma.task.create({
            data: {
                name: name,
                category: categories[category],
                points: points,
                flag: flag,
                content: content,
                hint: 'hint',
                author: {
                    connect: { id: player.id }
                }
            }
        })

        return redirect('/tasks/' + newTask.id)
    } catch (err) {
        console.error(err)
        return json({error: err})
    }
}

export default function NewTask() {
    const actionData = useActionData();
    const transition = useTransition();
    return (
        <div className="mx-auto px-4 max-w-xl text-sm">
            <p className='text-center pt-5'>
                Create New Task
            </p>
            <Form method='post'>
                <Input name='name' />
                <Input name='category' />
                <Input name='points' />
                <Input name='flag' />
                <Input name='content' />
                <button
                    className={`w-full h-12 px-5 mt-4 rounded-lg bg-black ${transition.submission ? 'text-gray-500' : 'text-white'}  `}
                    disabled={transition.submission}
                >
                    Save
                </button>
                <div>
                    {actionData?.error ? <p>ERROR: {actionData?.error?.message}</p> : null}
                </div>
            </Form>

        </div>
    )
}

function Input({ name, value, className }) {
    return (
        <div className='mt-4'>
            <label for={name} className='capitalize mb-3'>{name}</label>
            <input type='text' name={name} value={value}
                className={clsx(
                    'w-full h-10 px-3   border-2 focus-ring rounded-md text-gray-700 border-gray-700 ',
                    'focus:border-black focus:text-black',
                    className)}
            />
        </div>
    )
}