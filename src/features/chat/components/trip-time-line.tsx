import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Card } from '@/components/ui/card'
import { Building2, Car, FerrisWheel, MapPinHouse, Plane, Utensils } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

interface TimelineItem {
  id: string
  type: 'flight' | 'transfer' | 'city' | 'accommodation' | 'restaurant' | 'attraction'
  title: string
  description?: string
  image?: string
  details?: {
    duration?: string
    route?: string
    price?: string
    rating?: number
    reviewCount?: number
    address?: string
  }
}

interface DaySchedule {
  date: string
  title: string
  items: TimelineItem[]
}

const DUMMY_DATA: DaySchedule[] = [
  {
    date: 'Dec 10',
    title: 'Ngày đầu thư giãn và làm quen tại Paris',
    items: [
      {
        id: '1',
        type: 'flight',
        title: 'Bay đến Paris',
        description: 'Khởi hành lúc 08:30 từ TP.HCM đến sân bay Charles De Gaulle, Paris.',
        image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800&h=600&fit=crop',
        details: { duration: '13h', route: 'SGN → CDG', price: '890 USD' },
      },
      {
        id: '2',
        type: 'transfer',
        title: 'Từ sân bay đến khách sạn',
        description: 'Đón taxi về trung tâm thành phố, dọc đường ngắm tháp Eiffel từ xa.',
        image: 'https://images.unsplash.com/photo-1524041255072-7da0525d6b34?w=800&h=600&fit=crop',
        details: { duration: '45 phút', price: '40 EUR' },
      },
      {
        id: '3',
        type: 'accommodation',
        title: 'Khách sạn Le Meurice',
        description: 'Khách sạn 5 sao cổ điển, nhìn ra vườn Tuileries.',
        image: 'https://images.unsplash.com/photo-1560067174-894d3a0e0a0c?w=800&h=600&fit=crop',
        details: { rating: 4.7, reviewCount: 1350, price: '320 EUR/đêm' },
      },
      {
        id: '4',
        type: 'city',
        title: 'Dạo phố Champs-Élysées',
        description: 'Tản bộ, mua sắm và thưởng thức café ngoài trời.',
        image: 'https://images.unsplash.com/photo-1560067174-894d3a0e0a0c?w=800&h=600&fit=crop',
        details: { duration: '3 tiếng' },
      },
      {
        id: '5',
        type: 'restaurant',
        title: 'Ăn tối tại Le Jules Verne',
        description: 'Nhà hàng cao cấp trên tháp Eiffel.',
        image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0f?w=800&h=600&fit=crop',
        details: { rating: 4.8, reviewCount: 980, price: '150 EUR/người' },
      },
    ],
  },
  {
    date: 'Dec 11',
    title: 'Khám phá Tokyo – Shinjuku và Asakusa',
    items: [
      {
        id: '6',
        type: 'attraction',
        title: 'Shinjuku Gyoen Garden',
        description: 'Vườn Nhật cổ điển giữa trung tâm Tokyo.',
        image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&h=600&fit=crop',
        details: { rating: 4.6, duration: '2 tiếng' },
      },
      {
        id: '7',
        type: 'restaurant',
        title: 'Ichiran Ramen',
        description: 'Thưởng thức mì ramen nổi tiếng tại Shinjuku.',
        image: 'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=800&h=600&fit=crop',
        details: { rating: 4.5, price: '12 USD/người' },
      },
      {
        id: '8',
        type: 'attraction',
        title: 'Senso-ji Temple (Asakusa)',
        description: 'Ngôi chùa cổ kính và biểu tượng văn hóa của Tokyo.',
        image: 'https://images.unsplash.com/photo-1604112900927-e4d5b22ae3e1?w=800&h=600&fit=crop',
        details: { rating: 4.7 },
      },
    ],
  },
  {
    date: 'Dec 12',
    title: 'Khám phá thiên nhiên Kyoto',
    items: [
      {
        id: '9',
        type: 'transfer',
        title: 'Di chuyển đến Kyoto bằng Shinkansen',
        description: 'Tàu cao tốc từ Tokyo đến Kyoto trong 2 giờ 30 phút.',
        image: 'https://images.unsplash.com/photo-1570475735025-6e1e6dd37b94?w=800&h=600&fit=crop',
        details: { duration: '2h30', price: '130 USD' },
      },
      {
        id: '10',
        type: 'attraction',
        title: 'Rừng tre Arashiyama',
        description: 'Đi bộ giữa rừng tre xanh mát – điểm đến không thể bỏ lỡ.',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=600&fit=crop',
        details: { rating: 4.9, duration: '2 tiếng' },
      },
      {
        id: '11',
        type: 'restaurant',
        title: 'Ăn trưa Kaiseki',
        description: 'Trải nghiệm ẩm thực truyền thống Nhật Bản nhiều món.',
        image: 'https://images.unsplash.com/photo-1600891963933-96053a9b7ab2?w=800&h=600&fit=crop',
        details: { rating: 4.8, price: '80 USD/người' },
      },
      {
        id: '12',
        type: 'attraction',
        title: 'Đền Fushimi Inari',
        description: 'Cổng Torii đỏ trải dài lên núi – biểu tượng nổi tiếng của Kyoto.',
        image: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=800&h=600&fit=crop',
        details: { rating: 4.8, duration: '3 tiếng' },
      },
    ],
  },
  {
    date: 'Dec 13',
    title: 'Ngày nghỉ dưỡng ở Santorini',
    items: [
      {
        id: '13',
        type: 'flight',
        title: 'Bay đến Hy Lạp',
        description: 'Chuyến bay từ Tokyo đến Athens và tiếp tục đến Santorini.',
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop',
        details: { duration: '11h', route: 'HND → ATH → JTR' },
      },
      {
        id: '14',
        type: 'accommodation',
        title: 'Khách sạn Canaves Oia Suites',
        description: 'View nhìn ra biển Aegean và hồ bơi vô cực tuyệt đẹp.',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
        details: { rating: 4.9, price: '450 EUR/đêm' },
      },
      {
        id: '15',
        type: 'attraction',
        title: 'Hoàng hôn tại Oia',
        description: 'Ngắm hoàng hôn lãng mạn trên vách đá Santorini.',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
        details: { duration: '1.5 tiếng' },
      },
      {
        id: '16',
        type: 'restaurant',
        title: 'Ăn tối ven biển Ammoudi Bay',
        description: 'Thưởng thức hải sản tươi ngon cùng rượu vang Hy Lạp.',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop',
        details: { rating: 4.7, price: '70 EUR/người' },
      },
    ],
  },
];

