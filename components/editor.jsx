// components/EditorJS.jsx
import { useEffect, useRef, useState } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';

const EditorJSComponent = ({ data, onChange, holder = 'editorjs' }) => {
  const editorRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Vérifier si on est côté client
    if (typeof window === 'undefined') return;

    // Initialiser Editor.js
    const initEditor = () => {
      const editor = new EditorJS({
        holder,
        tools: {
          header: {
            class: Header,
            config: {
              placeholder: 'Entrez un titre...',
              levels: [1, 2, 3, 4, 5, 6],
              defaultLevel: 2
            }
          },
          paragraph: {
            class: Paragraph,
            inlineToolbar: true,
            config: {
              placeholder: 'Commencez à écrire...'
            }
          },
          list: {
            class: List,
            inlineToolbar: true,
            config: {
              defaultStyle: 'unordered'
            }
          }
        },
        data: data || {},
        placeholder: 'Commencez à écrire votre contenu...',
        onChange: async () => {
          if (onChange && editorRef.current) {
            const savedData = await editorRef.current.save();
            onChange(savedData);
          }
        }
      });

      editorRef.current = editor;
      setIsReady(true);
    };

    initEditor();

    // Nettoyage
    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
      }
    };
  }, [holder]);

  const save = async () => {
    if (editorRef.current) {
      try {
        const outputData = await editorRef.current.save();
        return outputData;
      } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
      }
    }
  };

  return (
    <div className="editor-wrapper">
      <div id={holder} />
      <style jsx>{`
        .editor-wrapper {
          border: 1px solid #e1e5e9;
          border-radius: 8px;
          padding: 20px;
          min-height: 300px;
        }
      `}</style>
    </div>
  );
};

export default EditorJSComponent;