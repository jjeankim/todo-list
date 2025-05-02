import {
  useReducer,
  useCallback,
  createContext,
  useMemo,
  useEffect,
} from "react";
import "./App.css";
import Editor from "./components/Editor";
import Header from "./components/Header";
import List from "./components/List";

function reducer(state, action) {
  switch (action.type) {
    case "INIT":
      return action.data;

    case "CREATE":
      return [action.data, ...state];

    case "UPDATE":
      return state.map((item) =>
        item.id === action.data.id ? action.data : item
      );

    case "DELETE":
      return state.filter((item) => item.id !== action.targetId);
    default:
      return state;
  }
}

export const TodoStateContext = createContext();
export const TodoDispatchContext = createContext();

function App() {
  const [todos, dispatch] = useReducer(reducer, []);

  useEffect(() => {
    const getTask = async () => {
      try {
        const res = await fetch("https://todo-api-3yui.onrender.com/tasks");
        const data = await res.json();

        const converted = data.map((task) => ({
          id: task._id,
          content: task.content,
          isDone: task.isComplete,
          date: new Date(task.createdAt).getTime(),
        }));

        dispatch({ type: "INIT", data: converted });
      } catch (error) {
        console.error("할일 불러오기 실패:", error);
      }
    };
    getTask();
  }, []);

  const onCreate = useCallback(async (content) => {
    try {
      const res = await fetch("https://todo-api-3yui.onrender.com/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, isComplete: false }),
      });
      const created = await res.json();
      dispatch({
        type: "CREATE",
        data: {
          id: created._id,
          content: created.content,
          date: new Date(created.createdAt).getTime(),
        },
      });
    } catch (error) {
      console.error("생성 실패:", error);
    }
  }, []);

  const onUpdate = useCallback(async (targetId) => {
    const current = todos.find((todo) => todo.id === targetId);
    if (!current) return;

    const res = await fetch(
      `https://todo-api-3yui.onrender.com/tasks/${targetId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isComplete: !current.isDone,
        }),
      }
    );
    const updated = await res.json();
    dispatch({
      type: "UPDATE",
      data: {
        id: updated._id,
        content: updated.content,
        isDone: updated.isComplete,
        date: new Date(updated.updatedAt).getTime(),
      },
    });
  }, [todos]);

  const onDelete = useCallback(async (targetId) => {
    console.log(targetId)
    try {
      await fetch(`https://todo-api-3yui.onrender.com/tasks/${targetId}`, {
        method: "DELETE",
      });

      dispatch({
        type: "DELETE",
        targetId,
      });
    } catch (error) {
      console.error("삭제 실패:", error);
    }
  }, []);

  const memoizedDispatch = useMemo(() => {
    return { onCreate, onUpdate, onDelete };
  }, [onCreate, onUpdate, onDelete]);

  return (
    <div className="App">
      <Header />
      <TodoStateContext.Provider value={todos}>
        <TodoDispatchContext.Provider value={memoizedDispatch}>
          <Editor />
          <List />
        </TodoDispatchContext.Provider>
      </TodoStateContext.Provider>
    </div>
  );
}

export default App;
