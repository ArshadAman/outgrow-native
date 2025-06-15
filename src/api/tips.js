const GEMINI_API_KEY = "AIzaSyB1dfw9FMlxVUe44ekb_KbQ5ImKpqO70BI";
export const fetchTips = async (tech) => {
  try {
    // Handle tech as either a string or an object with a name property
    const techName = typeof tech === 'string' ? tech : (tech?.name || 'Technology');
    
    const prompt = `Give me 10 modern, practical, and concise tips and tricks for ${techName} (with a short title and a detailed explanation for each, in markdown). Give me the tips in a format like this:
## Tip Title 1
### Tip 1 description here
## Tip Title 2
### Tip 2 description here
## Tip Title 3
### Tip 3 description here
## Tip Title 4
### Tip 4 description here
## Tip Title 5
### Tip 5 description here`;
    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
        GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );
    const data = await res.json();
    let tipsArr = [];
    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      // Remove everything before the first '## '
      const raw = data.candidates[0].content.parts[0].text;
      const firstTipIdx = raw.indexOf("## ");
      const tipsOnly = firstTipIdx !== -1 ? raw.slice(firstTipIdx) : raw;
      // Split on every '## ' heading
      const tipBlocks = tipsOnly
        .split(/\n## /g)
        .map((block, idx) =>
          idx === 0 && block.startsWith("## ") ? block.slice(3) : block
        );
      tipsArr = tipBlocks
        .map((block) => {
          // The first line is the title, the rest is the body
          const [titleLine, ...rest] = block.split("\n");
          const title = titleLine.replace(/^## /, "").trim();
          const body = rest.join("\n").trim();
          // Only include if both title and body exist
          if (title && body) {
            return { title, desc: body };
          }
          return null;
        })
        .filter(Boolean);
    }
    return tipsArr;
  } catch (e) {
    console.error("Error in fetchTips:", e);
    // Return a fallback array of tips so the UI has something to display
    return [
      { 
        title: `Getting Started with ${typeof tech === 'string' ? tech : (tech?.name || 'Technology')}`, 
        desc: "No connection to content service. This is a placeholder tip." 
      },
      { 
        title: "Best Practices", 
        desc: "Please check your internet connection and try again." 
      }
    ];
  }
};
