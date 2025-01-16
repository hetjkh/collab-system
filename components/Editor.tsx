// this will show the editor in the document that we are using as layout 
// this will also handle the dark mode and the light mode for editor

"use client";
import { useSelf } from "@liveblocks/react/suspense";
import { useRoom } from "@liveblocks/react/suspense";
import { useState, useEffect } from "react";
// it is a library that made changes by different uses are merged automaticaaly and it can connect with blockquote
import * as Y from "yjs";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { Button } from "./ui/button";
import { Sun } from "lucide-react";
import { Moon } from "lucide-react";
import { BlockNoteView } from "@blocknote/shadcn";
import { BlockNoteEditor } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";
import stringToColor from "@/lib/StringToColor";


// this is the pros that blocknote is using for its editor
type EditorProps = {
  doc: Y.Doc;
  provider: any;
  darkMode: boolean;
};
// BlockNote component: text editor with real-time collaboration
function BlockNote({ doc, provider, darkMode }: EditorProps) {
  const userInfo = useSelf((me) => me.info);

  const editor: BlockNoteEditor = useCreateBlockNote({
    collaboration: {
      provider,
      fragment: doc.getXmlFragment("document-store"),// sharing the document from yjs
      user: {
        name: userInfo?.name,
        color: stringToColor(userInfo?.email),// givind a colour 
      },
    },
  });

  return (
    <div className="relative max-w-6xl mx-auto ">
      <BlockNoteView
        className=" min-w-96"
        editor={editor}
        theme={darkMode ? "dark" : "light"}
      />
    </div>
  );
}

function Editor() {
  const room = useRoom();
  const [doc, setDoc] = useState<Y.Doc>(() => new Y.Doc());
  const [provider, setProvider] = useState<LiveblocksYjsProvider>();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const yDoc = new Y.Doc();// this will create aa new yjs document
    const yProvider = new LiveblocksYjsProvider(room, yDoc);//  this will create a real- time sync
    setDoc(yDoc);// saving the document
    setProvider(yProvider);

    return () => {
      yDoc?.destroy();
      yProvider?.destroy();
    };
  }, [room]);

  if (!doc || !provider) {
    return null;
  }

  const style = `hover:text:white ${
    darkMode
      ? "text-gray-300 bg-gray-700 hover:bg-gray-100 hover:text-gray-700"
      : "text-gray-700 bg-gray-200 hover:bg-gray-300 hover:text-gray-700"
  }`;
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-2 justify-end mb-10">
   
        <Button className={style} onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <Sun /> : <Moon />}
        </Button>
      </div>
          {/* BlockNote */}
          <BlockNote doc={doc} provider={provider} darkMode={darkMode} />
    </div>
  );
}

export default Editor;
