import clsx from 'clsx'

export default function ({ children, className }) {
    return (
        <div className={clsx('p-5 grid grid-auto-fit gap-5', className)}>
            {children}
        </div>
    )
}