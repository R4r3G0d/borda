import * as React from 'react'
import clsx from 'clsx';

function Label({ className, ...labelProps }) {
    return (
        <label
            {...labelProps}
            className={clsx(
                'inline-block text-base text-white mb-3',
                className,
            )}
        />
    )
}

const Input = React.forwardRef(function Input(props, ref) {
    const className = clsx(
        'w-full p-4',
        'text-base text-white font-normal placeholder:text-white/30',
        'bg-neutral-900',
        ['rounded-md border-2 border-white/10 focus:border-blue-600', { 'hover:border-white/60': !props.disabled }],
        'focus:outline outline-4 outline-blue-500/50 outline-offset-1',
        { 'cursor-not-allowed': props.disabled },
        'transition ease-out',
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
        <p className='pt-3 text-sm text-red-500 text-center'>
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
        <div className={clsx('w-full', className)}>
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
            placeholder='Email (e.g. me@example.com)'
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
            placeholder={label ? label : 'Password'}
            {...props}
        />
    )
}

export { Label, Input, InputError, Field, EmailField, PasswordField }