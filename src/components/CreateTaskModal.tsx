"use client";
import { useState } from "react";

type Props = {
  onSave: (title: string, description: string, type: string) => void;
  onClose: () => void;
  taskTypes: string[];
};

export default function CreateTaskModal({ onSave, onClose, taskTypes }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState(taskTypes[0] || "Task");

  const save = () => {
    if (!title.trim()) return;
    onSave(title.trim(), description, type);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 grid place-items-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Nova Task</h2>

        <div className="space-y-3">
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Título"
            className="w-full border rounded-lg px-3 py-2"
          />
          <select
            value={type}
            onChange={e => setType(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          >
            {taskTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Descrição (Markdown)"
            rows={6}
            className="w-full border rounded-lg px-3 py-2 font-mono text-sm"
          />
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancelar</button>
          <button onClick={save} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Criar</button>
        </div>
      </div>
    </div>
  );
}