import { useState } from "react";
import { deleteParticipant, updateParticipantName } from "../../api/api";

const COLORS = [
  { bg: "bg-violet-100", text: "text-violet-700", ring: "ring-violet-300" },
  { bg: "bg-rose-100", text: "text-rose-700", ring: "ring-rose-300" },
  { bg: "bg-sky-100", text: "text-sky-700", ring: "ring-sky-300" },
  { bg: "bg-emerald-100", text: "text-emerald-700", ring: "ring-emerald-300" },
  { bg: "bg-amber-100", text: "text-amber-700", ring: "ring-amber-300" },
];

export default function ParticipantList({ participants, groupId, onUpdate }) {
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  const handleStartEdit = (p) => {
    setEditingId(p.id);
    setEditingName(p.name);
  };

  const handleSaveEdit = async (participantId) => {
    if (!editingName.trim()) return;
    await updateParticipantName(groupId, participantId, editingName.trim());
    setEditingId(null);
    onUpdate();
  };

  const handleDelete = async (participantId) => {
    if (!confirm("Supprimer ce participant ?")) return;
    await deleteParticipant(groupId, participantId);
    onUpdate();
  };

  if (participants.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-4xl mb-3">👥</div>
        <p className="text-slate-400 text-sm font-medium">Aucun participant</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="divide-y divide-slate-50">
        {participants.map((p, i) => {
          const color = COLORS[i % COLORS.length];
          const isEditing = editingId === p.id;

          return (
            <div
              key={p.id}
              className="flex items-center gap-3 px-4 py-3 hover:bg-violet-50/30 transition-colors"
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${color.bg} ${color.text}`}
              >
                {p.name.slice(0, 1).toUpperCase()}
              </div>

              {isEditing ? (
                <input
                  autoFocus
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveEdit(p.id);
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  className="flex-1 border-2 border-violet-300 rounded-xl px-3 py-1.5 text-sm font-medium focus:outline-none focus:border-violet-400 bg-violet-50"
                />
              ) : (
                <span className="flex-1 text-sm font-semibold text-slate-700">
                  {p.name}
                </span>
              )}

              <div className="flex items-center gap-1">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => handleSaveEdit(p.id)}
                      className="text-xs bg-violet-500 text-white px-3 py-1.5 rounded-lg hover:bg-violet-600 transition-colors font-semibold"
                    >
                      Sauver
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-xs text-slate-400 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      Annuler
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleStartEdit(p)}
                      className="w-8 h-8 rounded-lg hover:bg-violet-100 flex items-center justify-center transition-colors text-slate-300 hover:text-violet-500"
                      title="Modifier"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="w-8 h-8 rounded-lg hover:bg-red-100 flex items-center justify-center transition-colors text-slate-300 hover:text-red-500"
                      title="Supprimer"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
