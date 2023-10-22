import React, { useState, useRef, useEffect } from "react";
import './css.css';
const LOCAL_STORAGE_KEY = "todosApp.todos";

function App() {
  const [todos, setTodos] = useState([]);
  const todoNameRef = useRef();
  const [id, setId] = useState(0); // Initialize id using useState
   const hasInitialLoadOccurred = useRef(false);

  useEffect(() => {
    // Use a separate function to retrieve todos from localStorage
    const loadTodosFromLocalStorage = () => {
      
      const storedTodos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
      console.log("Retrieved from localStorage:", storedTodos);
      if (storedTodos) {
        setTodos(storedTodos);
        const maxId = storedTodos.reduce((max, todo) => (todo.id > max ? todo.id : max), 0);
        setId(maxId + 1);
      }
    };

    loadTodosFromLocalStorage(); // Call the function to load todos from localStorage
  }, []); // Only run this effect when the component mounts


  useEffect(() => {
    // Prevent the effect from running on the initial load
    if (hasInitialLoadOccurred.current) {
      console.log("Storing in localStorage:", todos);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
    }
  }, [todos]); // Run when todos change

  function handleAddTodo() {
    const name = todoNameRef.current.value;
    if (name === "") {
      return;
    }
    hasInitialLoadOccurred.current = true;
    setTodos((prevTodos) => [
      ...prevTodos,
      { id: id, name: name, complete: false },
    ]);
    setId((prevId) => prevId + 1); // Increment the id using useState
    todoNameRef.current.value = "";
  }

  function TodoList({ todos }) {
    return (
      <div>
        {todos.map((todo) => (
          <div key={todo.id} className="todo-item">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={todo.complete}
                onChange={(e) => toggleTodo(todo.id, e.target.checked)}
              />
              {todo.name}
            </label>
            <button className="delete-button" onClick={() => deleteTodo(todo.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    );
  }
  

  function toggleTodo(idItem , complete){
    setTodos(todos=>{
      return todos.map(todo=> {
        if(todo.id===idItem){return{...todo,complete}}
        return todo
      })
    })
  }

  function deleteTodo(id){
    setTodos(correntTodos=>{
      return correntTodos.filter(todo=>todo.id!== id)
    })
  }

  return (
    <div className="container">
      <h1>Todo List ({todos.length})</h1>
      <div className="input-container">
        <input ref={todoNameRef} type="text" />
        <button onClick={handleAddTodo}>Add Todo</button>
      </div>
      <div className="todo-list">
        <TodoList todos={todos} />
      </div>
    </div>
  );
}

export default App;
