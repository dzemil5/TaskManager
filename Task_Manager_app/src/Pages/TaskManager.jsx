import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import AllTasks from "../components/TaskForm";
import InProcess from "./InProcess";
import Finished from "./Finished";
import CreateTask from "./CreateTask";
import "../index.css";

function TaskManager() {
  const [tasks, setTasks] = useState([]);

  const addTask = (task) => {
    setTasks([...tasks, { ...task, status: "in process" }]);
  };

  const updateTaskStatus = (id, status) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, status: status } : task))
    );
  };

  return (
    <>
      <div className="grid-container">
        <CreateTask addTask={addTask} className="Menu" />
        <Router>
          <Navbar />
          <Routes>
            <Route
              path="/"
              element={
                <InProcess tasks={tasks} updateTaskStatus={updateTaskStatus} />
              }
            />
            <Route
              path="/finished"
              element={
                <Finished tasks={tasks} updateTaskStatus={updateTaskStatus} />
              }
            />
            <Route
              path="/all-tasks"
              element={
                <AllTasks tasks={tasks} updateTaskStatus={updateTaskStatus} />
              }
            />
            <Route path="/create" element={<CreateTask addTask={addTask} />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default TaskManager;
