import TaskComponent from "./TaskComponent"

export default ({ tasks }) => {
    return (
        <div className="w-full grid grid-cols-3 grid-flow-row gap-10 mt-5">
            {tasks.map((task) => (
                <TaskComponent key={task.id} task={task} />
            ))}
        </div>
    )
}