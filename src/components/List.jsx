import { useState,useContext } from "react";
import "./List.css";
import TodoItem from "./TodoItem";
import { TodoContext } from "../App";

const List = () => {
  const { todos } = useContext(TodoContext)
  const [search, setSearch] = useState("");

  const onChangeSearch = (e) => {
    setSearch(e.target.value);
  };

  const getFiltersData = () => {
    if (search === "") return todos;
    return todos.filter((todo) =>
      todo.content.toLowerCase().includes(search.toLowerCase())
    );
  };

  const filterdTodos = getFiltersData();

  return (
    <div className="List">
      <h4>Todo List🌱</h4>
      <input
        value={search}
        onChange={onChangeSearch}
        placeholder="검색어를 입력하세요"
      ></input>
      <div className="todos_wrapper">
        {filterdTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            {...todo}
          />
        ))}
      </div>
    </div>
  );
};

export default List;
