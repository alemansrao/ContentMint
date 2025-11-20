// import fetch from "node-fetch";

export async function POST(req) {
	try {
		const body = await req.json();
		const { topic = "", description = "", instruction = "", apiKey = "" } = body;

		if (!apiKey) {
			return new Response(JSON.stringify({ error: "Missing API key" }), { status: 400 });
		}
		if (!topic.trim()) {
			return new Response(JSON.stringify({ error: "Missing topic" }), { status: 400 });
		}

		// Build the prompt: include custom instruction first, then topic and description
		const promptParts = [];
		if (instruction && instruction.trim()) promptParts.push(instruction.trim());
		promptParts.push(`Topic: ${topic.trim()}`);
		if (description && description.trim()) promptParts.push(`Notes: ${description.trim()}`);
		promptParts.push("Please generate a clear, structured script with a hook, main points, and a CTA. Output as plain text which can be narrated under a minute");

		const promptText = promptParts.join("\n\n");

		// Gemini generateContent endpoint (matches provided curl example)
		const endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

		// Payload shaped like the curl example
		const payload = {
			contents: [
				{
					parts: [
						{
							text: promptText,
						},
					],
				},
			],
			// optional params can be added here if desired
		};

		const upstream = await fetch(endpoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-goog-api-key": apiKey,
			},
			body: JSON.stringify(payload),
		});

		if (!upstream.ok) {
			const text = await upstream.text().catch(() => upstream.statusText);
			return new Response(text || "Upstream error", { status: upstream.status });
		}

		const json = await upstream.json();

		// Try to extract generated text from common response shapes.
		let generatedText = "";

		console.log("Upstream response JSON:", json["candidates"][0]["content"]["parts"][0]["text"]);
		generatedText = json["candidates"][0]["content"]["parts"][0]["text"];

		// fallback to stringify
		if (!generatedText) generatedText = JSON.stringify(json);

		return new Response(JSON.stringify({ text: generatedText }), {
			headers: { "Content-Type": "application/json" },
			status: 200,
		});
	} catch (err) {
		return new Response(JSON.stringify({ error: err?.message || "Server error" }), { status: 500 });
	}
}
