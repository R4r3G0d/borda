import clsx from 'clsx';
import { passwordValidator } from '~/utils/validator'

export default function Input({ name, defaultValue, className, placeholder, readonly, errorMessage, type, title }) {
    let error = errorMessage ? true : false;
    return (
        <div className={clsx('mt-4 w-full', className)}>
            <label for={title} className='inline-block mb-2 text-gray-700'>{title}</label>
            <input
                type={type}
                readOnly={readonly}
                name={name}
                id={name}
                defaultValue={defaultValue}
                placeholder={placeholder}
                className={clsx(
                    'block w-full h-10',
                    'px-3 py-1.5 m-0',
                    'text-base font-normal text-gray-700 bg-white bg-clip-padding',
                    'border border-solid border-gray-300 rounded',
                    'transition ease-in-out',
                    'focus:text-gray-700 focus:bg-white focus:outline-none',
                    { 'hover:border-gray-500 focus:border-blue-600': !readonly },
                    { 'border-red-500 focus:border-red-500 hover:border-red-500': error },
                )}
            />
            {error ? (
                <div className='pb-2'>
                    <p className='px-2 text-red-500'>
                        {errorMessage}
                    </p>
                </div>
            ) : null}
        </div>
    )
}