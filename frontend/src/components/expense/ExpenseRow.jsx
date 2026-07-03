const COLORS = [
  { bg: "bg-violet-100", text: "text-violet-700" },
  { bg: "bg-rose-100", text: "text-rose-700" },
  { bg: "bg-sky-100", text: "text-sky-700" },
  { bg: "bg-emerald-100", text: "text-emerald-700" },
  { bg: "bg-amber-100", text: "text-amber-700" },
  { bg: "bg-orange-100", text: "text-orange-700" },
];

export default function ExpenseRow({ expense, onEdit, onDelete }) {
  const color = COLORS[expense.paid_by % COLORS.length];
  const shareNames = expense.shares?.map((s) => s.name) || [];

  return (
    <div className="grid grid-cols-12 gap-2 px-4 py-3 hover:bg-violet-50/30 transition-colors items-center">
      {/* Dépense */}
      <div className="col-span-4 flex items-center gap-2 min-w-0">
        <div
          className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${color.bg} ${color.text}`}
        >
          {expense.paid_by_name?.slice(0, 1).toUpperCase()}
        </div>
        <p className="text-sm font-semibold text-slate-700 truncate">
          {expense.label}
        </p>
      </div>

      {/* Payé par */}
      <div className="col-span-2 min-w-0">
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-lg ${color.bg} ${color.text}`}
        >
          {expense.paid_by_name}
        </span>
      </div>

      {/* Pour */}
      <div className="col-span-3 min-w-0">
        <p className="text-xs text-slate-400 truncate">
          {shareNames.length > 3
            ? `${shareNames.slice(0, 2).join(", ")} +${shareNames.length - 2}`
            : shareNames.join(", ")}
        </p>
      </div>

      {/* Montant */}
      <div className="col-span-1 text-right">
        <span className="text-sm font-bold text-slate-800">
          {parseFloat(expense.amount).toFixed(2)}€
        </span>
      </div>

      {/* Actions */}
      <div className="col-span-2 flex items-center justify-end gap-1">
        <button
          onClick={onEdit}
          className="w-7 h-7 rounded-lg hover:bg-violet-100 flex items-center justify-center transition-colors text-slate-300 hover:text-violet-500"
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
          onClick={onDelete}
          className="w-7 h-7 rounded-lg hover:bg-red-100 flex items-center justify-center transition-colors text-slate-300 hover:text-red-500"
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
      </div>
    </div>
  );
}
