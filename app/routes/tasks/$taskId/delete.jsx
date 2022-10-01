import { redirect } from '@remix-run/node';
import { deleteTask } from '~/utils/task.server';

export function action({ params }) {
    // const url = new URL(request.url)
    // const searchParams = url.searchParams.getAll();

    // let newSearchParams = new URLSearchParams(searchParams)
    // console.log({searchParams, newSearchParams})
    let id = params.taskId
    try {
        deleteTask(id)

        return redirect(`/tasks`)
    } catch (error) {
        console.log(error)
    }
}