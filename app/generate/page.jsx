"use client"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation";
import { Button } from '@heroui/button';
const HOMEPAGE = () => {
  const [topic, setTopic] = useState("")
  const [description, setDescription] = useState("")
  const [script, setScript] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const lastGeneratedRef = useRef({ topic: "", description: "" })
  const debounceRef = useRef(null)
  const topicInputRef = useRef(null)

  const [apiKey, setApiKey] = useState("")
  const [customInstruction, setCustomInstruction] = useState("")

  const searchParams = useSearchParams();

  useEffect(() => {
    try {
      setApiKey(localStorage.getItem("contentAI_apiKey") || "");
      setCustomInstruction(localStorage.getItem("contentAI_customInstruction") || "");
    } catch {
      // ignore
    }

    // populate topic/description from Next.js search params if provided (e.g. ?topic=...&description=...)
    try {
      const t = searchParams?.get("topic");
      const d = searchParams?.get("description");
      if (t && t.trim()) {
        setTopic(t);
        topicInputRef.current?.focus();
      }
      if (d && d.trim()) {
        setDescription(d);
      }
    } catch {
      // ignore malformed params or other errors
    }
  }, [searchParams]);

  // single async generator used both for auto and manual generation
  const generateScript = useCallback(
    async ({ topic: t = topic, description: d = description } = {}) => {
      if (!t.trim()) {
        setError("Please provide a topic.")
        return
      }
      // avoid generating if inputs didn't change
      if (
        lastGeneratedRef.current.topic === t.trim() &&
        lastGeneratedRef.current.description === d.trim()
      ) {
        return
      }

      // require API key to call Gemini
      const key = apiKey || localStorage.getItem("contentAI_apiKey") || "";
      if (!key) {
        setError("No API key found. Please add your Gemini API key in Config.")
        return
      }

      setError(null)
      setLoading(true)
      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topic: t,
            description: d,
            instruction: customInstruction || localStorage.getItem("contentAI_customInstruction") || "",
            apiKey: key
          }),
        });
        if (!res.ok) {
          const errText = await res.text().catch(() => res.statusText);
          throw new Error(errText || "Generation failed");
        }
        const data = await res.json();
        // server returns { text: "...generated text..." }
        setScript(data.text || "No content returned");
        lastGeneratedRef.current = { topic: t.trim(), description: d.trim() }
      } catch (err) {
        setError("Failed to generate. " + (err.message || "Try again."))
      } finally {
        setLoading(false)
      }
    },
    [topic, description, apiKey, customInstruction]
  )

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(script)
    } catch {
      // ignore
    }
  }

  return (
    // outer page: dark modern gradient and light text
    <div className="min-h-[calc(100vh-4rem-1px)] max-h-[calc(100vh-4rem)] overflow-auto bg-linear-to-br from-slate-900 via-slate-800 to-sky-900 flex items-center justify-center p-6 ">
      {/* main card: responsive two-column layout (stack on small screens) */}
      <div className="w-full max-w-6xl bg-linear-to-br from-slate-800/80 to-slate-900/70 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-700 p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column: inputs + controls */}
        <div className="flex flex-col gap-4">
          <header className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-white">Content AI</h1>
              <p className="text-sm text-slate-300">Generate polished scripts in seconds</p>
            </div>
            <div className="text-xs text-slate-300 mt-1">
              {loading ? "Generating…" : script ? "Ready" : "Idle"}
            </div>
          </header>

          {/* form area */}
          <div className="grid grid-cols-1 gap-3">
            <label className="flex flex-col">
              <span className="text-sm font-medium text-slate-300 mb-1">Topic</span>
              <input
                ref={topicInputRef} // attach ref here
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Benefits of Remote Work"
                className="px-4  py-2 rounded-lg bg-slate-700 border border-slate-600 shadow-sm focus:ring-2 focus:ring-sky-500 outline-none"
                aria-label="Topic"
              />
            </label>

            <label className="flex flex-col">
              <span className="text-sm font-medium text-slate-300 mb-1">Description / Notes</span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add details or tone you'd like..."
                rows={6}
                className=" px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 shadow-sm focus:ring-2 focus:ring-sky-500 outline-none resize-none"
                aria-label="Description"
              />
            </label>

            <div className="flex items-center gap-3">
              <Button
                onPress={() => generateScript()}
                disabled={loading || !topic.trim()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-linear-to-r from-sky-500 to-indigo-600 text-white shadow hover:scale-[1.01] disabled:opacity-60"
                aria-busy={loading}
              >
                {loading ? (
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25" />
                    <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                ) : null}
                Generate
              </Button>

              <button
                onClick={() => {
                  setTopic("")
                  setDescription("")
                  setScript("")
                  lastGeneratedRef.current = { topic: "", description: "" }
                  topicInputRef.current?.focus()
                  setError(null)
                }}
                className="px-3 py-2 rounded-lg border border-slate-600 text-sm text-slate-200 hover:bg-slate-700"
              >
                Reset
              </button>

              <div className="ml-auto text-sm text-slate-300">{error ? <span className="text-red-400">{error}</span> : null}</div>
            </div>
          </div>

          {/* small preview summary for narrow screens (optional) */}
          {/* <div className="mt-2 md:hidden">
            <strong className="text-sm text-slate-200">Quick Preview</strong>
            <pre className="whitespace-pre-wrap p-3 rounded-lg border border-slate-700 bg-slate-800 text-sm  max-h-40 overflow-auto">
              {script ? script : "Your generated script will appear on the right."}
            </pre>
          </div> */}

        </div>

        {/* Right column: full preview panel */}
        <div className="flex flex-col md:pl-6 md:ml-2 md:border-l  border-slate-700">
          <div className="flex  justify-between mb-2 items-center">
            <div>
              <strong className="text-sm ">Preview</strong>
              <p className="text-xs text-slate-300">Generated script</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                disabled={!script}
                className="text-xs text-slate-200 px-3 py-1 rounded bg-slate-700 border border-slate-600 hover:bg-slate-600 disabled:opacity-50"
              >
                Copy
              </button>
            </div>
          </div>

          <pre className="whitespace-pre-wrap p-4 rounded-lg border border-slate-700 bg-slate-900 text-sm  flex-1 min-h-60 md:min-h-[360px] overflow-auto max-h-96">
            {script || "Your generated script will appear here."}
          </pre>
        </div>
      </div>
    </div>
  )
}

export default HOMEPAGE