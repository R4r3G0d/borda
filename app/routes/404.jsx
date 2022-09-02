import * as React from 'react'
import {MakaraIcon} from '~/components/icons/MakaraIcon'

export function meta() {
    return { title: "Ain't nothing here" }
}

export default function NotFoundPage() {
    return (
        <main>
            <div>
                <h1>404 - Oh no, you found a page that's missing stuff.</h1>
                <p>This is not a page on admctf.ru. So sorry.</p>
                <MakaraIcon size={128}/>
            </div>
        </main>
    )
}