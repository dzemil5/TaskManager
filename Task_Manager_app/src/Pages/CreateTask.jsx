import React, { useState } from "react";

const CreateTask = ({ addTask }) => {
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Format: YYYY-MM-DD
  };

  const [task, setTask] = useState({
    id: Date.now(),
    title: "",
    description: "",
    priority: "low",
    startDate: getTodayDate(),
    endDate: getTodayDate(),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addTask(task);
    setTask({
      id: Date.now(),
      title: "",
      description: "",
      priority: "low",
      startDate: getTodayDate(),
      endDate: getTodayDate(),
    });
  };

  return (
    <div className="sidebar">
      <h2>Create Task</h2>
      <form className="task-form" onSubmit={handleSubmit}>
        <label>Title</label>
        <input
          type="text"
          name="title"
          value={task.title}
          onChange={handleChange}
          required
        />

        <label>Description</label>
        <textarea
          name="description"
          value={task.description}
          onChange={handleChange}
          required
        ></textarea>

        <label>Priority</label>
        <select name="priority" value={task.priority} onChange={handleChange}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <label>Start Date</label>
        <input
          type="date"
          name="startDate"
          value={task.startDate}
          onChange={handleChange}
        />

        <label>End Date</label>
        <input
          type="date"
          name="endDate"
          value={task.endDate}
          onChange={handleChange}
        />

        <button type="submit">Add Task</button>
      </form>
    </div>
  );
};

export default CreateTask;
