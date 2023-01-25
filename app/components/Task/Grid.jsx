import * as React from "react";
import clsx from 'clsx'
import { Link, useLocation, useSearchParams } from '@remix-run/react'
import { Listbox, Transition } from '@headlessui/react'
import { ChevronUpDownIcon, CheckIcon, PlusIcon } from '@heroicons/react/24/solid'

export default function ({ children, className }) {
    // const [scroll, setScroll] = React.useState(0)
    // const ref = React.useRef(null)

    // // const getscroll = () => {
    // //     setScroll(Math.abs(ref.current.getBoundingClientRect().top - ref.current.offsetTop));
    // //     console.log(scroll);
    // // };

    // React.useEffect(() => {
    //     // setHeight(ref.current.clientHeight)

    //     // ref.current.scrollTop = 100
    //     console.log(ref.current.offsetTop)
    // }, [])

    return (
        <div className='sticky h-full flex-grow'>
            <div className="h-screen w-full overflow-y-auto overflow-x-hidden hidden sm:flex flex-col">
                <div className="h-full pt-14 pb-5">
                    <div className="px-5 pt-5 flex justify-between items-center">
                        <TaskGridSort />
                    </div>
                    <div className='p-5 grid grid-auto-fit-md gap-5'>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

function TaskGridNewTask() {
    return (
        <Link to={'/tasks/new'}
            className='flex flex-row items-center px-2'>
            <PlusIcon className='w-4 h-4' strokeWidth={1} />
            <p className='ml-2 h-8 leading-8 text-sm whitespace-nowrap'>
                New Task
            </p>
        </Link>
    )
}

function TaskGridSort() {
    const sortOptions = ['category', 'name', 'points']
    let [searchParams] = useSearchParams();
    let sortProp = searchParams.get("sort");
    let location = useLocation();
    let url = location.pathname
    return (
        <div className='z-10 flex felx-row'>
            <Listbox as={'div'} className={'w-24 relative'} value={sortProp}>
                <Listbox.Button className="h-8 relative flex flex-row justify-between items-center border rounded-md border-white border-opacity-25">
                    <div className="px-3 text-sm capitalize">{sortProp ? sortProp : 'sort'}</div>
                    <ChevronUpDownIcon
                        className="h-5 w-5 text-neutral-300"
                        aria-hidden="true"
                    />
                </Listbox.Button>
                <Transition
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                >
                    <Listbox.Options className={clsx(
                        'absolute w-60 min-w-full',
                        'flex flex-col p-2 mt-3',
                        'bg-black text-white',
                        'backdrop-blur-xl backdrop-filter',
                        'rounded-lg border border-white border-opacity-25',
                    )}>

                        {sortOptions.map((option) => (
                            <Listbox.Option
                                key={option}
                                value={option}
                                className='rounded-md hover:bg-blue-600'
                            >
                                {({ active, selected }) => (
                                    <Link
                                        to={`${url}?sort=${option}`}
                                        className='h-9 px-2 flex flex-row justify-between items-center text-neutral-200'
                                    >
                                        <p className='text-sm capitalize'>{option}</p>
                                        {selected && <CheckIcon className='h-4 w-4' strokeWidth={1} />}
                                    </Link>
                                )}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </Transition>
            </Listbox>
        </div>
    )
}