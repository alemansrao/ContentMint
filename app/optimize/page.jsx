"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@heroui/react";

const OptimizePage = () => {
  const [script, setScript] = useState("");
  const [optType, setOptType] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState("")
  const handleOptimize = useCallback(async () => {
    if (!script.trim() || !optType.trim()) return;

    setLoading(true);
    setResult("");
    const key =
      apiKey || (typeof window !== "undefined" && localStorage.getItem("contentAI_apiKey")) || ""

    if (!key) {
      setError("No API key found. Please add your Gemini API key in Config.")
      return
    }

    try {
      const res = await fetch("/api/optimize-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script, optType, apiKey: key }),
      });

      if (!res.ok) throw new Error("Failed to optimize");

      const data = await res.json();
      setResult(data.optimized || "Failed to generate result");
    } catch {
      setResult("Error optimizing script. Try again.");
    } finally {
      setLoading(false);
    }
  }, [script, optType]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(result);
    } catch { }
  }, [result]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (script) {
        setScript("");
        return;
      }
      setScript(text);
    } catch { }
  };

  return (
    <div className="min-h-[calc(100vh-4rem-1px)] md:p-6 max-h-[calc(100vh-4rem)] overflow-auto bg-linear-to-br from-slate-900 via-slate-800 to-sky-900 flex items-center justify-center p-6 pt-36 text-slate-100">
      <motion.div
        layout
        transition={{ duration: 0.25 }}
        className="w-full max-w-6xl bg-linear-to-br from-slate-800/80 to-slate-900/70 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-700 p-6 grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        {/* LEFT SIDE */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-row justify-between items-center">
            <h1 className="text-2xl font-semibold text-white">Optimize Script</h1>
            <div className="text-xs text-slate-300 mt-1">
              {loading ? "Optimizing…" : result ? "Ready" : "Idle"}
            </div>
          </div>

          <p className="text-sm">
            Paste your existing script and describe the optimization you want.
          </p>

          <div className="flex flex-row justify-between items-center">
            <label className="text-sm font-medium">Existing Script</label>
            <button
              onClick={handlePaste}
              className="text-xs text-slate-200 px-3 py-1 rounded bg-slate-700 border border-slate-600 hover:bg-slate-600"
            >
              {script ? "Clear" : "Paste"}
            </button>
          </div>

          <textarea
            value={script}
            placeholder="Paste your script here"
            rows={6}
            className="text-slate-100 px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 shadow-sm focus:ring-2 focus:ring-sky-500 outline-none resize-none"
            onChange={(e) => setScript(e.target.value)}
          />

          <label className="text-sm font-medium">Optimization Requirement</label>
          <input
            className="px-4 text-slate-100 py-2 rounded-lg bg-slate-700 border border-slate-600 shadow-sm focus:ring-2 focus:ring-sky-500 outline-none"
            placeholder="e.g. Shorten, improve English, add keywords…"
            value={optType}
            onChange={(e) => setOptType(e.target.value)}
          />

          <div className="flex items-center gap-3 mt-2">
            <Button
              className="inline-flex items-center justify-center rounded-lg bg-indigo-600 text-white font-medium py-2 px-4 hover:bg-indigo-700 transition disabled:opacity-50"
              onPress={handleOptimize}
              disabled={!script || !optType || loading}
            >
              {loading ? "Optimizing…" : "Optimize"}
            </Button>

            <Button
              className="inline-flex items-center justify-center rounded-lg bg-slate-600 hover:bg-slate-500 font-medium py-2 px-4 transition"
              onPress={() => {
                setScript("");
                setOptType("");
                setResult("");
              }}
            >
              Reset
            </Button>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col md:pl-6 md:ml-2 md:border-l border-slate-700">
          <div className="flex justify-between mb-2 items-center">
            <div>
              <strong className="text-sm">Preview</strong>
              <p className="text-xs text-slate-300">Generated script</p>
            </div>

            <button
              onClick={handleCopy}
              disabled={!result}
              className="text-xs text-slate-200 px-3 py-1 rounded bg-slate-700 border border-slate-600 hover:bg-slate-600 disabled:opacity-50"
            >
              Copy
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.pre
              key={result} // animate on change
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="whitespace-pre-wrap p-4 rounded-lg border border-slate-700 bg-slate-900 text-sm flex-1 min-h-60 md:min-h-[360px] overflow-auto"
            >
              {result || "Your generated script will appear here."}
            </motion.pre>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default OptimizePage;
