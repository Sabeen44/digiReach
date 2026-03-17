import { useState } from "react";

export default function AdminAdCard({ ad, filter, onApprove, onReject, onDelete }) {
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [reason, setReason] = useState("");

  return (
    <div className="flex gap-4 items-start rounded-xl border border-gray-100 bg-gray-50 p-4">

      {/* Thumbnail */}
      {ad.file_type?.startsWith("video") ? (
        <video src={ad.file_url} className="w-32 h-20 object-cover rounded-lg shrink-0" />
      ) : (
        <img src={ad.file_url} alt="Ad" className="w-32 h-20 object-cover rounded-lg shrink-0" />
      )}

      {/* Info */}
      <div className="flex-1 min-w-0 space-y-1">
        <p className="text-sm font-medium text-gray-800">
          {ad.store_locations?.store_name} — {ad.store_locations?.city}
        </p>
        <p className="text-xs text-gray-400">
          Uploaded {new Date(ad.created_at).toLocaleDateString()}
        </p>
        <p className="text-xs text-gray-300 truncate">{ad.file_url}</p>

        {/* Reject reason input */}
        {showRejectInput && (
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              placeholder="Reason for rejection (optional)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 placeholder-gray-300 focus:outline-none focus:border-red-300 focus:ring-1 focus:ring-red-100"
            />
            <button
              onClick={() => { onReject(ad.id, reason); setShowRejectInput(false); }}
              className="rounded-lg bg-red-50 border border-red-200 text-red-500 px-3 py-1.5 text-xs font-semibold hover:bg-red-100 transition-all"
            >
              Confirm
            </button>
            <button
              onClick={() => setShowRejectInput(false)}
              className="rounded-lg bg-gray-100 border border-gray-200 text-gray-400 px-3 py-1.5 text-xs hover:text-gray-600 transition-all"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 shrink-0">
        {filter === "pending" && (
          <>
            <button
              onClick={() => onApprove(ad.id)}
              className="rounded-lg bg-green-50 border border-green-200 text-green-600 px-4 py-1.5 text-xs font-semibold hover:bg-green-100 transition-all"
            >
              Approve
            </button>
            <button
              onClick={() => setShowRejectInput(true)}
              className="rounded-lg bg-red-50 border border-red-200 text-red-500 px-4 py-1.5 text-xs font-semibold hover:bg-red-100 transition-all"
            >
              Reject
            </button>
          </>
        )}
        <button
          onClick={() => onDelete(ad)}
          className="rounded-lg bg-white border border-gray-200 text-gray-400 px-4 py-1.5 text-xs font-semibold hover:text-red-400 hover:border-red-200 transition-all"
        >
          Delete
        </button>
      </div>

    </div>
  );
}