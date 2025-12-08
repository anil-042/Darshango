import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "./ui/carousel";
import { Card, CardContent } from "./ui/card";

// Import images
// Note: In Vite, we can import SVGs directly or use URLs. 
// Assuming they are in accessible assets path.
import slide1 from "../assets/slide1.png";
import slide2 from "../assets/slide2.png";
import slide3 from "../assets/slide3.png";
import slide4 from "../assets/slide4.png";

export function DashboardCarousel() {
    const plugin = useRef(
        Autoplay({ delay: 5000, stopOnInteraction: false })
    );

    const slides = [
        { id: 1, src: slide1, alt: "PM-AJAY Highlights" },
        { id: 2, src: slide2, alt: "Community Development" },
        { id: 3, src: slide3, alt: "Sustainable Growth" },
        { id: 4, src: slide4, alt: "Model Village" },
    ];

    return (
        <div className="w-full mb-6">
            <Carousel
                plugins={[plugin.current]}
                className="w-full"
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
            >
                <CarouselContent>
                    {slides.map((slide) => (
                        <CarouselItem key={slide.id}>
                            <CarouselItem key={slide.id}>
                                <div className="w-full">
                                    <div className="overflow-hidden rounded-xl">
                                        <img
                                            src={slide.src}
                                            alt={slide.alt}
                                            className="w-full h-auto object-contain"
                                        />
                                    </div>
                                </div>
                            </CarouselItem>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
            </Carousel>
        </div>
    );
}
