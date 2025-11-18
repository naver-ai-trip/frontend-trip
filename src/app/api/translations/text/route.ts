import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, source_language, target_language } = body

    // Validate required fields
    if (!text || !source_language || !target_language) {
      return NextResponse.json(
        { error: 'Missing required fields: text, source_language, target_language' },
        { status: 400 }
      )
    }

    // Forward request to backend API
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

    const response = await fetch(`${backendUrl}/translations/text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add auth headers if needed
        // 'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        text,
        source_language,
        target_language,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Backend responded with status: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Text translation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to translate text' },
      { status: 500 }
    )
  }
}