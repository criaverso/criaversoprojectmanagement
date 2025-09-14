import { useState } from "react";
import { Task } from "../types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  task: Task & { editing?: boolean };
  onClose: () => void;
  onSave: (task: Task) => void; // editar task
  onDelete: (id: string) => void;
};

export default function TaskModal({ task, onClose, onSave, onDelete }: Props) {
  const [editable, setEditable] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [type, setType] = useState(task.type);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6 w-[550px] max-h-[80vh] overflow-auto">
        {editable ? (
          <>
            <h2 className="text-xl font-semibold mb-4">Editar Tarefa</h2>

            {/* Tipo */}
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Tipo</label>
              <input
                type="text"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Título */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mb-4 p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400"
            />

            {/* Menu de formatação */}
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setDescription((prev) => prev + "**negrito** ")}
                className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 shadow-sm"
              >
                <span className="font-bold">B</span>
              </button>
              <button
                onClick={() => setDescription((prev) => prev + "*itálico* ")}
                className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 shadow-sm italic"
              >
                I
              </button>
              <button
                onClick={() => setDescription((prev) => prev + "- item lista\n")}
                className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 shadow-sm"
              >
                • Lista
              </button>
              <button
                onClick={() => setDescription((prev) => prev + "[texto](url) ")}
                className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 shadow-sm text-blue-600"
              >
                🔗
              </button>
              <button
                onClick={() => setDescription((prev) => prev + "`código` ")}
                className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 shadow-sm font-mono"
              >
                {"</>"}
              </button>
            </div>

            {/* Descrição */}
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mb-4 p-3 rounded-xl border border-gray-300 h-36 focus:ring-2 focus:ring-blue-400"
            />
          </>
        ) : (
          <>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">{task.title}</h2>
              <span className="text-xs font-mono text-gray-500">{task.code}</span>
            </div>
            <span className="inline-block text-xs px-2 py-0.5 rounded-full font-medium bg-gray-200 text-gray-700 mb-4">
              {task.type}
            </span>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ node, ...props }) => (
                  <p className="text-gray-700 leading-relaxed mb-2" {...props} />
                ),
                strong: ({ node, ...props }) => (
                  <strong className="font-semibold text-gray-900" {...props} />
                ),
                a: ({ node, ...props }) => (
                  <a
                    className="text-blue-600 underline"
                    target="_blank"
                    rel="noreferrer"
                    {...props}
                  />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="list-disc pl-5 space-y-1" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="list-decimal pl-5 space-y-1" {...props} />
                ),
                li: ({ node, ...props }) => <li className="text-gray-700" {...props} />,
                code: ({ node, ...props }) => (
                  <code className="bg-gray-100 px-1 rounded text-sm font-mono" {...props} />
                ),
              }}
            >
              {task.description || "_Sem descrição_"}
            </ReactMarkdown>
          </>
        )}

        <div className="flex justify-between mt-6">
          {/* Botão excluir */}
          <button
            onClick={() => {
              onDelete(task.id);
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 shadow-md"
          >
            Excluir
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => {
                if (editable) {
                  onSave({
                    ...task,
                    title,
                    description,
                    type,
                  });
                  setEditable(false);
                } else {
                  onClose();
                }
              }}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
            >
              {editable ? "Salvar alterações" : "Fechar"}
            </button>
            {!editable && (
              <button
                onClick={() => setEditable(true)}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md"
              >
                Editar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}