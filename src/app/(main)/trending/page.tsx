// import { CardItem } from '@/components/card-item'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TrendingPage() {
  return (
    <div className="container mx-auto mt-24 text-center">
      <h1 className="mb-2 text-4xl font-bold">{`What's Trending in Korea`}</h1>
      <p className="text-muted-foreground text-lg">
        Discover the latest buzz in food, culture, and shopping straight from thr streets of South
        Korea.
      </p>
      <div className="mt-10 flex justify-center">
        <Tabs defaultValue="all" className="">
          <TabsList className="mb-4 flex gap-4 bg-transparent">
            <TabsTrigger
              className="bg-secondary data-[state=active]:bg-primary cursor-pointer rounded-full p-4 text-base data-[state=active]:text-white"
              value="all"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              className="bg-secondary data-[state=active]:bg-primary cursor-pointer rounded-full p-4 text-base data-[state=active]:text-white"
              value="food"
            >
              Food
            </TabsTrigger>
            <TabsTrigger
              className="bg-secondary data-[state=active]:bg-primary cursor-pointer rounded-full p-4 text-base data-[state=active]:text-white"
              value="cafe"
            >
              Cafe
            </TabsTrigger>
            <TabsTrigger
              className="bg-secondary data-[state=active]:bg-primary cursor-pointer rounded-full p-4 text-base data-[state=active]:text-white"
              value="shopping"
            >
              Shopping
            </TabsTrigger>
            <TabsTrigger
              className="bg-secondary data-[state=active]:bg-primary cursor-pointer rounded-full p-4 text-base data-[state=active]:text-white"
              value="location"
            >
              Location
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <div className="grid grid-cols-5 gap-6">
              {/* <CardItem  place={}/>
              <CardItem />
              <CardItem />
              <CardItem />
              <CardItem /> */}
            </div>
          </TabsContent>
          <TabsContent value="food">
            <div className="grid grid-cols-5 gap-6">
              {/* <CardItem />
              <CardItem /> */}
            </div>
          </TabsContent>
          <TabsContent value="cafe">
            <div className="grid grid-cols-5 gap-6">
              {/* <CardItem />
              <CardItem />
              <CardItem /> */}
            </div>
          </TabsContent>
          <TabsContent value="shopping">
            <div className="grid grid-cols-5 gap-6">
              {/* <CardItem />
              <CardItem />
              <CardItem /> */}
            </div>
          </TabsContent>
          <TabsContent value="location">
            <div className="grid grid-cols-5 gap-6">
              {/* <CardItem />
              <CardItem />
              <CardItem />
              <CardItem />
              <CardItem /> */}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
