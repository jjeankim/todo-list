const BASE_URL = "https://todo-api-3yui.onrender.com";

export const fetchTodos = async () => {
  const res = await fetch(`${BASE_URL}/tasks`);
  return await res.json();
};

export const createTodo = async (content) => {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, isComplete: false }),
  });
  return await res.json();
};

export const updateTodo = async (id, isComplete) => {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isComplete }),
  });
  return await res.json();
};

export const deleteTodo = async (id) => {
  await fetch(`${BASE_URL}/tasks/${id}`, { method: "DELETE" });
};
