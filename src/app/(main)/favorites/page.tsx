'use client'
import { favoritesService } from '@/services/favorites-service'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, MapPin, Trash2, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from '@/components/ui/empty'
import Image from 'next/image'

interface Place {
  id: number
  name: string
  category: string
  address: string
  road_address: string
  latitude: number
  longitude: number
  naver_link: string
  created_at: string
  updated_at: string
}

interface Favorite {
  id: number
  user_id: number
  favoritable_type: string
  favoritable_id: number
  created_at: string
  updated_at: string
  favoritable: Place
}

const FavoritesPage = () => {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const res = await favoritesService.getFavorites();
      return res;
    },
  })

  const deleteFavoriteMutation = useMutation({
    mutationFn: async (favoriteId: number) => {
      await favoritesService.removeFavorite(favoriteId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
      toast.success('Removed from favorites')
    },
    onError: () => {
      toast.error('Failed to remove favorite')
    }
  })

  const favorites = (data as unknown as Favorite[]) || []

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading favorites...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8 pt-24">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">My Favorites</h1>
          </div>
          <p className="text-muted-foreground">
            Places you&apos;ve saved for your next adventure
          </p>
        </div>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite: Favorite) => (
              <Card key={favorite.id} className="group py-0 hover:shadow-xl transition-all duration-300 overflow-hidden">
                <CardContent className="p-0">
                  {/* Image */}
                  <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary/5 overflow-hidden">
                    <Image
                      src="https://mycayseouly.vn/Images/image/mycay/Kimbap.jpg"
                      alt={favorite.favoritable.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {/* Favorite Badge */}
                    <div className="absolute top-3 right-3">
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8 rounded-full shadow-lg"
                        onClick={() => deleteFavoriteMutation.mutate(favorite.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="mb-3">
                      <h3 className="font-semibold text-lg line-clamp-1 mb-2">
                        {favorite.favoritable.name}
                      </h3>
                      <Badge variant="secondary" className="mb-2">
                        {favorite.favoritable.category}
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{favorite.favoritable.address}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          window.open(
                            `https://map.naver.com/p/search/${encodeURIComponent(favorite.favoritable.name)}`,
                            '_blank'
                          )
                        }}
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        View on Map
                      </Button>
                      {favorite.favoritable.naver_link && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => window.open(favorite.favoritable.naver_link, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
                      Saved on {new Date(favorite.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Empty className="h-[60vh]">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Heart className="h-16 w-16 text-muted-foreground" />
              </EmptyMedia>
              <EmptyTitle>No favorites yet</EmptyTitle>
              <EmptyDescription>
                Start exploring and save your favorite places to see them here
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </div>
    </div>
  )
}

export default FavoritesPage