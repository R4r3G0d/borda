import { useLoaderData, Form } from '@remix-run/react'
import { json, redirect } from '@remix-run/node'
import { TrashIcon } from '@heroicons/react/24/outline'
import { StarIcon, InformationCircleIcon } from '@heroicons/react/24/solid'

import prisma from '~/utils/prisma.server'
import authenticator from '~/utils/auth.server'
import { getSession, commitSession } from '~/utils/session.server'
import { Field } from '~/components/Field'
import { Button } from '~/components'

export default function players() {
    return (
            <div className="colour-white pt-14"> players </div>
    )
}

//Редактировать пароль логин почту всё - ты бог пользователей