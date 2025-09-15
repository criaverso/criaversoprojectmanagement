"use client";
import { useRef, useState } from "react";

type Props = {
  onExport: () => void;
  onImport: (file: File) => void;
  onOpenTaskTypes?: () => void;
  title?: string;
};

export default function TopBar({
  onExport,
  onImport,
  onOpenTaskTypes,
  title = "Kanban Board",
}: Props) {
  const [openFile, setOpenFile] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const pickFile = () => inputRef.current?.click();
  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onImport(f);
    if (inputRef.current) inputRef.current.value = "";
    setOpenFile(false);
  };

  return (
    <header className="sticky top-0 z-10 w-full bg-white/70 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="mx-auto max-w-6xl px-6 py-3 flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>

        <nav className="flex items-center gap-6 text-sm font-medium">
          {/* Arquivo */}
          <div
            className="relative"
            onMouseEnter={() => setOpenFile(true)}
            onMouseLeave={() => setOpenFile(false)}
          >
            <button className="px-2 py-1 rounded-md hover:bg-gray-100">
              Arquivo ▾
            </button>
            {openFile && (
              <div className="absolute right-0 mt-1 w-44 bg-white border rounded-md shadow-lg overflow-hidden">
                <button
                  onClick={onExport}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Exportar
                </button>
                <button
                  onClick={pickFile}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Importar
                </button>
                <input
                  ref={inputRef}
                  type="file"
                  accept="application/json"
                  className="hidden"
                  onChange={onFile}
                />
              </div>
            )}
          </div>

          {/* Editar */}
          <div
            className="relative"
            onMouseEnter={() => setOpenEdit(true)}
            onMouseLeave={() => setOpenEdit(false)}
          >
            <button className="px-2 py-1 rounded-md hover:bg-gray-100">
              Editar ▾
            </button>
            {openEdit && (
              <div className="absolute right-0 mt-1 w-48 bg-white border rounded-md shadow-lg overflow-hidden">
                <button
                  onClick={onOpenTaskTypes}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Tipos de Tasks
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}