import { TrashIcon, PencilAltIcon } from "@heroicons/react/outline";
import { Link, useFetcher } from "@remix-run/react";


export function TaskControls(taskID) {
    let fetcher = useFetcher();
    return (
        <div className='flex flex-row justify-center items-center h-10'>
            <fetcher.Form method="post" action='./delete'>
                <button className='flex items-center'>
                    <TrashIcon className='w-5 h-5' strokeWidth={1} />
                </button>
            </fetcher.Form>
            <Link to='./edit' className='flex items-center ml-3'>
                <PencilAltIcon className='w-5 h-5' strokeWidth={1} />
            </Link>

            {/* <Link to={'./delete'}>
                <TrashIcon className='w-5 h-5' strokeWidth={1} />
            </Link> */}
        </div>
    )
}