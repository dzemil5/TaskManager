import React from "react";

const TaskList = ({ tasks, updateTaskStatus }) => {
  return (
    <div className="task-manager">
      {tasks.length === 0 ? (
        <p>No tasks available</p>
      ) : (
        tasks.map((task) => (
          <div key={task.id} className="task-card">
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Priority: {task.priority}</p>
            <p>Start: {task.startDate}</p>
            <p>End: {task.endDate}</p>
            {task.status === "in process" && (
              <button onClick={() => updateTaskStatus(task.id, "finished")}>
                Mark as Finished
              </button>
            )}
            {task.status === "finished" && (
              <button onClick={() => updateTaskStatus(task.id, "in process")}>
                Redo Task
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default TaskList;
