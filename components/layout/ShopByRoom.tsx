import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import type { RoomItem } from "@/services/sanity";

interface ShopByRoomProps {
  title?: string | null;
  rooms?: RoomItem[];
}

const defaultRooms: RoomItem[] = [
  {
    _id: "room_lr_default_id",
    _key: "room_lr_default_key",
    name: "Living Room",
    imageUrl: "https://picsum.photos/seed/livingroom/400/300",
    link: "/products/living-room",
  },
  {
    _id: "room_br_default_id",
    _key: "room_br_default_key",
    name: "Bedroom",
    imageUrl: "https://picsum.photos/seed/bedroom/400/300",
    link: "/products/bedroom",
  },
  {
    _id: "room_kt_default_id",
    _key: "room_kt_default_key",
    name: "Kitchen",
    imageUrl: "https://picsum.photos/seed/kitchen/400/300",
    link: "/products/kitchen",
  },
  {
    _id: "room_dr_default_id",
    _key: "room_dr_default_key",
    name: "Dining Room",
    imageUrl: "https://picsum.photos/seed/diningroom/400/300",
    link: "/products/dining-room",
  },
];

const ShopByRoom: React.FC<ShopByRoomProps> = ({
  title = "Shop by Room",
  rooms,
}) => {
  const displayRooms = rooms && rooms.length > 0 ? rooms : defaultRooms;

  return (
    <section className="py-12">
      {title && (
        <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayRooms.map((room) => {
          // Ensure imageUrl is valid for Image component
          const validImageUrl =
            room.imageUrl || `https://picsum.photos/seed/${room.name}/400/300`;
          // Ensure key is unique and valid
          const key = room._id || room._key || `room_fallback_${room.name}`;
          // Ensure link is valid
          const validLink = room.link || "#"; // Fallback to '#' if link is missing

          return (
            <Link key={key} href={validLink} className="group block">
              <Card className="overflow-hidden h-full shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={validImageUrl} // Use the processed valid image URL
                    alt={`${room.name} lighting`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    unoptimized={validImageUrl.includes("picsum.photos")} // Check optional chaining
                  />
                  {/* Overlay for text */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent flex items-end p-4">
                    <h3 className="text-xl font-semibold text-white drop-shadow-md">
                      {room.name}
                    </h3>
                  </div>
                </div>
                {/* Optional: Add a subtle arrow or link text if needed */}
                {/* <CardContent className="p-4 flex justify-between items-center">
                      <span className="text-sm font-medium text-accent group-hover:underline">Explore</span>
                      <ArrowRight className="h-4 w-4 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </CardContent> */}
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default ShopByRoom;
