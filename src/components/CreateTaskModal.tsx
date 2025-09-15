"use client";
import { useState } from "react";

type Props = {
  onClose: () => void;
  onSave: (title: string, description: string, type: string) => void;
  taskTypes: string[];
  setTaskTypes: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function CreateTaskModal({ onClose, onSave, taskTypes, setTaskTypes }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState(taskTypes[0] || "Task");
  const [newType, setNewType] = useState("");
  const [addingType, setAddingType] = useState(false);

  const addNewType = () => {
    if (!newType.trim()) return;
    if (!taskTypes.includes(newType)) {
      setTaskTypes([...taskTypes, newType]);
      setType(newType);
    }
    setNewType("");
    setAddingType(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6 w-[550px]">
        <h2 className="text-xl font-semibold mb-4">Nova Tarefa</h2>

        {/* Tipo */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Tipo</label>
          {!addingType ? (
            <div className="flex gap-2">
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="flex-1 p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400"
              >
                {taskTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setAddingType(true)}
                className="px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                + Tipo
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Novo tipo"
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                className="flex-1 p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={addNewType}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Salvar
              </button>
              <button
                onClick={() => setAddingType(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>

        {/* Título */}
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-4 p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400"
        />

        {/* Descrição */}
        <textarea
          placeholder="Descrição (Markdown)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mb-4 p-3 rounded-xl border border-gray-300 h-36 focus:ring-2 focus:ring-blue-400"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              onSave(title, description, type);
              onClose();
            }}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-md active:scale-95 transition"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}