interface TripTimeLineProps {
  handleChangeView?: (view: 'overview' | 'booking' | 'custom') => void
}


export const TripTimeLine = ({ handleChangeView }: TripTimeLineProps) => {
  return (
    <div className="trip-timeline w-full space-y-4">
      <Accordion
        type="multiple"
        className="w-full"
        defaultValue={['item-0']}
      >
        {DUMMY_DATA.map((day, dayIndex) => (
          <AccordionItem key={dayIndex} value={`item-${dayIndex}`} className="border rounded-lg mb-4">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center gap-3 text-left">
                <span className="font-semibold text-blue-600">{day.date}</span>
                <span className="text-gray-700">{day.title}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="mt-2 space-y-4">
                {day.items.map((item, itemIndex) => (
                  <div key={item.id} className="flex gap-4" onClick={() => handleChangeView && handleChangeView("booking")}>
                    <div className="flex flex-col items-center">
                      <div className="w-10 min-h-10 rounded-full bg-primary flex items-center justify-center text-white text-xl">
                        {getIconForType(item.type)}
                      </div>
                      {itemIndex < day.items.length - 1 && (
                        <div className="w-0.5 h-full min-h-[60px] bg-gray-300 my-2" />
                      )}
                    </div>
                    <Card className="flex-1 p-2">
                      <div className="flex items-start gap-3">
                        {item.image && (
                          <Image
                            width={100}
                            height={100}
                            src={item.image}
                            alt={item.title}
                            className="aspect-square rounded object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{item.title}</h3>
                          {item.description && (
                            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                          )}

                          {item.details && (
                            <div className="mt-2 space-y-1 text-sm text-gray-700">
                              {item.details.duration && (
                                <p className="flex items-center gap-2">
                                  <span>⏱️</span>
                                  <span>{item.details.duration}</span>
                                  {item.details.route && <span className="ml-2">• {item.details.route}</span>}
                                </p>
                              )}
                              {item.details.price && (
                                <p className="text-blue-600 font-medium">{item.details.price}</p>
                              )}
                              {item.details.rating && (
                                <p className="flex items-center gap-1">
                                  <span>⭐</span>
                                  <span>{item.details.rating}</span>
                                  {item.details.reviewCount && (
                                    <span className="text-gray-500">({item.details.reviewCount.toLocaleString()} reviews)</span>
                                  )}
                                </p>
                              )}
                              {item.details.address && (
                                <p className="text-gray-600">📍 {item.details.address}</p>
                              )}
                            </div>
                          )}
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">⋯</button>
                      </div>
                    </Card>
                  </div>
                ))}

                {dayIndex === 0 && (
                  <button className="ml-14 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    + Add
                  </button>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

const getIconForType = (type: TimelineItem['type']) => {
  const icons = {
    flight: <Plane className='size-5' />,
    transfer: <Car className='size-5' />,
    city: <Building2 className='size-5' />,
    accommodation: <MapPinHouse className='size-5' />,
    restaurant: <Utensils className='size-5' />,
    attraction: <FerrisWheel className='size-5' />
  }
  return icons[type] || '📍'
}
