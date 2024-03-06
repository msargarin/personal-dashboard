import { Task } from "@/app/data";
import { createContext, useContext, useReducer } from 'react';

// Context for front page widget
const TasksContext = createContext(null);

export function TasksProvider({ children } : { children: any}) {
  const [tasks, _] = useReducer(tasksReducer, getTasksFromLocalStore());

  return (
    <TasksContext.Provider value={tasks}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  return useContext(TasksContext);
}

// Get tasks data in localstore
export function getTasksFromLocalStore() {
  if (typeof(localStorage) !== 'undefined'){
    let tasks = localStorage.getItem('tasks');

    // Return either an empty list is tasks is not initiated or a parsed list
    return tasks ? tasks = JSON.parse(tasks) : []
  } else {
    return []
  }
}

// Set tasks data in localstore
export function setTasksToLocalStore(tasks:Task[]) {
  localStorage.setItem('tasks', JSON.stringify(tasks))
}

// Reducer for all task actions
export function tasksReducer(tasks:Task[], action:any) {
  // Add task
  if (action.type == 'added') {
    let newTaskList = [
      ...tasks,
      {
        id: action.id,
        text: action.text,
        done: false
      }
    ];

    // Set localstorage
    setTasksToLocalStore(newTaskList);

    return newTaskList;

  // Remove task
  } else if (action.type == 'removed') {
    let newTaskList = tasks.filter((t:Task) => t.id !== action.id);

    // Set localstorage
    setTasksToLocalStore(newTaskList);

    return newTaskList;

  // Toggle task as done or not done
  } else if (action.type == 'toggled') {
    let newTaskList = tasks.map((t:Task) => {
      if (t.id === action.id) {
        return {
          ...t,
          done: !t.done
        }
      } else {
        return t
      }
    });

    // Set localstorage
    setTasksToLocalStore(newTaskList);

    return newTaskList;

  // Clear all tasks marked as done
  } else if (action.type == 'cleared') {
    let newTaskList = tasks.filter((t:Task) => !t.done);

    // Set localstorage
    setTasksToLocalStore(newTaskList);

    return newTaskList;

  // Remove all tasks
  } else if (action.type == 'reset') {
    // Set localstorage
    setTasksToLocalStore([]);

    return [];

  // Load tasks
  } else if (action.type == 'initialized') {
    // Set initialized flag
    action.setInitialized(true);

    return action.tasks;

  // Handle unknown actions here
  } else {
    console.error(`Unknown action: ${action.type}`);

    return tasks
  }
}
