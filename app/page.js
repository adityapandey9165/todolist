// page.js
"use client";
// page.js
import React, { useState, useEffect } from "react";

const STORAGE_KEY = "todoListData";

const page = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [mainTask, setMainTask] = useState([]);

  // Load tasks from storage when the component mounts
  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks");
      if (response.ok) {
        const tasks = await response.json();
        setMainTask(tasks);
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  useEffect(() => {
    // Load tasks from the API route when the component mounts
    fetchTasks();
  }, []);

  useEffect(() => {
    // Save tasks to the API route whenever mainTask changes
    async function saveTasks() {
      try {
        const response = await fetch("/api/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, desc }),
        });
        if (response.ok) {
          fetchTasks(); // Refresh tasks after saving
        }
      } catch (error) {
        console.error("Failed to save tasks:", error);
      }
    }

    saveTasks();
  }, [mainTask]);

  // Save tasks to storage whenever mainTask changes
  useEffect(() => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7); // Data will expire in 7 days
    const dataToStore = JSON.stringify({
      tasks: mainTask,
      expiration: expirationDate,
    });
    sessionStorage.setItem(STORAGE_KEY, dataToStore);
  }, [mainTask]);

  const sumbitHandler = (e) => {
    e.preventDefault();
    setMainTask([...mainTask, { title, desc }]);
    setTitle("");
    setDesc("");
  };

  const deleteHandler = (i) => {
    const copyTask = [...mainTask];
    copyTask.splice(i, 1);
    setMainTask(copyTask);
  };

  return (
    <>
      <h1 className="bg-black text-white px-2 py-5 text-3xl font-bold text-center">
        My ToDoList
      </h1>
      <form onSubmit={sumbitHandler}>
        <input
          className="text-2xl border-zinc-800 border-2 m-8 p-2"
          type="text"
          placeholder="Enter Task Here"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />

        <input
          className="text-2xl border-zinc-800 border-2 m-8 p-2"
          type="text"
          placeholder="Enter Description Here"
          value={desc}
          onChange={(e) => {
            setDesc(e.target.value);
          }}
        />
        <button className="bg-black text-2xl text-white rounded-md font-600 px-4 py-2">
          Add Task
        </button>
      </form>
      <hr />
      <div className="p-4 text-center text-2xl bg-slate-400">
        {mainTask.length > 0 ? (
          mainTask.map((t, i) => (
            <li key={i} className="flex items-center justify-between mb-2">
              <div className="flex justify-between w-2/3">
                <h5 className="font-semibold">{t.title}</h5>
                <h6>{t.desc}</h6>
              </div>
              <button
                onClick={() => {
                  deleteHandler(i);
                }}
                className="text-2xl bg-red-500 text-white rounded-md font-600 ml-4 px-4 py-2"
              >
                Delete Task
              </button>
            </li>
          ))
        ) : (
          <p>No Tasks Available</p>
        )}
      </div>
    </>
  );
};

export default page;
