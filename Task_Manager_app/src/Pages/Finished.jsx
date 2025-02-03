import React from "react";
import TaskList from "../components/TaskList";

const Finished = ({ tasks, updateTaskStatus }) => {
  const finishedTasks = tasks.filter((task) => task.status === "finished");
  return (
    <div className="page">
      <h2>Finished Tasks</h2>
      <TaskList tasks={finishedTasks} updateTaskStatus={updateTaskStatus} />
    </div>
  );
};

export default Finished;
