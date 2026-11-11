'use client';

import { useState } from 'react';

interface Decision {
  text: string;
  source: string;
}

interface Risk {
  text: string;
  uncertainty: string;
}

interface HandoverData {
  decisions: Decision[];
  risks: Risk[];
}

export default function Home() {
  const [step, setStep] = useState<number>(1);
  const [inputText, setInputText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<HandoverData | null>(null);

  const handleGenerate = async () => {
    if (!inputText.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/process-handover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ raw_text: inputText }),
      });
      const result = await res.json();
      setData(result);
      setStep(2);
    } catch (err) {
      console.error("Error generating handover:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0f1d] text-slate-100 p-8 font-sans">
      {/* Top Header */}
      <div className="max-w-5xl mx-auto flex justify-between items-center border-b border-slate-800 pb-6 mb-10">
        <div>
          <h1 className="text-2xl font-bold text-cyan-400 tracking-wide">KnowledgeHandover AI</h1>
          <p className="text-sm text-slate-400">Automated Knowledge Transfer Platform</p>
        </div>
        <div className="bg-slate-900 border border-slate-700 px-4 py-1.5 rounded-full text-xs text-cyan-300 font-medium shadow-inner">
          Status: Round 2 Prototype
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        {/* STEP 1: Ingestion View */}
        {step === 1 && (
          <div className="bg-[#111827] border border-slate-800 rounded-xl p-8 shadow-xl">
            <span className="text-xs uppercase tracking-wider text-cyan-400 font-semibold">Step 1 of 3</span>
            <h2 className="text-xl font-bold mt-1 mb-4 text-white">Ingest Raw Project Context</h2>
            <p className="text-sm text-slate-400 mb-6">
              Paste your raw commit logs, meeting notes, or chat history below to automatically extract critical architectural decisions and unverified risks.
            </p>
            <textarea
              rows={6}
              className="w-full bg-[#0b101b] border border-slate-700 rounded-lg p-4 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 transition"
              placeholder="Paste notes, commits, or transition details here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <div className="flex justify-end mt-6">
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-6 py-2.5 rounded-lg text-sm transition shadow-lg disabled:opacity-50"
              >
                {loading ? "Analyzing..." : "Generate Handover Plan →"}
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Review & Approve View */}
        {step === 2 && data && (
          <div>
            <div className="flex justify-between items-center bg-[#111827] border border-slate-800 rounded-xl p-6 mb-8 shadow-xl">
              <div>
                <span className="text-xs uppercase tracking-wider text-cyan-400 font-semibold">Step 2 of 3</span>
                <h2 className="text-xl font-bold text-white mt-1">Review & Approve Handover</h2>
              </div>
              <button
                onClick={() => setStep(3)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-6 py-2.5 rounded-lg text-sm transition shadow-lg flex items-center gap-2"
              >
                Approve & Share <span>✓</span>
              </button>
            </div>

            {/* Decisions Section */}
            <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 mb-6 shadow-lg">
              <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2 mb-4">
                <span className="text-cyan-400">📄</span> Key Architectural Decisions & Evidence
              </h3>
              <div className="space-y-3">
                {data.decisions.map((dec, idx) => (
                  <div key={idx} className="bg-[#0b101b] border border-slate-800 p-4 rounded-lg flex justify-between items-center">
                    <span className="text-sm text-slate-200">{dec.text}</span>
                    <span className="text-xs bg-slate-800 text-cyan-300 px-3 py-1.5 rounded border border-slate-700 font-mono">
                      {dec.source} ↗
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Risks Section */}
            <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2 mb-4">
                <span className="text-amber-400">⚠️</span> Flagged Risks & Missing Evidence
              </h3>
              <div className="space-y-3">
                {data.risks.map((risk, idx) => (
                  <div key={idx} className="bg-[#0b101b] border border-slate-800 p-4 rounded-lg flex justify-between items-center">
                    <span className="text-sm text-slate-200">{risk.text}</span>
                    <span className="text-xs bg-amber-950/60 text-amber-400 px-3 py-1 rounded border border-amber-800/50 font-semibold">
                      {risk.uncertainty}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Approved Success View */}
        {step === 3 && (
          <div className="bg-[#111827] border border-slate-800 rounded-xl p-12 text-center shadow-xl max-w-xl mx-auto mt-10">
            <div className="w-16 h-16 bg-emerald-950/80 border border-emerald-600/50 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-400 text-2xl font-bold">
              ✓
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Handover Approved!</h2>
            <p className="text-sm text-slate-400 mb-8">
              Role-appropriate continuation plan generated and ready to share with incoming team members.
            </p>
            <button
              onClick={() => {
                setStep(1);
                setInputText('');
                setData(null);
              }}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium px-6 py-2.5 rounded-lg text-sm transition border border-slate-700"
            >
              Start New Handover
            </button>
          </div>
        )}
      </div>
    </main>
  );
}