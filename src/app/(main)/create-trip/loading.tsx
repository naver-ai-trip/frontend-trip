import React from 'react'

const Loading = () => {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
    </div>
  )
}

export default Loading
