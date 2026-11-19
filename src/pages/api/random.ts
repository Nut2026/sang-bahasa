export const prerender = false;

import { getAllPeribahasa, getAllBahasaKlasik } from "../../utils/supabase";

export const GET = async () => {
  try {
    // Fetch all entries from both tables
    const [peribahasa, bahasaKlasik] = await Promise.all([
      getAllPeribahasa(),
      getAllBahasaKlasik(),
    ]);

    // Combine all entries with their word type
    const allEntries = [
      ...peribahasa.map((entry) => ({ ...entry, word_type: "peribahasa" })),
      ...bahasaKlasik.map((entry) => ({ ...entry, word_type: "bahasa-klasik" })),
    ];

    if (allEntries.length === 0) {
      return new Response(JSON.stringify({ error: "No entries found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Pick a random entry
    const randomIndex = Math.floor(Math.random() * allEntries.length);
    const randomEntry = allEntries[randomIndex];

    // Build the URL based on word type
    const wordType = randomEntry.word_type;
    const slug = randomEntry.slug || randomEntry.phrase.toLowerCase().replace(/\s+/g, "-");
    const entryUrl = `/kamus/${wordType}/${slug}`;

    return new Response(JSON.stringify({ url: entryUrl }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching random entry:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch random entry" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};