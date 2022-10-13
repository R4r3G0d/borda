import * as React from 'react'
import { useFetcher } from '@remix-run/react'

import { Button } from '~/components/Button'
import { Field } from '~/components/Field'

export default function () {
    const fetcher = useFetcher()

    let inputRef = React.forwardRef()

    return (
        <fetcher.Form
            method='post'
            action='./flag'
            className='w-full'
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
                <Field
                    className='m-0'
                    name='flag'
                    // id='flag'
                    placeholder='flag{s0m3_fl4g}'
                    ref={inputRef}
                />
                <Button
                    // className={`ml-2 hover:bg-gray-800 ${fetcher.submission ? 'bg-gray-700' : 'bg-black'}`}
                    className='ml-2 h-11'
                    type='submit'
                    name='check'
                />
                {/* <button
                    type='submit'
                    className={`ml-2 h-10 px-3 rounded-md ${fetcher.submission ? 'bg-gray-700' : 'bg-black'}  text-white text-sm`}

                >
                    Check
                </button> */}
            </fieldset>

        </fetcher.Form >
    )
}