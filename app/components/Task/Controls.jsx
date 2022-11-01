import { TrashIcon, PencilSquareIcon } from '@heroicons/react/24/outline'
import { Link, useFetcher } from '@remix-run/react'
// import { Switch } from '@headlessui/react'
// import { useState } from 'react'


export default function () {
    let fetcher = useFetcher();
    // const [enabled, setEnabled] = useState(false)
    return (
        <div className='absolute top-0 left-0 w-full px-5 flex flex-row justify-start items-center h-12 border-b border-gray-300'>
            <fetcher.Form method="post" action='./delete'>
                <button className='flex items-center'>
                    <TrashIcon className='w-5 h-5' strokeWidth={1} />
                </button>
            </fetcher.Form>
            <Link to='./edit' className='flex items-center ml-3'>
                <PencilSquareIcon className='w-5 h-5' strokeWidth={1} />
            </Link>
            <p>Сделать кнопку для скрытия таска</p>
            {/* <Switch
                checked={enabled}
                onChange={setEnabled}
                className={`${enabled ? 'bg-blue-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 items-center rounded-full`}
            >
                <span className="sr-only">Hide</span>
                <span
                    className={`${enabled ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-black transition`}
                />
            </Switch> */}
        </div>
    )
}