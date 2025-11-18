import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Forward request to backend API
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

    const response = await fetch(`${backendUrl}/translations`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Add auth headers if needed
        // 'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Translation history fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch translation history" }, { status: 500 });
  }
}
