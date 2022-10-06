import * as React from 'react'
import { FlagIcon, ThumbUpIcon, CheckIcon, XCircleIcon } from '@heroicons/react/outline'
import { Link, useActionData, useFetcher, useLoaderData } from '@remix-run/react'
import moment from 'moment'

const colors = new Map([
    ["WEB", "yellow"],
    ["CRYPTO", "lime"],
    ["FORENSICS", "fuchsia"],
    ["OSINT", "blue"],
    ["REVERSE", "rose"],
    ["BINARY", "red"],
    ["OTHER", "violet"],
]);

export function TaskHeader({ name = 'Empty Task', category = 'OTHER', points = 0 }) {
    const taskIcon = Array.from(category)[0];
    const taskColor = colors.get(category)

    return (
        <div className="h-10 flex flex-row">
            <div className={`flex-none h-10 w-10 bg-${taskColor}-500 font-semibold text-base text-center text-white leading-10 capitalize rounded-sm`}>
                {taskIcon}
            </div>
            <div className="grow ml-2 h-10">
                <p className="font-medium whitespace-nowrap text-sm">{name}</p>
                <p className="text-gray-400 text-xs">{category}</p>
            </div>
            <div className="flex-none font-medium text-2xl h-10">
                {points}
            </div>
        </div>
    )
}

export function TaskBody({ author, content, tags = ['easy', 'linux'] }) {
    const Flag = useFetcher();
    const data = useActionData();

    let inputRef = React.useRef();

    React.useEffect(function () {
        // if (Flag.data?.error) {
        // }
        inputRef.current.focus();
    }, [])

    return (
        <>
            <div className='mt-2'>
                <div className='text-black text-sm whitespace-nowrap'>
                    by <Link to={`/users/${author.id}`} className='underline'>{author.displayName}</Link>

                </div>
                <div className='flex flex-row pt-2'>
                    {tags.map((tag, idx) => (
                        <div className='px-2 py-px first:m-0 ml-4 rounded-lg bg-black text-white text-xs align-middle' key={idx}>{tag}</div>
                    ))}

                </div>
            </div>

            <div className='py-5'>{content}</div>

            <Flag.Form
                method='post'
                action='./flag'
            >
                {Flag.data?.error ? (
                    <div className='pb-2'>
                        <div className='bg-red-100 text-red-500 rounded-md h-10 flex items-center w-full'>
                            <p className='px-3'>
                                {Flag.data.error.message}
                            </p>
                        </div>

                    </div>
                ) : null}

                <fieldset
                    className='flex flex-row'
                    disabled={Flag.submission}>
                    <input
                        ref={inputRef}
                        type='text'
                        name='flag'
                        placeholder='flag{s0m3_fl4g}'
                        // disabled={Flag.submission}
                        className='w-full h-10 px-2 border-2 focus-ring rounded-md text-black text-sm border-gray-500 focus:border-black'
                    >
                    </input>

                    <button
                        type='submit'
                        className={`ml-2 h-10 px-3 rounded-md ${Flag.submission ? 'bg-gray-700' : 'bg-black'}  text-white text-sm`}

                    >
                        Check
                    </button>
                </fieldset>

            </Flag.Form>
        </>
    )
}

export function TaskSolutionsList({ solutions }) {
    return (
        <div className='grow mt-5 w-full overflow-auto h-96'>
            <table class="table-auto">
                {/* <thead>
                        <tr>
                            <th>Time</th>
                            <th>Name</th>
                            <th>Flag</th>
                            <th>Flag</th>
                        </tr>
                    </thead> */}
                <tbody>
                    {solutions.map((solution) => (
                        <tr className='h-10 whitespace-nowrap'>
                            <td>{moment().from(solution.createdAt, Boolean)} ago</td>
                            <td className='px-3'>{solution.player.displayName}</td>
                            <td className='px-3'>{solution.flag}</td>
                            <td>
                                {solution.isCorrect
                                    ? <CheckIcon strokeWidth={1} className='h-4 w-4' />
                                    : <XCircleIcon strokeWidth={1} className='h-4 w-4' />}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export function TaskFooter({ solves = 0, likes = 0 }) {
    return (
        <div className="h-10 flex flex-row justify-between items-center text-gray-400 font-normal">
            <div className="flex felx-row items-end">
                <FlagIcon className='w-5 h-5' strokeWidth={1} />
                <p className="ml-2">
                    <span className="mr-1">{solves}</span>solve(s)
                </p>
            </div>
            <div className="flex flex-row items-end">
                <ThumbUpIcon className="w-5 h-5" strokeWidth={1} />
                <p className="ml-2">{likes}</p>
            </div>
        </div>
    )
}