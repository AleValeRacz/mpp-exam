"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddCandidate() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [party, setParty] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch("/api/candidates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, party, description, image }),
      });

      if (res.ok) {
        const newCandidate = await res.json();
        router.push(`/routes/candidates/${newCandidate.id}`);
      } else {
        alert("Failed to add candidate.");
      }
    } catch (error) {
      console.error("Error adding candidate:", error);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 500, margin: "auto" }}>
      <h1>Add Candidate</h1>
      <label>
        Name: <br />
        <input value={name} onChange={(e) => setName(e.target.value)} required />
      </label>
      <br />
      <label>
        Party: <br />
        <input value={party} onChange={(e) => setParty(e.target.value)} required />
      </label>
      <br />
      <label>
        Description: <br />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
        />
      </label>
      <br />
      <label>
        Image URL: <br />
        <input value={image} onChange={(e) => setImage(e.target.value)} required />
      </label>
      <br />
      <button type="submit" style={{ marginTop: 10 }}>
        Add Candidate
      </button>
    </form>
  );
}
