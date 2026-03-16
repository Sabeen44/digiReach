export default function DashboardAccount({ session }) {
  return (
    <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500">Account</h2>
      <p className="mt-2 text-lg font-medium text-white">{session.user.email}</p>
      <p className="mt-1 text-sm text-gray-500">User ID: {session.user.id}</p>
    </div>
  );
}