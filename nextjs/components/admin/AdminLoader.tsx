export default function AdminLoader({
  text = "Loading...",
  subtext,
}: {
  text?: string;
  subtext?: string;
}) {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center gap-4">
      <div className="relative h-11 w-11">
        <div className="absolute inset-0 rounded-full border-[3px] border-slate-200" />
        <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-transparent border-r-teal-deep border-t-teal-deep" />
      </div>

      <div className="text-center">
        <p className="text-sm font-bold text-slate-600">{text}</p>

        {subtext && (
          <p className="mt-1 text-[10px] text-slate-400">{subtext}</p>
        )}
      </div>
    </div>
  );
}