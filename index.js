import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Legend, Tooltip } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Legend, Tooltip);

export default function FitmentDashboard() {
  const [data, setData] = useState([]);
  const [makeFilter, setMakeFilter] = useState("All");

  useEffect(() => {
    fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vSAMPLE1234567890/pub?output=csv")
      .then((res) => res.text())
      .then((csv) => {
        const [headerLine, ...lines] = csv.trim().split("\n");
        const headers = headerLine.split(",");
        const parsedData = lines.map(line => {
          const values = line.split(",");
          const row = {};
          headers.forEach((h, i) => row[h.trim()] = values[i]?.trim());
          return row;
        });
        setData(parsedData);
      });
  }, []);

  const makes = [...new Set(data.map((row) => row.make))].sort();
  const filteredData = makeFilter === "All" ? data : data.filter(row => row.make === makeFilter);

  const makeCounts = {};
  filteredData.forEach(row => {
    const make = row.make;
    makeCounts[make] = makeCounts[make] || { trim: 0, model: new Set() };
    makeCounts[make].trim += 1;
    makeCounts[make].model.add(row.model);
  });

  const chartData = {
    labels: Object.keys(makeCounts),
    datasets: [
      {
        label: "Trim Entries",
        data: Object.values(makeCounts).map(m => m.trim),
        backgroundColor: "#3B82F6"
      },
      {
        label: "Unique Models",
        data: Object.values(makeCounts).map(m => m.model.size),
        backgroundColor: "#10B981"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-white text-black p-8">
      <h1 className="text-3xl font-bold mb-4">Adacko Analytics</h1>
      <div className="mb-6">
        <label htmlFor="make" className="mr-2">Filter by Make</label>
        <select
          id="make"
          value={makeFilter}
          onChange={(e) => setMakeFilter(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="All">All</option>
          {makes.map(make => <option key={make}>{make}</option>)}
        </select>
      </div>
      <div className="bg-white rounded-lg shadow p-4 mb-8">
        <Bar data={chartData} />
      </div>
      <h2 className="text-xl font-semibold mb-2">📄 Live Fitment Data Table</h2>
      <div className="overflow-auto max-h-96 border rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="px-2 py-1 text-left">Year</th>
              <th className="px-2 py-1 text-left">Make</th>
              <th className="px-2 py-1 text-left">Model</th>
              <th className="px-2 py-1 text-left">Trim</th>
              <th className="px-2 py-1 text-left">Bolt Pattern</th>
              <th className="px-2 py-1 text-left">Wheel Size (Front)</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.slice(0, 100).map((row, idx) => (
              <tr key={idx} className="even:bg-gray-50">
                <td className="px-2 py-1">{row.year}</td>
                <td className="px-2 py-1">{row.make}</td>
                <td className="px-2 py-1">{row.model}</td>
                <td className="px-2 py-1">{row.trim}</td>
                <td className="px-2 py-1">{row.bolt_pattern}</td>
                <td className="px-2 py-1">{row.wheel_size_front}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
