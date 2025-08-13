"use client";
import { useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";


export default function Editor({ data, onChange }) {
  const ejInstance = useRef(null);

  useEffect(() => {
    if (!ejInstance.current) {
      initEditor();
    }
    return () => {
      if (ejInstance.current?.destroy) {
        ejInstance.current.destroy();
        ejInstance.current = null;
      }
    };
  }, []);

  const initEditor = () => {
    const editor = new EditorJS({
      holder: "editorjs",
      data: data || {},
      autofocus: true,
      onChange: async () => {
        const content = await editor.saver.save();
        onChange(content);
      },
      tools: {
        header: require("@editorjs/header"),
        list: require("@editorjs/list"),
        paragraph: require("@editorjs/paragraph"),
      },
    });
    ejInstance.current = editor;
  };

  return <div id="editorjs" className="border p-4 min-h-[300px] bg-white" />;
}
