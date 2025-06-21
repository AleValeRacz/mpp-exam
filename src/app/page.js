"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import styles from "@/app/page.module.css";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useCandidateStream } from "@/app/useCandidateStream";

const PARTY_COLORS = {
  Independent: "#8884d8",
  Democrat: "#82ca9d",
  Republican: "#ff7f7f",
  Other: "#ffc658",
};

export default function Home() {
  const [candidates, setCandidates] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch candidates from backend API on mount
  useEffect(() => {
    async function fetchCandidates() {
      const res = await fetch("/api/candidates");
      if (res.ok) {
        const data = await res.json();
        setCandidates(data);
      }
    }
    fetchCandidates();
  }, []);

  // Add candidate via API and update state
  async function addCandidate(candidate) {
    const res = await fetch("/api/candidates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(candidate),
    });
    if (res.ok) {
      const newCandidate = await res.json();
      setCandidates((prev) => [...prev, newCandidate]);
    }
  }

  // Delete candidate via API and update state
  async function deleteCandidate(id) {
    const res = await fetch(`/api/candidates?id=${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setCandidates((prev) => prev.filter((c) => c.id !== id));
    }
  }

  // Handle new candidate from websocket: add to API + local state
  const handleNewCandidate = useCallback(
    (candidate) => {
      addCandidate(candidate);
    },
    [] // no dependencies, addCandidate is stable here
  );

  // Start/stop websocket stream based on isGenerating toggle
  useCandidateStream(isGenerating, handleNewCandidate);

  // Prepare pie chart data
  const partyCounts = candidates.reduce((acc, c) => {
    acc[c.party] = (acc[c.party] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(partyCounts).map(([party, count]) => ({
    name: party,
    value: count,
  }));

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Election Candidates</h1>

      <button
        onClick={() => setIsGenerating((prev) => !prev)}
        style={{ marginBottom: 20 }}
      >
        {isGenerating ? "Stop Auto-Generation" : "Start Auto-Generation"}
      </button>

        <Link href="/routes/add" passHref>
    <button >
      Add Candidate
    </button>
    </Link>

      <ul className={styles.list}>
        {candidates.map((candidate) => (
          <li
            key={candidate.id}
            className={styles.listItem}
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            <Link
              href={`/routes/candidates/${candidate.id}`}
              style={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                color: "inherit",
                flexGrow: 1,
              }}
            >
              <img
                src={candidate.image}
                alt={candidate.name}
                width={50}
                height={50}
                style={{ borderRadius: "50%", objectFit: "cover" }}
              />
              <span style={{ marginLeft: 10 }}>
                {candidate.name} - {candidate.party}
              </span>
            </Link>

            <button
              onClick={() => deleteCandidate(candidate.id)}
              style={{ marginLeft: 10, color: "red", cursor: "pointer" }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <h2>Party Distribution</h2>
      <PieChart width={400} height={300}>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          label
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={PARTY_COLORS[entry.name] || "#8884d8"}
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}
