import clsx from 'clsx';

export default function Input({ name, defaultValue, className, placeholder, readonly, errorMessage, title, ref, autocomplete, type, onChange }) {
    let error = errorMessage ? true : false;
    return (
        <div className={clsx('w-full', className)}>
            {title ? <label for={title} className='inline-block mb-1 text-gray-700'>{title}</label> : null}
            <input
                type={type}
                ref={ref}
                readOnly={readonly}
                name={name}
                autocomplete={autocomplete}
                id={name}
                defaultValue={defaultValue}
                placeholder={placeholder}
                onChange={onChange}
                className={clsx(
                    'block w-full h-10',
                    'px-3 py-1.5 m-0',
                    'text-base font-normal text-gray-700 bg-white bg-clip-padding',
                    'border border-solid border-gray-300 rounded',
                    'transition ease-in-out',
                    'focus:text-gray-700 focus:bg-white focus:outline-none',
                    { 'hover:border-gray-500 focus:border-blue-600': !readonly },
                    { 'border-red-500 focus:border-red-500 hover:border-red-500': error },
                    className
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

export function EmailInput({ errorMessage, readonly, defaultValue, title, className }) {
    return (
        <Input
            type='email'
            name='email'
            placeholder='Email'
            autocomplete='email'
            title={title}
            defaultValue={defaultValue}
            errorMessage={errorMessage}
            readonly={readonly} 
            className={className}/>
    )
}
export function PasswordInput({ errorMessage, name, title, className }) {
    return (
        <Input
            type='password'
            title={title}
            name={name ? name : 'password'}
            placeholder='Password'
            className={className}
            autocomplete='password'
            errorMessage={errorMessage} />
    )
}