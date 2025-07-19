import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vT4V58dzbn1kgSkIEvTyMf-YBzRzrSnYN2Yx3Qxx5z9MJff1hStXeEDxZQBDsQWmu8g_zKICtUPNWef/pub?gid=0&single=true&output=csv";

export default function Home() {
  const [data, setData] = useState([]);
  const [make, setMake] = useState("All");

  useEffect(() => {
    fetch(SHEET_CSV_URL)
      .then((res) => res.text())
      .then((text) => {
        const [headersLine, ...lines] = text.trim().split("\n");
        const headers = headersLine.split(",").map(h => h.trim());
        const parsed = lines.map(line => {
          const values = line.split(",");
          const row = {};
          headers.forEach((h, i) => (row[h] = values[i] || ""));
          return row;
        });
        setData(parsed);
      });
  }, []);

  const filtered = make === "All" ? data : data.filter(r => r.make === make);
  const makes = [...new Set(data.map(r => r.make).filter(Boolean))].sort();

  const trimCounts = {};
  filtered.forEach(row => {
    if (!row.make) return;
    trimCounts[row.make] = (trimCounts[row.make] || 0) + 1;
  });

  const chartData = {
    labels: Object.keys(trimCounts),
    datasets: [
      {
        label: "Trim Entries",
        data: Object.values(trimCounts),
        backgroundColor: "#3b82f6",
      },
    ],
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif", background: "#fff", color: "#000" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Adacko Analytics</h1>
      <label style={{ fontWeight: "bold", marginRight: "0.5rem" }}>Filter by Make:</label>
      <select
        value={make}
        onChange={(e) => setMake(e.target.value)}
        style={{ padding: "0.25rem", marginBottom: "1rem" }}
      >
        <option value="All">All</option>
        {makes.map((m) => (
          <option key={m}>{m}</option>
        ))}
      </select>

      <div style={{ maxWidth: "1000px", marginBottom: "2rem" }}>
        <Bar data={chartData} />
      </div>

      <h2 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>Live Fitment Data</h2>
      <div style={{ maxHeight: "400px", overflow: "auto", border: "1px solid #ccc" }}>
        <table style={{ width: "100%", fontSize: "0.9rem", borderCollapse: "collapse" }}>
          <thead style={{ background: "#f9f9f9", position: "sticky", top: 0 }}>
            <tr>
              <th style={{ padding: "6px", border: "1px solid #ddd" }}>Year</th>
              <th style={{ padding: "6px", border: "1px solid #ddd" }}>Make</th>
              <th style={{ padding: "6px", border: "1px solid #ddd" }}>Model</th>
              <th style={{ padding: "6px", border: "1px solid #ddd" }}>Trim</th>
              <th style={{ padding: "6px", border: "1px solid #ddd" }}>Bolt Pattern</th>
              <th style={{ padding: "6px", border: "1px solid #ddd" }}>Wheel Size (Front)</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 100).map((row, idx) => (
              <tr key={idx}>
                <td style={{ padding: "6px", border: "1px solid #ddd" }}>{row.year}</td>
                <td style={{ padding: "6px", border: "1px solid #ddd" }}>{row.make}</td>
                <td style={{ padding: "6px", border: "1px solid #ddd" }}>{row.model}</td>
                <td style={{ padding: "6px", border: "1px solid #ddd" }}>{row.trim}</td>
                <td style={{ padding: "6px", border: "1px solid #ddd" }}>{row.bolt_pattern}</td>
                <td style={{ padding: "6px", border: "1px solid #ddd" }}>{row.wheel_size_front}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}