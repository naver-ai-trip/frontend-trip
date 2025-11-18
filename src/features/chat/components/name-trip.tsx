import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Download, PanelLeftClose, Share, ShoppingCart } from 'lucide-react'

export const NameTrip = ({ handleOpen }: { handleOpen: () => void }) => {
  return (
    <Card className='w-full h-full py-4'>
      <CardHeader>
        <div className='flex justify-between items-center'>
          <div onClick={handleOpen}>
            <PanelLeftClose />
          </div>
          <div className='flex justify-end gap-3'>
            <Button variant={'secondary'}>
              <Download />
            </Button>
            <Button variant={'secondary'}>
              <Share />
            </Button>
            <Button variant={'default'}>
              <ShoppingCart />
              <div>Review & Book ($98.876)</div>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-medium'>5 Ngày Khám Phá Văn Hóa và Ẩm Thực Tokyo</div>
      </CardContent>
    </Card>
  )
}
