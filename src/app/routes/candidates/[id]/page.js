"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import styles from "@/app/page.module.css";

export default function CandidateDetail() {
  const [candidate, setCandidate] = useState(null);
  const router = useRouter();
  const params = useParams(); 

  useEffect(() => {
    if (!params?.id) return;

    async function fetchCandidate() {
      const res = await fetch(`/api/candidates?id=${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setCandidate(data);
      } else {
        setCandidate(null);
      }
    }
    fetchCandidate();
  }, [params]);

  if (!candidate) return <p>Loading or Candidate not found...</p>;

  return (
    <div className={styles.detailContainer}>
      <h1 className={styles.detailTitle}>{candidate.name}</h1>
      <p className={styles.detailParty}>
        <strong>Party:</strong> {candidate.party}
      </p>
      <p className={styles.detailDescription}>{candidate.description}</p>
      <img
        src={candidate.image}
        alt={candidate.name}
        width={200}
        height={200}
        className={styles.detailImage}
      />
      <Link
        href={`/routes/candidates/${candidate.id}/edit`}
        style={{ marginTop: 20, display: "inline-block" }}
      >
        Edit Candidate
      </Link>
      <br />
      <Link
        href="/"
        style={{ marginTop: 10, display: "inline-block" }}
      >
        Back to list
      </Link>
    </div>
  );
}
