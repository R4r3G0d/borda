import * as React from 'react'
import { useFetcher } from '@remix-run/react'

export default function () {
    const fetcher = useFetcher()

    let inputRef = React.useRef()

    React.useEffect(function () {
        inputRef.current.focus()
    }, [])
    
    return (
        <fetcher.Form
            method='post'
            action='./flag'
        >
            {fetcher.data?.error ? (
                <div className='pb-2'>
                    <div className='bg-red-100 text-red-500 rounded-md h-10 flex items-center w-full'>
                        <p className='px-3'>
                            {fetcher.data.error.message}
                        </p>
                    </div>

                </div>
            ) : null}

            <fieldset
                className='flex flex-row'
                disabled={fetcher.submission}>
                <input
                    ref={inputRef}
                    type='text'
                    name='flag'
                    placeholder='flag{s0m3_fl4g}'
                    className='w-full h-10 px-2 border-2 focus-ring rounded-md text-black text-sm border-gray-500 focus:border-black'
                >
                </input>

                <button
                    type='submit'
                    className={`ml-2 h-10 px-3 rounded-md ${fetcher.submission ? 'bg-gray-700' : 'bg-black'}  text-white text-sm`}

                >
                    Check
                </button>
            </fieldset>

        </fetcher.Form>
    )
}