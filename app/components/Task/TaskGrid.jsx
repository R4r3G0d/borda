import clsx from 'clsx'

function TaskGrid({ children, className }) {
    return (
        <div className={clsx('p-5 w-1/2 lg:w-2/3 grid grid-auto-fit gap-5', className)}>
            {children}
        </div>
    )
}

export default TaskGrid