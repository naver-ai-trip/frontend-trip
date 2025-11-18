import { RadialFlow, Topic } from "@/components/ui/radialflow";

const demoTopics: Topic[] = [
  {
    id: "flights",
    name: "Flights",
    position: { x: 10, y: 20 },
    color: "#93C5FD",
    highlighted: true,
  },
  { id: "hotels", name: "Hotels", position: { x: 10, y: 35 }, color: "#86EFAC", highlighted: true },
  {
    id: "itinerary",
    name: "Itinerary",
    position: { x: 10, y: 50 },
    color: "#FBCFE8",
    highlighted: true,
  },
  {
    id: "activities",
    name: "Activities",
    position: { x: 10, y: 65 },
    color: "#FEF08A",
    highlighted: true,
  },
  {
    id: "restaurants",
    name: "Restaurants",
    position: { x: 10, y: 80 },
    color: "#FEE2E2",
    highlighted: true,
  },
  {
    id: "transport",
    name: "Transport",
    position: { x: 90, y: 20 },
    color: "#E9D5FF",
    highlighted: false,
  },
  {
    id: "tours",
    name: "Tours & Guides",
    position: { x: 90, y: 35 },
    color: "#BBF7D0",
    highlighted: true,
  },
  {
    id: "visa",
    name: "Visa & Entry",
    position: { x: 90, y: 50 },
    color: "#BFDBFE",
    highlighted: true,
  },
  {
    id: "weather",
    name: "Weather",
    position: { x: 90, y: 65 },
    color: "#FED7AA",
    highlighted: true,
  },
  {
    id: "budget",
    name: "Budget & Deals",
    position: { x: 90, y: 80 },
    color: "#FDE68A",
    highlighted: true,
  },
];

export const Loading = () => {
  return <RadialFlow topics={demoTopics} badgeName="Travel Planner" centralDotColor="#cccccc" />;
};
