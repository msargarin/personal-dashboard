'use client';

import { useEffect, useReducer, useState } from "react";
import { tasksReducer, getTasksFromLocalStore } from "@/app/tasks/utils";
import { AddTaskForm, TaskList } from "@/app/tasks/components";
import { Task } from "@/app/data";

// Initialize next task ID
let nextId = 1;

export default function Tasks() {
  const [initialized, setInitialized] = useState(false)
  const [tasks, dispatch] = useReducer(tasksReducer, []);

  // Handler for adding a task
  function handleAddTask(text:string) {
    dispatch({
      type: "added",
      id: nextId++,
      text: text
    });
  }

  // Handler for removing a task
  function handleRemoveTask(taskId:number) {
    dispatch({
      type: "removed",
      id: taskId
    });

    // Set to correct nextId
    tasks.map((t:Task) => {
      if (t.id > nextId) {
        nextId = t.id + 1;
      }
    });
  }

  // Handler for marking tasks as done or not done
  function handleToggleTask(taskId:number) {
    dispatch({
      type: "toggled",
      id: taskId
    });
  }

  // Handler for clearing tasks marked as done
  function handleClearTask() {
    dispatch({
      type: "cleared"
    });

    // Set to correct nextId
    tasks.map((t:Task) => {
      if (t.id > nextId) {
        nextId = t.id + 1;
      }
    });
  }

  // Handler for resetting tasks
  function handleResetTask() {
    dispatch({
      type: "reset"
    });

    // Set to correct nextId
    tasks.map((t:Task) => {
      if (t.id > nextId) {
        nextId = t.id + 1;
      }
    });
  }

  // Handler for loading task list from localstore
  function handleInitTasks(tasks:Task[]) {
    dispatch({
      type: "initialized",
      tasks: tasks,
      setInitialized: setInitialized
    });

    // Set to correct nextId
    tasks.map((t:Task) => {
      if (t.id > nextId) {
        nextId = t.id + 1;
      }
    });
  }

  useEffect(() => {
    // Initialize tasks list with data from localstorage
    handleInitTasks(getTasksFromLocalStore());
  }, [])

  return (
    <main>
      <div className="rounded-xl bg-gray-100 p-2 shadow-sm">
        <div className="flex p-4">
          <h1 className="font-medium text-xl">My Tasks</h1>
        </div>
        <div className="container mx-auto p-4 bg-white rounded-lg min-h-[200px]">
          { initialized ? (
            <>
              <AddTaskForm onAddTask={handleAddTask} />

              <TaskList tasks={tasks} onRemoveTask={handleRemoveTask} onToggleTask={handleToggleTask} />

              <div className="mt-4 text-right">
                <button
                    className="border-2 border-red-500 p-2 text-red-500 rounded-md hover:text-white hover:bg-red-500"
                    onClick={handleClearTask}
                >
                  Clear Completed Task
                </button>
                <button
                    className="border-2 border-indigo-500 p-2 text-indigo-500 rounded-md hover:text-white hover:bg-indigo-500 ml-4"
                    onClick={handleResetTask}
                >
                  Reset Todo List
                </button>
              </div>
            </>
          ) : (
            <span>Loading tasks ...</span>
          )}
        </div>
      </div>
    </main>
  )
}
