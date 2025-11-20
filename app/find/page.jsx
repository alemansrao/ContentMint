"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

export default function FindPage() {
  const [query, setQuery] = useState("")
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const inputRef = useRef(null)

  const [customInstruction, setCustomInstruction] = useState("")
  const [apiKey, setApiKey] = useState("")

  // Load localStorage once (safe)
  useEffect(() => {
    try {
      setApiKey(localStorage.getItem("contentAI_apiKey") || "")
      setCustomInstruction(localStorage.getItem("contentAI_customInstruction") || "")
    } catch { }
    inputRef.current?.focus()
  }, [])

  const findTopics = useCallback(async () => {
    if (!query.trim()) {
      setError("Please enter what kind of topics you'd like.")
      return
    }

    const key =
      apiKey || (typeof window !== "undefined" && localStorage.getItem("contentAI_apiKey")) || ""

    if (!key) {
      setError("No API key found. Please add your Gemini API key in Config.")
      return
    }

    setError(null)
    setLoading(true)
    setTopics([])

    try {
      const res = await fetch("/api/find-topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: query.trim(),
          instruction:
            customInstruction ||
            (typeof window !== "undefined" && localStorage.getItem("contentAI_customInstruction")) ||
            "",
          apiKey: key,
        }),
      })

      if (!res.ok) throw new Error("API returned error")
      const data = await res.json()

      let parsed = []
      try {
        parsed = JSON.parse(data.text).map((item, idx) => ({
          id: idx,
          title: item.topic,
          description: item.description,
        }))
      } catch {
        throw new Error("Failed to parse JSON from Gemini")
      }

      setTopics(parsed)
    } catch (e) {
      setError("Failed to find topics. Try again.")
    } finally {
      setLoading(false)
    }
  }, [query, apiKey, customInstruction])

  return (
    <div className="min-h-[calc(100vh-4rem-1px)] max-h-[calc(100vh-4rem)] overflow-auto bg-linear-to-br from-slate-900 via-slate-800 to-sky-900 flex items-center justify-center p-6 text-slate-100">
      <motion.div
        layout
        transition={{ duration: 0.25 }}
        className="w-full max-w-6xl bg-linear-to-br from-slate-800/80 to-slate-900/70 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-700 p-6 grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="flex flex-col gap-4 justify-center">
          <header className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-white">Find Topics</h1>
              <p className="text-sm text-slate-300">
                Discover trending, relevant topics for your content.
              </p>
            </div>
            <div className="text-xs text-slate-300 mt-1">
              {loading ? "Searching…" : topics.length ? `${topics.length} topics` : "Idle"}
            </div>
          </header>

          <div className="grid grid-cols-1 gap-3">
            <label className="flex flex-col">
              <span className="text-sm font-medium text-slate-300 mb-1">
                What topics do you need?
              </span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. remote work, fintech, short-form video"
                className="px-4 text-slate-100 py-2 rounded-lg bg-slate-700 border border-slate-600 shadow-sm focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </label>

            <div className="flex items-center gap-3">
              <button
                onClick={findTopics}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-linear-to-r from-sky-500 to-indigo-600 text-white shadow hover:scale-[1.01] disabled:opacity-60"
              >
                {loading && (
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeOpacity="0.25"
                    />
                    <path
                      d="M22 12a10 10 0 00-10-10"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
                Find topics
              </button>

              <button
                onClick={() => {
                  setQuery("")
                  setTopics([])
                  setError(null)
                  inputRef.current?.focus()
                }}
                className="px-3 py-2 rounded-lg border border-slate-600 text-sm text-slate-200 hover:bg-slate-700"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:pl-6 md:ml-2 md:border-l border-slate-700">
          <div className="flex justify-between mb-2 items-center">
            <div>
              <strong className="text-sm text-slate-100">Results</strong>
              <p className="text-xs text-slate-300">Topics relevant to your query</p>
            </div>
          </div>

          <div className="flex-1">
            {!topics.length ? (
              <div className="whitespace-pre-wrap p-4 rounded-lg border border-slate-700 bg-slate-900 text-sm text-slate-100 min-h-60 flex items-center justify-center">
                {loading ? "Searching for trending topics…" : "No topics yet. Enter a query and click Find topics."}
              </div>
            ) : (
              <ul className="space-y-3">
                <AnimatePresence>
                  {topics.map((t) => (
                    <motion.li
                      key={t.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                      className="p-4 rounded-lg border border-slate-700 bg-slate-900 flex items-center justify-between"
                    >
                      <div>
                        <h4 className="text-sm font-semibold text-slate-100">{t.title}</h4>
                      </div>

                      <Link
                        href={{
                          pathname: "/generate",
                          query: { topic: t.title, description: t.description },
                        }}
                        className="text-xs text-slate-200 px-3 py-1 rounded bg-slate-700 border border-slate-600 hover:bg-slate-600"
                      >
                        Generate script
                      </Link>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
