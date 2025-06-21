let candidates = [
  {
    id: "1",
    name: "Alice",
    party: "Independent",
    description: "Experienced politician",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    id: "2",
    name: "Bob",
    party: "Democrat",
    description: "Community leader",
    image: "https://randomuser.me/api/portraits/men/75.jpg",
  },
];



import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    const candidate = candidates.find((c) => c.id === id);
    if (candidate) {
      return NextResponse.json(candidate);
    } else {
      return new NextResponse("Candidate not found", { status: 404 });
    }
  }

  return NextResponse.json(candidates);
}

export async function PUT(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const updatedData = await request.json();

  candidates = candidates.map((c) => (c.id === id ? { ...c, ...updatedData } : c));
  const updatedCandidate = candidates.find((c) => c.id === id);

  if (!updatedCandidate) {
    return new NextResponse("Candidate not found", { status: 404 });
  }

  return NextResponse.json(updatedCandidate);
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  const lengthBefore = candidates.length;
  candidates = candidates.filter((c) => c.id !== id);

  if (candidates.length === lengthBefore) {
    return new NextResponse("Candidate not found", { status: 404 });
  }

  return NextResponse.json({ message: "Deleted" });
}

export async function POST(request) {
  const newCandidate = await request.json();
  const id = uuidv4();
  const candidate = { id, ...newCandidate };
  candidates.push(candidate);
  return NextResponse.json(candidate, { status: 201 });
}
