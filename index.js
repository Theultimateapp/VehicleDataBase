import { useEffect, useState } from "react";

export default function Home() {
  const [rows, setRows] = useState([]);
  const [make, setMake] = useState("All");

  useEffect(() => {
    fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vT4V58dzbn1kgSkIEvTyMf-YBzRzrSnYN2Yx3Qxx5z9MJff1hStXeEDxZQBDsQWmu8g_zKICtUPNWef/pub?output=csv")
      .then((res) => res.text())
      .then((text) => {
        const lines = text.trim().split("\n");
        const headers = lines[0].split(",");
        const data = lines.slice(1).map((line) => {
          const values = line.split(",");
          const row = {};
          headers.forEach((h, i) => {
            row[h.trim()] = values[i]?.trim() || "";
          });
          return row;
        });
        setRows(data);
      });
  }, []);

  const makes = [...new Set(rows.map((r) => r.make))].filter(Boolean).sort();
  const filtered = make === "All" ? rows : rows.filter((r) => r.make === make);

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif", background: "#fff" }}>
      <h1 style={{ fontSize: "1.75rem", fontWeight: "bold" }}>Adacko Analytics (LIVE)</h1>
      <label style={{ marginRight: "0.5rem" }}>Filter by Make:</label>
      <select value={make} onChange={(e) => setMake(e.target.value)}>
        <option value="All">All</option>
        {makes.map((m) => (
          <option key={m}>{m}</option>
        ))}
      </select>

      <div style={{ marginTop: "2rem", maxHeight: "400px", overflow: "auto", border: "1px solid #ccc" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
          <thead style={{ background: "#f0f0f0" }}>
            <tr>
              <th style={{ padding: "6px", border: "1px solid #ddd" }}>Year</th>
              <th style={{ padding: "6px", border: "1px solid #ddd" }}>Make</th>
              <th style={{ padding: "6px", border: "1px solid #ddd" }}>Model</th>
              <th style={{ padding: "6px", border: "1px solid #ddd" }}>Trim</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 100).map((r, i) => (
              <tr key={i}>
                <td style={{ padding: "6px", border: "1px solid #ddd" }}>{r.year}</td>
                <td style={{ padding: "6px", border: "1px solid #ddd" }}>{r.make}</td>
                <td style={{ padding: "6px", border: "1px solid #ddd" }}>{r.model}</td>
                <td style={{ padding: "6px", border: "1px solid #ddd" }}>{r.trim}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
