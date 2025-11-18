import { NextRequest, NextResponse } from 'next/server'

// Mock data for demonstration
const mockPlaces = [
  {
    id: 1,
    name: "Bun Bo Hue Ba Tuyet",
    category: "Restaurant",
    address: "83 Hang Buom Street, Hoan Kiem District",
    road_address: "83 Hang Buom Street, Hoan Kiem, Hanoi",
    latitude: 21.0327,
    longitude: 105.8511,
    naver_link: "https://place.naver.com/restaurant/1234567",
    average_rating: 4.5,
    review_count: 128,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 2,
    name: "Old Quarter Coffee",
    category: "Cafe",
    address: "15 Ta Hien Street, Hoan Kiem District",
    road_address: "15 Ta Hien Street, Hoan Kiem, Hanoi",
    latitude: 21.0344,
    longitude: 105.8513,
    naver_link: "https://place.naver.com/cafe/1234568",
    average_rating: 4.2,
    review_count: 89,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 3,
    name: "Hanoi Hilton Hotel",
    category: "Hotel",
    address: "1 Le Thanh Tong Street, Hoan Kiem District",
    road_address: "1 Le Thanh Tong Street, Hoan Kiem, Hanoi",
    latitude: 21.0285,
    longitude: 105.8542,
    naver_link: "https://place.naver.com/hotel/1234569",
    average_rating: 4.8,
    review_count: 245,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 4,
    name: "Temple of Literature",
    category: "Tourist Attraction",
    address: "58 Quoc Tu Giam Street, Dong Da District",
    road_address: "58 Quoc Tu Giam Street, Dong Da, Hanoi",
    latitude: 21.0266,
    longitude: 105.8363,
    naver_link: "https://place.naver.com/tourist/1234570",
    average_rating: 4.6,
    review_count: 312,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 5,
    name: "Dong Xuan Market",
    category: "Shopping",
    address: "Dong Xuan Street, Hoan Kiem District",
    road_address: "Dong Xuan Street, Hoan Kiem, Hanoi",
    latitude: 21.0366,
    longitude: 105.8507,
    naver_link: "https://place.naver.com/shopping/1234571",
    average_rating: 4.1,
    review_count: 156,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 6,
    name: "Pho 10 Ly Quoc Su",
    category: "Restaurant",
    address: "10 Ly Quoc Su Street, Hoan Kiem District",
    road_address: "10 Ly Quoc Su Street, Hoan Kiem, Hanoi",
    latitude: 21.0309,
    longitude: 105.8520,
    naver_link: "https://place.naver.com/restaurant/1234572",
    average_rating: 4.3,
    review_count: 98,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 7,
    name: "Hoa Lo Prison Museum",
    category: "Tourist Attraction",
    address: "1 Hoa Lo Street, Hoan Kiem District",
    road_address: "1 Hoa Lo Street, Hoan Kiem, Hanoi",
    latitude: 21.0291,
    longitude: 105.8481,
    naver_link: "https://place.naver.com/museum/1234573",
    average_rating: 4.4,
    review_count: 188,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 8,
    name: "Cong Caphe",
    category: "Cafe",
    address: "27 Nguyen Thiep Street, Hoan Kiem District",
    road_address: "27 Nguyen Thiep Street, Hoan Kiem, Hanoi",
    latitude: 21.0278,
    longitude: 105.8507,
    naver_link: "https://place.naver.com/cafe/1234574",
    average_rating: 4.0,
    review_count: 67,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  }
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query } = body

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      )
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Filter places based on query
    const filteredPlaces = mockPlaces.filter(place =>
      place.name.toLowerCase().includes(query.toLowerCase()) ||
      place.category.toLowerCase().includes(query.toLowerCase()) ||
      place.address.toLowerCase().includes(query.toLowerCase())
    )

    return NextResponse.json({
      data: filteredPlaces,
      total: filteredPlaces.length,
      page: 1,
      per_page: 20
    })

  } catch (error) {
    console.error('Search places error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')
  const category = searchParams.get('category')

  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter is required' },
      { status: 400 }
    )
  }

  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))

    // Filter places based on query and category
    let filteredPlaces = mockPlaces.filter(place =>
      place.name.toLowerCase().includes(query.toLowerCase()) ||
      place.category.toLowerCase().includes(query.toLowerCase()) ||
      place.address.toLowerCase().includes(query.toLowerCase())
    )

    if (category && category !== 'all') {
      filteredPlaces = filteredPlaces.filter(place =>
        place.category.toLowerCase().includes(category.toLowerCase())
      )
    }

    return NextResponse.json({
      data: filteredPlaces,
      total: filteredPlaces.length,
      page: 1,
      per_page: 20
    })

  } catch (error) {
    console.error('Search places error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}