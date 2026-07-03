import { useState } from "react";
import ExpenseRow from "./ExpenseRow";
import EditExpenseModal from "./EditExpenseModal";
import { deleteExpense } from "../../api/api";

export default function ExpenseList({
  expenses,
  participants,
  groupId,
  onUpdate,
}) {
  const [editingExpense, setEditingExpense] = useState(null);

  const handleDelete = async (expenseId) => {
    if (!confirm("Supprimer cette dépense ?")) return;
    await deleteExpense(groupId, expenseId);
    onUpdate();
  };

  if (expenses.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-4xl mb-3">💸</div>
        <p className="text-slate-400 text-sm font-medium">
          Aucune dépense pour l'instant
        </p>
        <p className="text-slate-300 text-xs mt-1">
          Ajoute la première dépense du groupe
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Header tableau */}
        <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-slate-50 border-b border-slate-100">
          <div className="col-span-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">
            Dépense
          </div>
          <div className="col-span-2 text-xs font-semibold text-slate-400 uppercase tracking-wide">
            Payé par
          </div>
          <div className="col-span-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">
            Pour
          </div>
          <div className="col-span-1 text-xs font-semibold text-slate-400 uppercase tracking-wide text-right">
            €
          </div>
          <div className="col-span-2 text-xs font-semibold text-slate-400 uppercase tracking-wide text-right">
            Actions
          </div>
        </div>

        <div className="divide-y divide-slate-50">
          {expenses.map((expense) => (
            <ExpenseRow
              key={expense.id}
              expense={expense}
              onEdit={() => setEditingExpense(expense)}
              onDelete={() => handleDelete(expense.id)}
            />
          ))}
        </div>
      </div>

      {editingExpense && (
        <EditExpenseModal
          expense={editingExpense}
          participants={participants}
          groupId={groupId}
          onClose={() => setEditingExpense(null)}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
}
