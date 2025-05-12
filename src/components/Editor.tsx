import { useContext, useRef, useState } from "react";
import "./Editor.css";
import { TodoDispatchContext } from "../App";

const Editor = () => {
  const dispatch = useContext(TodoDispatchContext);
  if (!dispatch) {
    throw new Error("TodoDispatchContext.Provider 내부에서 사용해야 합니다.");
  }
  const { onCreate } = dispatch;

  const [content, setContent] = useState("");
  const contentRef = useRef<HTMLInputElement>(null);

  const onChangeContent = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
  };

  const onKeydown = (e:React.KeyboardEvent) => {
    if (e.key === "Enter") onSubmit();
  };

  const onSubmit = () => {
    if (content === "") {
      contentRef.current?.focus();
      return;
    }
    onCreate(content);
    setContent("");
  };

  return (
    <div className="Editor">
      <input
        ref={contentRef}
        value={content}
        onChange={onChangeContent}
        onKeyDown={onKeydown}
        placeholder="새로운 Todo..."
      ></input>
      <button onClick={onSubmit}>추가</button>
    </div>
  );
};

export default Editor;
