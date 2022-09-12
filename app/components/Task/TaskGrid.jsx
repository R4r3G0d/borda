import TaskComponent from "./TaskComponent"

export default ({ tasks }) => {
    return (
        <div className="w-full grid auto-cols-auto grid-flow-row-dense gap-10 mt-5">
            {tasks.map((task) => (
                <TaskComponent key={task.id} task={task} />
            ))}
        </div>
    )
}