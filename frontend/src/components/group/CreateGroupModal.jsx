import { useState } from "react";

export default function CreateGroupModal({ onClose, onCreate }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return setError("Le nom est requis");
    await onCreate(name.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Nouveau groupe
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Weekend montagne"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-1 focus:outline-none focus:border-blue-400"
            autoFocus
          />
          {error && <p className="text-red-500 text-xs mb-3">{error}</p>}

          <div className="flex gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-500 py-2 rounded-lg text-sm hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white py-2 rounded-lg text-sm hover:bg-blue-600"
            >
              Créer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
