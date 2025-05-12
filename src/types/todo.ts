export type TaskFromAPI = {
  _id: string;
  content: string;
  isComplete: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Todo = {
  id: string;
  content: string;
  isDone: boolean;
  createdAt: number;
  updatedAt: number;
};

export type TodoDispatchContextType = {
  onCreate: (text: string) => void;
  onUpdate: (id: string) => void;
  onDelete: (id: string) => void;
};

export type TodoAction =
  | { type: "INIT"; data: Todo[] }
  | { type: "CREATE"; data: Todo }
  | { type: "UPDATE"; data: Todo }
  | { type: "DELETE"; targetId: string };

  export interface TodoItemProps {
    id: string;
    isDone: boolean;
    content: string;
    createdAt: number;
    updatedAt: number;
  }