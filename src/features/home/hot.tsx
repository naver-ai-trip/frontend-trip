import { CardItem } from '@/components/card-item'
import { favoritesService } from '@/services/favorites-service';
import { PlaceDatum } from '@/services/places-service';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const Hot = ({ places }: { places?: PlaceDatum[] }) => {
  const addFavorites = useMutation({
    mutationFn: async (placeId: number) => {
      toast.loading('Adding to favorites...');
      const res = await favoritesService.addFavorite({
        favoritable_type: 'place',
        favoritable_id: placeId,
      });
      return res;
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success('Added to favorites!');
      console.log('Place added to favorites successfully');
    },
    onError: (error) => {
      toast.dismiss();
      toast.error('Failed to add to favorites.');
      console.error('Error adding place to favorites:', error);
    }
  });
  return (
    <div className='mt-8'>
      <div className='text-2xl font-semibold mb-2'>Hot places</div>
      <div className='grid  xl:grid-cols-4 lg:grid-cols-3 grid-cols-2 gap-6'>
        {places && places?.slice(0, 4).map((place: PlaceDatum) => (
          <CardItem key={place.id} place={place} handleAddToFavorite={addFavorites.mutate} />
        ))}
      </div>
    </div>
  )
}
