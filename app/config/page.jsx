"use client"
import React, { useEffect, useState } from "react"
import { Input } from "@heroui/react";
import { Select, SelectItem } from "@heroui/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";


const HOMEPAGE = () => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [apiKey, setApiKey] = useState("");
  const [customInstruction, setCustomInstruction] = useState("");
  const [platform, setPlatform] = useState("");
  const [saved, setSaved] = useState(false);


  const toggleVisibility = () => setIsVisible(!isVisible);
  const saveSettings = () => {
    try {
      localStorage.setItem("contentAI_apiKey", apiKey || "");
      localStorage.setItem("contentAI_customInstruction", customInstruction || "");
      localStorage.setItem("contentAI_platform", platform || "");
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    } catch {
      // ignore
    }
  };

 

  const resetSettings = () => {
    setApiKey("");
    setCustomInstruction("");
    setPlatform("");
    try {
      localStorage.removeItem("contentAI_apiKey");
      localStorage.removeItem("contentAI_customInstruction");
      localStorage.removeItem("contentAI_platform");
    } catch { }
  };

  const platforms = [
    { key: "youtube", label: "Youtube" },
    { key: "tiktok", label: "Tiktok" },
    { key: "instagram", label: "Instagram" },
  ];


  return (
    // outer page: dark modern gradient and light text
    <div className="min-h-[calc(100vh-4rem-1px)] max-h-[calc(100vh-4rem)] overflow-auto bg-linear-to-br from-slate-900 via-slate-800 to-sky-900 flex items-center justify-center p-4 ">
      {/* main card: responsive two-column layout (stack on small screens) */}
      <div className="w-full max-w-6xl bg-linear-to-br from-slate-800/80 to-slate-900/70 backdrop-4lur-md rounded-2xl shadow-2xl border border-slate-700 p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left column: inputs + controls */}
        <div className="flex flex-col gap-4">
          <header className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-white">Settings</h1>
              <p className="text-sm text-slate-300">Configure your API key and default content settings. These are stored locally in your browser.</p>
            </div>
          </header>

          {/* form area */}
          <div className="grid grid-cols-1 gap-4">
            <label className="flex flex-col">
              {/* <span className="text-sm font-medium text-slate-300 mb-1">Topic</span> */}
              <Input
                className="max-w-full"
                endContent={
                  <button
                    aria-label="toggle password visibility"
                    className="focus:outline-solid outline-transparent"
                    type="button"
                    onClick={toggleVisibility}
                  >
                    {isVisible ? (
                      <FaEyeSlash className="text-2xl text-indigo-400 pointer-events-none" />
                    ) : (
                      <FaEye className="text-2xl text-indigo-400 pointer-events-none" />
                    )}
                  </button>
                }
                onChange={(e) => setApiKey(e.target.value)}
                label="API Key"
                value={apiKey}
                placeholder="Enter your Gemini API Key"
                type={isVisible ? "text" : "password"}
                variant="bordered"
                classNames={{
                  inputWrapper: "border-indigo-200 focus-within:border-slate-400 ",

                }}
              />
              <div className="text-sm text-indigo-500 py-2">Changes are applied to local storage only and are browser-specific.</div>

            </label>

            <label className="flex flex-col">
              <Select
                className="max-w-full"
                variant="bordered"
                label="Platform"
                // defaultSelectedKeys={["youtube"]}
                placeholder="Select the platform you are mainly focusing on"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
              >
                {platforms.map((p) => (
                  <SelectItem key={p.key} value={p.key}>{p.label}</SelectItem>
                ))}
              </Select>
              {/* <div className="text-sm text-indigo-500 py-2">Changes are applied to local storage only and are browser-specific.</div> */}

            </label>


          </div>


        </div>

        {/* Right column: full preview panel */}
        <div className="flex flex-col md:pl-6 md:ml-2 md:border-l  border-slate-700">
          <div className="flex  justify-between mb-2 items-center">
            <div>
              <strong className="text-sm ">Custom instructions to the AI</strong>
              {/* <p className="text-xs text-slate-300">Generated script</p> */}
            </div>

          </div>

          <textarea
            value={customInstruction}
            onChange={(e) => setCustomInstruction(e.target.value)}
            placeholder="Preview or edit your default AI instruction..."
            className="p-4 rounded-lg border border-slate-700 bg-slate-900 text-sm flex-1 min-h-60 md:min-h-[360px] overflow-auto"
          />
          <p className="text-sm pt-1 text-indigo-500">This instruction will be sent as a default system prompt when generating content.</p>

          <div
            className="flex flex-row justify-end gap-3 pt-3"

          >

            <button
              onClick={saveSettings}
              type="button"
              className="inline-flex items-center justify-center rounded-lg bg-linear-to-r from-indigo-600 to-pink-500 text-white font-medium py-2 px-4 hover:from-indigo-700 hover:to-pink-600 transition"
            >
              {saved ? "Saved" : "Update settings"}
            </button>
            <button
              onClick={() => { resetSettings(); setSaved(false); }}
              type="button"
              className="inline-flex items-center justify-center rounded-lg bg-pink-100 text-pink-800 font-medium py-2 px-4 hover:bg-pink-200 transition"
            >
              Reset
            </button>
          </div>


        </div>

      </div>
    </div>
  )
}

export default HOMEPAGE
