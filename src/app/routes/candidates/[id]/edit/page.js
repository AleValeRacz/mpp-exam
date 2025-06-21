"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CandidateEdit({ params }) {
  const router = useRouter();
  const [candidate, setCandidate] = useState(null);
  const [name, setName] = useState("");
  const [party, setParty] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    async function fetchCandidate() {
      try {
        const res = await fetch("/api/candidates");
        const data = await res.json();
        const found = data.find((c) => c.id === params.id);
        if (found) {
          setCandidate(found);
          setName(found.name);
          setParty(found.party);
          setDescription(found.description);
          setImage(found.image);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching candidate:", error);
        setLoading(false);
      }
    }

    fetchCandidate();
  }, [params.id]);

  if (loading) return <p>Loading...</p>;
  if (!candidate) return <p>Candidate not found</p>;

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch(`/api/candidates?id=${candidate.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, party, description, image }),
      });

      if (res.ok) {
        router.push(`/routes/candidates/${candidate.id}`);
      } else {
        alert("Update failed.");
      }
    } catch (error) {
      console.error("Update error:", error);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 500, margin: "auto" }}>
      <h1>Edit Candidate</h1>
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
        Save Changes
      </button>
    </form>
  );
}
