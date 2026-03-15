export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'web-search-2025-03-05',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
```

Click **Commit new file**.

---

## Part 4 — Update the quiz to use your new route

Now you need to update one line in `components/HYSAQuiz.jsx`. In GitHub, open that file, click the pencil (edit) icon, and use **Ctrl+F** (or Cmd+F) to find this exact text:
```
"https://api.anthropic.com/v1/messages",
```

There are **two occurrences** — one inside `runAgenticSearch` and one inside `sendChat`. Replace **both** with:
```
"/api/messages",
