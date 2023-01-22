import * as React from 'react'

function Copyright(){
    var now = new Date()
    var year = now.getFullYear()
    return(
        <div className='text-white'>Copyright &#169 {year} ctfboard team. All rights reserved.</div>
    )
}

export default Copyright