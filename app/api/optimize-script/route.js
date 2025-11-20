export async function POST(req) {
  try {
    const { script = "", optType = "", apiKey = "" } = await req.json();

    if (!script.trim() || !optType.trim()) {
      return new Response(JSON.stringify({ error: "Missing input" }), { status: 400 });
    }

    const key =
      apiKey ||
      (typeof window !== "undefined" && localStorage.getItem("contentAI_apiKey")) ||
      "";

    if (!key) {
      return new Response(JSON.stringify({ error: "Missing API key" }), { status: 400 });
    }

    const prompt = `
Optimize the following script based on this instruction: "${optType}".

Return ONLY the optimized script text.

Script:
${script}
`;

    const endpoint =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

    const upstream = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": key,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!upstream.ok) {
      const text = await upstream.text();
      return new Response(JSON.stringify({ error: text }), { status: upstream.status });
    }

    const json = await upstream.json();

    let text =
      json?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No output received";

    // remove markdown fences
    text = text.replace(/^```[\s\S]*?```$/g, "").trim();

    return new Response(JSON.stringify({ optimized: text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
