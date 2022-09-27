import clsx from 'clsx'
import { NavLink } from '@remix-run/react'

export default function ({ children, link }) {
    return (
        <NavLink
            to={link}
            className={({ isActive }) => clsx(
                'flex flex-col max-h-min py-4 px-5 border border-gray-300 rounded-md',
                { 'border-blue-600': isActive },
            )}
        >
            {children}
        </NavLink>
    )
}