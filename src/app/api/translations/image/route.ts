import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get('image') as File
    const targetLanguage = formData.get('target_language') as string

    // Validate required fields
    if (!image || !targetLanguage) {
      return NextResponse.json(
        { error: 'Missing required fields: image, target_language' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!image.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload an image.' },
        { status: 400 }
      )
    }

    // Forward request to backend API
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

    // Create new FormData for backend request
    const backendFormData = new FormData()
    backendFormData.append('image', image)
    backendFormData.append('target_language', targetLanguage)

    const response = await fetch(`${backendUrl}/translations/image`, {
      method: 'POST',
      headers: {
        // Don't set Content-Type for FormData, let the browser set it with boundary
        // Add auth headers if needed
        // 'Authorization': `Bearer ${token}`,
      },
      body: backendFormData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Backend responded with status: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Image translation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to translate image' },
      { status: 500 }
    )
  }
}