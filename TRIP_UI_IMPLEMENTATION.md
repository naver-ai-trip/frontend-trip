# Trip Itinerary UI Implementation

## Overview

Implemented a comprehensive travel itinerary planning interface based on the provided design mockup. The UI allows users to:

- View their trip on a map
- Organize activities by day with a timeline view
- Drag and drop unscheduled places into the itinerary
- Search for places, restaurants, or hotels

## Features Implemented

### 1. **Map View (Left Panel)**

- Toggle between Map View and List View
- Visual map placeholder with grid pattern
- Animated location markers
- Displays trip destination city

### 2. **Day Timeline (Right Panel)**

- Day tabs for multi-day trips
- Timeline-based schedule with times
- Activity cards showing:
  - Activity title
  - Description
  - Time range
  - Placeholder images
- Empty state with drop zone for new activities

### 3. **Unscheduled Places (Bottom Left)**

- List of places not yet scheduled
- Each place shows:
  - Name
  - Category/Address
  - Placeholder image
- Drag and drop enabled
- Count badge showing number of unscheduled items

### 4. **Search Functionality**

- Search bar at the top
- Placeholder for searching places, restaurants, or hotels
- Ready for API integration

### 5. **Drag and Drop**

- Drag places from unscheduled list
- Drop into day timeline
- Visual feedback during drag
- Add button as alternative to drag & drop

## Technical Stack

- **Framework**: Next.js 15 with App Router
- **State Management**: React Query (@tanstack/react-query)
- **UI Components**: Shadcn/ui
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Notifications**: Sonner

## File Structure

```
src/app/(main)/trip/[tripId]/
└── page.tsx          # Main trip detail page with full UI
```

## Component Structure

```tsx
TripDetail
├── Search Bar
├── Left Panel
│   ├── View Toggle (Map/List)
│   ├── Map View
│   └── Unscheduled Places List
└── Right Panel
    ├── Day Tabs
    └── Timeline Schedule
        ├── Time Slots
        └── Activity Cards
```

## Data Interfaces

```typescript
interface Trip {
  id: number;
  title: string;
  destination_country: string;
  destination_city: string;
  start_date: string;
  end_date: string;
  duration_days: number | null;
  // ... other fields
}

interface Place {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  category: string;
  rating: number;
  // ... other fields
}

interface Itinerary {
  id: number;
  trip_id: number;
  title: string;
  day_number: number;
  start_time: string;
  end_time: string;
  place_id: number;
  description: string;
}
```

## Mock Data

Currently using mock data for demonstration:

- 3 unscheduled places (Shibuya Crossing, Ghibli Museum, Ichiran Ramen)
- 2 scheduled activities for Day 1 (Senso-ji Temple, Lunch)

## API Integration Points

The following functions are marked with TODO and ready for API integration:

1. **Fetch Itineraries**

   ```typescript
   queryKey: ["itineraries", tripId];
   // TODO: Replace with actual API call
   ```

2. **Add to Itinerary**

   ```typescript
   addToItineraryMutation;
   // TODO: Replace with actual API call
   ```

3. **Search Places**
   - Search input state ready
   - Needs API endpoint for place search

## Styling Features

- **Responsive Layout**: Full-screen layout with proper overflow handling
- **Dark Mode Support**: All components support theme switching
- **Smooth Transitions**: Hover effects and animations
- **Grid Pattern**: SVG-based grid for map background
- **Color System**: Uses Tailwind's design tokens for consistency

## User Interactions

1. **View Toggle**: Click Map View or List View tabs
2. **Select Day**: Click on day tabs to view that day's schedule
3. **Drag Place**: Click and hold on unscheduled place, drag to timeline
4. **Drop Place**: Release on drop zone to add to schedule
5. **Add Activity**: Click "Add Activity" button as alternative
6. **Search**: Type in search bar (ready for API integration)

## Next Steps

To complete the implementation:

1. **Map Integration**:
   - Integrate with a map library (Google Maps, Mapbox, etc.)
   - Display actual location markers
   - Show routes between locations

2. **API Integration**:
   - Connect to backend endpoints for itineraries
   - Implement place search API
   - Add/update/delete itinerary items

3. **Real Images**:
   - Replace placeholder images with actual place photos
   - Use Naver Place API for images

4. **Enhanced Features**:
   - Time picker for activities
   - Edit activity details
   - Delete activities
   - Reorder activities within a day
   - Share itinerary

5. **Optimization**:
   - Add loading states
   - Error handling
   - Optimistic updates
   - Skeleton loaders

## Running the Application

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Navigate to a trip detail page
# http://localhost:3000/trip/[tripId]
```

## Notes

- The UI matches the provided design mockup
- All components are TypeScript typed
- Follows Next.js 15 best practices
- Uses React Query for data fetching
- Ready for production with proper API integration
