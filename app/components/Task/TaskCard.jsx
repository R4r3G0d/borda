import clsx from 'clsx'
import { NavLink } from '@remix-run/react'
import { motion, AnimatePresence } from "framer-motion"

export default function ({ children, link, isActive }) {
    return (
        <NavLink
            to={link}
            className={clsx(
                'flex flex-col max-h-min py-4 px-5 border border-gray-300 rounded-md',
                { 'border-blue-600': isActive },
            )}
        >
            <motion.div layout animate={{
                scale: [1, 2, 2, 1, 1],
                rotate: [0, 0, 270, 270, 0],
                borderRadius: ["20%", "20%", "50%", "50%", "20%"],
            }}>
                {children}
            </motion.div>
        </NavLink>
    )
}