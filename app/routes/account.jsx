import { NavLink, Outlet } from "@remix-run/react"
import clsx from "clsx"

export default () => {

    const links = [
        {
            path: '.',
            text: 'General',
        },
        {
            path: './team',
            text: 'Team',
        }
    ]

    return (
        <div className='px-5'>
            <div className='flex flex-row h-12 pt-3 items-center'>
                {links.map((link) => (
                    <NavLink to={link.path} end
                        className={({ isActive }) => 
                            clsx('h-full px-5 border-b mt-px first:pl-0 text-center', {'border-black':isActive})
                        }
                    >
                        {link.text}

                    </NavLink>
                ))}
                <div className='h-full w-full border-b'></div>
            </div>
            <Outlet />
        </div >
    )
}