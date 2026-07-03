import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getGroup,
  getParticipants,
  getExpenses,
  getSettlement,
  addParticipant,
} from "../api/api";
import ExpenseList from "../components/expense/ExpenseList";
import AddExpenseModal from "../components/expense/AddExpenseModal";
import SettlementList from "../components/settlement/SettlementList";
import ParticipantList from "../components/participant/ParticipantList";

const TABS = ["Dépenses", "Participants", "Règlement"];

export default function GroupPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Dépenses");
  const [group, setGroup] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [settlement, setSettlement] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newParticipant, setNewParticipant] = useState("");
  const [participantError, setParticipantError] = useState("");

  const loadData = async () => {
    const [g, p, e, s] = await Promise.all([
      getGroup(id),
      getParticipants(id),
      getExpenses(id),
      getSettlement(id),
    ]);
    setGroup(g);
    setParticipants(p);
    setExpenses(e);
    setSettlement(s);
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleAddParticipant = async (e) => {
    e.preventDefault();
    if (!newParticipant.trim()) {
      setParticipantError("Le nom du participant est requis.");
      return;
    }
    setParticipantError("");
    await addParticipant(id, newParticipant.trim());
    setNewParticipant("");
    loadData();
  };

  if (!group)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-violet-50">
        <div className="text-slate-400 text-sm animate-pulse">
          Chargement...
        </div>
      </div>
    );

  const TAB_COUNTS = {
    Dépenses: expenses.length,
    Participants: participants.length,
    Règlement: settlement?.transactions?.length ?? 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors flex-shrink-0"
          >
            <svg
              className="w-4 h-4 text-slate-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-bold">
                {group.name.slice(0, 1).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <h1 className="text-base font-bold text-slate-800 truncate">
                {group.name}
              </h1>
              <p className="text-xs text-slate-400 truncate">
                {participants.map((p) => p.name).join(" · ")}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-violet-500 to-purple-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition-all shadow-md shadow-violet-200 active:scale-95 flex-shrink-0"
          >
            + Dépense
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex bg-white rounded-2xl border border-slate-100 shadow-sm p-1 mb-6">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
                activeTab === tab
                  ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md shadow-violet-200"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab}
              {TAB_COUNTS[tab] > 0 && (
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                    activeTab === tab
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {TAB_COUNTS[tab]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Contenu */}
        {activeTab === "Dépenses" && (
          <ExpenseList
            expenses={expenses}
            participants={participants}
            groupId={id}
            onUpdate={loadData}
          />
        )}

        {activeTab === "Participants" && (
          <div className="space-y-4">
            <form onSubmit={handleAddParticipant} className="flex gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  value={newParticipant}
                  onChange={(e) => {
                    setNewParticipant(e.target.value);
                    if (participantError) setParticipantError("");
                  }}
                  placeholder="Nom du participant"
                  className={`w-full rounded-xl px-4 py-2.5 text-sm font-medium border-2 focus:outline-none transition-colors ${
                    participantError
                      ? "border-red-300 bg-red-50 placeholder-red-300 text-red-600 focus:border-red-400"
                      : "border-slate-200 bg-white placeholder-slate-300 focus:border-violet-400"
                  }`}
                />
                {participantError && (
                  <p className="text-red-500 text-xs mt-1 ml-1 font-medium">
                    {participantError}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-violet-500 to-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-md shadow-violet-200 active:scale-95"
              >
                Ajouter
              </button>
            </form>

            <ParticipantList
              participants={participants}
              groupId={id}
              onUpdate={loadData}
            />
          </div>
        )}

        {activeTab === "Règlement" && settlement && (
          <SettlementList settlement={settlement} />
        )}
      </div>

      {showModal && (
        <AddExpenseModal
          participants={participants}
          onClose={() => setShowModal(false)}
          onAdd={async () => {
            await loadData();
            setShowModal(false);
          }}
          groupId={id}
        />
      )}
    </div>
  );
}
