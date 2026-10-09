import { FileText } from 'lucide-react';

export default function AdminAuditLogsTab({ logs }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-extrabold text-sm text-zinc-100 flex items-center gap-2">
          <FileText className="w-4 h-4 text-amber-400" /> Admin Activity Audit Trail
        </h2>
        <p className="text-xs text-zinc-400">Recorded system actions by administrative staff</p>
      </div>

      <div className="bg-[#0f0f10] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1d1d20] text-amber-300 font-bold uppercase tracking-wider border-b border-zinc-800">
              <tr>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">Admin Staff</th>
                <th className="p-3.5">Action Type</th>
                <th className="p-3.5">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300 font-medium">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-zinc-500">
                    No audit log entries recorded yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#1d1d20]/50 transition-colors">
                    <td className="p-3.5 font-mono text-[11px] text-zinc-400">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="p-3.5 font-bold text-zinc-100">{log.adminName}</td>
                    <td className="p-3.5">
                      <span className="bg-amber-500/10 text-amber-300 border border-amber-500/30 font-mono px-2 py-0.5 rounded-md text-[10px] font-bold uppercase">
                        {log.actionType}
                      </span>
                    </td>
                    <td className="p-3.5 text-zinc-300">{log.details}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}