import * as React from 'react'

function Video({ className, src }) {

    return (
        <video
            className={className}
            autoPlay
            src={src}
            muted
            loop
            controls={false}
        />
    )
}

function Hacker(props) {
    return (
        <Video src='/images/hacker.mp4' {...props} />
    )
}

function Hacker2(props) {
    return (
        <Video src='/images/hacker2.mp4' {...props} />
    )
}

export { Hacker, Hacker2, Video }