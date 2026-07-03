import { useState } from "react";
import { updateExpense } from "../../api/api";

export default function EditExpenseModal({
  expense,
  participants,
  groupId,
  onClose,
  onUpdate,
}) {
  const [label, setLabel] = useState(expense.label);
  const [amount, setAmount] = useState(expense.amount);
  const [paidBy, setPaidBy] = useState(expense.paid_by);
  const [selectedIds, setSelectedIds] = useState(
    expense.shares
      ?.map((s) => {
        const p = participants.find((p) => p.name === s.name);
        return p?.id;
      })
      .filter(Boolean) || []
  );
  const [error, setError] = useState("");

  const toggleParticipant = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!label.trim()) return setError("Le libellé est requis");
    if (!amount || parseFloat(amount) <= 0) return setError("Montant invalide");
    if (selectedIds.length === 0)
      return setError("Sélectionne au moins un participant");

    await updateExpense(groupId, expense.id, {
      paid_by: paidBy,
      amount: parseFloat(amount),
      label: label.trim(),
      participant_ids: selectedIds,
    });
    onUpdate();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Modifier la dépense
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Libellé"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
          />

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Montant (€)"
            min="0.01"
            step="0.01"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
          />

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Payé par</label>
            <select
              value={paidBy}
              onChange={(e) => setPaidBy(parseInt(e.target.value))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
            >
              {participants.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Pour qui</label>
            <div className="flex flex-wrap gap-2">
              {participants.map((p) => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => toggleParticipant(p.id)}
                  className={`text-sm px-3 py-1 rounded-full border transition-colors ${
                    selectedIds.includes(p.id)
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white text-gray-500 border-gray-200"
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <div className="flex gap-2 pt-2">
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
              Sauvegarder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
