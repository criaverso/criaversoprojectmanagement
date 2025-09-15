"use client";
import { useState } from "react";

type Props = {
  taskTypes: string[];
  setTaskTypes: (types: string[]) => void;
  onClose: () => void;
};

export default function TaskTypesModal({ taskTypes, setTaskTypes, onClose }: Props) {
  const [newType, setNewType] = useState("");

  const add = () => {
    const v = newType.trim();
    if (!v) return;
    if (!taskTypes.includes(v)) setTaskTypes([...taskTypes, v]);
    setNewType("");
  };

  const remove = (t: string) => setTaskTypes(taskTypes.filter(x => x !== t));

  return (
    <div className="fixed inset-0 bg-black/50 grid place-items-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Tipos de Tasks</h2>

        <div className="space-y-2 mb-4">
          {taskTypes.map(t => (
            <div key={t} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
              <span>{t}</span>
              <button onClick={() => remove(t)} className="text-red-600 hover:underline">Excluir</button>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-4">
          <input
            value={newType}
            onChange={e => setNewType(e.target.value)}
            placeholder="Novo tipo"
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button onClick={add} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Adicionar
          </button>
        </div>

        <div className="text-right">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}