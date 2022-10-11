import clsx from 'clsx'

export default function ({ children, className }) {
    return (
        <div className={clsx('overflow-y-auto overflow-x-hidden h-full w-full p-5 grid grid-auto-fit-sm gap-5', className)}>
            {children}
        </div>
    )
}