import * as React from 'react'
import clsx from 'clsx';

function Label({ className, ...labelProps }) {
    return (
        <label
            {...labelProps}
            className={clsx(
                'inline-block text-base text-gray-700 mb-2',
                className,
            )}
        />
    )
}

const Input = React.forwardRef(function Input(props, ref) {
    const className = clsx(
        'block w-full h-11 px-3 py-1.5',
        'text-base font-normal text-gray-700 bg-white bg-clip-padding',
        'border border-solid border-gray-300 rounded',
        'transition ease-in-out',
        'focus:text-gray-700 focus:bg-white focus:outline-none focus:border-blue-600',
        'hover:border-gray-500',
        'disabled:focus:border-gray-300',
        { 'border-red-500 focus:border-red-500 hover:border-red-500': props.error },
        props.Classname
    )

    if (props.type === 'textarea') {
        return (
            <textarea
                {...props}
                className={className}
            />
        )
    }

    return (
        <input
            {...props}
            ref={ref}
            className={className}
        />
    )
})

function InputError({ children }) {
    if (!children) {
        return null
    }

    return (
        <p className='text-sm px-2 text-red-500'>
            {children}
        </p>
    )
}

const Field = React.forwardRef(function Field(
    {
        error,
        name,
        label,
        className,
        ...inputProps
    }, ref) {

    return (
        <div className={clsx('w-full mb-4', className)}>
            {label && (<Label htmlFor={name}>{label}</Label>)}
            <Input
                // @ts-expect-error no idea 🤷‍♂️
                ref={ref}
                {...inputProps}
                name={name}
                id={name}
                autoComplete={name}
                error={error}
            />
            {error
                ? (<InputError>{error}</InputError>)
                : null
            }
        </div>
    )
})

function EmailField({ label, ...props }) {
    return (
        <Field
            // type='email'
            name='email'
            label={label ? label : 'Email'}
            placeholder='me@example.com'
            {...props}
        />
    )
}

function PasswordField({ label, name, ...props }) {
    return (
        <Field
            type='password'
            name={name ? name : 'password'}
            label={label ? label : 'Password'}
            // placeholder={label ? label : 'Password'}
            {...props}
        />
    )
}

export { Label, Input, InputError, Field, EmailField, PasswordField }