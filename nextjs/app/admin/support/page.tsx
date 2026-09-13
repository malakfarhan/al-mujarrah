const tickets = [
  {
    project: "Enterprise ERP Rollout",
    subject: "Purchase approval rule",
    type: "Change",
    status: "Open",
    date: "Sep 07",
  },
  {
    project: "B2B Customer Portal",
    subject: "Invoice PDF mismatch",
    type: "Bug",
    status: "In Progress",
    date: "Sep 07",
  },
  {
    project: "Knowledge Copilot",
    subject: "Add HR knowledge base",
    type: "Feature",
    status: "Resolved",
    date: "Sep 06",
  },
];

export default function SupportPage() {
  return (
    <div>
      <div className="mb-6">
        <span className="text-[10px] font-black uppercase tracking-[.14em] text-teal-deep">
          Support
        </span>

        <h1 className="mt-1 font-display text-4xl font-semibold text-ink">
          Support tickets
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Unified support view across active projects.
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                {["Project", "Subject", "Type", "Status", "Date"].map((item) => (
                  <th
                    key={item}
                    className="whitespace-nowrap border-b border-slate-200 px-4 py-3 text-left text-[10px] font-black uppercase tracking-[.08em] text-slate-400"
                  >
                    {item}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.subject}>
                  <td className="border-b border-slate-100 px-4 py-4 text-sm font-bold text-ink">
                    {ticket.project}
                  </td>

                  <td className="border-b border-slate-100 px-4 py-4 text-sm text-slate-600">
                    {ticket.subject}
                  </td>

                  <td className="border-b border-slate-100 px-4 py-4">
                    <Status value={ticket.type} />
                  </td>

                  <td className="border-b border-slate-100 px-4 py-4">
                    <Status value={ticket.status} />
                  </td>

                  <td className="border-b border-slate-100 px-4 py-4 text-sm text-slate-600">
                    {ticket.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Status({ value }: { value: string }) {
  const key = value.toLowerCase();

  const style =
    key.includes("resolved") || key.includes("feature")
      ? "bg-emerald-50 text-emerald-700"
      : key.includes("bug")
        ? "bg-rose-50 text-rose-700"
        : key.includes("change")
          ? "bg-amber-50 text-amber-700"
          : "bg-blue-50 text-blue-700";

  return (
    <span className={`rounded-full px-2.5 py-1.5 text-[9px] font-black ${style}`}>
      {value}
    </span>
  );
}