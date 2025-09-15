"use client";
import { useState } from "react";

type Props = {
  onClose: () => void;
  onSave: (title: string, color: string) => void;
};

export default function CreateColumnModal({ onClose, onSave }: Props) {
  const [title, setTitle] = useState("");
  const [color, setColor] = useState("#3b82f6"); // azul padrão

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6 w-[400px]">
        <h2 className="text-lg font-semibold mb-4">Nova Coluna</h2>
        <input
          type="text"
          placeholder="Título da coluna"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-4 p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400"
        />

        {/* Seletor de cor */}
        <div className="flex items-center gap-3 mb-4">
          <label className="text-sm text-gray-600">Cor:</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              onSave(title, color);
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}