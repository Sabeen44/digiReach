import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function DashboardMyAd({ userId }) {
  const [currentAd, setCurrentAd] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [file, setFile]           = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess]     = useState(false);
  const [error, setError]         = useState("");

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("ads")
        .select("file_url, file_type")
        .eq("user_id", userId)
        .neq("status", "inactive")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      setCurrentAd(data);
      setLoading(false);
    };
    fetch();
  }, [userId]);

  const handleUpdate = async () => {
    if (!file) return;
    setError("");
    setSuccess(false);
    setUploading(true);
    try {
      const fileExt  = file.name.split(".").pop();
      const filePath = `${userId}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from("ads").upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from("ads").getPublicUrl(filePath);
      const newUrl = urlData.publicUrl;

      // Update all non-inactive ads with the new creative; reset to pending for re-approval
      await supabase
        .from("ads")
        .update({ file_url: newUrl, file_type: file.type, status: "pending" })
        .eq("user_id", userId)
        .neq("status", "inactive");

      setCurrentAd({ file_url: newUrl, file_type: file.type });
      setFile(null);
      setSuccess(true);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6 space-y-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500">My Ad</h2>

      {loading && <p className="text-sm text-gray-500">Loading…</p>}

      {!loading && (
        <div className="flex flex-col sm:flex-row gap-6">

          {/* Current ad preview */}
          <div className="shrink-0 w-full sm:w-48">
            <p className="text-xs font-medium text-gray-500 mb-2">Current</p>
            {currentAd ? (
              <div className="rounded-xl overflow-hidden border border-white/[0.08] bg-white/[0.02]">
                {currentAd.file_type?.startsWith("video") ? (
                  <video
                    src={currentAd.file_url}
                    className="w-full h-32 object-cover"
                    muted
                    loop
                    autoPlay
                    playsInline
                  />
                ) : (
                  <img
                    src={currentAd.file_url}
                    alt="Current ad"
                    className="w-full h-32 object-cover"
                  />
                )}
              </div>
            ) : (
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] h-32 flex items-center justify-center">
                <p className="text-xs text-gray-600">No ad yet</p>
              </div>
            )}
          </div>

          {/* Upload new ad */}
          <div className="flex-1 space-y-3">
            <p className="text-xs font-medium text-gray-500">Replace with a new file</p>

            <label className="flex flex-col items-center justify-center w-full rounded-xl border-2 border-dashed border-white/[0.08] bg-white/[0.02] px-4 py-6 cursor-pointer hover:border-indigo-500/40 hover:bg-indigo-500/[0.04] transition-all">
              <svg className="w-6 h-6 text-gray-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <span className="text-sm text-gray-400">
                {file ? file.name : "Click to choose a file"}
              </span>
              {!file && <span className="text-xs text-gray-600 mt-1">PNG, JPG, MP4</span>}
              <input
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={(e) => { setFile(e.target.files[0]); setSuccess(false); setError(""); }}
              />
            </label>

            {file && (
              <button
                onClick={handleUpdate}
                disabled={uploading}
                className="w-full rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                style={{ boxShadow: uploading ? "none" : "0 4px 20px rgba(99,102,241,0.25)" }}
              >
                {uploading ? "Uploading…" : "Update Ad"}
              </button>
            )}

            {success && (
              <p className="text-xs text-green-400 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Ad updated — pending re-approval.
              </p>
            )}

            {error && <p className="text-xs text-red-400">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
