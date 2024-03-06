import { useState, useEffect } from "react";
import { Task } from "@/app/data";
import { useTasks } from "@/app/tasks/utils";

// Task widget for front page
export function TasksWidget() {
  const tasks:any = useTasks();
  const [loading, setLoading] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    // Get pending tasks count once tasks becomes available
    if (tasks) {
      setPendingCount(tasks.filter((t:Task) => !t.done).length);

      // Unset loading flag
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [tasks]);

  return (
    <div className="rounded-xl bg-white px-4 py-8 text-center text-2xl flex flex-col items-center justify-center">
      { loading ? (
        <p>Loading tasks ...</p>
      ) : (
        pendingCount === 0 ? (
          <>
            <h1>Hooray!</h1>
            <p>You have no pending tasks</p>
          </>
        ) : (
          <p>You have {pendingCount} pending task{ pendingCount > 1 ? 's' : '' }</p>
        )
      )}
    </div>
  );
}

// Add task component for the dedicated tasks page
export function AddTaskForm({
  onAddTask
}: {
  onAddTask:Function
}) {
  // Text here represents the content of the input box
  const [text, setText] = useState('');

  return (
    <div className="p-2 flex">
      <input
        // ref={taskInputBox}
        className="w-full p-2 border-b-2 border-gray-500 text-black focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
        type="text" placeholder="Enter new tasks here"
        value={text}
        onKeyUp={(e) => {
          // Submit on Enter keypress
          if (e.key === "Enter") {
            setText("");
            onAddTask(text);
          }
        }}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        className="ml-2 border-2 border-sky-500 p-2 text-sky-400 hover:text-white hover:bg-sky-500 rounded-md flex"
        onClick={() => {
          if (text !== "") {
            setText("");
            onAddTask(text);
          }
        }}
      >
        <svg className="h-6 w-6"  width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <circle cx="12" cy="12" r="9" />  <line x1="9" y1="12" x2="15" y2="12" />  <line x1="12" y1="9" x2="12" y2="15" /></svg>
        <span className="ml-1">Add</span>
      </button>
    </div>
  )
}

// Task list component for the dedicated tasks page
export function TaskList({
  tasks,
  onRemoveTask,
  onToggleTask
}: {
  tasks: Task[],
  onRemoveTask: Function,
  onToggleTask: Function
}) {
  return (
    <ul>
      { tasks.length === 0 ? (
          <li className="p-2 my-2 border-b-2">
            <div className="flex align-middle flex-row justify-between">
              <p className="p-2 text-lg">
              No task yet
              </p>
            </div>
          </li>
        ): (
          tasks.map((task:Task, _:number) => {
            return (
              <li key={task.id} className="p-2 rounded-lg my-2 border-b-2">
                <div className="flex align-middle flex-row justify-between">
                  <div className="p-2">
                    <input
                      type="checkbox" className="h-6 w-6"
                      defaultChecked={task.done}
                      onChange={() => onToggleTask(task.id)}
                    />
                  </div>

                  <div className="p-2">
                    <p
                      className={ task.done ? 'text-lg text-gray-400 line-through' : 'text-lg'}
                    >
                      {task.text}
                    </p>
                  </div>

                  <button
                      className="border-2 border-red-500 p-2 text-red-400 hover:text-white hover:bg-red-500 rounded-md flex"
                      onClick={() => onRemoveTask(task.id)}
                  >
                    <svg className="h-6 w-6" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"> <circle cx="12" cy="12" r="10" /> <line x1="15" y1="9" x2="9" y2="15" /> <line x1="9" y1="9" x2="15" y2="15" /></svg>
                    <span className="ml-1">Remove</span>
                  </button>
                </div>
              </li>
            )
          })
        )
      }
    </ul>
  );
}
