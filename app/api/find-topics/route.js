export async function POST(req) {
	try {
		const { description = "", instruction = "", apiKey = "" } = await req.json()

		if (!apiKey) {
			return new Response(JSON.stringify({ error: "Missing API key" }), { status: 400 })
		}

		const prompt = `${instruction?.trim() || ""}
						${description?.trim() ? `Idea: ${description.trim()}` : ""}

						Your task is to generate exactly 5 topics based on the idea.

						Output Rules:
						- Output ONLY pure JSON — no text, no explanation, no markdown.
						- If Topic is Camera, then Output should be something like this:
						[
							{'topic': 'Camera - DSLR Photography Tips', 'description': 'A script covering essential tips for beginners in DSLR photography, including settings, composition, and lighting techniques.'},
							.
							.
							.
							]
						- JSON must be an array of objects.
						- Each object must contain:
						• topic → short, medium-to-specific topic derived from the idea
						• description → clear instructions on how the content/script should be created for that topic (what to cover, angle, style, details to focus on)

						Content Rules:
						- Avoid sensitive topics entirely.
						- If the user’s idea is highly sensitive, you must still return 5 array elements — but each topic + description should politely refuse to generate content while remaining in valid JSON format.

						Quality Rules:
						- Topics must NOT be broad.
						- Topic names must be short.
						- Descriptions should explain what the script should contain, what aspects to highlight, and how the content should be approached.

						Your Output Format (strict):
						[
						{ "topic": "...", "description": "..." },
						{ "topic": "...", "description": "..." },
						{ "topic": "...", "description": "..." },
						{ "topic": "...", "description": "..." },
						{ "topic": "...", "description": "..." }
						]
						`.trim();


		const endpoint =
			"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"

		const upstream = await fetch(endpoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-goog-api-key": apiKey
			},
			body: JSON.stringify({
				contents: [{ parts: [{ text: prompt }] }]
			})
		})

		if (!upstream.ok) {
			console.error("Upstream response status:", upstream.status)
			const text = await upstream.text().catch(() => "Upstream error")
			return new Response(JSON.stringify({ error: text }), { status: upstream.status })
		}

		const json = await upstream.json()
		let text =
			json?.candidates?.[0]?.content?.parts?.[0]?.text ||
			JSON.stringify(json)

		// Remove ```json fences
		text = text
			.replace(/^```json/i, "")
			.replace(/```$/, "")
			.trim()

		return new Response(JSON.stringify({ text }), {
			headers: { "Content-Type": "application/json" },
			status: 200
		})
	} catch (err) {
		console.error("Error in /api/generate-topics:", err)
		return new Response(
			JSON.stringify({ error: err?.message || "Server error" }),
			{ status: 500 }
		)
	}
}
