"use client";
import { useState } from "react";

type Props = {
  onSave: (title: string, color: string) => void;
  onClose: () => void;
};

export default function CreateColumnModal({ onSave, onClose }: Props) {
  const [title, setTitle] = useState("");
  const [color, setColor] = useState("#3b82f6");

  const save = () => {
    if (!title.trim()) return;
    onSave(title.trim(), color);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 grid place-items-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Nova Coluna</h2>

        <div className="space-y-3">
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Título"
            className="w-full border rounded-lg px-3 py-2"
          />
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600">Cor:</label>
            <input type="color" value={color} onChange={e => setColor(e.target.value)} />
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancelar</button>
          <button onClick={save} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Salvar</button>
        </div>
      </div>
    </div>
  );
}