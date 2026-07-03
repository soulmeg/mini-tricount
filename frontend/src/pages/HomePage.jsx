import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  createGroup,
  getAllGroups,
  deleteGroup,
  updateGroupName,
} from "../api/api";
import CreateGroupModal from "../components/group/CreateGroupModal";

const PASTEL_CONFIGS = [
  {
    bg: "from-violet-100 to-purple-50",
    icon: "bg-violet-400",
    text: "text-violet-700",
  },
  {
    bg: "from-rose-100 to-pink-50",
    icon: "bg-rose-400",
    text: "text-rose-700",
  },
  { bg: "from-sky-100 to-blue-50", icon: "bg-sky-400", text: "text-sky-700" },
  {
    bg: "from-emerald-100 to-teal-50",
    icon: "bg-emerald-400",
    text: "text-emerald-700",
  },
  {
    bg: "from-amber-100 to-yellow-50",
    icon: "bg-amber-400",
    text: "text-amber-700",
  },
  {
    bg: "from-orange-100 to-red-50",
    icon: "bg-orange-400",
    text: "text-orange-700",
  },
];

export default function HomePage() {
  const [showModal, setShowModal] = useState(false);
  const [groups, setGroups] = useState([]);
  const [editingGroup, setEditingGroup] = useState(null); // { id, name }
  const [editingName, setEditingName] = useState("");
  const [menuOpenId, setMenuOpenId] = useState(null); // id du groupe dont le menu est ouvert
  const navigate = useNavigate();

  const loadGroups = async () => {
    const data = await getAllGroups();
    setGroups(data);
  };

  useEffect(() => {
    loadGroups();
  }, []);

  // Ferme le menu si on clique ailleurs
  useEffect(() => {
    const close = () => setMenuOpenId(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  const handleCreate = async (name) => {
    const group = await createGroup(name);
    navigate(`/groups/${group.id}`);
  };

  const handleDelete = async (e, groupId) => {
    e.stopPropagation();
    if (!confirm("Supprimer ce groupe et toutes ses dépenses ?")) return;
    await deleteGroup(groupId);
    setMenuOpenId(null);
    loadGroups();
  };

  const handleStartEdit = (e, group) => {
    e.stopPropagation();
    setEditingGroup(group);
    setEditingName(group.name);
    setMenuOpenId(null);
  };

  const handleSaveEdit = async () => {
    if (!editingName.trim()) return;
    await updateGroupName(editingGroup.id, editingName.trim());
    setEditingGroup(null);
    loadGroups();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <span className="text-white text-sm font-bold">T</span>
            </div>
            <span className="text-lg bg-gradient-to-r from-violet-600 to-purple-500 bg-clip-text text-transparent font-extrabold tracking-tight">
              Tricount
            </span>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-violet-500 to-purple-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition-all shadow-md shadow-violet-200 active:scale-95"
          >
            + Nouveau groupe
          </button>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight mb-2">
            Qui doit quoi
            <span className="bg-gradient-to-r from-violet-500 to-purple-500 bg-clip-text text-transparent">
              {" "}
              à qui ?
            </span>
          </h1>
          <p className="text-slate-400 text-base">
            Gère tes dépenses partagées sans prise de tête.
          </p>
        </div>

        {/* Liste groupes */}
        {groups.length > 0 ? (
          <div className="space-y-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
              Mes groupes
            </p>
            {groups.map((group, i) => {
              const config = PASTEL_CONFIGS[i % PASTEL_CONFIGS.length];
              const isMenuOpen = menuOpenId === group.id;

              return (
                <div key={group.id} className="relative">
                  <button
                    onClick={() => navigate(`/groups/${group.id}`)}
                    className={`w-full bg-gradient-to-r ${config.bg} border border-white rounded-2xl px-5 py-4 flex items-center gap-4 hover:scale-[1.01] transition-all shadow-sm hover:shadow-md text-left`}
                  >
                    <div
                      className={`w-11 h-11 rounded-xl ${config.icon} flex items-center justify-center text-white font-bold text-lg shadow-sm flex-shrink-0`}
                    >
                      {group.name.slice(0, 1).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-bold text-base ${config.text} truncate`}
                      >
                        {group.name}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Créé le{" "}
                        {new Date(group.created_at).toLocaleDateString(
                          "fr-FR",
                          { day: "numeric", month: "long" }
                        )}
                      </p>
                    </div>
                    <svg
                      className="w-5 h-5 text-slate-300 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>

                  {/* Bouton menu ⋯ */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpenId(isMenuOpen ? null : group.id);
                    }}
                    className="absolute right-14 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-white/60 hover:bg-white flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all"
                    title="Options"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" />
                    </svg>
                  </button>

                  {/* Dropdown menu */}
                  {isMenuOpen && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-4 top-16 z-20 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 w-44 animate-in"
                    >
                      <button
                        onClick={(e) => handleStartEdit(e, group)}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-violet-50 hover:text-violet-600 transition-colors"
                      >
                        <svg
                          className="w-4 h-4"
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
                        Renommer
                      </button>
                      <div className="mx-3 my-1 border-t border-slate-100" />
                      <button
                        onClick={(e) => handleDelete(e, group.id)}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <svg
                          className="w-4 h-4"
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
                        Supprimer
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-300">
            <div className="text-5xl mb-3">🧾</div>
            <p className="text-sm">Aucun groupe pour l'instant</p>
          </div>
        )}

        {/* Bouton créer */}
        <button
          onClick={() => setShowModal(true)}
          className="mt-4 w-full border-2 border-dashed border-violet-200 rounded-2xl py-6 text-violet-300 hover:border-violet-400 hover:text-violet-500 hover:bg-violet-50/50 transition-all text-sm font-medium"
        >
          + Créer un nouveau groupe
        </button>
      </div>

      {/* Modal création */}
      {showModal && (
        <CreateGroupModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
        />
      )}

      {/* Modal renommage */}
      {editingGroup && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h2 className="text-lg font-bold text-slate-800 mb-4">
              Renommer le groupe
            </h2>
            <input
              autoFocus
              type="text"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveEdit();
                if (e.key === "Escape") setEditingGroup(null);
              }}
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-violet-400 mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setEditingGroup(null)}
                className="flex-1 border-2 border-slate-200 text-slate-500 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 bg-gradient-to-r from-violet-500 to-purple-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-md shadow-violet-200"
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
