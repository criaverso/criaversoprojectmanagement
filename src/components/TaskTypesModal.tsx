"use client";
import { useState } from "react";

type Props = {
  taskTypes: string[];
  setTaskTypes: (types: string[]) => void;
  onClose: () => void;
};

export default function TaskTypesModal({ taskTypes, setTaskTypes, onClose }: Props) {
  const [newType, setNewType] = useState("");

  const addType = () => {
    if (newType.trim() && !taskTypes.includes(newType.trim())) {
      setTaskTypes([...taskTypes, newType.trim()]);
      setNewType("");
    }
  };

  const deleteType = (type: string) => {
    setTaskTypes(taskTypes.filter((t) => t !== type));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Gerenciar Tipos de Tasks</h2>

        <div className="space-y-2 mb-4">
          {taskTypes.map((type) => (
            <div key={type} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-lg">
              <span>{type}</span>
              <button
                onClick={() => deleteType(type)}
                className="text-red-500 hover:text-red-700 font-medium"
              >
                Excluir
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            placeholder="Novo tipo"
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addType}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Adicionar
          </button>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}