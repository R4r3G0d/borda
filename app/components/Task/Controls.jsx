import { TrashIcon, PencilSquareIcon } from '@heroicons/react/24/outline'
import { Link, useFetcher } from '@remix-run/react'
import { Switch } from '@headlessui/react'
import { useState } from 'react'


export default function () {
    let fetcher = useFetcher();
    const [enabled, setEnabled] = useState(false)

    return (
        <div className=' h-12 px-5 flex flex-row justify-start items-center'>
            <fetcher.Form method="post" action='./delete'>
                <button className='flex items-center'>
                    <TrashIcon className='w-5 h-5' strokeWidth={1} />
                </button>
            </fetcher.Form>
            <Link to='./edit' className='flex items-center ml-3'>
                <PencilSquareIcon className='w-5 h-5' strokeWidth={1} />
            </Link>

            <Switch
                checked={enabled}
                onChange={setEnabled}
                className={`${enabled ? 'bg-teal-900' : 'bg-teal-700'}
          ml-5 relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
            >
                <span className="sr-only">Hide</span>
                <span
                    aria-hidden="true"
                    className={`${enabled ? 'translate-x-6' : 'translate-x-0'}
            pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                />
            </Switch>
        </div>
    )
}