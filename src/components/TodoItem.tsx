import { memo, useContext } from "react";
import "./TodoItem.css";
import { TodoDispatchContext } from "../App";
import { TodoItemProps } from "../types/todo";

const TodoItem = ({ id, isDone, content, updatedAt }: TodoItemProps) => {
  const dispatch = useContext(TodoDispatchContext);
  if (!dispatch) {
    throw new Error("TodoDispatchContext.Provider 내부에서 사용해야 합니다.");
  }

  const { onUpdate, onDelete } = dispatch;

  const onChangeCheckbox = () => {
    onUpdate(id);
  };

  const onClickDeleteButton = () => {
    onDelete(id);
  };
  return (
    <div className="TodoItem">
      <input onChange={onChangeCheckbox} checked={!!isDone} type="checkbox" />
      <div className="content">{content}</div>
      <div className="date">{new Date(updatedAt).toLocaleDateString()}</div>
      <button onClick={onClickDeleteButton}>삭제</button>
    </div>
  );
};

export default memo(TodoItem);
