import { TrashIcon, PencilAltIcon } from '@heroicons/react/outline'
import { Link, useFetcher } from '@remix-run/react'


export default function() {
    let fetcher = useFetcher();
    return (
        <div className='absolute top-0 left-0 w-full px-5 flex flex-row justify-start items-center h-12 border-b border-gray-300'>
            <fetcher.Form method="post" action='./delete'>
                <button className='flex items-center'>
                    <TrashIcon className='w-5 h-5' strokeWidth={1} />
                </button>
            </fetcher.Form>
            <Link to='./edit' className='flex items-center ml-3'>
                <PencilAltIcon className='w-5 h-5' strokeWidth={1} />
            </Link>
        </div>
    )
}