import * as React from 'react'
import { Form, useActionData, useTransition } from '@remix-run/react'
import { json, redirect } from '@remix-run/node'
import clsx from 'clsx'

import prisma from '~/utils/prisma.server'
import authenticator from '~/utils/auth.server'
import { validateNewTaskInput } from '~/utils/task.server'

export async function action({ request }) {
    let player = await authenticator.isAuthenticated(request);
    let formData = await request.formData();

    let newTaskData = {
        name: formData.get('name'),
        category: formData.get('category'),
        labels: formData.get('labels'),
        points: Number(formData.get('points')),
        flag: formData.get('flag'),
        content: formData.get('content')
    }

    let result = validateNewTaskInput(newTaskData);
    if (!result.success) {
        return json(result)
    }

    let {id} = await prisma.task.create({
        data: {
            name: newTaskData.name,
            category: newTaskData.category,
            points: newTaskData.points,
            flag: newTaskData.flag,
            content: newTaskData.content,
            hint: 'hint',
            author: {
                connect: { id: player.id }
            }
        }
    })

    return redirect('/tasks/' + id)
    
    // try {

    // } catch (err) {
    //     console.error(err)
    //     return json({ error: err })
    // }
}

export default function NewTask() {
    const actionData = useActionData();
    const transition = useTransition();
    const [value, setValue] = React.useState("**Hello world!!!**");

    return (
        <div className="mx-auto px-4 max-w-xl text-sm">
            <p className='text-center pt-5'>
                Create New Task
            </p>
            <Form method='post'
            // id='newTaskFrom'
            >
                <Input name='name' />
                <div className='flex w-full'>
                    <Input name='category' className={'mr-3'} />
                    <Input name='points' className={'ml-3'} />
                </div>
                <Input name='labels' />
                <Input name='flag' />

                <div className='pt-4'>
                    <label for="content" className="inline-block mb-2 text-gray-700">
                        Content
                    </label>
                    <textarea
                        id='content'
                        name='content'
                        // form='newTaskFrom'
                        rows='5'
                        placeholder='Task text in Markdown'
                        className={clsx(
                            'block w-full',
                            'px-3 py-1.5 m-0',
                            'text-base font-normal text-gray-700 bg-white bg-clip-padding',
                            'border border-solid border-gray-300 rounded',
                            'transition ease-in-out',
                            'focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
                        )}
                    ></textarea>

                </div>

                <button
                    className={`w-full h-12 px-5 mt-4 rounded-lg bg-black ${transition.submission ? 'text-gray-500' : 'text-white'}  `}
                    disabled={transition.submission}
                >
                    Save
                </button>
                <div>
                    {actionData?.error ? <p>ERROR: {JSON.stringify(actionData.error)}</p> : null}
                </div>
            </Form>

        </div>
    )
}

function Input({ name, value, className }) {
    return (
        <div className={clsx('mt-4 w-full', className)}>
            <label for={name} className='inline-block mb-2 text-gray-700 capitalize'>{name}</label>
            <input
                type='text'
                name={name}
                id={name}
                value={value}
                className={clsx(
                    'block w-full',
                    'px-3 py-1.5 m-0',
                    'text-base font-normal text-gray-700 bg-white bg-clip-padding',
                    'border border-solid border-gray-300 rounded',
                    'transition ease-in-out',
                    'focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none',
                )}
            />
        </div>
    )
}

export function CatchBoundary() {
    const caught = useCatch();
    const params = useParams();
      return (
        <div className="text-red-500">
          Uh oh! Catch some error
        </div>
      );
    // throw new Error(`Unsupported thrown response status code: ${caught.status}`);
  }
