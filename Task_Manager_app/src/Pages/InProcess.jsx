import React from "react";
import TaskList from "../components/TaskList";

const InProcess = ({ tasks, updateTaskStatus }) => {
  const inProcessTasks = tasks.filter((task) => task.status === "in process");
  return (
    <div className="page">
      <h2>In Process</h2>
      <TaskList tasks={inProcessTasks} updateTaskStatus={updateTaskStatus} />
    </div>
  );
};

export default InProcess;
