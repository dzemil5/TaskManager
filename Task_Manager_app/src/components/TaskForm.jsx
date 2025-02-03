import React from "react";
import TaskList from "./TaskList";

const AllTasks = ({ tasks, updateTaskStatus }) => {
  return (
    <div className="page">
      <h2>All Tasks</h2>
      <TaskList tasks={tasks} updateTaskStatus={updateTaskStatus} />
    </div>
  );
};

export default AllTasks;
