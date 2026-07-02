import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";

export function AdminResultUpload() {
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  async function onUpload(e) {
    e.preventDefault();
    if (!file) return;
    setBusy(true);
    setError("");
    setResult(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await api.post("/admin/results/upload-excel", form, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setResult(res.data?.data || null);
    } catch (err) {
      setError(err?.response?.data?.error?.message || "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-academic-navydark via-slate-900 to-black text-slate-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center">
        <div className="mx-auto h-16 w-16 bg-academic-navy rounded-full flex items-center justify-center border-2 border-academic-gold shadow-lg shadow-academic-gold/20">
          <span className="font-serif-academic font-bold text-2xl text-academic-gold">JU</span>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-white font-serif-academic">
          Results Upload System
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Publish bulk student grade cards using Excel sheets
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-slate-950/60 backdrop-blur-xl py-8 px-4 border border-slate-800 shadow-2xl rounded-2xl sm:px-10 space-y-6">
          
          <div className="rounded-xl border border-slate-850 bg-slate-900/40 p-5">
            <h4 className="text-sm font-bold text-white font-serif-academic">Expected Excel Columns</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Ensure your Excel template has exactly these columns (one subject grade record per row):
            </p>
            <div className="mt-2 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 font-mono text-[11px] text-slate-300">
              rollNumber, semester, subjectCode, subjectName, credits, marks
            </div>
          </div>

          <form onSubmit={onUpload} className="space-y-4">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full text-xs text-slate-350 file:mr-4 file:rounded-lg file:border-0 file:bg-academic-gold file:px-4 file:py-2 file:text-xs file:font-semibold file:text-academic-navy hover:file:bg-academic-goldhover cursor-pointer"
            />

            {error && (
              <div className="rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-200">
                {error}
              </div>
            )}

            {result && (
              <div className="rounded-lg border border-emerald-900 bg-emerald-950/30 p-3 text-xs text-emerald-250">
                Successfully Uploaded! Rows Parsed: <span className="font-bold text-white">{result.rows}</span>, Grade Cards Affected:{" "}
                <span className="font-bold text-white">{result.resultDocumentsTouched}</span>
              </div>
            )}

            <div className="flex gap-4">
              <button
                disabled={!file || busy}
                className="flex-grow flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-academic-navy bg-academic-gold hover:bg-academic-goldhover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-academic-gold disabled:opacity-50 transition cursor-pointer"
              >
                {busy ? "Uploading Sheet..." : "Upload & Publish"}
              </button>
              <Link
                to="/admin"
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold hover:bg-slate-850 flex items-center justify-center text-slate-300"
              >
                Back to Dashboard
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
