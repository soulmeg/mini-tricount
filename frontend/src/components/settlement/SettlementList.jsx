const COLORS = [
  { bg: "bg-violet-100", text: "text-violet-700" },
  { bg: "bg-rose-100", text: "text-rose-700" },
  { bg: "bg-sky-100", text: "text-sky-700" },
  { bg: "bg-emerald-100", text: "text-emerald-700" },
  { bg: "bg-amber-100", text: "text-amber-700" },
];

const Avatar = ({ name, index }) => {
  const color = COLORS[index % COLORS.length];
  return (
    <div
      className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${color.bg} ${color.text}`}
    >
      {name.slice(0, 1).toUpperCase()}
    </div>
  );
};

export default function SettlementList({ settlement }) {
  if (settlement.transactions.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-4xl mb-3">🎉</div>
        <p className="text-slate-600 font-semibold">Tout est équilibré !</p>
        <p className="text-slate-400 text-xs mt-1">
          Personne ne doit rien à personne
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
        {settlement.transactions.length} virement
        {settlement.transactions.length > 1 ? "s" : ""} à effectuer
      </p>

      {settlement.transactions.map((t, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-4 flex items-center gap-3"
        >
          <Avatar name={t.from} index={i} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-700">
              <span className="text-slate-800">{t.from}</span>
              <span className="text-slate-300 mx-2">→</span>
              <span className="text-slate-800">{t.to}</span>
            </p>
          </div>
          <Avatar name={t.to} index={i + 1} />
          <div className="ml-2 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 text-emerald-700 font-bold text-sm px-3 py-1.5 rounded-xl flex-shrink-0">
            {t.amount.toFixed(2)} €
          </div>
        </div>
      ))}

      {/* Récap soldes */}
      <div className="mt-6 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
            Soldes nets
          </p>
        </div>
        <div className="divide-y divide-slate-50">
          {settlement.balances.map((b, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              <Avatar name={b.name} index={i} />
              <span className="flex-1 text-sm font-semibold text-slate-700">
                {b.name}
              </span>
              <span
                className={`text-sm font-bold ${
                  b.balance > 0
                    ? "text-emerald-600"
                    : b.balance < 0
                    ? "text-red-500"
                    : "text-slate-400"
                }`}
              >
                {b.balance > 0 ? "+" : ""}
                {b.balance.toFixed(2)} €
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
