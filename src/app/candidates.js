"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const CandidatesContext = createContext();

const STORAGE_KEY = "candidates_data";

const initialCandidates = [
  {
    id: "1",
    name: "John Doe",
    party: "Party A",
    description: "Experienced politician",
    image: "https://media.istockphoto.com/id/175523696/photo/confident-african-american-female-executive-isolated.jpg?s=612x612&w=0&k=20&c=PpnhVPU49-5cj43UGBWt5aQjgWJAZw2jbMDJY8wXln0=",
  },
  {
    id: "2",
    name: "Jane Smith",
    party: "Party B",
    description: "Community leader",
    image: "https://media.istockphoto.com/id/175523696/photo/confident-african-american-female-executive-isolated.jpg?s=612x612&w=0&k=20&c=PpnhVPU49-5cj43UGBWt5aQjgWJAZw2jbMDJY8wXln0=",
  },
];

export function CandidatesProvider({ children }) {
  // Load from localStorage or fallback
  const [candidates, setCandidates] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : initialCandidates;
    }
    return initialCandidates;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(candidates));
    }
  }, [candidates]);

  function addCandidate(candidate) {
    setCandidates((cands) => [...cands, candidate]);
  }

  function updateCandidate(id, updatedData) {
    setCandidates((cands) =>
      cands.map((c) => (c.id === id ? { ...c, ...updatedData } : c))
    );
  }

  function deleteCandidate(id) {
    setCandidates((cands) => cands.filter((c) => c.id !== id));
  }

  function getCandidate(id) {
    return candidates.find((c) => c.id === id);
  }

  return (
    <CandidatesContext.Provider
      value={{ candidates, addCandidate, updateCandidate, deleteCandidate, getCandidate }}
    >
      {children}
    </CandidatesContext.Provider>
  );
}

export function useCandidates() {
  const context = useContext(CandidatesContext);
  if (!context) {
    throw new Error("useCandidates must be used within CandidatesProvider");
  }
  return context;
}
