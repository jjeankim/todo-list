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
import { createTodo, deleteTodo, updateTodo } from "./api/todo";
import {
  TaskFromAPI,
  Todo,
  TodoDispatchContextType,
  TodoAction,
} from "./types/todo";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

function reducer(state: Todo[], action: TodoAction): Todo[] {
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

export const TodoStateContext = createContext<Todo[] | undefined>(undefined);
export const TodoDispatchContext = createContext<
  TodoDispatchContextType | undefined
>(undefined);

function App() {
  const [todos, dispatch] = useReducer(reducer, []);

  useEffect(() => {
    const getTask = async () => {
      try {
        const res = await fetch(`${BASE_URL}/tasks`);
        const data = await res.json();

        const converted = data.map((task: TaskFromAPI) => ({
          id: task._id,
          content: task.content,
          isDone: task.isComplete,
          createdAt: new Date(task.createdAt).getTime(),
          updatedAt: new Date(task.updatedAt).getTime(),
        }));

        dispatch({ type: "INIT", data: converted });
      } catch (error) {
        console.error("할일 불러오기 실패:", error);
      }
    };
    getTask();
  }, []);

  const onCreate = useCallback(async (content: string) => {
    try {
      const created = await createTodo(content);
      dispatch({
        type: "CREATE",
        data: {
          id: created._id,
          content: created.content,
          isDone: created.isComplete,
          createdAt: new Date(created.createdAt).getTime(),
          updatedAt: new Date(created.updatedAt).getTime(),
        },
      });
    } catch (error) {
      console.error("생성 실패:", error);
    }
  }, []);

  const onUpdate = useCallback(
    async (targetId: string) => {
      const current = todos.find((todo) => todo.id === targetId);
      if (!current) return;

      const updated = await updateTodo(targetId, !current.isDone);
      dispatch({
        type: "UPDATE",
        data: {
          id: updated._id,
          content: updated.content,
          isDone: updated.isComplete,
          createdAt: new Date(updated.createdAt).getTime(),
          updatedAt: new Date(updated.updatedAt).getTime(),
        },
      });
    },
    [todos]
  );

  const onDelete = useCallback(async (targetId: string) => {
    try {
      await deleteTodo(targetId);
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
