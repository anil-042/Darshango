import { Bell, Megaphone } from "lucide-react";

export function MarqueeNotification() {
    return (
        <div className="w-full bg-gradient-to-r from-orange-100 via-white to-green-100 border-y border-orange-200 py-3 mb-6 relative overflow-hidden shadow-sm">
            <div className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-orange-100 to-transparent w-20 z-10 flex items-center justify-center">
                <div className="bg-red-500 text-white p-1.5 rounded-full animate-pulse shadow-md">
                    <Megaphone className="w-4 h-4" />
                </div>
            </div>

            <div className="marquee-container flex items-center overflow-hidden whitespace-nowrap relative z-0">
                <div className="animate-marquee marquee-paused inline-block text-gray-800 font-medium text-sm md:text-base">
                    <span className="mx-4 text-red-600 font-bold">• Important :</span>
                    States are requested to proceed with the VDP generation for the newly selected villages for the year 2025–2026.
                    <span className="mx-8 text-gray-400">|</span>
                    <span className="mx-4 text-blue-600 font-bold">• Update :</span>
                    Quarterly utilization certificates due by end of this month.
                    <span className="mx-8 text-gray-400">|</span>
                    <span className="mx-4 text-green-600 font-bold">• Announcement :</span>
                    New batch of Adarsh Grams to be finalized by District Committee.
                </div>
            </div>

            <div className="absolute right-0 top-0 bottom-0 bg-gradient-to-l from-green-100 to-transparent w-20 z-10 pointer-events-none"></div>
        </div>
    );
}
