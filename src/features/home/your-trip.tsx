import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CakeSlice, Calendar, Home, Share } from 'lucide-react'
import Link from 'next/link'



export const YourTrip = () => {
  return (
    <Card className='p-6' >
      <div className='flex justify-between'>
        <div className='space-y-3'>
          <div className='text-rose-600 font-semibold'>Your Trip to Ha Noi</div>
          <h2 className='text-3xl font-semibold'>Ready for your adventure, Cuong!</h2>
          <p className='text-muted-foreground'>Here`s a quick look at what you`ve go planned. Use your travel tools for a seamless experience in Korea</p>
          <div className='space-x-3'>
            <Link prefetch href={"/chat"}>
              <Button className='' size={'lg'}>
                <Calendar className='mr-2 h-4 w-4' />
                <span>View Full Itinerary</span>
              </Button>
            </Link>
            <Button variant={'outline'} size={'lg'}>
              <Share className='mr-2 h-4 w-4' />
              <span>Share Trip</span>
            </Button>
          </div>
        </div>
        <div className='rounded-lg px-6 py-4 bg-secondary'>
          <div className='font-semibold text-lg'>Up Next</div>
          <div className='mt-3 space-y-3'>
            <div className='flex gap-2'>
              <div className='p-3 bg-white rounded-lg'>
                <CakeSlice className='h-6 w-6 text-rose-600' />
              </div>
              <div className='mt-2'>
                <div className='font-semibold'>Dinner at La Vong Restaurant</div>
                <div className='text-sm text-muted-foreground'>Today, 7:00 PM</div>
              </div>
            </div>
            <div className='flex gap-2'>
              <div className='p-3 bg-white rounded-lg'>
                <Home className='h-6 w-6 text-rose-600' />
              </div>
              <div className='mt-2'>
                <div className='font-semibold'>Visit Ho Hoan Kiem </div>
                <div className='text-sm text-muted-foreground'>Today, 9:00 PM</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
