import { Link } from '@remix-run/react'
import * as React from 'react'

function Copyright({children}){
    var now = new Date()
    var year = now.getFullYear()
    return(
        <div className='text-white/70 text-center text-sm'>Copyright <span>&#169;</span> {year} {children}. All rights reserved.</div>
    )
}

export default Copyright