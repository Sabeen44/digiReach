import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { PLAN_LOCATION_LIMITS } from "../config/plans";

export default function UploadAd() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [locationLimit, setLocationLimit] = useState(0);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [uploadedAd, setUploadedAd] = useState(null); // ← stores success data

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      const { data: profile } = await supabase
        .from("profiles")
        .select("plan_id, subscription_status")
        .eq("id", user.id)
        .single();

      if (!profile || profile.subscription_status !== "active") {
        navigate("/pricing");
        return;
      }

      const limit = PLAN_LOCATION_LIMITS[profile.plan_id];
      setLocationLimit(limit ?? 1);

      const { data: locs, error } = await supabase
        .from("store_locations")
        .select("*")
        .eq("active", true)
        .order("store_name", { ascending: true });

      if (!error) setLocations(locs);
    };

    fetchData();
  }, []);

  const toggleLocation = (id) => {
    setSelectedLocations((prev) => {
      if (prev.includes(id)) return prev.filter((l) => l !== id);
      if (locationLimit !== Infinity && prev.length >= locationLimit) return prev;
      return [...prev, id];
    });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setMessage("");

    if (selectedLocations.length === 0) {
      setMessage("Please select at least one location.");
      return;
    }
    if (!file) {
      setMessage("Please choose a file to upload.");
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${selectedLocations[0]}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("ads")
        .upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from("ads").getPublicUrl(filePath);
      const fileUrl = urlData.publicUrl;

      const { data: { user } } = await supabase.auth.getUser();

      const inserts = selectedLocations.map((locationId) => ({
        user_id: user.id,
        store_location_id: locationId,
        file_url: fileUrl,
        file_type: file.type,
      }));

      const { error: dbError } = await supabase.from("ads").insert(inserts);
      if (dbError) throw dbError;

      // Store success data to show success state
      const selectedLocationNames = locations
        .filter((l) => selectedLocations.includes(l.id))
        .map((l) => `${l.store_name} — ${l.city}`);

      setUploadedAd({
        fileUrl,
        fileType: file.type,
        locationNames: selectedLocationNames,
      });

    } catch (err) {
      setMessage("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const isAtLimit = locationLimit !== Infinity && selectedLocations.length >= locationLimit;

  // ── Success state ─────────────────────────────────────────────────────────
  if (uploadedAd) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-20">
        <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 z-50" />

        {/* Background glows */}
        <div className="fixed top-0 left-0 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-40 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="fixed bottom-0 right-0 w-96 h-96 bg-pink-100 rounded-full blur-3xl opacity-40 translate-x-1/2 translate-y-1/2 pointer-events-none" />

        <div className="relative mx-auto max-w-lg text-center space-y-8">

          {/* Success icon */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-500 flex items-center justify-center mx-auto shadow-lg shadow-indigo-200">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <span className="text-xs font-medium text-indigo-500 tracking-wide uppercase">Ad Submitted</span>
          </div>

          {/* Heading */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              Ad{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500">
                Uploaded!
              </span>
            </h1>
            <p className="mt-3 text-gray-400 text-sm">
              Your ad has been submitted for review. You'll see it go live once approved.
            </p>
          </div>

          Preview
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-4">
            {uploadedAd.fileType?.startsWith("video") ? (
              <video src={uploadedAd.fileUrl} controls className="w-full rounded-xl" />
            ) : (
              <img src={uploadedAd.fileUrl} alt="Ad preview" className="w-full rounded-xl object-cover max-h-64" />
            )}
          </div>

          {/* Locations */}
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-4 text-left space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Submitted to</p>
            {uploadedAd.locationNames.map((name, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                <span className="text-sm text-gray-700">{name}</span>
              </div>
            ))}
          </div>

          {/* Pending badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-yellow-50 border border-yellow-200 px-4 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
            <span className="text-xs text-yellow-600 font-medium">Pending admin approval</span>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3 max-w-xs mx-auto">
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full rounded-xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-400 transition-all duration-200"
              style={{ boxShadow: "0 4px 20px rgba(99,102,241,0.3)" }}
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => {
                setUploadedAd(null);
                setSelectedLocations([]);
                setFile(null);
                setMessage("");
              }}
              className="w-full rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-500 hover:text-gray-700 hover:border-indigo-200 transition-all duration-200"
            >
              Upload Another Ad
            </button>
          </div>

        </div>
      </div>
    );
  }

  // ── Upload form ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-20">
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 z-50" />

      <div className="mx-auto max-w-2xl space-y-8">

        {/* Page header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-1.5 mb-4">
            <span className="text-xs font-medium text-indigo-500 tracking-wide uppercase">Ads</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
            Upload Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500">
              Ad
            </span>
          </h1>
          <p className="mt-3 text-gray-400 text-sm">
            Select your store locations and upload your image or video.
          </p>
        </div>

        {/* Form card */}
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 space-y-6">

          {/* Location selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                Store Locations
              </label>
              <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${
                isAtLimit
                  ? "bg-red-50 text-red-400 border-red-100"
                  : "bg-indigo-50 text-indigo-400 border-indigo-100"
              }`}>
                {locationLimit === Infinity
                  ? `${selectedLocations.length} selected`
                  : `${selectedLocations.length} / ${locationLimit} selected`}
              </span>
            </div>

            <div className="space-y-2">
              {locations.map((loc) => {
                const isSelected = selectedLocations.includes(loc.id);
                const isDisabled = !isSelected && isAtLimit;

                return (
                  <label
                    key={loc.id}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-all ${
                      isSelected
                        ? "border-indigo-300 bg-indigo-50 cursor-pointer"
                        : isDisabled
                        ? "border-gray-100 bg-gray-50 opacity-40 cursor-not-allowed"
                        : "border-gray-200 bg-gray-50 hover:border-indigo-200 hover:bg-indigo-50/30 cursor-pointer"
                    }`}
                  >
                    <input
                      type="checkbox"
                      disabled={isDisabled}
                      checked={isSelected}
                      onChange={() => toggleLocation(loc.id)}
                      className="accent-indigo-500 w-4 h-4 shrink-0"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">{loc.store_name}</p>
                      <p className="text-xs text-gray-400">{loc.city}</p>
                    </div>
                    {isSelected && (
                      <span className="text-xs text-indigo-400 font-medium">✓ Selected</span>
                    )}
                  </label>
                );
              })}
            </div>

            {isAtLimit && (
              <p className="text-xs text-yellow-500 pt-1">
                ⚠ Location limit reached.{" "}
                <a href="/pricing" className="underline hover:text-yellow-400">
                  Upgrade your plan
                </a>{" "}
                to select more.
              </p>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100" />

          {/* File input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Ad File
            </label>
            <label className="flex flex-col items-center justify-center w-full rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 px-4 py-10 cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/40 transition-all">
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-500">
                {file ? file.name : "Click to choose an image or video"}
              </span>
              {!file && (
                <span className="text-xs text-gray-300 mt-1">PNG, JPG, MP4 supported</span>
              )}
              <input
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
          </div>

          {/* Upload button */}
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full rounded-xl bg-indigo-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-400 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-200"
            style={{ boxShadow: uploading ? "none" : "0 4px 20px rgba(99,102,241,0.2)" }}
          >
            {uploading
              ? "Uploading…"
              : `Upload Ad${selectedLocations.length > 1 ? ` to ${selectedLocations.length} Locations` : ""}`}
          </button>

          {/* Message */}
          {message && (
            <p className={`text-sm text-center font-medium ${
              message.includes("success") ? "text-green-500" : "text-red-400"
            }`}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}